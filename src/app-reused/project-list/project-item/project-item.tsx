import React, { useState, useRef, useEffect } from 'react';
import { ProjectActions } from './project-actions/project-actions';
import { ProjectContextMenu } from './project-context-menu/project-context-menu';
import './project-item.scss';
import { DTO_ProjectItem } from '@/dtos/home.page.dto';

interface ProjectItemProps {
  project: DTO_ProjectItem;
  onProjectClick: (projectId: number) => void;
  onUpdateProject: (project: DTO_ProjectItem) => void;
  onAddLeader: (projectId: number) => void;
  onUpdateLeader: (project: DTO_ProjectItem) => void;
  onDeleteProject: (project: DTO_ProjectItem) => void;
  onCompleteProject: (project: DTO_ProjectItem) => void;
  completingProjectId: number | null;
  completedProjects: Record<string, boolean>;
  deletingProjectId: number | null;
  permissions?: any;
}

export function ProjectItem({
  project,
  onProjectClick,
  onUpdateProject,
  onAddLeader,
  onUpdateLeader,
  onDeleteProject,
  onCompleteProject,
  completingProjectId,
  completedProjects,
  deletingProjectId,
  permissions
}: ProjectItemProps) {
  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenu(false);
      }
    }

    if (openMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openMenu]);

  const isDisabled = project.active === false;
  const isCompleting = completingProjectId === project.id;
  const isCompleted = project.status === 'Completed' || completedProjects[project.id];
  const isDeleting = deletingProjectId === project.id;

  return (
    <div className={`project-item ${isDisabled ? 'project-item--disabled' : ''}`}>
      <div className="project-item-content">
        <div className="project-item-info">
          <svg width="28" height="28" fill="none" stroke="var(--main-green)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="4" y="4" width="20" height="20" rx="5" fill="#e6f4ea" stroke="var(--main-green)" />
            <path d="M10 12h8M10 16h8" stroke="var(--main-green)" />
          </svg>
          <span 
            className={`project-item-name ${isDisabled ? 'project-item-name--disabled' : ''}`}
            onClick={() => !isDisabled && onProjectClick(project.id)}
          >
            {project.name}
            {isDisabled && <span className="project-item-disabled-text">(Disabled)</span>}
          </span>
        </div>
        
        <div className="project-item-deadline">
          Deadline: <span className="project-item-deadline-date">{project.deadline}</span>
        </div>

        <ProjectActions
          project={project}
          isDisabled={isDisabled}
          isCompleting={isCompleting}
          isCompleted={isCompleted}
          onAddLeader={() => onAddLeader(project.id)}
          onCompleteProject={() => onCompleteProject(project)}
          permissions={permissions}
        />

        <button
          className={`project-item-menu-btn ${isDisabled ? 'project-item-menu-btn--disabled' : ''}`}
          title="More"
          onClick={() => !isDisabled && setOpenMenu(!openMenu)}
          disabled={isDisabled}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="5" r="2" fill="currentColor" />
            <circle cx="12" cy="12" r="2" fill="currentColor" />
            <circle cx="12" cy="19" r="2" fill="currentColor" />
          </svg>
        </button>

        {openMenu && (
          <ProjectContextMenu
            ref={menuRef}
            project={project}
            onViewDetails={() => {
              setOpenMenu(false);
              onUpdateProject(project);
            }}
            onViewLeaders={() => {
              setOpenMenu(false);
              onUpdateLeader(project);
            }}
            onDeleteProject={() => {
              setOpenMenu(false);
              onDeleteProject(project);
            }}
            isDeleting={isDeleting}
            permissions={permissions}
          />
        )}
      </div>
    </div>
  );
} 