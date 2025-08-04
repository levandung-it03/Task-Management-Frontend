import React from 'react';
import './project-header.scss';

interface ProjectHeaderProps {
  onCreateProject: () => void;
  canCreateProject?: boolean;
}

export function ProjectHeader({ onCreateProject, canCreateProject = true }: ProjectHeaderProps) {
  return (
    <div className="project-header">
      <div className="project-header-left">
        <div className="project-header-title">
          <svg width="32" height="32" fill="none" stroke="var(--main-green)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="4" y="4" width="24" height="24" rx="6" fill="#e6f4ea" stroke="var(--main-green)" />
            <path d="M10 12h12M10 18h12" stroke="var(--main-green)" />
          </svg>
          <span className="project-header-text">Project Information</span>
        </div>
        <div className="project-header-subtitle">See full Project information</div>
      </div>
      
      {canCreateProject && (
        <button
          className="project-header-create-btn"
          onClick={onCreateProject}
        >
          <span className="project-header-create-icon">+</span>
          New
        </button>
      )}
    </div>
  );
} 