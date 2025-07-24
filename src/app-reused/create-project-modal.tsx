import React, { useRef, useEffect, useState } from 'react';
import { DTO_CreateProject, PROJECT_STATUS, ProjectStatus } from '../dtos/create-project.page.dto';
import { createProject } from '../apis/create-project.page.api';

interface CreateProjectModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (project: any) => void;
  initialForm?: DTO_CreateProject;
}

export default function CreateProjectModal({ open, onClose, onCreate, initialForm }: CreateProjectModalProps) {
  const [form, setForm] = useState<DTO_CreateProject>(
    initialForm || {
      name: '',
      description: '',
      startDate: '',
      endDate: '',
      deadline: '',
      status: 'Pending',
    }
  );
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) setForm(
      initialForm || {
        name: '',
        description: '',
        startDate: '',
        endDate: '',
        deadline: '',
        status: 'Pending',
      }
    );
  }, [open, initialForm]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (open && modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open, onClose]);

  if (!open) return null;

  return (
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
        {/* Header Create Project */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <svg width="24" height="24" fill="none" stroke="#166534" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 4 }}>
            <rect x="4" y="4" width="16" height="16" rx="3" fill="#e6f4ea" stroke="#166534" />
            <path d="M8 8h8M8 12h8M8 16h4" stroke="#166534" />
          </svg>
          <span style={{ fontWeight: 700, fontSize: 20, color: '#166534' }}>Create Project</span>
          <button onClick={onClose} style={{ marginLeft: 'auto', background: 'none', border: 'none', fontSize: 30, color: '#222', cursor: 'pointer', lineHeight: 1 }}>&times;</button>
        </div>
        {/* Form 2 columns */}
        <form
          onSubmit={async e => {
            e.preventDefault();
            onClose();
            const newProject = await createProject(form as DTO_CreateProject);
            onCreate(newProject);
            setForm({
              name: '',
              description: '',
              startDate: '',
              endDate: '',
              deadline: '',
              status: 'Pending',
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
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
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
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
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
                  value={form.startDate}
                  onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))}
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
                  value={form.endDate}
                  onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))}
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
                  value={form.deadline}
                  onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))}
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
                  value={form.status}
                  onChange={e => setForm(f => ({ ...f, status: e.target.value as ProjectStatus }))}
                  style={{ border: 'none', outline: 'none', fontSize: 15, padding: '12px 12px', width: '100%', background: 'transparent' }}
                  required
                >
                  {PROJECT_STATUS.map(status => (
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
            }}
            onClick={async (e) => {
              e.preventDefault();
              onClose();
              const newProject = await createProject(form as DTO_CreateProject);
              onCreate(newProject);
              setForm({
                name: '',
                description: '',
                startDate: '',
                endDate: '',
                deadline: '',
                status: 'Pending',
              });
            }}
          >
            Create Project
          </button>
        </div>
      </div>
    </div>
  );
} 