import React from 'react';
import './project-header.scss';
import { FolderKanban, Plus } from 'lucide-react';

interface ProjectHeaderProps {
  onCreateProject: () => void;
  canCreateProject?: boolean;
}

export function ProjectHeader({ onCreateProject, canCreateProject = true }: ProjectHeaderProps) {
  return (
    <div className="project-header form-caption-wrap">
      <div className="form-caption">
        <FolderKanban className="caption-icon" />
        <span className="caption-content">Projects List</span>
        <i className="desc-content">All your Related Projects are shown here!</i>
      </div>
      
      {canCreateProject && (
        <div className="general-crt-btn">
          <button
            className="gcb-main"
            onClick={onCreateProject}
          >
            <Plus className="gcb-icon" />
            <span className="gcb-text">New</span>
          </button>
        </div>
      )}
    </div>
  );
} 