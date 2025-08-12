import React from 'react';
import { DTO_PhaseItem } from '@/dtos/phase.page.dto';
import './phase-list.scss';
import { AlignLeft, Trash } from 'lucide-react';

interface PhaseListProps {
  phases: DTO_PhaseItem[];
  onPhaseClick: (phaseId: number) => void;
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
          className="phase-card overview-list-item"
        >
          <div className="phase-card__info" onClick={() => onPhaseClick(phase.id)}>
            <AlignLeft className="oli-icon" />
            <span className="phase-card__name oli-title">
              {phase.name}
            </span>
          </div>
          
          <div className="phase-card__deadline quick-blue-tag oli-due-date">
            Due Date: {phase.dueDate}
          </div>
          
          {permissions?.canViewPhaseDetails && (
            <button
              className="oli-quick-btn"
              onClick={() => onUpdateClick(phase)}
            >
              View Phase Details
            </button>
          )}
          
          {permissions?.canDeletePhase && (
            <button
              className="oli-delete-btn"
              onClick={() => onDeleteClick(phase)}
            >
              <Trash className="oli-db-icon"/>
            </button>
          )}
        </div>
      ))}
    </div>
  );
} 