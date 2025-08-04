import React from 'react';
import { DTO_CollectionItem } from '../../../dtos/emp.collection.page.dto';
import './collection-list.scss';

interface CollectionListProps {
  collections: DTO_CollectionItem[];
  onCollectionClick: (collectionId: string) => void;
  onOpenUpdate: (collection: DTO_CollectionItem) => void;
  onDeleteCollection: (collection: DTO_CollectionItem) => void;
  canDeleteCollection?: boolean;
}

export default function CollectionList({ 
  collections, 
  onCollectionClick, 
  onOpenUpdate, 
  onDeleteCollection,
  canDeleteCollection
}: CollectionListProps) {
  return (
    <div className="collection-list">
      {collections.map((collection) => (
        <div 
          key={collection.id} 
          className={`collection-item ${collection.active === false ? 'disabled' : ''}`}
        >
          <div className="collection-info">
            <svg width="28" height="28" fill="none" stroke="var(--main-green)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="4" y="4" width="20" height="20" rx="5" fill="#e6f4ea" stroke="var(--main-green)" />
              <path d="M10 12h8M10 16h8" stroke="var(--main-green)" />
            </svg>
            <span 
              className="collection-name"
              onClick={() => collection.active !== false && onCollectionClick(collection.id)}
            >
              {collection.name}
              {collection.active === false && <span className="disabled-label">(Disabled)</span>}
            </span>
          </div>
          <div className="collection-deadline">
            Deadline: <span className="deadline-value">{collection.deadline}</span>
          </div>
          <button
            className="view-details-btn"
            onClick={() => collection.active !== false && onOpenUpdate(collection)}
            disabled={collection.active === false}
          >
            View Collection Details
          </button>
          {canDeleteCollection && (
            <button
              className="delete-btn"
              onClick={() => {
                if (collection.active === false) return;
                onDeleteCollection(collection);
              }}
              disabled={collection.active === false}
            >
              <svg width="20" height="20" fill="none" stroke={collection.active === false ? '#ccc' : '#dc2626'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0v2m4-2v2m4-2v2"/>
              </svg>
            </button>
          )}
        </div>
      ))}
    </div>
  );
} 