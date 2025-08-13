import React, { useState } from 'react';
import { DTO_CreateTaskList, DTO_TaskListItem } from '@/dtos/task-list.page.dto';
import { DateValidationHelper, ValidationResult } from '@/util/date-validation.helper';
import './task-list-form.scss';

interface TaskListFormProps {
  isOpen: boolean;
  form: DTO_CreateTaskList | null;
  onClose: () => void;
  onSubmit: (formData: DTO_CreateTaskList) => void;
  onFormChange: (formData: DTO_CreateTaskList) => void;
}

export default function TaskListForm({ 
  isOpen, 
  form, 
  onClose, 
  onSubmit, 
  onFormChange
}: TaskListFormProps) {
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  if (!isOpen || !form) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data before submission
    const validation = DateValidationHelper.validateCollectionForm(
      form.name || '',
      form.description || '',
      form.startDate || '',
      form.deadline || ''
    );
    
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      return;
    }
    
    setValidationErrors([]);
    onSubmit(form);
  };

  const handleInputChange = (field: string, value: string) => {
    onFormChange({ ...form, [field]: value });
  };

  return (
    <div className="task-list-form-overlay">
      <div className="task-list-form-modal">
        <div className="form-header">
          <div className="header-icon">
            <svg width="24" height="24" fill="none" stroke="#166534" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="4" y="4" width="16" height="16" rx="3" fill="#e6f4ea" stroke="#166534" />
              <path d="M8 8h8M8 12h8M8 16h4" stroke="#166534" />
            </svg>
          </div>
          <span className="form-title">
            Create Task List
          </span>
          <button onClick={onClose} className="close-btn">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="task-list-form">
          {/* Validation Errors */}
          {validationErrors.length > 0 && (
            <div className="task-list-form-validation-errors">
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
          <fieldset className="form-fieldset">
            <legend className="field-legend">Task List Name</legend>
            <input
              type="text"
              placeholder="..."
              value={form.name}
              onChange={e => handleInputChange('name', e.target.value)}
              className="form-input"
              required
            />
          </fieldset>

          <fieldset className="form-fieldset">
            <legend className="field-legend">Description</legend>
            <textarea
              placeholder="..."
              value={form.description || ''}
              onChange={e => handleInputChange('description', e.target.value)}
              className="form-textarea"
            />
          </fieldset>

          <div className="form-row">
            <div className="form-column">
              <fieldset className="form-fieldset">
                <legend className="field-legend">Start Date</legend>
                <input
                  type="date"
                  value={form.startDate || ''}
                  onChange={e => handleInputChange('startDate', e.target.value)}
                  className="form-input"
                  required
                />
              </fieldset>
            </div>

            <div className="form-column">
              <fieldset className="form-fieldset">
                <legend className="field-legend">Deadline</legend>
                <input
                  type="date"
                  value={form.deadline || ''}
                  onChange={e => handleInputChange('deadline', e.target.value)}
                  className="form-input"
                  min={DateValidationHelper.getMinDueDate(form.startDate || '')}
                  required
                />
              </fieldset>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-btn">
              Create Task List
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 