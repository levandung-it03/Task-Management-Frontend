'use client'

import React, { useState, useRef, useEffect } from 'react';

import './add-leader-modal.scss';
import { DTO_FastUserInfo } from '@/dtos/create-task.page.dto';
import { ProjectAPIs } from '@/apis/project.page.api';
import { ApiResponse } from '@/apis/general.api';

interface AddLeaderModalProps {
  open: boolean;
  projectId: number | null;
  onClose: () => void;
  onAddLeader: (projectId: number, leaders: Record<string, any>) => void;
}

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

export function AddLeaderModal({ open, projectId, onClose, onAddLeader }: AddLeaderModalProps) {
  const [searchLeader, setSearchLeader] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchedLeaders, setSearchedLeaders] = useState<DTO_FastUserInfo[]>([]);
  const [selectedLeaders, setSelectedLeaders] = useState<Record<string, DTO_FastUserInfo>>({});
  const modalRef = useRef<HTMLDivElement>(null);
  const searchUserRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
        setSearchLeader('');
        setSearchedLeaders([]);
        setSelectedLeaders({});
      }
      if (searchUserRef.current && !searchUserRef.current.contains(event.target as Node)) {
        setSearchLeader('');
      }
    }

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open, onClose]);

  const handleSearchLeader = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchLeader(value);
    if (!value.trim()) {
      setSearchedLeaders([]);
      return;
    }
    setSearching(true);
    try {
      const res = await ProjectAPIs.searchLeadersForProject(projectId!, value);
      setSearchedLeaders(((res as ApiResponse<DTO_FastUserInfo[]>).body) || []);
    } catch (error) {
      console.error('Error searching leaders:', error);
      setSearchedLeaders([]);
    }
    setSearching(false);
  };

  const toggleSelectLeader = (user: DTO_FastUserInfo) => {
    setSelectedLeaders(prev => {
      const key = user.email;
      if (key in prev) {
        const newData = { ...prev };
        delete newData[key];
        return newData;
      }
      return { ...prev, [key]: user };
    });
  };

  const handleAssignLeaders = async () => {
    if (!projectId) return;
    const leaderEmails = Object.keys(selectedLeaders);
    if (!leaderEmails.length) return;
    
    try {
      await ProjectAPIs.addLeadersToProject(projectId, { assignedEmails: leaderEmails });
      const leaders = Object.fromEntries(
        leaderEmails.map(email => [
          email, 
          { 
            username: email, 
            fullName: selectedLeaders[email].fullName, 
            role: selectedLeaders[email].role 
          }
        ])
      );
      onAddLeader(projectId, leaders);
    } catch (error) {
      console.error('Error adding leaders:', error);
      alert('An error occurred while adding leaders. Please try again!');
    }
  };

  if (!open || !projectId) return null;

  return (
    <div className="add-leader-modal-overlay">
      <div ref={modalRef} className="add-leader-modal">
        <div className="add-leader-modal-header">
          <span className="add-leader-modal-title">Add Leader</span>
          <button onClick={onClose} className="add-leader-modal-close">&times;</button>
        </div>

        <div ref={searchUserRef} className="add-leader-modal-search">
          <label className="add-leader-modal-label">Search User</label>
          <input
            type="text"
            placeholder="Search User"
            value={searchLeader}
            onChange={handleSearchLeader}
            className="add-leader-modal-search-input"
          />
          
          {searchLeader && searchedLeaders.length > 0 && (
            <div className="add-leader-modal-dropdown">
              {searchedLeaders.map(user => {
                const isSelected = !!selectedLeaders[user.email];
                const roleColor = getRoleColor(user.role);
                return (
                  <div
                    key={user.email}
                    className={`add-leader-modal-user-item ${isSelected ? 'add-leader-modal-user-item--selected' : ''}`}
                    onClick={() => toggleSelectLeader(user)}
                  >
                    <div 
                      className="add-leader-modal-user-avatar"
                      style={{ background: stringToColor(user.fullName || user.email) }}
                    >
                      {(user.fullName || user.email)[0].toUpperCase()}
                    </div>
                    <div className="add-leader-modal-user-info">
                      <span className="add-leader-modal-user-name">{user.fullName}</span>
                      <span className="add-leader-modal-user-email">{user.email}</span>
                    </div>
                    <span 
                      className="add-leader-modal-user-role"
                      style={{ background: roleColor.bg, color: roleColor.color }}
                    >
                      {user.role}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="add-leader-modal-assigned">
          <label className="add-leader-modal-label">Assigned Users</label>
          <div className="add-leader-modal-assigned-container">
            {Object.values(selectedLeaders).length === 0 && (
              <span className="add-leader-modal-placeholder">Assigned Users (blank for Root Task)</span>
            )}
            {Object.values(selectedLeaders).map(user => {
              const roleColor = getRoleColor(user.role);
              return (
                <span key={user.email} className="add-leader-modal-assigned-user">
                  <div 
                    className="add-leader-modal-assigned-avatar"
                    style={{ background: stringToColor(user.fullName || user.email) }}
                  >
                    {(user.fullName || user.email)[0].toUpperCase()}
                  </div>
                  <div className="add-leader-modal-assigned-info">
                    <span className="add-leader-modal-assigned-name">{user.fullName}</span>
                    <span className="add-leader-modal-assigned-email">{user.email}</span>
                  </div>
                  <span 
                    className="add-leader-modal-assigned-role"
                    style={{ background: roleColor.bg, color: roleColor.color }}
                  >
                    {user.role}
                  </span>
                  <span 
                    className="add-leader-modal-assigned-remove"
                    onClick={() => toggleSelectLeader(user)}
                  >
                    &times;
                  </span>
                </span>
              );
            })}
          </div>
        </div>

        <button
          className="add-leader-modal-submit"
          onClick={handleAssignLeaders}
          disabled={!Object.keys(selectedLeaders).length}
        >
          Add Leader
        </button>
      </div>
    </div>
  );
} 