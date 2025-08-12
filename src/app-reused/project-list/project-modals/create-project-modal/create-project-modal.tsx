import React from 'react';
import { DTO_ProjectItem } from '@/dtos/home.page.dto';
import CreateProjectModal from '@/app-reused/create-project-modal';
import './create-project-modal.scss';

interface CreateProjectModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (newProject: DTO_ProjectItem) => void;
}

export function CreateProjectModalComponent({ open, onClose, onCreate }: CreateProjectModalProps) {
  if (!open) return null;

  return (
    <CreateProjectModal
      open={open}
      onClose={onClose}
      onCreate={onCreate}
      initialForm={{
        name: '',
        description: '',
        expectedStartDate: '',
        dueDate: '',
      }}
    />
  );
} 