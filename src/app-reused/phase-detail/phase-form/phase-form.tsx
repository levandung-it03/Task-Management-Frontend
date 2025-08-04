import React, { useState } from 'react';
import { DTO_CreatePhase, CREATE_PHASE_STATUS, CreatePhaseStatus, DTO_PhaseItem } from '../../../dtos/emp.phase.page.dto';
import { DateValidationHelper, ValidationResult } from '../../../util/date-validation.helper';
import './phase-form.scss';

interface PhaseFormProps {
  form: DTO_CreatePhase | DTO_PhaseItem;
  setForm: (form: DTO_CreatePhase | DTO_PhaseItem) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
  modalRef: React.RefObject<HTMLDivElement | null>;
  isUpdate: boolean;
  canUpdatePhase?: boolean;
}

export default function PhaseForm({ form, setForm, onSubmit, onClose, modalRef, isUpdate, canUpdatePhase = true }: PhaseFormProps) {
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data before submission
    const validation = DateValidationHelper.validatePhaseForm(
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
    onSubmit(e);
  };

  const handleFormChange = (updates: Partial<DTO_CreatePhase | DTO_PhaseItem>) => {
    setForm({ ...form, ...updates });
  };

  return (
    <div className="phase-form-overlay">
      <div ref={modalRef} className="phase-form-modal">
        <div className="phase-form-header">
          <div className="phase-form-title">
            <svg width="24" height="24" fill="none" stroke="#166534" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="4" y="4" width="16" height="16" rx="3" fill="#e6f4ea" stroke="#166534" />
              <path d="M8 8h8M8 12h8M8 16h4" stroke="#166534" />
            </svg>
            <span>{isUpdate ? 'Update Phase' : 'Create Phase'}</span>
          </div>
          <button onClick={onClose} className="phase-form-close">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="phase-form">
          {/* Validation Errors */}
          {validationErrors.length > 0 && (
            <div className="phase-form-validation-errors">
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
          <fieldset className="phase-form-fieldset">
            <legend className="phase-form-legend">Phase Name</legend>
            <input
              type="text"
              placeholder="..."
              value={form.name}
              onChange={e => handleFormChange({ name: e.target.value })}
              className="phase-form-input"
              required
              disabled={isUpdate && !canUpdatePhase}
            />
          </fieldset>

          <fieldset className="phase-form-fieldset">
            <legend className="phase-form-legend">Description</legend>
            <textarea
              placeholder="..."
              value={form.description || ''}
              onChange={e => handleFormChange({ description: e.target.value })}
              className="phase-form-textarea"
              disabled={isUpdate && !canUpdatePhase}
            />
          </fieldset>

          <div className="phase-form-row">
            <div className="phase-form-column">
              <fieldset className="phase-form-fieldset">
                <legend className="phase-form-legend">Start Date</legend>
                <input
                  type="date"
                  value={form.startDate || ''}
                  onChange={e => handleFormChange({ startDate: e.target.value })}
                  className="phase-form-input"
                  required
                  disabled={isUpdate && !canUpdatePhase}
                />
              </fieldset>

              <fieldset className="phase-form-fieldset">
                <legend className="phase-form-legend">End Date</legend>
                <input
                  type="date"
                  value={form.endDate || ''}
                  onChange={e => handleFormChange({ endDate: e.target.value })}
                  className="phase-form-input"
                  min={DateValidationHelper.getMinEndDate(form.startDate || '')}
                  max={DateValidationHelper.getMaxEndDate(form.deadline || '')}
                  disabled={isUpdate && !canUpdatePhase}
                />
              </fieldset>
            </div>

            <div className="phase-form-column">
              <fieldset className="phase-form-fieldset">
                <legend className="phase-form-legend">Deadline</legend>
                <input
                  type="date"
                  value={form.deadline || ''}
                  onChange={e => handleFormChange({ deadline: e.target.value })}
                  className="phase-form-input"
                  min={DateValidationHelper.getMinDeadline(form.startDate || '')}
                  required
                  disabled={isUpdate && !canUpdatePhase}
                />
              </fieldset>

              <fieldset className="phase-form-fieldset">
                <legend className="phase-form-legend">Status</legend>
                <select
                  value={form.status || ''}
                  onChange={e => handleFormChange({ status: e.target.value as CreatePhaseStatus })}
                  className="phase-form-select"
                  required
                  disabled={isUpdate && !canUpdatePhase}
                >
                  {CREATE_PHASE_STATUS.map((status: CreatePhaseStatus) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </fieldset>
            </div>
          </div>

          {!isUpdate && (
            <div className="phase-form-actions">
              <button
                type="button"
                className="phase-form-submit-button"
                onClick={handleSubmit}
              >
                Create Phase
              </button>
            </div>
          )}

          {isUpdate && canUpdatePhase && (
            <button
              type="submit"
              className="phase-form-submit-button"
            >
              Update
            </button>
          )}
        </form>
      </div>
    </div>
  );
} 