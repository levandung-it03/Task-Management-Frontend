import React, { useState } from 'react';
import { DTO_CreateCollection, DTO_CollectionItem, COLLECTION_STATUS, CollectionStatus } from '../../../dtos/emp.collection.page.dto';
import { DateValidationHelper, ValidationResult } from '../../../util/date-validation.helper';
import './collection-form.scss';

interface CollectionFormProps {
  isOpen: boolean;
  isCreate: boolean;
  form: DTO_CreateCollection | DTO_CollectionItem | null;
  onClose: () => void;
  onSubmit: (formData: DTO_CreateCollection | DTO_CollectionItem) => void;
  onFormChange: (formData: DTO_CreateCollection | DTO_CollectionItem) => void;
  canUpdateCollection?: boolean;
}

export default function CollectionForm({ 
  isOpen, 
  isCreate, 
  form, 
  onClose, 
  onSubmit, 
  onFormChange,
  canUpdateCollection = true
}: CollectionFormProps) {
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  if (!isOpen || !form) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data before submission
    const validation = DateValidationHelper.validateCollectionForm(
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
    onSubmit(form);
  };

  const handleInputChange = (field: string, value: string) => {
    onFormChange({ ...form, [field]: value });
  };

  return (
    <div className="collection-form-overlay">
      <div className="collection-form-modal">
        <div className="form-header">
          <div className="header-icon">
            <svg width="24" height="24" fill="none" stroke="#166534" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="4" y="4" width="16" height="16" rx="3" fill="#e6f4ea" stroke="#166534" />
              <path d="M8 8h8M8 12h8M8 16h4" stroke="#166534" />
            </svg>
          </div>
          <span className="form-title">
            {isCreate ? 'Create Collection' : 'Update Collection'}
          </span>
          <button onClick={onClose} className="close-btn">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="collection-form">
          {/* Validation Errors */}
          {validationErrors.length > 0 && (
            <div className="collection-form-validation-errors">
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
          <fieldset className="form-fieldset">
            <legend className="field-legend">Collection Name</legend>
            <input
              type="text"
              placeholder="..."
              value={form.name}
              onChange={e => handleInputChange('name', e.target.value)}
              className="form-input"
              required
              disabled={!isCreate && !canUpdateCollection}
            />
          </fieldset>

          <fieldset className="form-fieldset">
            <legend className="field-legend">Description</legend>
            <textarea
              placeholder="..."
              value={form.description || ''}
              onChange={e => handleInputChange('description', e.target.value)}
              className="form-textarea"
              disabled={!isCreate && !canUpdateCollection}
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
                  disabled={!isCreate && !canUpdateCollection}
                />
              </fieldset>

              <fieldset className="form-fieldset">
                <legend className="field-legend">End Date</legend>
                <input
                  type="date"
                  value={form.endDate || ''}
                  onChange={e => handleInputChange('endDate', e.target.value)}
                  className="form-input"
                  min={DateValidationHelper.getMinEndDate(form.startDate || '')}
                  max={DateValidationHelper.getMaxEndDate(form.deadline || '')}
                  disabled={!isCreate && !canUpdateCollection}
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
                  min={DateValidationHelper.getMinDeadline(form.startDate || '')}
                  required
                  disabled={!isCreate && !canUpdateCollection}
                />
              </fieldset>

              <fieldset className="form-fieldset">
                <legend className="field-legend">Status</legend>
                <select
                  value={form.status || ''}
                  onChange={e => handleInputChange('status', e.target.value)}
                  className="form-select"
                  required
                  disabled={!isCreate && !canUpdateCollection}
                >
                  {COLLECTION_STATUS.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </fieldset>
            </div>
          </div>

          <div className="form-actions">
            {(isCreate || canUpdateCollection) && (
              <button type="submit" className="submit-btn">
                {isCreate ? 'Create Collection' : 'Update'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
} 