import React from 'react';
import './task-list-actions.scss';

interface TaskListActionsProps {
  canCreateTask?: boolean;
}

export default function TaskListActions({ canCreateTask }: TaskListActionsProps) {
  return (
    <div className="task-list-actions">
      <div className="task-list-header">
        <div className="task-list-header-content">
          <div className="header-icon">
            <svg width="32" height="32" fill="none" stroke="var(--main-green)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="4" y="4" width="24" height="24" rx="6" fill="#e6f4ea" stroke="var(--main-green)" />
              <path d="M10 12h12M10 18h12" stroke="var(--main-green)" />
            </svg>
          </div>
          <div className="header-text">
            <span className="title">Task List Information</span>
            <div className="subtitle">See full Task List information</div>
          </div>
        </div>
        {canCreateTask && (
          <a
            href="#"
            className="new-collection-btn"
          >
            <span className="plus-icon">+</span> New
          </a>
        )}
      </div>
    </div>
  );
} 