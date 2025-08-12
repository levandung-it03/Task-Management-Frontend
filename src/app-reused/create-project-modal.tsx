"use client";
import React, { useRef, useEffect, useState } from 'react';
import { DTO_CreateProject, PROJECT_STATUS, ProjectStatus } from '@/dtos/project.page.dto';
import { ProjectAPIs } from '@/apis/project.page.api';
import { DateValidationHelper } from '@/util/date-validation.helper';

interface CreateProjectModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (project: any) => void;
  initialForm?: DTO_CreateProject;
}

export default function CreateProjectModal({ open, onClose, onCreate, initialForm }: CreateProjectModalProps) {
  const [form, setForm] = useState<DTO_CreateProject>(
    initialForm || {
      name: '',
      description: '',
      startDate: '',
      dueDate: '',
    }
  );
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setForm(
        initialForm || {
          name: '',
          description: '',
          startDate: '',
          dueDate: '',
        }
      );
      setValidationErrors([]);
    }
  }, [open, initialForm]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (open && modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open, onClose]);

  const handleInputChange = (field: string, value: string) => {
    setForm(f => ({ ...f, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data before submission
    const validation = DateValidationHelper.validateProjectForm(
      form.name,
      form.description,
      form.startDate,
      null, // endDate is not used in project creation
      form.dueDate
    );
    
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      return;
    }
    
    setValidationErrors([]);
    
    // Log the data being sent
    console.log('Sending project data:', form);
    
    try {
      onClose();
      const newProject = await ProjectAPIs.createProject(form as DTO_CreateProject);
      console.log('Project creation result:', newProject);
      onCreate(newProject);
    } catch (error) {
      console.error('Failed to create project:', error);
      return;
    }
    setForm({
      name: '',
      description: '',
      startDate: '',
      dueDate: '',
    });
    setValidationErrors([]);
  };

  if (!open) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0,0,0,0.18)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div ref={modalRef} style={{
        background: '#fff',
        borderRadius: 18,
        boxShadow: '0 4px 32px #0002',
        padding: '32px 32px 24px 32px',
        minWidth: 400,
        maxWidth: '95vw',
        width: '60%',
        minHeight: 300,
        maxHeight: 600,
        display: 'flex',
        flexDirection: 'column',
        gap: 18,
        position: 'relative',
        overflowY: 'auto',
      }}>
        {/* Header Create Project */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <svg width="24" height="24" fill="none" stroke="#166534" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 4 }}>
            <rect x="4" y="4" width="16" height="16" rx="3" fill="#e6f4ea" stroke="#166534" />
            <path d="M8 8h8M8 12h8M8 16h4" stroke="#166534" />
          </svg>
          <span style={{ fontWeight: 700, fontSize: 20, color: '#166534' }}>Create Project</span>
          <button onClick={onClose} style={{ marginLeft: 'auto', background: 'none', border: 'none', fontSize: 30, color: '#222', cursor: 'pointer', lineHeight: 1 }}>&times;</button>
        </div>
        
        {/* Form */}
        <form
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 0 }}
        >
          {/* Validation Errors */}
          {validationErrors.length > 0 && (
            <div style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '8px',
              padding: '12px 16px',
              marginBottom: '16px',
            }}>
              <div style={{
                color: '#dc2626',
                fontWeight: '600',
                marginBottom: '8px',
              }}>
                Vui lòng sửa các lỗi sau:
              </div>
              <ul style={{
                margin: 0,
                paddingLeft: '20px',
                color: '#dc2626',
              }}>
                {validationErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Project Name full row */}
          <fieldset
            style={{
              border: '2.5px solid #111',
              borderRadius: 8,
              padding: '0 8px 0 8px',
              margin: 0,
              minWidth: 0,
              position: 'relative',
              marginBottom: 0,
            }}
          >
            <legend
              style={{
                fontSize: 16,
                color: '#111',
                fontWeight: 500,
                padding: '0 8px',
                letterSpacing: 0.2,
                lineHeight: 1,
                background: '#fff',
                borderRadius: 4,
                marginLeft: 8,
              }}
            >
              Project Name
            </legend>
            <input
              type="text"
              placeholder="..."
              value={form.name}
              onChange={e => handleInputChange('name', e.target.value)}
              style={{ border: 'none', outline: 'none', fontSize: 15, padding: '12px 12px', width: '100%', background: 'transparent' }}
              required
              minLength={1}
            />
          </fieldset>
          
          {/* Description full row */}
          <fieldset
            style={{
              border: '2.5px solid #111',
              borderRadius: 8,
              padding: '0 8px 0 8px',
              margin: 0,
              minWidth: 0,
              position: 'relative',
              marginBottom: 0,
            }}
          >
            <legend
              style={{
                fontSize: 16,
                color: '#111',
                fontWeight: 500,
                padding: '0 8px',
                letterSpacing: 0.2,
                lineHeight: 1,
                background: '#fff',
                borderRadius: 4,
                marginLeft: 8,
              }}
            >
              Description
            </legend>
            <textarea
              placeholder="..."
              value={form.description}
              onChange={e => handleInputChange('description', e.target.value)}
              style={{ border: 'none', outline: 'none', fontSize: 15, padding: '12px 12px', width: '100%', background: 'transparent', minHeight: 70, resize: 'vertical' }}
            />
          </fieldset>
          
          {/* 2 fields in 2 columns */}
          <div style={{ display: 'flex', gap: 16 }}>
            <div style={{ flex: 1 }}>
              <fieldset
                style={{
                  border: '2.5px solid #111',
                  borderRadius: 8,
                  padding: '0 8px 0 8px',
                  margin: 0,
                  minWidth: 0,
                  position: 'relative',
                }}
              >
                <legend
                  style={{
                    fontSize: 16,
                    color: '#111',
                    fontWeight: 500,
                    padding: '0 8px',
                    letterSpacing: 0.2,
                    lineHeight: 1,
                    background: '#fff',
                    borderRadius: 4,
                    marginLeft: 8,
                  }}
                >
                  Start Date
                </legend>
                <input
                  type="date"
                  value={form.startDate}
                  onChange={e => {
                    const newStartDate = e.target.value;
                    handleInputChange('startDate', newStartDate);
                    // Reset dueDate if it's now invalid
                    if (form.dueDate && new Date(form.dueDate) <= new Date(newStartDate)) {
                      handleInputChange('dueDate', '');
                    }
                  }}
                  style={{ border: 'none', outline: 'none', fontSize: 15, padding: '12px 12px', width: '100%', background: 'transparent' }}
                  required
                />
              </fieldset>
            </div>
            <div style={{ flex: 1 }}>
              <fieldset
                style={{
                  border: '2.5px solid #111',
                  borderRadius: 8,
                  padding: '0 8px 0 8px',
                  margin: 0,
                  minWidth: 0,
                  position: 'relative',
                }}
              >
                <legend
                  style={{
                    fontSize: 16,
                    color: '#111',
                    fontWeight: 500,
                    padding: '0 8px',
                    letterSpacing: 0.2,
                    lineHeight: 1,
                    background: '#fff',
                    borderRadius: 4,
                    marginLeft: 8,
                  }}
                >
                  Due Date
                </legend>
                <input
                  type="date"
                  value={form.dueDate}
                  onChange={e => handleInputChange('dueDate', e.target.value)}
                  style={{ border: 'none', outline: 'none', fontSize: 15, padding: '12px 12px', width: '100%', background: 'transparent' }}
                  required
                  min={DateValidationHelper.getMinDueDate(form.startDate)}
                />
              </fieldset>
            </div>
          </div>
        </form>
        
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 18 }}>
          <button
            type="submit"
            form=""
            style={{
              background: '#207558',
              color: '#fff',
              border: 'none',
              borderRadius: 10,
              padding: '16px 0',
              fontWeight: 600,
              fontSize: 17,
              width: '100%',
              display: 'block',
              margin: '0 auto',
              boxShadow: 'none',
              letterSpacing: 0.2,
              cursor: 'pointer',
            }}
            onClick={handleSubmit}
          >
            Create Project
          </button>
        </div>
      </div>
    </div>
  );
} 