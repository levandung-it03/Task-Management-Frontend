import React from 'react';
import './collection-actions.scss';

interface CollectionActionsProps {
  onShowCreateModal: () => void;
  canCreateCollection?: boolean;
}

export default function CollectionActions({ onShowCreateModal, canCreateCollection }: CollectionActionsProps) {
  return (
    <div className="collection-actions">
      <div className="collection-header">
        <div className="header-content">
          <div className="header-icon">
            <svg width="32" height="32" fill="none" stroke="var(--main-green)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="4" y="4" width="24" height="24" rx="6" fill="#e6f4ea" stroke="var(--main-green)" />
              <path d="M10 12h12M10 18h12" stroke="var(--main-green)" />
            </svg>
          </div>
          <div className="header-text">
            <span className="title">Collection Information</span>
            <div className="subtitle">See full Collection information</div>
          </div>
        </div>
        {canCreateCollection && (
          <button
            className="new-collection-btn"
            onClick={onShowCreateModal}
          >
            <span className="plus-icon">+</span> New
          </button>
        )}
      </div>
    </div>
  );
} 