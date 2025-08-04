'use client'

import React, { useState, useRef, useEffect } from 'react';
import './update-leader-modal.scss';
import { DTO_ProjectItem } from '@/dtos/home.page.dto';
import { DTO_FastUserInfo } from '@/dtos/create-task.page.dto';
import { DTO_RemoveLeaderFromProject } from '@/dtos/emp.project.page.dto';
import { ProjectAPIs } from '@/apis/emp.project.page.api';
import { confirm } from '@/app-reused/confirm-alert/confirm-alert';

// Hàm tạo màu từ chuỗi (dùng cho avatar)
function stringToColor(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += ('00' + value.toString(16)).slice(-2);
  }
  return color;
}

// Hàm lấy màu cho badge role
function getRoleColor(role: string) {
  switch (role) {
    case 'ROLE_EMP': return { bg: '#111', color: '#fff' };
    case 'ROLE_LEAD': return { bg: '#43a047', color: '#fff' };
    case 'ROLE_ADMIN': return { bg: '#e53935', color: '#fff' };
    case 'ROLE_PM': return { bg: '#1976d2', color: '#fff' };
    default: return { bg: '#888', color: '#fff' };
  }
}

interface UpdateLeaderModalProps {
  open: boolean;
  project: DTO_ProjectItem | null;
  onClose: () => void;
  onUpdateLeader: (projectId: number, leaders: Record<string, any>) => void;
  canAddLeader?: boolean;
  canRemoveLeader?: boolean;
}

export function UpdateLeaderModal({ open, project, onClose, onUpdateLeader, canAddLeader = true, canRemoveLeader = true }: UpdateLeaderModalProps) {
  const [updateSelectedLeaders, setUpdateSelectedLeaders] = useState<Record<string, DTO_FastUserInfo>>({});
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (project) {
      const leaders = project.leaders || {};
      setUpdateSelectedLeaders(
        Object.fromEntries(
          Object.entries(leaders).map(([email, info]: any) => [email, { email, fullName: info.fullName, role: info.role }])
        )
      );
    }
  }, [project]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open, onClose]);

  const handleRemoveLeader = async (projectId: number, leaderEmail: string) => {
    const ok = await confirm('Are you sure you want to remove this leader from the project?', 'Remove Leader');
    if (!ok) return;
    
    try {
      const request = new DTO_RemoveLeaderFromProject().bquery(projectId, leaderEmail);
      await ProjectAPIs.removeLeaderFromProject(request);
      
      setUpdateSelectedLeaders(prev => {
        const newData = { ...prev };
        delete newData[leaderEmail];
        return newData;
      });
    } catch (error) {
      console.error('Error removing leader:', error);
      alert('Có lỗi xảy ra khi xóa leader. Vui lòng thử lại!');
    }
  };

  const handleUpdateLeaders = async () => {
    if (!project) return;
    const leaderEmails = Object.keys(updateSelectedLeaders);
    if (!leaderEmails.length) return;
    
    try {
      await ProjectAPIs.addLeadersToProject({ projectId: project.id, leaderEmails });
      const leaders = Object.fromEntries(
        leaderEmails.map(email => [email, { 
          username: email, 
          fullName: updateSelectedLeaders[email].fullName, 
          role: updateSelectedLeaders[email].role 
        }])
      );
      onUpdateLeader(project.id, leaders);
    } catch (error) {
      console.error('Error updating leaders:', error);
      alert('An error occurred while updating leaders. Please try again!');
    }
  };

  if (!open || !project) return null;

  return (
    <div className="update-leader-modal-overlay">
      <div ref={modalRef} className="update-leader-modal">
        <div className="update-leader-modal-header">
          <span className="update-leader-modal-title">Update Leader</span>
          <button onClick={onClose} className="update-leader-modal-close">&times;</button>
        </div>

        <div className="update-leader-modal-assigned">
          <label className="update-leader-modal-label">Assigned Users</label>
          <div className="update-leader-modal-assigned-container">
            {Object.values(updateSelectedLeaders).length === 0 && (
              <span className="update-leader-modal-placeholder">Assigned Users (blank for Root Task)</span>
            )}
            {Object.values(updateSelectedLeaders).map(user => {
              const roleColor = getRoleColor(user.role);
              return (
                <span key={user.email} className="update-leader-modal-assigned-user">
                  <div 
                    className="update-leader-modal-assigned-avatar"
                    style={{ background: stringToColor(user.fullName || user.email) }}
                  >
                    {(user.fullName || user.email)[0].toUpperCase()}
                  </div>
                  <div className="update-leader-modal-assigned-info">
                    <span className="update-leader-modal-assigned-name">{user.fullName}</span>
                    <span className="update-leader-modal-assigned-email">{user.email}</span>
                  </div>
                  <span 
                    className="update-leader-modal-assigned-role"
                    style={{ background: roleColor.bg, color: roleColor.color }}
                  >
                    {user.role}
                  </span>
                  {canRemoveLeader && (
                    <button
                      className="update-leader-modal-assigned-kick"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveLeader(project.id, user.email);
                      }}
                    >
                      Kick
                    </button>
                  )}
                </span>
              );
            })}
          </div>
        </div>

        {canAddLeader && (
          <button
            className="update-leader-modal-submit"
            onClick={handleUpdateLeaders}
            disabled={!Object.keys(updateSelectedLeaders).length}
          >
            Update Leader
          </button>
        )}
      </div>
    </div>
  );
} 