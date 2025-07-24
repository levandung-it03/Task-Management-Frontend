'use client';
import React, { useState, useRef, useEffect } from 'react';
import { fetchPhaseData } from '../../../apis/emp.home.page.api';

import { createProject } from '../../../apis/create-project.page.api';
import { SearchUserToAssign, AssignedUsers } from '../../../app-reused/create-task/task-creation-form/task-creation.form';
import { DTO_CreatePhase, CREATE_PHASE_STATUS, CreatePhaseStatus, DTO_PhaseItem } from '../../../dtos/create-phase.page.dto';
import { createPhase, updatePhase } from '../../../apis/create-phase.page.api';
import './page.scss';

// Hàm tạo màu từ chuỗi
function stringToColor(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = `hsl(${hash % 360}, 70%, 60%)`;
  return color;
}
// Hàm lấy màu theo role
function getRoleColor(role: string) {
  switch (role) {
    case 'ROLE_LEAD':
      return '#43a047'; // xanh lá
    case 'ROLE_ADMIN':
      return '#e53935'; // đỏ
    case 'ROLE_PM':
      return '#1976d2'; // xanh dương
    default:
      return '#222'; // đen
  }
}

export default function ProjectListPage() {
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
  const [showAddLeaderModal, setShowAddLeaderModal] = useState<string | null>(null);
  const [leaderAssignedUsers, setLeaderAssignedUsers] = useState<Record<string, Record<string, string>>>({});
  const [leaderAssignedUsersHist, setLeaderAssignedUsersHist] = useState<Record<string, Record<string, string>>>({});
  const [canUndoLeader, setCanUndoLeader] = useState(false);
  const [hoveredUserId, setHoveredUserId] = useState<string | null>(null);

  // State cho modal cập nhật leader
  const [showUpdateLeaderModal, setShowUpdateLeaderModal] = useState<string | null>(null);
  const [updateLeaderAssignedUsers, setUpdateLeaderAssignedUsers] = useState<Record<string, Record<string, string>>>({});
  const [updateLeaderAssignedUsersHist, setUpdateLeaderAssignedUsersHist] = useState<Record<string, Record<string, string>>>({});
  const [hoveredUpdateUserId, setHoveredUpdateUserId] = useState<string | null>(null);

  useEffect(() => {
    fetchPhaseData().then((data: any) => setPhases(data));
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
      if (showAddLeaderModal && (modalRef.current || createModalRef.current) && !modalRef.current?.contains(event.target as Node) && !createModalRef.current?.contains(event.target as Node)) {
        setShowAddLeaderModal(null);
      }
      if (showUpdateLeaderModal && (modalRef.current || createModalRef.current) && !modalRef.current?.contains(event.target as Node) && !createModalRef.current?.contains(event.target as Node)) {
        setShowUpdateLeaderModal(null);
      }
    }
    if (openMenu || showUpdateModal || showCreateModal || showAddLeaderModal || showUpdateLeaderModal) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openMenu, showUpdateModal, showCreateModal, showAddLeaderModal, showUpdateLeaderModal]);

  function handleOpenUpdate(phase: DTO_PhaseItem) {
    setForm({ ...phase });
    setShowUpdateModal(true);
    setOpenMenu(null);
  }

  function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    setShowUpdateModal(false);
    if (form) {
      const { id, name, description, startDate, endDate, deadline, status } = form;
      updatePhase(id, { name, description, startDate, endDate, deadline, status }).then((updatedPhase) => {
        setPhases((prev) => prev.map((p) => (p.id === id ? updatedPhase : p)));
      });
    }
  }

  function handleClickAddLeader(phaseId: string) {
    setShowAddLeaderModal(phaseId);
    setLeaderAssignedUsers({});
    setLeaderAssignedUsersHist({});
    setCanUndoLeader(false);
  }

  // Hàm mở modal cập nhật leader
  function handleClickViewLeader(phaseId: string) {
    setShowUpdateLeaderModal(phaseId);
    // Lấy leader đã add từ project (giả sử có trường leaders hoặc assignedLeaders)
    const phase = phases.find(p => p.id === phaseId);
    // Giả sử project.leaders là object { userId: { username, fullName, role } }
    setUpdateLeaderAssignedUsers(phase?.leaders || {});
    setUpdateLeaderAssignedUsersHist(phase?.leaders || {});
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--under-background)', padding: 32, fontFamily: 'Inter, sans-serif' }}>
      <div style={{ maxWidth: 1700, margin: '0 auto', background: 'var(--background)', borderRadius: 18, boxShadow: '0 2px 16px #0001', padding: 48 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <svg width="32" height="32" fill="none" stroke="var(--main-green)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="4" y="4" width="24" height="24" rx="6" fill="#e6f4ea" stroke="var(--main-green)" />
                <path d="M10 12h12M10 18h12" stroke="var(--main-green)" />
              </svg>
              <span style={{ fontWeight: 700, fontSize: 32, color: 'var(--main-green)' }}>Phase Information</span>
            </div>
            <div style={{ color: '#64748b', fontSize: 16,marginBottom: 24, marginTop: 2, fontStyle: 'italic', marginLeft: 40 }}>See full Phase information</div>
          </div>
          <button
            style={{
              background: '#166534',
              color: '#fff',
              border: 'none',
              borderRadius: 999,
              padding: '12px 32px',
              fontWeight: 700,
              fontSize: 18,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              boxShadow: '0 2px 8px #0001',
              cursor: 'pointer',
              marginRight: 90,
            }}
            onClick={() => setShowCreateModal(true)}
          >
            <span style={{ color: '#fff',fontSize: 22, fontWeight: 700, marginRight: 4 }}>+</span> New
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {phases.map((phase) => (
            <div key={phase.id} style={{ position: 'relative', background: 'linear-gradient(110deg, #e6f4ec 0%, #b2dbc7 30%, #5ac8a1 50%, #b2dbc7 70%, #e6f4ec 100%)', border: '1px solid var(--main-green)', borderRadius: 16, padding: '15px 32px', display: 'flex', alignItems: 'center', gap: 18 }}>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 16 }}>
                <svg width="28" height="28" fill="none" stroke="var(--main-green)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="4" y="4" width="20" height="20" rx="5" fill="#e6f4ea" stroke="var(--main-green)" />
                  <path d="M10 12h8M10 16h8" stroke="var(--main-green)" />
                </svg>
                <span style={{ fontWeight: 700, fontSize: 22, color: 'var(--main-green)' }}>{phase.name}</span>
              </div>
              <div style={{ minWidth: 180, fontSize: 16, color: 'var(--main-green)', fontWeight: 500, textAlign: 'right' }}>
                Deadline: <span style={{ fontWeight: 700, color: '#d32f2f' }}>{phase.deadline}</span>
              </div>
              <button
                style={{ background: 'var(--main-green)', color: '#fff', border: '1.5px solid var(--main-green)', borderRadius: 8, padding: '8px 18px', fontWeight: 600, fontSize: 15, marginLeft: 18, cursor: 'pointer' }}
                onClick={() => handleClickAddLeader(phase.id)}
              >
                Add Leader
              </button>
              <button
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: 26,
                  color: 'var(--main-green)',
                  cursor: 'pointer',
                  padding: '0 8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                title="More"
                onClick={() => setOpenMenu(openMenu === phase.id ? null : phase.id)}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="5" r="2" fill="currentColor" />
                  <circle cx="12" cy="12" r="2" fill="currentColor" />
                  <circle cx="12" cy="19" r="2" fill="currentColor" />
                </svg>
              </button>
              {/* Menu context */}
              {openMenu === phase.id && (
                <div
                  ref={el => { menuRefs.current[phase.id] = el; }}
                  style={{
                    position: 'absolute',
                    top: 54,
                    right: 16,
                    minWidth: 220,
                    background: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: 10,
                    boxShadow: '0 4px 24px #0002',
                    zIndex: 10,
                    padding: '8px 0',
                  }}
                >
                  <div
                    style={{
                      padding: '10px 20px',
                      fontSize: 16,
                      color: '#222',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      fontWeight: 500,
                      transition: 'background 0.2s',
                      borderBottom: '1px solid #e5e7eb',
                    }}
                    onClick={() => handleOpenUpdate(phase)}
                    onMouseOver={e => (e.currentTarget.style.background = '#f3f4f6')}
                    onMouseOut={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    {/* icon file */}
                    <svg width="20" height="20" fill="none" stroke="#166534" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 10 }}>
                      <rect x="4" y="4" width="12" height="12" rx="2" />
                      <path d="M8 8h4M8 12h4" />
                    </svg>
                    View Phase Details
                  </div>
                  <div
                    style={{
                      padding: '10px 20px',
                      fontSize: 16,
                      color: '#222',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      fontWeight: 500,
                      transition: 'background 0.2s',
                    }}
                    onClick={() => {
                      setOpenMenu(null);
                      handleClickViewLeader(phase.id);
                    }}
                    onMouseOver={e => (e.currentTarget.style.background = '#f3f4f6')}
                    onMouseOut={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    {/* icon user */}
                    <svg width="20" height="20" fill="none" stroke="#166534" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 10 }}>
                      <circle cx="10" cy="8" r="4" />
                      <path d="M2 18c0-3.3 3.6-6 8-6s8 2.7 8 6" />
                    </svg>
                    View Leader Joined
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      {/* Modal Update Project */}
      {showUpdateModal && form && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.18)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div ref={modalRef} style={{
            background: '#fff',
            borderRadius: 18,
            boxShadow: '0 4px 32px #0002',
            padding: '32px 32px 24px 32px',
            minWidth: 400,
            maxWidth: '95vw',
            width: '60%',
            minHeight: 300,
            maxHeight: 600,
            display: 'flex',
            flexDirection: 'column',
            gap: 18,
            position: 'relative',
            overflowY: 'auto',
          }}>
            {/* Header Update Project */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <svg width="24" height="24" fill="none" stroke="#166534" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 4 }}>
                <rect x="4" y="4" width="16" height="16" rx="3" fill="#e6f4ea" stroke="#166534" />
                <path d="M8 8h8M8 12h8M8 16h4" stroke="#166534" />
              </svg>
              <span style={{ fontWeight: 700, fontSize: 20, color: '#166534' }}>Update Project</span>
              <button onClick={() => setShowUpdateModal(false)} style={{ marginLeft: 'auto', background: 'none', border: 'none', fontSize: 30, color: '#222', cursor: 'pointer', lineHeight: 1 }}>&times;</button>
            </div>
            {/* Form update project */}
            <form
              onSubmit={handleUpdate}
              style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 0 }}
            >
              {/* Project Name full row */}
              <fieldset
                style={{
                  border: '2.5px solid #111',
                  borderRadius: 8,
                  padding: '0 8px 0 8px',
                  margin: 0,
                  minWidth: 0,
                  position: 'relative',
                  marginBottom: 0,
                }}
              >
                <legend
                  style={{
                    fontSize: 16,
                    color: '#111',
                    fontWeight: 500,
                    padding: '0 8px',
                    letterSpacing: 0.2,
                    lineHeight: 1,
                    background: '#fff',
                    borderRadius: 4,
                    marginLeft: 8,
                  }}
                >
                  Project Name
                </legend>
                <input
                  type="text"
                  placeholder="..."
                  value={form.name}
                  onChange={e => setForm((f: DTO_PhaseItem | null) => f ? { ...f, name: e.target.value } : f)}
                  style={{ border: 'none', outline: 'none', fontSize: 15, padding: '12px 12px', width: '100%', background: 'transparent' }}
                  required
                />
              </fieldset>
              {/* Description full row */}
              <fieldset
                style={{
                  border: '2.5px solid #111',
                  borderRadius: 8,
                  padding: '0 8px 0 8px',
                  margin: 0,
                  minWidth: 0,
                  position: 'relative',
                  marginBottom: 0,
                }}
              >
                <legend
                  style={{
                    fontSize: 16,
                    color: '#111',
                    fontWeight: 500,
                    padding: '0 8px',
                    letterSpacing: 0.2,
                    lineHeight: 1,
                    background: '#fff',
                    borderRadius: 4,
                    marginLeft: 8,
                  }}
                >
                  Description
                </legend>
                <textarea
                  placeholder="..."
                  value={form.description || ''}
                  onChange={e => setForm((f: DTO_PhaseItem | null) => f ? { ...f, description: e.target.value } : f)}
                  style={{ border: 'none', outline: 'none', fontSize: 15, padding: '12px 12px', width: '100%', background: 'transparent', minHeight: 70, resize: 'vertical' }}
                />
              </fieldset>
              {/* 4 fields in 2 columns, 2 rows */}
              <div style={{ display: 'flex', gap: 16 }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <fieldset
                    style={{
                      border: '2.5px solid #111',
                      borderRadius: 8,
                      padding: '0 8px 0 8px',
                      margin: 0,
                      minWidth: 0,
                      position: 'relative',
                    }}
                  >
                    <legend
                      style={{
                        fontSize: 16,
                        color: '#111',
                        fontWeight: 500,
                        padding: '0 8px',
                        letterSpacing: 0.2,
                        lineHeight: 1,
                        background: '#fff',
                        borderRadius: 4,
                        marginLeft: 8,
                      }}
                    >
                      Start Date
                    </legend>
                    <input
                      type="date"
                      value={form.startDate || ''}
                      onChange={e => setForm((f: DTO_PhaseItem | null) => f ? { ...f, startDate: e.target.value } : f)}
                      style={{ border: 'none', outline: 'none', fontSize: 15, padding: '12px 12px', width: '100%', background: 'transparent' }}
                      required
                    />
                  </fieldset>
                  <fieldset
                    style={{
                      border: '2.5px solid #111',
                      borderRadius: 8,
                      padding: '0 8px 0 8px',
                      margin: 0,
                      minWidth: 0,
                      position: 'relative',
                    }}
                  >
                    <legend
                      style={{
                        fontSize: 16,
                        color: '#111',
                        fontWeight: 500,
                        padding: '0 8px',
                        letterSpacing: 0.2,
                        lineHeight: 1,
                        background: '#fff',
                        borderRadius: 4,
                        marginLeft: 8,
                      }}
                    >
                      End Date
                    </legend>
                    <input
                      type="date"
                      value={form.endDate || ''}
                      onChange={e => setForm((f: DTO_PhaseItem | null) => f ? { ...f, endDate: e.target.value } : f)}
                      style={{ border: 'none', outline: 'none', fontSize: 15, padding: '12px 12px', width: '100%', background: 'transparent' }}
                      required
                    />
                  </fieldset>
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <fieldset
                    style={{
                      border: '2.5px solid #111',
                      borderRadius: 8,
                      padding: '0 8px 0 8px',
                      margin: 0,
                      minWidth: 0,
                      position: 'relative',
                    }}
                  >
                    <legend
                      style={{
                        fontSize: 16,
                        color: '#111',
                        fontWeight: 500,
                        padding: '0 8px',
                        letterSpacing: 0.2,
                        lineHeight: 1,
                        background: '#fff',
                        borderRadius: 4,
                        marginLeft: 8,
                      }}
                    >
                      Deadline
                    </legend>
                    <input
                      type="date"
                      value={form.deadline || ''}
                      onChange={e => setForm((f: DTO_PhaseItem | null) => f ? { ...f, deadline: e.target.value } : f)}
                      style={{ border: 'none', outline: 'none', fontSize: 15, padding: '12px 12px', width: '100%', background: 'transparent' }}
                      required
                    />
                  </fieldset>
                  <fieldset
                    style={{
                      border: '2.5px solid #111',
                      borderRadius: 8,
                      padding: '0 8px 0 8px',
                      margin: 0,
                      minWidth: 0,
                      position: 'relative',
                    }}
                  >
                    <legend
                      style={{
                        fontSize: 16,
                        color: '#111',
                        fontWeight: 500,
                        padding: '0 8px',
                        letterSpacing: 0.2,
                        lineHeight: 1,
                        background: '#fff',
                        borderRadius: 4,
                        marginLeft: 8,
                      }}
                    >
                      Status
                    </legend>
                    <select
                      value={form.status || ''}
                      onChange={e => setForm((f: DTO_PhaseItem | null) => f ? { ...f, status: e.target.value as CreatePhaseStatus } : f)}
                      style={{ border: 'none', outline: 'none', fontSize: 15, padding: '12px 12px', width: '100%', background: 'transparent' }}
                      required
                    >
                      {CREATE_PHASE_STATUS.map((status: CreatePhaseStatus) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </fieldset>
                </div>
              </div>
              <button
                type="submit"
                style={{
                  background: '#207558',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 10,
                  padding: '16px 0',
                  fontWeight: 600,
                  fontSize: 17,
                  width: '100%',
                  display: 'block',
                  margin: '0 auto',
                  boxShadow: 'none',
                  letterSpacing: 0.2,
                  cursor: 'pointer',
                  marginTop: 18,
                }}
              >
                Update
              </button>
            </form>
          </div>
        </div>
      )}
      {showCreateModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.18)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div ref={createModalRef} style={{
            background: '#fff',
            borderRadius: 18,
            boxShadow: '0 4px 32px #0002',
            padding: '32px 32px 24px 32px',
            minWidth: 400,
            maxWidth: '95vw',
            width: '60%',
            minHeight: 300,
            maxHeight: 600,
            display: 'flex',
            flexDirection: 'column',
            gap: 18,
            position: 'relative',
            overflowY: 'auto',
          }}>
            {/* Header Create Project */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <svg width="24" height="24" fill="none" stroke="#166534" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 4 }}>
                <rect x="4" y="4" width="16" height="16" rx="3" fill="#e6f4ea" stroke="#166534" />
                <path d="M8 8h8M8 12h8M8 16h4" stroke="#166534" />
              </svg>
              <span style={{ fontWeight: 700, fontSize: 20, color: '#166534' }}>Create Phase</span>
              <button onClick={() => setShowCreateModal(false)} style={{ marginLeft: 'auto', background: 'none', border: 'none', fontSize: 30, color: '#222', cursor: 'pointer', lineHeight: 1 }}>&times;</button>
            </div>
            {/* Form 2 columns */}
            <form
              onSubmit={async e => {
                e.preventDefault();
                setShowCreateModal(false);
                createPhase(createForm as DTO_CreatePhase).then((newPhase) => {
                  setPhases(d => [newPhase, ...d]);
                  setCreateForm({
                    name: '',
                    description: '',
                    startDate: '',
                    endDate: '',
                    deadline: '',
                    status: 'Pending',
                  });
                });
              }}
              style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 0 }}
            >
              {/* Project Name full row */}
              <fieldset
                style={{
                  border: '2.5px solid #111',
                  borderRadius: 8,
                  padding: '0 8px 0 8px',
                  margin: 0,
                  minWidth: 0,
                  position: 'relative',
                  marginBottom: 0,
                }}
              >
                <legend
                  style={{
                    fontSize: 16,
                    color: '#111',
                    fontWeight: 500,
                    padding: '0 8px',
                    letterSpacing: 0.2,
                    lineHeight: 1,
                    background: '#fff',
                    borderRadius: 4,
                    marginLeft: 8,
                  }}
                >
                  Project Name
                </legend>
                <input
                  type="text"
                  placeholder="..."
                  value={createForm.name}
                  onChange={e => setCreateForm((f: DTO_CreatePhase) => ({ ...f, name: e.target.value }))}
                  style={{ border: 'none', outline: 'none', fontSize: 15, padding: '12px 12px', width: '100%', background: 'transparent' }}
                  required
                />
              </fieldset>
              {/* Description full row */}
              <fieldset
                style={{
                  border: '2.5px solid #111',
                  borderRadius: 8,
                  padding: '0 8px 0 8px',
                  margin: 0,
                  minWidth: 0,
                  position: 'relative',
                  marginBottom: 0,
                }}
              >
                <legend
                  style={{
                    fontSize: 16,
                    color: '#111',
                    fontWeight: 500,
                    padding: '0 8px',
                    letterSpacing: 0.2,
                    lineHeight: 1,
                    background: '#fff',
                    borderRadius: 4,
                    marginLeft: 8,
                  }}
                >
                  Description
                </legend>
                <textarea
                  placeholder="..."
                  value={createForm.description}
                  onChange={e => setCreateForm((f: DTO_CreatePhase) => ({ ...f, description: e.target.value }))}
                  style={{ border: 'none', outline: 'none', fontSize: 15, padding: '12px 12px', width: '100%', background: 'transparent', minHeight: 70, resize: 'vertical' }}
                />
              </fieldset>
              {/* 4 fields in 2 columns, 2 rows */}
              <div style={{ display: 'flex', gap: 16 }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <fieldset
                    style={{
                      border: '2.5px solid #111',
                      borderRadius: 8,
                      padding: '0 8px 0 8px',
                      margin: 0,
                      minWidth: 0,
                      position: 'relative',
                    }}
                  >
                    <legend
                      style={{
                        fontSize: 16,
                        color: '#111',
                        fontWeight: 500,
                        padding: '0 8px',
                        letterSpacing: 0.2,
                        lineHeight: 1,
                        background: '#fff',
                        borderRadius: 4,
                        marginLeft: 8,
                      }}
                    >
                      Start Date
                    </legend>
                    <input
                      type="date"
                      value={createForm.startDate}
                      onChange={e => setCreateForm((f: DTO_CreatePhase) => ({ ...f, startDate: e.target.value }))}
                      style={{ border: 'none', outline: 'none', fontSize: 15, padding: '12px 12px', width: '100%', background: 'transparent' }}
                      required
                    />
                  </fieldset>
                  <fieldset
                    style={{
                      border: '2.5px solid #111',
                      borderRadius: 8,
                      padding: '0 8px 0 8px',
                      margin: 0,
                      minWidth: 0,
                      position: 'relative',
                    }}
                  >
                    <legend
                      style={{
                        fontSize: 16,
                        color: '#111',
                        fontWeight: 500,
                        padding: '0 8px',
                        letterSpacing: 0.2,
                        lineHeight: 1,
                        background: '#fff',
                        borderRadius: 4,
                        marginLeft: 8,
                      }}
                    >
                      End Date
                    </legend>
                    <input
                      type="date"
                      value={createForm.endDate}
                      onChange={e => setCreateForm((f: DTO_CreatePhase) => ({ ...f, endDate: e.target.value }))}
                      style={{ border: 'none', outline: 'none', fontSize: 15, padding: '12px 12px', width: '100%', background: 'transparent' }}
                      required
                    />
                  </fieldset>
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <fieldset
                    style={{
                      border: '2.5px solid #111',
                      borderRadius: 8,
                      padding: '0 8px 0 8px',
                      margin: 0,
                      minWidth: 0,
                      position: 'relative',
                    }}
                  >
                    <legend
                      style={{
                        fontSize: 16,
                        color: '#111',
                        fontWeight: 500,
                        padding: '0 8px',
                        letterSpacing: 0.2,
                        lineHeight: 1,
                        background: '#fff',
                        borderRadius: 4,
                        marginLeft: 8,
                      }}
                    >
                      Deadline
                    </legend>
                    <input
                      type="date"
                      value={createForm.deadline}
                      onChange={e => setCreateForm((f: DTO_CreatePhase) => ({ ...f, deadline: e.target.value }))}
                      style={{ border: 'none', outline: 'none', fontSize: 15, padding: '12px 12px', width: '100%', background: 'transparent' }}
                      required
                    />
                  </fieldset>
                  <fieldset
                    style={{
                      border: '2.5px solid #111',
                      borderRadius: 8,
                      padding: '0 8px 0 8px',
                      margin: 0,
                      minWidth: 0,
                      position: 'relative',
                    }}
                  >
                    <legend
                      style={{
                        fontSize: 16,
                        color: '#111',
                        fontWeight: 500,
                        padding: '0 8px',
                        letterSpacing: 0.2,
                        lineHeight: 1,
                        background: '#fff',
                        borderRadius: 4,
                        marginLeft: 8,
                      }}
                    >
                      Status
                    </legend>
                    <select
                      value={createForm.status}
                      onChange={e => setCreateForm((f: DTO_CreatePhase) => ({ ...f, status: e.target.value as CreatePhaseStatus }))}
                      style={{ border: 'none', outline: 'none', fontSize: 15, padding: '12px 12px', width: '100%', background: 'transparent' }}
                      required
                    >
                      {CREATE_PHASE_STATUS.map((status: CreatePhaseStatus) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </fieldset>
                </div>
              </div>
            </form>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 18 }}>
              <button
                type="submit"
                form=""
                style={{
                  background: '#207558', // xanh đậm
                  color: '#fff',
                  border: 'none',
                  borderRadius: 10,
                  padding: '16px 0',
                  fontWeight: 600,
                  fontSize: 17,
                  width: '100%',
                  display: 'block',
                  margin: '0 auto',
                  boxShadow: 'none',
                  letterSpacing: 0.2,
                  cursor: 'pointer',
                }}
                onClick={async (e) => {
                  e.preventDefault();
                  setShowCreateModal(false);
                  const newProject = await createProject(createForm as DTO_CreatePhase);
                  setPhases(d => [newProject, ...d]);
                  setCreateForm({
                    name: '',
                    description: '',
                    startDate: '',
                    endDate: '',
                    deadline: '',
                    status: 'Pending',
                  });
                }}
              >
                Create Phase
              </button>
            </div>
          </div>
        </div>
      )}
      {showAddLeaderModal && (
        <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.18)', zIndex: 1000 }}>
          <div
            className="modal-content"
            style={{
              position: 'fixed',
              left: '50%',
              top: '13vh',
              transform: 'translateX(-50%)',
              minWidth: 600,
              maxWidth: 900,
              minHeight: 420,
              width: '90vw',
              background: '#fff',
              borderRadius: 18,
              boxShadow: '0 8px 32px #0003',
              padding: '44px 40px 32px 40px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              margin: '0 16px',
            }}
          >
            <div className="modal-header" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18, position: 'relative' }}>
              <span style={{ fontWeight: 700, fontSize: 24, color: 'var(--main-green)', letterSpacing: 0.5 }}>Add Leader</span>
              <button
                className="modal-close-button"
                onClick={() => setShowAddLeaderModal(null)}
                style={{ position: 'absolute', right: 0, top: 0, background: 'none', border: 'none', fontSize: 30, color: '#222', cursor: 'pointer', lineHeight: 1 }}
              >
                &times;
              </button>
            </div>
            <form
              className="modal-form"
              style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'center' }}
              onSubmit={e => { e.preventDefault(); setShowAddLeaderModal(null); }}
            >
              <div className="form-group-container search-user-container" style={{ width: '100%' }}>
                <fieldset className="form-group" style={{ border: '1.5px solid #166534', borderRadius: 10, padding: '12px 18px' }}>
                  <legend className="form-label" style={{ color: 'var(--main-green)', fontWeight: 600, fontSize: 16 }}>Search User</legend>
                  <SearchUserToAssign
                    assignedUsers={leaderAssignedUsers}
                    setAssignedUsers={setLeaderAssignedUsers}
                    setHistories={setLeaderAssignedUsersHist}
                  />
                </fieldset>
              </div>
              <div className="form-group-container assign-for-container" style={{ width: '100%' }}>
                <fieldset className="form-group" style={{ border: '1.5px solid #166534', borderRadius: 10, padding: '12px 18px' }}>
                  <legend className="form-label" style={{ color: 'var(--main-green)', fontWeight: 600, fontSize: 16 }}>Assigned Users</legend>
                  {/* Thêm dòng hướng dẫn nếu chưa có user nào */}
                  {Object.keys(leaderAssignedUsers).length === 0 && (
                    <div style={{ color: '#888', fontSize: 14, fontStyle: 'italic', marginBottom: 8 }}>
                      Assigned Users (blank for Root Task)
                    </div>
                  )}
                  {/* Custom Assigned Users render with tooltip on hover */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {Object.entries(leaderAssignedUsers).map(([userId, user]) => (
                      <div
                        key={userId}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          width: '100%',
                          marginBottom: 6,
                          position: 'relative',
                        }}
                      >
                        {/* Email + Tooltip */}
                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', flex: 1 }}>
                          <span
                            style={{
                              fontSize: 16,
                              color: '#222',
                              background: '#f7f7fa',
                              borderRadius: 8,
                              padding: '8px 18px',
                              border: '1.5px solid #e0e0e0',
                              fontWeight: 500,
                              cursor: 'pointer',
                              transition: 'box-shadow 0.2s',
                              boxShadow: '0 2px 8px #0001',
                              width: '100%',
                              display: 'block',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                            onMouseEnter={() => setHoveredUserId(userId)}
                            onMouseLeave={() => setHoveredUserId(null)}
                          >
                            {user.username}
                          </span>
                          {/* Tooltip detail */}
                          {hoveredUserId === userId && (
                            <div
                              style={{
                                position: 'absolute',
                                left: 0,
                                top: 40,
                                zIndex: 10,
                                background: '#fff',
                                border: '1.5px solid #e0e0e0',
                                borderRadius: 14,
                                boxShadow: '0 4px 24px #0002',
                                padding: '6px 10px 6px 8px', // giảm padding
                                width: '100%',
                                boxSizing: 'border-box',
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 6, // giảm gap
                              }}
                              onMouseEnter={() => setHoveredUserId(userId)}
                              onMouseLeave={() => setHoveredUserId(null)}
                            >
                              {/* Avatar nhỏ hơn */}
                              <div style={{
                                width: 20, height: 20, borderRadius: '50%',
                                background: stringToColor(user.username || user.fullName || ''),
                                color: '#fff', display: 'flex',
                                alignItems: 'center', justifyContent: 'center',
                                fontWeight: 700, fontSize: 11,
                                flexShrink: 0,
                              }}>
                                {user.fullName ? user.fullName[0].toUpperCase() : user.username[0].toUpperCase()}
                              </div>
                              {/* Info: tên + email cùng dòng */}
                              <div style={{ flex: 1, display: 'flex', alignItems: 'center', minWidth: 0 }}>
                                <span style={{ fontWeight: 600, fontSize: 14, marginRight: 8, whiteSpace: 'nowrap' }}>{user.fullName}</span>
                                <span style={{ color: '#666', fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', opacity: 0.85, minWidth: 0 }}>{user.username}</span>
                              </div>
                              {/* Badge role nhỏ lại */}
                              <div style={{
                                background: getRoleColor(user.role),
                                color: '#fff', borderRadius: 4, padding: '2px 8px',
                                fontWeight: 400, fontSize: 11, alignSelf: 'center'
                              }}>
                                {user.role}
                              </div>
                            </div>
                          )}
                        </div>
                        {/* Remove button */}
                        <button
                          onClick={() => {
                            const newUsers = { ...leaderAssignedUsers };
                            delete newUsers[userId];
                            setLeaderAssignedUsers(newUsers);
                          }}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#888',
                            fontSize: 22,
                            cursor: 'pointer',
                            marginLeft: 12,
                            alignSelf: 'center',
                          }}
                          title="Remove"
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                </fieldset>
              </div>
              <div className="modal-footer" style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: 10 }}>
                <button
                  type="submit"
                  className="create-project-button"
                  style={{
                    background: '#166534',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 10,
                    padding: '14px 48px',
                    fontWeight: 700,
                    fontSize: 18,
                    boxShadow: '0 2px 8px #0001',
                    cursor: 'pointer',
                    letterSpacing: 0.5,
                    transition: 'background 0.2s',
                  }}
                >
                  Add Leader
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Modal Update Leader */}
      {showUpdateLeaderModal && (
        <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.18)', zIndex: 1000 }}>
          <div
            className="modal-content"
            style={{
              position: 'fixed',
              left: '50%',
              top: '13vh',
              transform: 'translateX(-50%)',
              minWidth: 600,
              maxWidth: 900,
              minHeight: 420,
              width: '90vw',
              background: '#fff',
              borderRadius: 18,
              boxShadow: '0 8px 32px #0003',
              padding: '44px 40px 32px 40px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              margin: '0 16px',
            }}
          >
            <div className="modal-header" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18, position: 'relative' }}>
              <span style={{ fontWeight: 700, fontSize: 24, color: 'var(--main-green)', letterSpacing: 0.5 }}>Update Leader</span>
              <button
                className="modal-close-button"
                onClick={() => setShowUpdateLeaderModal(null)}
                style={{ position: 'absolute', right: 0, top: 0, background: 'none', border: 'none', fontSize: 30, color: '#222', cursor: 'pointer', lineHeight: 1 }}
              >
                &times;
              </button>
            </div>
            <form
              className="modal-form"
              style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'center' }}
              onSubmit={e => { e.preventDefault(); setShowUpdateLeaderModal(null); }}
            >
              <div className="form-group-container search-user-container" style={{ width: '100%' }}>
                <fieldset className="form-group" style={{ border: '1.5px solid #166534', borderRadius: 10, padding: '12px 18px' }}>
                  <legend className="form-label" style={{ color: 'var(--main-green)', fontWeight: 600, fontSize: 16 }}>Search User</legend>
                  <SearchUserToAssign
                    assignedUsers={updateLeaderAssignedUsers}
                    setAssignedUsers={setUpdateLeaderAssignedUsers}
                    setHistories={setUpdateLeaderAssignedUsersHist}
                  />
                </fieldset>
              </div>
              <div className="form-group-container assign-for-container" style={{ width: '100%' }}>
                <fieldset className="form-group" style={{ border: '1.5px solid #166534', borderRadius: 10, padding: '12px 18px' }}>
                  <legend className="form-label" style={{ color: 'var(--main-green)', fontWeight: 600, fontSize: 16 }}>Assigned Users</legend>
                  {/* Custom Assigned Users render with tooltip on hover */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {Object.entries(updateLeaderAssignedUsers).map(([userId, user]) => (
                      <div
                        key={userId}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          width: '100%',
                          marginBottom: 6,
                          position: 'relative',
                        }}
                      >
                        {/* Email + Tooltip */}
                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', flex: 1 }}>
                          <span
                            style={{
                              fontSize: 14,
                              color: '#222',
                              background: '#f7f7fa',
                              borderRadius: 8,
                              padding: '8px 18px',
                              border: '1.5px solid #e0e0e0',
                              fontWeight: 500,
                              cursor: 'pointer',
                              transition: 'box-shadow 0.2s',
                              boxShadow: '0 2px 8px #0001',
                              width: '100%',
                              display: 'block',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                            onMouseEnter={() => setHoveredUpdateUserId(userId)}
                            onMouseLeave={() => setHoveredUpdateUserId(null)}
                          >
                            {user.username}
                          </span>
                          {/* Tooltip detail giống như modal add leader, dùng hoveredUpdateUserId */}
                          {hoveredUpdateUserId === userId && (
                            <div
                              style={{
                                position: 'absolute',
                                left: 0,
                                top: 40,
                                zIndex: 10,
                                background: '#fff',
                                border: '1.5px solid #e0e0e0',
                                borderRadius: 14,
                                boxShadow: '0 4px 24px #0002',
                                padding: '6px 10px 6px 8px', // giảm padding
                                width: '100%',
                                boxSizing: 'border-box',
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 6, // giảm gap
                              }}
                              onMouseEnter={() => setHoveredUpdateUserId(userId)}
                              onMouseLeave={() => setHoveredUpdateUserId(null)}
                            >
                              {/* Avatar nhỏ hơn */}
                              <div style={{
                                width: 20, height: 20, borderRadius: '50%',
                                background: stringToColor(user.username || user.fullName || ''),
                                color: '#fff', display: 'flex',
                                alignItems: 'center', justifyContent: 'center',
                                fontWeight: 700, fontSize: 11,
                                flexShrink: 0,
                              }}>
                                {user.fullName ? user.fullName[0].toUpperCase() : user.username[0].toUpperCase()}
                              </div>
                              {/* Info: tên + email cùng dòng */}
                              <div style={{ flex: 1, display: 'flex', alignItems: 'center', minWidth: 0 }}>
                                <span style={{ fontWeight: 600, fontSize: 14, marginRight: 8, whiteSpace: 'nowrap' }}>{user.fullName}</span>
                                <span style={{ color: '#666', fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', opacity: 0.85, minWidth: 0 }}>{user.username}</span>
                              </div>
                              {/* Badge role nhỏ lại */}
                              <div style={{
                                background: getRoleColor(user.role),
                                color: '#fff', borderRadius: 4, padding: '2px 8px',
                                fontWeight: 400, fontSize: 11, alignSelf: 'center'
                              }}>
                                {user.role}
                              </div>
                            </div>
                          )}
                        </div>
                        {/* Remove button */}
                        <button
                          onClick={() => {
                            const newUsers = { ...updateLeaderAssignedUsers };
                            delete newUsers[userId];
                            setUpdateLeaderAssignedUsers(newUsers);
                          }}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#888',
                            fontSize: 22,
                            cursor: 'pointer',
                            marginLeft: 12,
                            alignSelf: 'center',
                          }}
                          title="Remove"
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                </fieldset>
              </div>
              <div className="modal-footer" style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: 10 }}>
                <button
                  type="submit"
                  className="create-project-button"
                  style={{
                    background: '#166534',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 10,
                    padding: '14px 48px',
                    fontWeight: 700,
                    fontSize: 18,
                    boxShadow: '0 2px 8px #0001',
                    cursor: 'pointer',
                    letterSpacing: 0.5,
                    transition: 'background 0.2s',
                  }}
                >
                  Update Leader
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}