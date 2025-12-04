import React from 'react';
import { Plus } from 'lucide-react';

interface PhaseActionsProps {
  onCreateClick: () => void;
  canCreatePhase?: boolean;
}

export default function PhaseActions({ onCreateClick, canCreatePhase = true }: PhaseActionsProps) {
  return (
    <>
      {canCreatePhase && (
        <div className="general-crt-btn">
          <button
            className="gcb-main"
            onClick={onCreateClick}
          >
            <Plus className="gcb-icon" />
            <span className="gcb-text">New</span>
          </button>
        </div>
      )}
    </>
  );
} 