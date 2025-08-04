import React from 'react';
import { DTO_PhaseItem } from '../../../dtos/emp.phase.page.dto';
import './phase-list.scss';

interface PhaseListProps {
  phases: DTO_PhaseItem[];
  onPhaseClick: (phaseId: string) => void;
  onUpdateClick: (phase: DTO_PhaseItem) => void;
  onDeleteClick: (phase: DTO_PhaseItem) => void;
  permissions?: any;
}

export default function PhaseList({ phases, onPhaseClick, onUpdateClick, onDeleteClick, permissions }: PhaseListProps) {
  return (
    <div className="phase-list">
      {phases.map((phase) => (
        <div 
          key={phase.id} 
          className={`phase-card ${phase.active === false ? 'phase-card--disabled' : ''}`}
        >
          <div className="phase-card__info">
            <svg width="28" height="28" fill="none" stroke="var(--main-green)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="4" y="4" width="20" height="20" rx="5" fill="#e6f4ea" stroke="var(--main-green)" />
              <path d="M10 12h8M10 16h8" stroke="var(--main-green)" />
            </svg>
            <span 
              className="phase-card__name"
              onClick={() => phase.active !== false && onPhaseClick(phase.id)}
            >
              {phase.name}
              {phase.active === false && <span className="phase-card__disabled-text">(Disabled)</span>}
            </span>
          </div>
          
          <div className="phase-card__deadline">
            Deadline: <span className="phase-card__deadline-text">{phase.deadline}</span>
          </div>
          
          {permissions?.canViewPhaseDetails && (
            <button
              className="phase-card__button"
              onClick={() => phase.active !== false && onUpdateClick(phase)}
              disabled={phase.active === false}
            >
              View Phase Details
            </button>
          )}
          
          {permissions?.canDeletePhase && (
            <button
              className="phase-card__delete-button"
              onClick={() => {
                if (phase.active === false) return;
                onDeleteClick(phase);
              }}
              disabled={phase.active === false}
            >
              <svg width="20" height="20" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0v2m4-2v2m4-2v2"/>
              </svg>
            </button>
          )}
        </div>
      ))}
    </div>
  );
} 