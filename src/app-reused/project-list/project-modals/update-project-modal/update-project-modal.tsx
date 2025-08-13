"use client";
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { DTO_ProjectItem } from '@/dtos/home.page.dto';
import { ProjectAPIs } from '@/apis/project.page.api';
import { ApiResponse } from '@/apis/general.api';
import { DateValidationHelper, ValidationResult } from '@/util/date-validation.helper';
import './update-project-modal.scss';

interface UpdateProjectModalProps {
  open: boolean;
  project: DTO_ProjectItem | null;
  onClose: () => void;
  onUpdate: (updatedProject: DTO_ProjectItem) => void;
  canUpdateProject?: boolean;
}

export function UpdateProjectModal({ open, project, onClose, onUpdate, canUpdateProject = true }: UpdateProjectModalProps) {
  const [form, setForm] = useState<DTO_ProjectItem | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const modalRef = useRef<HTMLDivElement>(null);

  const formattedDate = useCallback((dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }, [])

  useEffect(() => {
    if (project) {
      console.log('Project data received:', project);
      console.log('expectedStartDate:', project.expectedStartDate, 'type:', typeof project.expectedStartDate);
      console.log('dueDate:', project.dueDate, 'type:', typeof project.dueDate);

      // Ensure dates are in YYYY-MM-DD format for HTML date inputs
      const formattedProject = {
        ...project,
        expectedStartDate: project.expectedStartDate ? formattedDate(project.expectedStartDate) : '',
        dueDate: project.dueDate ? formattedDate(project.dueDate) : ''
      };

      console.log('Formatted project:', formattedProject);
      setForm(formattedProject);
    }
  }, [project]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open, onClose]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;

    console.log('Starting update process...');

    // Validate form data before submission
    const validation = DateValidationHelper.validateProjectForm(
      form.name || '',
      form.description || '',
      form.expectedStartDate || '',
      null, // endDate removed
      (form.dueDate as string) || '' // dueDate maps to deadline parameter in validation
    );

    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      return;
    }

    setValidationErrors([]);

    try {
      console.log('Calling API to update project...');
      const updatedRes = await ProjectAPIs.updateProject(form.id, {
        name: form.name,
        description: form.description,
        expectedStartDate: form.expectedStartDate,
        dueDate: form.dueDate,
      });
      
             // Kiểm tra xem response có thành công không
       if (updatedRes && typeof updatedRes === 'object' && 'status' in updatedRes && updatedRes.status === 200) {
         console.log('Project updated successfully, closing modal...');
         const updated = (updatedRes as ApiResponse<DTO_ProjectItem>).body;
         if (updated) {
           onUpdate(updated);
         }
         setValidationErrors([]);
         onClose();
         console.log('About to reload page...');
         window.location.reload(); // Chỉ reload khi thành công
       } else {
         console.log('Update failed, showing error...');
         const errorMsg = (updatedRes as any)?.msg || 'Cập nhật project thất bại. Vui lòng thử lại.';
         setValidationErrors([errorMsg]);
         // Không đóng modal và không reload khi thất bại
       }
    } catch (error) {
      console.error('Error updating project:', error);
      setValidationErrors(['Đã xảy ra lỗi khi cập nhật project. Vui lòng thử lại.']);
      // Không đóng modal và không reload khi có lỗi
    }
  };

  if (!open || !form) return null;

  return (
    <div className="update-project-modal-overlay">
      <div ref={modalRef} className="update-project-modal">
        <div className="update-project-modal-header">
          <div className="update-project-modal-title">
            <svg width="24" height="24" fill="none" stroke="#166534" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="4" y="4" width="16" height="16" rx="3" fill="#e6f4ea" stroke="#166534" />
              <path d="M8 8h8M8 12h8M8 16h4" stroke="#166534" />
            </svg>
            <span>Update Project</span>
          </div>
          <button onClick={onClose} className="update-project-modal-close">&times;</button>
        </div>

        <form onSubmit={handleUpdate} className="update-project-modal-form">
          {/* Validation Errors */}
          {validationErrors.length > 0 && (
            <div className="update-project-modal-validation-errors">
              <div className="validation-errors-title">
                Errors occured by provided information:
              </div>
              <ul className="validation-errors-list">
                {validationErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}
          <fieldset className="update-project-modal-fieldset">
            <legend className="update-project-modal-legend">Project Name</legend>
            <input
              type="text"
              placeholder="..."
              value={form.name}
              onChange={e => setForm(f => f ? { ...f, name: e.target.value } : f)}
              className="update-project-modal-input"
              required
              disabled={!canUpdateProject}
            />
          </fieldset>

          <fieldset className="update-project-modal-fieldset">
            <legend className="update-project-modal-legend">Description</legend>
            <textarea
              placeholder="..."
              value={form.description || ''}
              onChange={e => setForm(f => f ? { ...f, description: e.target.value } : f)}
              className="update-project-modal-textarea"
              disabled={!canUpdateProject}
            />
          </fieldset>

          <div className="update-project-modal-row">
            <div className="update-project-modal-column">
              <fieldset className="update-project-modal-fieldset">
                <legend className="update-project-modal-legend">Expected Start Date</legend>
                <input
                  type="date"
                  value={form.expectedStartDate || ''}
                  onChange={e => setForm(f => f ? { ...f, expectedStartDate: e.target.value } : f)}
                  className="update-project-modal-input"
                  required
                  disabled={!canUpdateProject}
                />
              </fieldset>
            </div>

            <div className="update-project-modal-column">
              <fieldset className="update-project-modal-fieldset">
                <legend className="update-project-modal-legend">Due Date</legend>
                <input
                  type="date"
                  value={form.dueDate || ''}
                  onChange={e => setForm(f => f ? { ...f, dueDate: e.target.value } : f)}
                  className="update-project-modal-input"
                  min={DateValidationHelper.getMinDueDate(form.expectedStartDate || '')}
                  required
                  disabled={!canUpdateProject}
                />
              </fieldset>
            </div>
          </div>



          {canUpdateProject && (
            <button type="submit" className="update-project-modal-submit">
              Update
            </button>
          )}
        </form>
      </div>
    </div>
  );
} 