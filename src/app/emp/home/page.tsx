'use client';
import React, { useEffect, useState, useRef } from 'react';
import { fetchEmpHomeData } from '../../../apis/emp.home.page.api';
import { EmpHomeData, ProjectItem } from '../../../dtos/emp.home.page.dto';
import { createProject } from '../../../apis/create-project.page.api';
import { CreateProjectDto, PROJECT_STATUS } from '../../../dtos/create-project.page.dto';

export default function EmpHome() {
  const [data, setData] = useState<EmpHomeData | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    dueDate: '',
    status: 'Pending',
  });
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchEmpHomeData().then(setData);
  }, []);

  // Đóng modal khi click ngoài
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (showModal && modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setShowModal(false);
      }
    }
    if (showModal) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showModal]);

  if (!data) return <div>Loading...</div>;

  return (
    <div style={{ padding: 32, fontFamily: 'Inter, sans-serif', background: 'var(--under-background)', minHeight: '100vh' }}>
      {/* Vùng 1: Search + Import Data + Avatar */}
      <div style={{ background: 'rgb(240, 240, 240)', borderRadius: 16, boxShadow: '0 2px 8px #0001', padding: 24, marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Ô search với icon kính lúp và ⌘F */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: '#f8fafc',
            borderRadius: 12,
            border: '1px solid #e5e7eb',
            padding: '0 12px',
            height: 44,
            width: 360,
            minWidth: 0,
            marginRight: 20,
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 8 }}>
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search project"
              style={{
                border: 'none',
                outline: 'none',
                background: 'transparent',
                fontSize: 16,
                flex: 1,
                color: '#222',
              }}
            />
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              background: '#f1f5f9',
              color: '#334155',
              borderRadius: 8,
              fontWeight: 600,
              fontSize: 15,
              padding: '2px 10px',
              marginLeft: 8,
              border: '1px solid #e5e7eb',
              letterSpacing: 1,
            }}>
              ⌘F
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            {/* Icon chuông thông báo */}
            <button style={{ background: '#fff', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center' }} aria-label="Notifications">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#334155" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <img src="/images/avatar1.png" alt="avatar" style={{ width: 40, height: 40, borderRadius: '50%' }} />
              <div>
                <div style={{ fontWeight: 600 }}>Totok Michael</div>
                <div style={{ fontSize: 13, color: '#888' }}>tmichael20@mail.com</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Vùng 2: Phần còn lại */}
      <div style={{ background: 'rgb(240, 240, 240)', borderRadius: 16, boxShadow: '0 2px 8px #0001', padding: 24 }}>
        {/* Header dòng 2: Dashboard + mô tả + Add Project + Import User */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ fontWeight: 700, fontSize: 32, letterSpacing: -1 }}>Dashboard</div>
            <div style={{ color: '#888', fontSize: 16, fontWeight: 400 }}>
              Plan, prioritize, and accomplish your tasks with ease.
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 8 }}>
            <button
              style={{ background: '#166534', color: '#fff', border: 'none', borderRadius: 999, padding: '12px 32px', fontWeight: 600, fontSize: 16, display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 2px 8px #0001' }}
              onClick={() => setShowModal(true)}
            >
              <span style={{ fontSize: 22, fontWeight: 700, marginRight: 4 }}>+</span> Add Project
            </button>
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <button style={{
                background: '#fff',
                color: 'var(--logo-color)',
                border: '1.5px solid #222',
                borderRadius: 999,
                padding: '12px 32px',
                fontWeight: 600,
                fontSize: 16,
                position: 'relative',
                overflow: 'hidden',
                zIndex: 1,
              }}>
                Import User
              </button>
            </div>
          </div>
        </div>
        {/* Dashboard Stats */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
          <StatCard
            label="Total Projects"
            value={data.stats.details?.[0]?.value ?? 0}
            color={data.stats.details?.[0]?.color ?? '#166534'}
            growth={data.stats.details?.[0]?.growth}
            growthType={data.stats.details?.[0]?.growthType}
            growthText={data.stats.details?.[0]?.growthText}
          />
          <StatCard
            label="Ended Projects"
            value={data.stats.details?.[1]?.value ?? 0}
            color={data.stats.details?.[1]?.color ?? '#334155'}
            growth={data.stats.details?.[1]?.growth}
            growthType={data.stats.details?.[1]?.growthType}
            growthText={data.stats.details?.[1]?.growthText}
          />
          <StatCard
            label="Running Projects"
            value={data.stats.details?.[2]?.value ?? 0}
            color={data.stats.details?.[2]?.color ?? '#0e7490'}
            growth={data.stats.details?.[2]?.growth}
            growthType={data.stats.details?.[2]?.growthType}
            growthText={data.stats.details?.[2]?.growthText}
          />
          <StatCard
            label="Pending Project"
            value={data.stats.details?.[3]?.value ?? 0}
            color={data.stats.details?.[3]?.color ?? '#a16207'}
            growth={data.stats.details?.[3]?.growth}
            growthType={data.stats.details?.[3]?.growthType}
            growthText={data.stats.details?.[3]?.growthText}
          />
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          {/* Team Collaboration (Group List) */}
          <div style={{ flex: 2, background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 2px 8px #0001', display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 16 }}>On Groups</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {data.groups?.map((group) => (
                <div key={group.id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '10px 10px', border: '1.5px solid #111', borderRadius: 12, background: '#fff' }}>
                  <img src={group.groupAvatar} alt={group.groupName} style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', border: '2px solid #e5e7eb' }} />
                  <div style={{ flex: 1, fontWeight: 600, fontSize: 16 }}>{group.groupName}</div>
                  <RoleTag role={group.role} />
                </div>
              ))}
            </div>
          </div>
          {/* Project List */}
          <div style={{ flex: 1, background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 2px 8px #0001' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ fontWeight: 600, fontSize: 18 }}>Project</div>
              <button style={{ background: '#f1f5f9', border: 'none', borderRadius: 8, padding: '6px 16px', fontWeight: 500 }}>
                + New
              </button>
            </div>
            <div>
              {data.projects.map((proj: ProjectItem) => (
                <div key={proj.id} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#0ea5e9' }} />
                  <div style={{ flex: 1, fontWeight: 500 }}>{proj.name}</div>
                  <div style={{ fontSize: 13, color: '#888' }}>Due date: {proj.dueDate}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Modal Create Project */}
      {showModal && (
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
            maxWidth: '90vw',
            width: 420,
            display: 'flex',
            flexDirection: 'column',
            gap: 18,
            position: 'relative',
          }}>
            <div style={{ fontWeight: 700, fontSize: 26, textAlign: 'center', marginBottom: 8, color: '#1e293b' }}>Create New Project</div>
            <label style={{ fontWeight: 600, fontSize: 15, marginBottom: 2 }}>Project Name</label>
            <input
              type="text"
              placeholder="..."
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              style={{ padding: 10, borderRadius: 8, border: '1.5px solid #e5e7eb', fontSize: 15, marginBottom: 2 }}
            />
            <label style={{ fontWeight: 600, fontSize: 15, marginBottom: 2 }}>Description</label>
            <textarea
              placeholder="..."
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              style={{ padding: 10, borderRadius: 8, border: '1.5px solid #e5e7eb', fontSize: 15, minHeight: 70, resize: 'vertical', marginBottom: 2 }}
            />
            <label style={{ fontWeight: 600, fontSize: 15, marginBottom: 2 }}>Start Date</label>
            <input
              type="date"
              value={form.startDate}
              onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))}
              style={{ padding: 10, borderRadius: 8, border: '1.5px solid #e5e7eb', fontSize: 15, marginBottom: 2 }}
            />
            <label style={{ fontWeight: 600, fontSize: 15, marginBottom: 2 }}>End Date</label>
            <input
              type="date"
              value={form.endDate}
              onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))}
              style={{ padding: 10, borderRadius: 8, border: '1.5px solid #e5e7eb', fontSize: 15, marginBottom: 2 }}
            />
            <label style={{ fontWeight: 600, fontSize: 15, marginBottom: 2 }}>Due Date</label>
            <input
              type="date"
              value={form.dueDate}
              onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))}
              style={{ padding: 10, borderRadius: 8, border: '1.5px solid #e5e7eb', fontSize: 15, marginBottom: 2 }}
            />
            <label style={{ fontWeight: 600, fontSize: 15, marginBottom: 2 }}>Status</label>
            <select
              value={form.status}
              onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
              style={{ padding: 10, borderRadius: 8, border: '1.5px solid #e5e7eb', fontSize: 15, marginBottom: 2 }}
            >
              {PROJECT_STATUS.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 18 }}>
              <button
                onClick={() => setShowModal(false)}
                style={{ background: '#e5e7eb', color: '#222', border: 'none', borderRadius: 8, padding: '10px 28px', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  setShowModal(false);
                  const newProject = await createProject(form as CreateProjectDto);
                  setData(d => d ? { ...d, projects: [newProject, ...d.projects] } : d);
                }}
                style={{ background: 'var(--logo-color)', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 28px', fontWeight: 600, fontSize: 15, cursor: 'pointer', boxShadow: '0 2px 8px #22c55e33' }}
              >
                Create Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, color, growth, growthType, growthText }: {
  label: string;
  value: number;
  color: string;
  growth?: number;
  growthType?: 'up' | 'down' | 'discuss' | null;
  growthText?: string;
}) {
  const isTotal = label === 'Total Projects';
  // Style cho card
  const cardBg = isTotal ? 'linear-gradient(135deg,var(--logo-color) 60%, #22c55e 100%)' : '#fff';
  const labelColor = isTotal ? '#fff' : '#222';
  const valueColor = isTotal ? '#fff' : '#111';
  const statusColor = isTotal ? 'rgb(34, 197, 94)' : '#22c55e';
  // Style cho icon góc phải
  const iconCircleBg = isTotal ? '#fff' : '#fff';
  const iconCircleBorder = isTotal ? 'none' : '1.5px solid #222';
  const iconArrowColor = isTotal ? '#166534' : '#222';
  // Style cho trạng thái
  const statusFontWeight = isTotal ? 600 : 500;
  // Style cho số
  const valueFontWeight = 300;
  // Style cho ô trạng thái
  const statusBoxBg = isTotal ? 'var(--logo-color)' : '#fff';
  const statusBoxColor = isTotal ? 'rgb(34, 197, 94)' : '#22c55e';
  const statusBoxBorder = isTotal ? 'none' : '1.5px solid #22c55e';
  // Icon tăng trưởng
  let growthIcon = null;
  if (growthType === 'up') {
    growthIcon = (
      <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke={statusBoxColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 2 }}>
        <path d="M10 14V6" />
        <path d="M6 10l4-4 4 4" />
      </svg>
    );
  } else if (growthType === 'down') {
    growthIcon = (
      <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 2 }}>
        <path d="M10 6v8" />
        <path d="M6 10l4 4 4-4" />
      </svg>
    );
  } else if (growthType === 'discuss') {
    growthIcon = (
      <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="#a16207" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 2 }}>
        <circle cx="10" cy="10" r="6" />
        <path d="M8 10h4" />
      </svg>
    );
  }
  return (
    <div style={{
      flex: 1,
      background: cardBg,
      color: labelColor,
      borderRadius: 16,
      padding: 24,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      minWidth: 180,
      position: 'relative',
      overflow: 'hidden',
      boxShadow: isTotal ? undefined : '0 1px 8px #0001',
      border: isTotal ? undefined : '1.5px solid #f1f5f9',
    }}>
      {/* Nút tròn góc phải với icon mũi tên lên phải */}
      <div style={{
        position: 'absolute',
        top: 18,
        right: 18,
        width: 36,
        height: 36,
        background: iconCircleBg,
        border: iconCircleBorder,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: isTotal ? undefined : '0 1px 4px #0001',
      }}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke={iconArrowColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 13L13 7" />
          <path d="M9 7h4v4" />
        </svg>
      </div>
      <div style={{ fontSize: 18, opacity: 0.9, marginBottom: 20, color: labelColor, fontWeight: 600 }}>{label}</div>
      <div style={{ fontSize: 55, fontWeight: valueFontWeight, margin: 0, fontFamily: 'Inter, Roboto, Arial, sans-serif', color: valueColor }}>{value}</div>
      <div style={{ display: 'flex', alignItems: 'center', marginTop: 0 }}>
        {growthType && (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            background: statusBoxBg,
            color: statusBoxColor,
            borderRadius: 6,
            fontSize: 14,
            fontWeight: 600,
            padding: '2px 8px',
            marginRight: 8,
            border: '1.5px solid rgb(34, 197, 94)',
          }}>
            {growth !== undefined && growth !== null ? growth : (growthType === 'discuss' ? '💬' : '')}
            {growthIcon}
          </span>
        )}
        <span style={{ color: statusColor, fontWeight: statusFontWeight, fontSize: 13 }}>{growthText}</span>
      </div>
    </div>
  );
}

function RoleTag({ role }: { role: 'OWNER' | 'MEMBER' }) {
  const isOwner = role === 'OWNER';
  return (
    <span style={{
      background: isOwner ? '#22c55e' : '#111',
      color: '#fff',
      borderRadius: 999,
      padding: '6px 0',
      fontSize: 14,
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: 1,
      minWidth: 80,
      textAlign: 'center',
      display: 'inline-block',
      border: 'none',
    }}>
      {role}
    </span>
  );
}