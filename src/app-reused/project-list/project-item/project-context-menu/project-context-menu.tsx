import React, { forwardRef } from 'react';
import { DTO_ProjectItem } from '@/dtos/home.page.dto';
import './project-context-menu.scss';

interface ProjectContextMenuProps {
  project: DTO_ProjectItem;
  onViewDetails: () => void;
  onViewLeaders: () => void;
  onDeleteProject: () => void;
  isDeleting: boolean;
  permissions?: any;
}

export const ProjectContextMenu = forwardRef<HTMLDivElement, ProjectContextMenuProps>(
  ({ project, onViewDetails, onViewLeaders, onDeleteProject, isDeleting, permissions }, ref) => {
    return (
      <div
        ref={ref}
        className="project-context-menu"
      >
        {permissions?.canViewProjectDetails && (
          <div
            className="project-context-menu-item"
            onClick={onViewDetails}
          >
            <svg width="20" height="20" fill="none" stroke="#166534" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <rect x="4" y="4" width="12" height="12" rx="2" />
              <path d="M8 8h4M8 12h4" />
            </svg>
            Update
          </div>
        )}
        
        {permissions?.canViewLeaders && (
          <div
            className="project-context-menu-item"
            onClick={onViewLeaders}
          >
            <svg width="20" height="20" fill="none" stroke="#166534" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="10" cy="8" r="4" />
              <path d="M2 18c0-3.3 3.6-6 8-6s8 2.7 8 6" />
            </svg>
            View Leader Joined
          </div>
        )}
        
        {permissions?.canViewPerformance && (
          <div
            className="project-context-menu-item"
          >
            <svg width="20" height="20" fill="none" stroke="#166534" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="10" width="3" height="7" rx="1" />
              <rect x="8.5" y="6" width="3" height="11" rx="1" />
              <rect x="14" y="3" width="3" height="14" rx="1" />
            </svg>
            View Project Performance
          </div>
        )}
        
        {permissions?.canDeleteProject && (
          <div
            className="project-context-menu-item project-context-menu-item--danger"
            onClick={onDeleteProject}
          >
            <svg width="20" height="20" fill="none" stroke="#d32f2f" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
              <path d="M10 11v6M14 11v6" />
            </svg>
            {isDeleting ? 'Deleting...' : 'Delete Project'}
          </div>
        )}
      </div>
    );
  }
);

ProjectContextMenu.displayName = 'ProjectContextMenu'; 