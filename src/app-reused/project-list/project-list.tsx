'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProjectListService } from './project-list.service';
import { ProjectHeader } from './project-header/project-header';
import { ProjectItem } from './project-item/project-item';
import { ProjectModals } from './project-modals/project-modals';
import { usePermission } from '../../util/usePermission.hook';
import './project-list.scss';
import { DTO_ProjectItem, DTO_ProjectItem1 } from '@/dtos/home.page.dto';

export default function ProjectListPage() {
  const router = useRouter();
  const permissions = usePermission();
  const [cachedProjects, setCachedProjects] = useState<DTO_ProjectItem1[]>([]);
  const [name, setName] = useState("")
  const [projects, setProjects] = useState<DTO_ProjectItem1[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showAddLeaderModal, setShowAddLeaderModal] = useState<number | null>(null);
  const [showUpdateLeaderModal, setShowUpdateLeaderModal] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<DTO_ProjectItem | null>(null);
  const [completingProjectId, setCompletingProjectId] = useState<number | null>(null);
  const [completedProjects, setCompletedProjects] = useState<Record<string, boolean>>({});
  const [deletingProjectId, setDeletingProjectId] = useState<number | null>(null);
  
  const onChangeName = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  }, []);

  useEffect(() => {
    ProjectListService.fetchProjects().then(setCachedProjects).catch(console.error);
  }, []);

  useEffect(() => {
    setProjects(cachedProjects)
  }, [cachedProjects])

  useEffect(() => {
    if (name.length === 0) {
      setProjects(cachedProjects)
    } else {
      setProjects(prev => {
        return [...prev.filter(project => project.name.toUpperCase().includes(name.toUpperCase()))]
      })
    }
  }, [name, cachedProjects])

  return (
    <div className="project-list-container">
      <div className="project-list-content">
        <ProjectHeader
          onCreateProject={() => setShowCreateModal(true)}
          canCreateProject={permissions.canCreateProject}
        />

        <div className="form-group-container">
          <fieldset className="form-group">
            <legend className="form-label">Search</legend>
            <input type="name" id="name" className="form-input" placeholder="Type Name" required value={name} onChange={onChangeName} />
          </fieldset>
        </div>

        <div className="project-list-items">
          {projects.length === 0
            ? <span className="loading-row">No Projects are shown here!</span>
            : projects.map((project) => (
              <ProjectItem
                key={project.id}
                project={project}
                onUpdateProject={(project) => {
                  console.log('Opening update modal with project:', project);
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
                    // Reload toàn bộ danh sách projects để đảm bảo dữ liệu mới nhất
                    const updatedProjects = await ProjectListService.fetchProjects();
                    setProjects(updatedProjects);
                    setCompletedProjects(prev => ({ ...prev, [project.id]: true }));
                  } catch (error) {
                    console.error('Error reloading projects after completion:', error);
                    // Fallback: cập nhật state local nếu reload thất bại
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
        onCreateProject={async (newProject) => {
          // Reload toàn bộ danh sách projects để đảm bảo dữ liệu mới nhất
          try {
            const updatedProjects = await ProjectListService.fetchProjects();
            setProjects(updatedProjects);
          } catch (error) {
            console.error('Error reloading projects:', error);
            // Fallback: thêm project mới vào đầu danh sách nếu reload thất bại
            setProjects(prev => [newProject, ...prev]);
          }
        }}
        onUpdateProject={async (updatedProject) => {
          // Reload toàn bộ danh sách projects để đảm bảo dữ liệu mới nhất
          try {
            const updatedProjects = await ProjectListService.fetchProjects();
            setProjects(updatedProjects);
          } catch (error) {
            console.error('Error reloading projects:', error);
            // Fallback: cập nhật project trong state local nếu reload thất bại
            setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
          }
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