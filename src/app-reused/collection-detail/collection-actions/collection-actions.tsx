import React from 'react';
import './collection-actions.scss';
import { LayoutList, Plus } from 'lucide-react';

interface CollectionActionsProps {
  onShowCreateModal: () => void;
  canCreateCollection?: boolean;
}

export default function CollectionActions({ onShowCreateModal, canCreateCollection }: CollectionActionsProps) {
  return <div className="collection-header form-caption-wrap">
    <div className="form-caption">
      <LayoutList className="caption-icon" />
      <span className="caption-content">Tasks Collection</span>
      <i className="desc-content">All Collections are shown here!</i>
    </div>

    {canCreateCollection && <div className="general-crt-btn">
      <button
        className="gcb-main"
        onClick={onShowCreateModal}
      >
        <Plus className="gcb-icon" />
        <span className="gcb-text">New</span>
      </button>
    </div>
    }
  </div>;
} 