"use client";
import React, { useState, useEffect } from 'react';
import './delete-project-modal.scss';
import { DTO_ProjectItem } from '@/dtos/home.page.dto';
import { ProjectAPIs } from '@/apis/project.page.api';
import { DTO_DeleteProject } from '@/dtos/project.page.dto';

interface DeleteProjectModalProps {
  open: boolean;
  project: DTO_ProjectItem | null;
  onClose: () => void;
  onDelete: (projectId: number, deleted: boolean) => void;
}

export function DeleteProjectModal({ open, project, onClose, onDelete }: DeleteProjectModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!project) return;

    setIsDeleting(true);
    try {
      // Call delete API with project ID
      const response = await ProjectAPIs.deleteProject(project.id);

      // Treat as success when HTTP-like status is 2xx, align with other modals
      if (response && typeof response === 'object') {
        const apiResponse = response as any;
        const hasStatus = 'status' in apiResponse;
        const hasCode = 'code' in apiResponse;
        const isSuccess = (hasStatus && apiResponse.status >= 200 && apiResponse.status < 300)
          || (hasCode && apiResponse.code >= 200 && apiResponse.code < 300);
        onDelete(project.id, !!isSuccess);
      } else {
        // Fallback if API response is unexpected
        onDelete(project.id, true);
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      // Fallback on error
      onDelete(project.id, false);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  if (!open || !project) return null;

  return (
    <div className="delete-project-modal-overlay">
      <div className="delete-project-modal">
        <div className="delete-project-modal-header">
          <h2 className="delete-project-modal-title">Delete Project</h2>
          <button className="delete-project-modal-close" onClick={handleCancel}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <div className="delete-project-modal-content">
          <p className="delete-project-modal-message">
            Are you sure you want to delete the project '{project.name}'?
          </p>
          <p className="delete-project-modal-caution">This action cannot be undone.</p>
        </div>

        <div className="delete-project-modal-actions">
          <button 
            className="delete-project-modal-cancel-btn" 
            onClick={handleCancel}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button 
            className="delete-project-modal-delete-btn" 
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
} 