import React, { useMemo } from 'react';
import { DTO_CollectionItem } from '../../../dtos/collection.page.dto';
import './collection-list.scss';
import { SquareLibrary, Trash } from 'lucide-react';

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
  const validCollections = useMemo(() => collections.filter(collection => collection != null), [collections]);

  return (
    <div className="collection-list">
      {validCollections.map((collection) => (
        <div 
          key={`collection-${collection.id}`} 
          className="collection-item overview-list-item"
        >
          <div className="collection-info" onClick={() => onCollectionClick(collection.id)}>
            <SquareLibrary className="oli-icon"/>
            <span className="collection-name oli-title">
              {collection.name}
            </span>
          </div>
          <div className="collection-deadline oli-due-date quick-blue-tag">
            Due Date: {collection.dueDate}
          </div>
          <button
            className="view-details-btn oli-quick-btn"
            onClick={() => onOpenUpdate(collection)}
          >
            Update
          </button>
          {canDeleteCollection ? (
            <button
              key={`delete-${collection.id}`}
              className="oli-delete-btn"
              onClick={() => onDeleteCollection(collection)}
            >
              <Trash className="oli-db-icon" />
            </button>
          ) : null}
        </div>
      ))}
    </div>
  );
} 