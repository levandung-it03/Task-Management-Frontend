import React from 'react';
import './phase-actions.scss';

interface PhaseActionsProps {
  onCreateClick: () => void;
  canCreatePhase?: boolean;
}

export default function PhaseActions({ onCreateClick, canCreatePhase = true }: PhaseActionsProps) {
  return (
    <>
      {canCreatePhase && (
        <button
          className="phase-actions__create-button"
          onClick={onCreateClick}
        >
          <span className="phase-actions__create-icon">+</span>
          New
        </button>
      )}
    </>
  );
} 