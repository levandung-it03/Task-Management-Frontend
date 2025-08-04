'use client';
import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PhaseList from './phase-list/phase-list';
import PhaseForm from './phase-form/phase-form';
import PhaseActions from './phase-actions/phase-actions';
import './phase-detail.scss';
import { usePermission } from '@/util/usePermission.hook';
import { PhaseAPIs } from '@/apis/emp.phase.page.api';
import { ApiResponse } from '@/apis/general.api';
import { confirm } from '../confirm-alert/confirm-alert';
import { DTO_CreatePhase, DTO_DeletePhase, DTO_PhaseItem } from '@/dtos/phase.page.dto';

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
    endDate: '',
    deadline: '',
    status: 'Pending',
  });
  const createModalRef = useRef<HTMLDivElement>(null);

  // Hàm xử lý click vào phase để chuyển đến trang collection
  const handlePhaseClick = (phaseId: string) => {
    router.push(`/emp/collection?phaseId=${phaseId}`);
  };

  useEffect(() => {
    PhaseAPIs.getPhaseData().then((response) => {
      const data = (response as ApiResponse<DTO_PhaseItem[]>).body;
      if (data) {
        setPhases(data);
      }
    });
  }, []);

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
      const { id, name, description, startDate, endDate, deadline, status } = form;
      PhaseAPIs.updatePhase(id, { name, description, startDate, endDate, deadline, status }).then((res) => {
        if (res && typeof res === 'object' && 'body' in res) {
          setPhases((prev) => prev.map((p) => (p.id === id ? (res as any).body : p)));
          setShowUpdateModal(false);
        }
      }).catch((error) => {
        console.error('Error updating phase:', error);
        alert('An error occurred while updating the phase. Please try again!');
      });
    }
  }

  // Hàm xóa phase
  const handleDeletePhase = async (phase: DTO_PhaseItem) => {
    try {
      const hasCollections = await checkPhaseHasCollections(phase.id);
      const message = hasCollections 
        ? 'This phase has child data (collections). Do you want to disable this phase?'
        : 'Are you sure you want to delete this phase?';
      const title = hasCollections ? 'Disable Phase' : 'Delete Phase';
      
      const ok = await confirm(message, title);
      if (!ok) return;
      
      const request = new DTO_DeletePhase().bquery(phase.id, !hasCollections);
      const response = await PhaseAPIs.deletePhase(request);
      const result = (response as ApiResponse<{ phaseId: string; deleted: boolean; softDeleted: boolean }>).body;
      
      if (result) {
        if (result.deleted) {
          setPhases(prev => prev.filter(p => p.id !== phase.id));
        } else if (result.softDeleted) {
          setPhases(prev => prev.map(p => p.id === phase.id ? { ...p, active: false } : p));
        }
      }
    } catch (error) {
      console.error('Error deleting phase:', error);
      alert('An error occurred while deleting the phase. Please try again!');
    }
  };

  // Hàm kiểm tra phase có collection hay không
  const checkPhaseHasCollections = async (phaseId: string): Promise<boolean> => {
    try {
      const response = await PhaseAPIs.checkPhaseHasCollections(phaseId);
      const data = (response as ApiResponse<{ count: number }>).body;
      return data ? data.count > 0 : false;
    } catch (error) {
      console.error('Error checking phase collections:', error);
      return true;
    }
  };

  const handleCreatePhase = async () => {
    try {
      const res = await PhaseAPIs.createPhase(projectId, createForm as DTO_CreatePhase);
      if (res && typeof res === 'object' && 'body' in res) {
        setPhases(d => [(res as any).body, ...d]);
        setShowCreateModal(false);
        setCreateForm({
          name: '',
          description: '',
          startDate: '',
          deadline: '',
          status: 'Pending',
        });
      }
    } catch (error) {
      console.error('Error creating phase:', error);
      alert('An error occurred while creating the phase. Please try again!');
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
    <div className="phase-detail-container">
      <div className="phase-detail-content">
        <div className="phase-detail-header">
          <div className="phase-detail-title">
            <div className="phase-detail-title-main">
              <svg width="32" height="32" fill="none" stroke="var(--main-green)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="4" y="4" width="24" height="24" rx="6" fill="#e6f4ea" stroke="var(--main-green)" />
                <path d="M10 12h12M10 18h12" stroke="var(--main-green)" />
              </svg>
              <span className="phase-detail-title-text">Phase Information</span>
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
  );
} 