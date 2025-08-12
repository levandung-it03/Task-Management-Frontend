import React from 'react';
import { DTO_ProjectItem } from '@/dtos/home.page.dto';
import { confirm } from "@/app-reused/confirm-alert/confirm-alert";
import { ProjectAPIs } from '@/apis/project.page.api';
import toast from 'react-hot-toast';
import './project-actions.scss';

interface ProjectActionsProps {
  project: DTO_ProjectItem;
  isDisabled: boolean;
  isCompleting: boolean;
  onAddLeader: () => void;
  onCompleteProject: () => void;
  permissions?: any;
}

export function ProjectActions({
  project,
  isDisabled,
  isCompleting,
  onAddLeader,
  onCompleteProject,
  permissions
}: ProjectActionsProps) {
  const handleCompleteProject = async () => {
    if (isCompleting || isDisabled) return;
    
    const ok = await confirm('This action cannot be undone. Are you sure?', 'Completed Project');
    if (!ok) return;
    
    try {
      const updatedRes = await ProjectAPIs.completeProject(project.id);
      if (updatedRes) {
        onCompleteProject();
        // Thông báo thành công
        toast.success('Project completed successfully!');
      }
    } catch (error) {
      console.error('Error completing project:', error);
    }
  };

  // Kiểm tra project có hoàn thành sớm hay trễ
  const getCompletionStatus = () => {
    if (!project.endDate) return null;
    
    const endDate = new Date(project.endDate);
    const dueDate = new Date(project.dueDate);
    
    if (endDate > dueDate) {
      return 'late'; // Trễ
    } else if (endDate <= dueDate) {
      return 'early'; // Sớm hoặc đúng hạn
    }
    return null;
  };

  const completionStatus = getCompletionStatus();
  const isCompleted = !!project.endDate;

  return (
    <div className="project-actions">
      {(permissions?.canAddLeader && project.status === "IN_PROGRESS") && (
        <button
          className={`project-actions-add-leader-btn ${isDisabled ? 'project-actions-add-leader-btn--disabled' : ''}`}
          onClick={onAddLeader}
          disabled={isDisabled}
        >
          Add Leader
        </button>
      )}

      {(permissions?.canCompleteProject && project.status === "IN_PROGRESS") && (
        isCompleted ? (
          <button
            className={`project-actions-complete-btn project-actions-complete-btn--completed ${
              completionStatus === 'late' ? 'project-actions-complete-btn--late' : 
              completionStatus === 'early' ? 'project-actions-complete-btn--early' : ''
            }`}
            disabled
          >
            {completionStatus === 'late' ? 'Completed ' : 
             completionStatus === 'early' ? 'Completed ' : 'Completed'}
          </button>
        ) : (
          <button
            className={`project-actions-complete-btn ${isDisabled ? 'project-actions-complete-btn--disabled' : ''} ${isCompleting ? 'project-actions-complete-btn--loading' : ''}`}
            onClick={handleCompleteProject}
            disabled={!!isCompleting || isDisabled}
          >
            {isCompleting ? 'Completing...' : 'Completed'}
          </button>
        )
      )}
    </div>
  );
}