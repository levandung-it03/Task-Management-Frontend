'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProjectListService } from './project-list.service';
import { ProjectHeader } from './project-header/project-header';
import { ProjectItem } from './project-item/project-item';
import { ProjectModals } from './project-modals/project-modals';
import { usePermission } from '../../util/usePermission.hook';
import './project-list.scss';
import { DTO_ProjectItem } from '@/dtos/home.page.dto';

export default function ProjectListPage() {
  const router = useRouter();
  const permissions = usePermission();
  const [projects, setProjects] = useState<DTO_ProjectItem[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showAddLeaderModal, setShowAddLeaderModal] = useState<number | null>(null);
  const [showUpdateLeaderModal, setShowUpdateLeaderModal] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<DTO_ProjectItem | null>(null);
  const [completingProjectId, setCompletingProjectId] = useState<number | null>(null);
  const [completedProjects, setCompletedProjects] = useState<Record<string, boolean>>({});
  const [deletingProjectId, setDeletingProjectId] = useState<number | null>(null);

  // Hàm xử lý click vào project để chuyển đến trang phase
  const handleProjectClick = (projectId: number) => {
    router.push(`/emp/phase?projectId=${projectId}`);
  };

  useEffect(() => {
    ProjectListService.fetchProjects().then(setProjects).catch(console.error);
  }, []);

  return (
    <div className="project-list-container">
      <div className="project-list-content">
        <ProjectHeader 
          onCreateProject={() => setShowCreateModal(true)}
          canCreateProject={permissions.canCreateProject}
        />
        
        <div className="project-list-items">
          {projects.map((project) => (
            <ProjectItem
              key={project.id}
              project={project}
              onProjectClick={handleProjectClick}
              onUpdateProject={(project) => {
                setSelectedProject(project);
                setShowUpdateModal(true);
              }}
              onAddLeader={(projectId) => setShowAddLeaderModal(projectId)}
              onUpdateLeader={(project) => {
                setSelectedProject(project);
                setShowUpdateLeaderModal(project.id);
              }}
              onDeleteProject={(project) => {
                setSelectedProject(project);
                setDeletingProjectId(project.id);
                setShowDeleteModal(true);
              }}
              onCompleteProject={async (project) => {
                setCompletingProjectId(project.id);
                try {
                  // Logic complete project sẽ được implement trong ProjectItem
                  setCompletedProjects(prev => ({ ...prev, [project.id]: true }));
                } finally {
                  setCompletingProjectId(null);
                }
              }}
              completingProjectId={completingProjectId}
              completedProjects={completedProjects}
              deletingProjectId={deletingProjectId}
              permissions={permissions}
            />
          ))}
        </div>
      </div>

      <ProjectModals
        showCreateModal={showCreateModal}
        showUpdateModal={showUpdateModal}
        showAddLeaderModal={showAddLeaderModal}
        showUpdateLeaderModal={showUpdateLeaderModal}
        showDeleteModal={showDeleteModal}
        selectedProject={selectedProject}
        onCloseCreateModal={() => setShowCreateModal(false)}
        onCloseUpdateModal={() => setShowUpdateModal(false)}
        onCloseAddLeaderModal={() => setShowAddLeaderModal(null)}
        onCloseUpdateLeaderModal={() => setShowUpdateLeaderModal(null)}
        onCloseDeleteModal={() => setShowDeleteModal(false)}
        onCreateProject={(newProject) => setProjects(prev => [newProject, ...prev])}
        onUpdateProject={(updatedProject) => {
          setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
          setShowUpdateModal(false);
        }}
        onAddLeader={(projectId, leaders) => {
          setProjects(prev => prev.map(p => p.id === projectId ? { 
            ...p, 
            leaders: { ...(p.leaders || {}), ...leaders }
          } : p));
          setShowAddLeaderModal(null);
        }}
        onUpdateLeader={(projectId, leaders) => {
          setProjects(prev => prev.map(p => p.id === projectId ? { 
            ...p, 
            leaders 
          } : p));
          setShowUpdateLeaderModal(null);
        }}
        onDeleteProject={(projectId, deleted) => {
          if (deleted) {
            setProjects(prev => prev.filter(p => p.id !== projectId));
          } else {
            setProjects(prev => prev.map(p => p.id === projectId ? { ...p, active: false } : p));
          }
          setShowDeleteModal(false);
          setDeletingProjectId(null);
        }}
        canUpdateProject={permissions.canUpdateProject}
        canAddLeader={permissions.canAddLeader}
        canRemoveLeader={permissions.canRemoveLeader}
      />
    </div>
  );
} 