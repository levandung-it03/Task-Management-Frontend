import React, { useState, useRef, useEffect } from 'react';
import { DTO_ProjectItem } from '../../../@/dtos/home.page.dto';
import { ProjectAPIs } from '../../../../apis/emp.project.page.api';
import { ApiResponse } from '../../../../apis/general.api';
import { DateValidationHelper, ValidationResult } from '../../../../util/date-validation.helper';
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

  useEffect(() => {
    if (project) {
      setForm({ ...project });
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
    
    // Validate form data before submission
    const validation = DateValidationHelper.validateProjectForm(
      form.name || '',
      form.description || '',
      form.startDate || '',
      form.endDate || '',
      form.deadline || ''
    );
    
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      return;
    }
    
    setValidationErrors([]);
    
    try {
      const updatedRes = await ProjectAPIs.updateProject(form.id, {
        name: form.name,
        description: form.description,
        startDate: form.startDate,
        endDate: form.endDate,
        deadline: form.deadline,
        status: form.status as 'Pending' | 'Running' | 'Completed' | 'Cancelled',
      });
      const updated = (updatedRes as ApiResponse<DTO_ProjectItem>).body;
      if (updated) {
        onUpdate(updated);
        setValidationErrors([]);
      }
    } catch (error) {
      console.error('Error updating project:', error);
      alert('An error occurred while updating the project. Please try again!');
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
                Vui lòng sửa các lỗi sau:
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
                <legend className="update-project-modal-legend">Start Date</legend>
                <input
                  type="date"
                  value={form.startDate || ''}
                  onChange={e => setForm(f => f ? { ...f, startDate: e.target.value } : f)}
                  className="update-project-modal-input"
                  required
                  disabled={!canUpdateProject}
                />
              </fieldset>

              <fieldset className="update-project-modal-fieldset">
                <legend className="update-project-modal-legend">End Date</legend>
                <input
                  type="date"
                  value={form.endDate || ''}
                  onChange={e => setForm(f => f ? { ...f, endDate: e.target.value } : f)}
                  className="update-project-modal-input"
                  min={DateValidationHelper.getMinEndDate(form.startDate || '')}
                  max={DateValidationHelper.getMaxEndDate(form.deadline || '')}
                  disabled={!canUpdateProject}
                />
              </fieldset>
            </div>

            <div className="update-project-modal-column">
              <fieldset className="update-project-modal-fieldset">
                <legend className="update-project-modal-legend">Deadline</legend>
                <input
                  type="date"
                  value={form.deadline || ''}
                  onChange={e => setForm(f => f ? { ...f, deadline: e.target.value } : f)}
                  className="update-project-modal-input"
                  min={DateValidationHelper.getMinDeadline(form.startDate || '')}
                  required
                  disabled={!canUpdateProject}
                />
              </fieldset>

              <fieldset className="update-project-modal-fieldset">
                <legend className="update-project-modal-legend">Status</legend>
                <select
                  value={form.status || ''}
                  onChange={e => setForm(f => f ? { ...f, status: e.target.value as 'Pending' | 'Running' | 'Completed' | 'Cancelled' } : f)}
                  className="update-project-modal-select"
                  required
                  disabled={!canUpdateProject}
                >
                  {['Pending', 'Running', 'Completed', 'Cancelled'].map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
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