import React from 'react';
import { DTO_CollectionItem } from '../../../dtos/collection.page.dto';
import './collection-list.scss';

interface CollectionListProps {
  collections: DTO_CollectionItem[];
  onCollectionClick: (collectionId: number) => void;
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
  // Filter out any null or undefined collections to prevent errors
  const validCollections = collections.filter(collection => collection != null);

  return (
    <div className="collection-list">
      {validCollections.map((collection) => (
        <div 
          key={`collection-${collection.id}`} 
          className="collection-item"
        >
          <div className="collection-info">
            <svg width="28" height="28" fill="none" stroke="var(--main-green)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="4" y="4" width="20" height="20" rx="5" fill="#e6f4ea" stroke="var(--main-green)" />
              <path d="M10 12h8M10 16h8" stroke="var(--main-green)" />
            </svg>
            <span 
              className="collection-name"
              onClick={() => onCollectionClick(collection.id)}
            >
              {collection.name}
            </span>
          </div>
          <div className="collection-deadline">
            Due Date: <span className="deadline-value">{collection.dueDate}</span>
          </div>
          <button
            className="view-details-btn"
            onClick={() => onOpenUpdate(collection)}
          >
            View Collection Details
          </button>
          {canDeleteCollection ? (
            <button
              key={`delete-${collection.id}`}
              className="delete-btn"
              onClick={() => onDeleteCollection(collection)}
            >
              <svg width="20" height="20" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0v2m4-2v2m4-2v2"/>
              </svg>
            </button>
          ) : null}
        </div>
      ))}
    </div>
  );
} 