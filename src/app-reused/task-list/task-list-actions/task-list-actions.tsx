import React, { useMemo } from 'react';
import './task-list-actions.scss';
import { AuthHelper } from '@/util/auth.helper';
import { ClipboardList, Plus } from 'lucide-react';

interface TaskListActionsProps {
  canCreateTask?: boolean;
  collectionId: number
}

export default function TaskListActions({ canCreateTask, collectionId }: TaskListActionsProps) {
  const url = useMemo(() =>
    `${window.location.origin}/${AuthHelper.getRoleFromToken()}/collections/${collectionId}/create-task`
    , [collectionId, canCreateTask])
  return <div className="task-header form-caption-wrap">
    <div className="form-caption">
      <ClipboardList className="caption-icon" />
      <span className="caption-content">Tasks List</span>
      <i className="desc-content">All Tasks are shown here!</i>
    </div>

    {canCreateTask && <div className="general-crt-btn">
      <a
        href={url}
        className="gcb-main"
      >
        <Plus className="gcb-icon" />
        <span className="gcb-text">New</span>
      </a>
    </div>
    }
  </div>;
} 