"use client";
import React, { useState, useRef, useEffect } from 'react';
import { ProjectActions } from './project-actions/project-actions';
import { ProjectContextMenu } from './project-context-menu/project-context-menu';

// Helper function to format date as YYYY-MM-DD
const formatDateAsYYYYMMDD = (dateStr: string | undefined): string => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toISOString().split('T')[0];
};
import './project-item.scss';
import { DTO_ProjectItem } from '@/dtos/home.page.dto';
import { Container, EllipsisVertical } from 'lucide-react';

interface ProjectItemProps {
  project: DTO_ProjectItem;
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

  const isDisabled = project.status === "CLOSED" || project.status === "PAUSED";
  const isCompleting = completingProjectId === project.id;
  const isCompleted = !!project.endDate;
  const isDeleting = deletingProjectId === project.id;

  return (
    <div className={`project-item overview-list-item ${isDisabled ? 'project-item--disabled' : ''}`}>
      <div className="project-item-content">
        <a className="project-item-info" href={`${window.location.href}/${project.id}/phases`}>
          <Container className="oli-icon"/>
          <span 
            className={`oli-title project-item-name ${isDisabled ? 'project-item-name--disabled' : ''}`}
          >
            {project.name}
            {isDisabled && <span className="project-item-disabled-text">(Disabled)</span>}
          </span>
        </a>
        
        <div className="oli-due-date quick-blue-tag">
          Due Date: {formatDateAsYYYYMMDD(project.dueDate)}
        </div>

        <ProjectActions
          project={project}
          isDisabled={isDisabled}
          isCompleting={isCompleting}
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
          <EllipsisVertical className="oli-menu" />
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