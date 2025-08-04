import React from 'react';
import { DTO_ProjectItem } from '../../../@/dtos/home.page.dto';
import { confirm } from "../../../confirm-alert/confirm-alert";
import { ProjectAPIs } from '../../../../apis/emp.project.page.api';
import { ApiResponse } from '../../../../apis/general.api';
import './project-actions.scss';

interface ProjectActionsProps {
  project: DTO_ProjectItem;
  isDisabled: boolean;
  isCompleting: boolean;
  isCompleted: boolean;
  onAddLeader: () => void;
  onCompleteProject: () => void;
  permissions?: any;
}

export function ProjectActions({
  project,
  isDisabled,
  isCompleting,
  isCompleted,
  onAddLeader,
  onCompleteProject,
  permissions
}: ProjectActionsProps) {
  const handleCompleteProject = async () => {
    if (isCompleting || isDisabled) return;
    
    const ok = await confirm('This action cannot be undone. Are you sure?', 'Complete Project');
    if (!ok) return;
    
    try {
      const updatedRes = await ProjectAPIs.updateProject(project.id, {
        name: project.name,
        description: project.description,
        startDate: project.startDate,
        endDate: project.endDate,
        deadline: project.deadline,
        status: 'Completed',
      });
      const updated = (updatedRes as ApiResponse<DTO_ProjectItem>).body;
      if (updated) {
        onCompleteProject();
      }
    } catch (error) {
      console.error('Error completing project:', error);
      alert('An error occurred while completing the project. Please try again!');
    }
  };

  return (
    <div className="project-actions">
      {permissions?.canAddLeader && (
        <button
          className={`project-actions-add-leader-btn ${isDisabled ? 'project-actions-add-leader-btn--disabled' : ''}`}
          onClick={onAddLeader}
          disabled={isDisabled}
        >
          Add Leader
        </button>
      )}

      {permissions?.canCompleteProject && (
        isCompleted ? (
          <button
            className="project-actions-complete-btn project-actions-complete-btn--completed"
            disabled
          >
            Complete
          </button>
        ) : (
          <button
            className={`project-actions-complete-btn ${isDisabled ? 'project-actions-complete-btn--disabled' : ''} ${isCompleting ? 'project-actions-complete-btn--loading' : ''}`}
            onClick={handleCompleteProject}
            disabled={!!isCompleting || isDisabled}
          >
            Complete
          </button>
        )
      )}
    </div>
  );
} 