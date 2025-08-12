'use client';
import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PhaseList from './phase-list/phase-list';
import PhaseForm from './phase-form/phase-form';
import PhaseActions from './phase-actions/phase-actions';
import './phase-detail.scss';
import { usePermission } from '@/util/usePermission.hook';
import { PhaseAPIs } from '@/apis/phase.page.api';
import { ApiResponse } from '@/apis/general.api';
import { confirm } from '../confirm-alert/confirm-alert';
import { DTO_CreatePhase, DTO_PhaseItem } from '@/dtos/phase.page.dto';
import { AuthHelper } from '../../util/auth.helper';
import { DTO_IdResponse } from '@/dtos/general.dto';
import ProjectDetail from './project-detail/project-detail';
export default function PhaseDetail({ projectId }: { projectId: number }) {
  const router = useRouter();
  const permissions = usePermission();

  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [form, setForm] = useState<DTO_PhaseItem | null>(null);
  const [phases, setPhases] = useState<DTO_PhaseItem[]>([]);
  const menuRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const modalRef = useRef<HTMLDivElement>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState<DTO_CreatePhase>({
    name: '',
    description: '',
    startDate: '',
    dueDate: '',
  });
  const createModalRef = useRef<HTMLDivElement>(null);

  // Hàm xử lý click vào phase để chuyển đến trang collection
  const handlePhaseClick = (phaseId: number) => {
    const role = AuthHelper.getRoleFromToken();

    const rolePaths: Record<string, string> = {
      pm: '/pm',
      lead: '/lead',
      emp: '/emp'
    };

    const basePath = rolePaths[role];
    if (!basePath) {
      console.error('Role không hợp lệ:', role);
      return;
    }

    router.push(`${basePath}/phases/${phaseId}/collections`);
  };


  useEffect(() => {
    if (projectId) {
      PhaseAPIs.getPhasesByProject(Number(projectId)).then((response) => {
        if (response && typeof response === 'object' && 'body' in response && response.body) {
          const data = (response as ApiResponse<DTO_PhaseItem[]>).body;
          setPhases(data);
        } else {
          console.error('Invalid response format:', response);
        }
      }).catch((error) => {
        console.error('Error loading phases:', error);
      });
    }
  }, [projectId]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (openMenu) {
        const ref = menuRefs.current[openMenu];
        if (ref && !ref.contains(event.target as Node)) {
          setOpenMenu(null);
        }
      }
      if (showUpdateModal && modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setShowUpdateModal(false);
      }
      if (showCreateModal && createModalRef.current && !createModalRef.current.contains(event.target as Node)) {
        setShowCreateModal(false);
      }
    }
    if (openMenu || showUpdateModal || showCreateModal) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openMenu, showUpdateModal, showCreateModal]);

  function handleOpenUpdate(phase: DTO_PhaseItem) {
    setForm({ ...phase });
    setShowUpdateModal(true);
  }

  function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (form) {
      const { id, name, description, startDate, dueDate } = form;
      PhaseAPIs.updatePhase(id, { name, description, startDate, dueDate }).then((res) => {
        if (res && typeof res === 'object' && 'status' in res && res.status === 200) {
          // Update the phase in the local state with the form data
          setPhases((prev) => prev.map((p) => (p.id === id ? { ...p, name, description, startDate, dueDate, updatedTime: new Date().toISOString().slice(0, 19).replace('T', ' ') } : p)));
          setShowUpdateModal(false);
        } else {
          console.error('Invalid response format:', res);
        }
      }).catch((error: unknown) => {
        console.error('Error updating phase:', error);
      });
    }
  }

  // Hàm xóa phase
  const handleDeletePhase = async (phase: DTO_PhaseItem) => {
    try {
      const ok = await confirm('Are you sure you want to delete this phase?', 'Delete Phase');
      if (!ok) return;

      const response = await PhaseAPIs.deletePhase(phase.id);

      if (response && typeof response === 'object' && 'status' in response && response.status === 200) {
        // Remove the phase from the local state
        setPhases(prev => prev.filter(p => p.id !== phase.id));
      } else {
        console.error('Invalid response format:', response);
      }
    } catch (error) {
      console.error('Error deleting phase:', error);
    }
  };

  const handleCreatePhase = async () => {
    try {
      const res = await PhaseAPIs.createPhase(projectId, createForm);
      if (res && typeof res === 'object' && 'body' in res && res.body) {
        const response = res as ApiResponse<DTO_IdResponse>;
        // Tạo phase item mới từ response
        const newPhase: DTO_PhaseItem = {
          id: response.body.id,
          name: createForm.name,
          description: createForm.description,
          startDate: createForm.startDate,
          dueDate: createForm.dueDate,
          endDate: null,
          createdTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
          updatedTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
        };
        setPhases(d => [newPhase, ...d]);
        setShowCreateModal(false);
        setCreateForm({
          name: '',
          description: '',
          startDate: '',
          dueDate: '',
        });
      } else {
        console.error('Invalid response format:', res);
      }
    } catch (error) {
      console.error('Error creating phase:', error);
    }
  };

  // Wrapper functions for form setters
  const handleSetForm = (newForm: DTO_PhaseItem | DTO_CreatePhase) => {
    setForm(newForm as DTO_PhaseItem);
  };

  const handleSetCreateForm = (newForm: DTO_PhaseItem | DTO_CreatePhase) => {
    setCreateForm(newForm as DTO_CreatePhase);
  };

  return (
    <>
      <ProjectDetail projectId={projectId} />
      <div className="phase-detail-container">
        <div className="phase-detail-content">
          <div className="phase-detail-header">
            <div className="phase-detail-title">
              <div className="phase-detail-title-main">
                <svg width="32" height="32" fill="none" stroke="var(--main-green)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="4" y="4" width="24" height="24" rx="6" fill="#e6f4ea" stroke="var(--main-green)" />
                  <path d="M10 12h12M10 18h12" stroke="var(--main-green)" />
                </svg>
                <span className="phase-detail-title-text">Phase List</span>
              </div>
              <div className="phase-detail-subtitle">
                See full Phase information
              </div>
            </div>
            <PhaseActions
              onCreateClick={() => setShowCreateModal(true)}
              canCreatePhase={permissions.canCreatePhase}
            />
          </div>

          <PhaseList
            phases={phases}
            onPhaseClick={handlePhaseClick}
            onUpdateClick={handleOpenUpdate}
            onDeleteClick={handleDeletePhase}
            permissions={permissions}
          />
        </div>

        {showUpdateModal && form && (
          <PhaseForm
            form={form}
            setForm={handleSetForm}
            onSubmit={handleUpdate}
            onClose={() => setShowUpdateModal(false)}
            modalRef={modalRef}
            isUpdate={true}
            canUpdatePhase={permissions.canUpdatePhase}
          />
        )}

        {showCreateModal && (
          <PhaseForm
            form={createForm}
            setForm={handleSetCreateForm}
            onSubmit={handleCreatePhase}
            onClose={() => setShowCreateModal(false)}
            modalRef={createModalRef}
            isUpdate={false}
            canUpdatePhase={permissions.canUpdatePhase}
          />
        )}
      </div>
    </>
  );
} 