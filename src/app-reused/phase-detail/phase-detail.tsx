'use client';
import React, { useState, useRef, useEffect, useCallback } from 'react';
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
import { AudioWaveform } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PhaseDetail({ projectId }: { projectId: number }) {
  const router = useRouter();
  const permissions = usePermission();

  const [cachedPhases, setCachedPhases] = useState<DTO_PhaseItem[]>([]);
  const [name, setName] = useState("")
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [form, setForm] = useState<DTO_PhaseItem | null>(null);
  const [phases, setPhases] = useState<DTO_PhaseItem[]>([]);
  const menuRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const modalRef = useRef<HTMLDivElement>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState<Record<string, string>>({
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
          setCachedPhases(data)
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

  const handleUpdate = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    async function update() {
      if (form) {
        const { id, name, description, startDate, dueDate } = form;
        const request = DTO_CreatePhase.withBuilder()
          .bname(name)
          .bdescription(description)
          .bstartDate(startDate)
          .bdueDate(dueDate);
        const response = await PhaseAPIs.updatePhase(form.id, request) as ApiResponse<void>;
        if (String(response.status).startsWith("2")) {
          toast.success(response.msg);
          setPhases((prev) => prev.map((p) => (p.id === id
            ? {
              ...p,
              name,
              description,
              startDate,
              dueDate,
              updatedTime: new Date().toISOString().slice(0, 19).replace('T', ' ')
            } : p)));
          setShowUpdateModal(false);
        }
      }
    }
    update();
  }, [form]);

  const handleDeletePhase = useCallback((phase: DTO_PhaseItem) => {
    async function remove() {
      if (!await confirm('Are you sure you want to delete this phase?', 'Delete Phase'))
        return;

      const response = await PhaseAPIs.deletePhase(phase.id) as ApiResponse<void>;
      if (String(response.status).startsWith("2")) {
        toast.success(response.msg)
        setPhases(prev => prev.filter(p => p.id !== phase.id));
      }
    }
    remove();
  }, []);

  const handleCreatePhase = useCallback(() => {
    async function create() {
      const request = DTO_CreatePhase.withBuilder()
        .bname(createForm.name)
        .bdescription(createForm.description)
        .bstartDate(createForm.startDate)
        .bdueDate(createForm.dueDate);
      const response = await PhaseAPIs.createPhase(projectId, request) as ApiResponse<DTO_IdResponse>;
      if (String(response.status).startsWith("2")) {
        toast.success(response.msg);
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
      }
    }
    create();
  }, [createForm]);

  // Wrapper functions for form setters
  const handleSetForm = (newForm: DTO_PhaseItem | DTO_CreatePhase) => {
    setForm(newForm as DTO_PhaseItem);
  };

  const handleSetCreateForm = (newForm: DTO_PhaseItem | DTO_CreatePhase) => {
    setCreateForm(newForm as DTO_CreatePhase);
  };

  const onChangeName = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  }, []);

  useEffect(() => {
    if (name.length === 0) {
      setPhases(cachedPhases)
    } else {
      setPhases(prev => {
        return [...prev.filter(phase => phase.name.toUpperCase().includes(name.toUpperCase()))]
      })
    }
  }, [name, cachedPhases])

  return (
    <>
      <ProjectDetail projectId={projectId} />
      <div className="phase-detail-container">
        <div className="phase-detail-content">
          <div className="phase-detail-header form-caption-wrap">
            <div className="form-caption">
              <AudioWaveform className="caption-icon" />
              <span className="caption-content">Phases List</span>
              <i className="desc-content">All Phases that relates to this Project.</i>
            </div>
            <PhaseActions
              onCreateClick={() => setShowCreateModal(true)}
              canCreatePhase={permissions.canCreatePhase}
            />
          </div>

          <div className="form-group-container">
            <fieldset className="form-group">
              <legend className="form-label">Search</legend>
              <input type="name" id="name" className="form-input" placeholder="Type Name" required value={name} onChange={onChangeName} />
            </fieldset>
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