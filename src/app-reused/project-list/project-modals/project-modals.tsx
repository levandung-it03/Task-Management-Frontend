import React from 'react';
import { CreateProjectModalComponent } from './create-project-modal/create-project-modal';
import { UpdateProjectModal } from './update-project-modal/update-project-modal';
import { AddLeaderModal } from './add-leader-modal/add-leader-modal';
import { UpdateLeaderModal } from './update-leader-modal/update-leader-modal';
import { DeleteProjectModal } from './delete-project-modal/delete-project-modal';
import { DTO_ProjectItem } from '@/dtos/home.page.dto';

interface ProjectModalsProps {
  showCreateModal: boolean;
  showUpdateModal: boolean;
  showAddLeaderModal: number | null;
  showUpdateLeaderModal: number | null;
  showDeleteModal: boolean;
  selectedProject: DTO_ProjectItem | null;
  onCloseCreateModal: () => void;
  onCloseUpdateModal: () => void;
  onCloseAddLeaderModal: () => void;
  onCloseUpdateLeaderModal: () => void;
  onCloseDeleteModal: () => void;
  onCreateProject: (newProject: DTO_ProjectItem) => void;
  onUpdateProject: (updatedProject: DTO_ProjectItem) => void;
  onAddLeader: (projectId: number, leaders: Record<number, any>) => void;
  onUpdateLeader: (projectId: number, leaders: Record<number, any>) => void;
  onDeleteProject: (projectId: number, deleted: boolean) => void;
  canUpdateProject?: boolean;
  canAddLeader?: boolean;
  canRemoveLeader?: boolean;
}

export function ProjectModals({
  showCreateModal,
  showUpdateModal,
  showAddLeaderModal,
  showUpdateLeaderModal,
  showDeleteModal,
  selectedProject,
  onCloseCreateModal,
  onCloseUpdateModal,
  onCloseAddLeaderModal,
  onCloseUpdateLeaderModal,
  onCloseDeleteModal,
  onCreateProject,
  onUpdateProject,
  onAddLeader,
  onUpdateLeader,
  onDeleteProject,
  canUpdateProject,
  canAddLeader,
  canRemoveLeader
}: ProjectModalsProps) {
  return (
    <>
      <CreateProjectModalComponent
        open={showCreateModal}
        onClose={onCloseCreateModal}
        onCreate={onCreateProject}
      />

      <UpdateProjectModal
        open={showUpdateModal}
        project={selectedProject}
        onClose={onCloseUpdateModal}
        onUpdate={onUpdateProject}
        canUpdateProject={canUpdateProject}
      />

      <AddLeaderModal
        open={!!showAddLeaderModal}
        projectId={showAddLeaderModal}
        onClose={onCloseAddLeaderModal}
        onAddLeader={onAddLeader}
      />

      <UpdateLeaderModal
        open={!!showUpdateLeaderModal}
        project={selectedProject}
        onClose={onCloseUpdateLeaderModal}
        onUpdateLeader={onUpdateLeader}
        canAddLeader={canAddLeader}
        canRemoveLeader={canRemoveLeader}
      />

      <DeleteProjectModal
        open={showDeleteModal}
        project={selectedProject}
        onClose={onCloseDeleteModal}
        onDelete={onDeleteProject}
      />
    </>
  );
} 