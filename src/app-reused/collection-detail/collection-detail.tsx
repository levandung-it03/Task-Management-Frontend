import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CollectionAPIs } from '../../apis/emp.collection.page.api';
import { DTO_CreateCollection, DTO_CollectionItem, CollectionStatus, DTO_DeleteCollection } from '../../dtos/emp.collection.page.dto';
import { ApiResponse } from '../../apis/general.api';
import { PhaseAPIs } from '../../apis/emp.phase.page.api';

import { confirm } from '../confirm-alert/confirm-alert';
import { usePermission } from '../../util/usePermission.hook';
import CollectionActions from './collection-actions/collection-actions';
import CollectionList from './collection-list/collection-list';
import CollectionForm from './collection-form/collection-form';
import './collection-detail.scss';

export default function CollectionDetail() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const phaseId = searchParams.get('phaseId');
  const permissions = usePermission();
  
  const [collections, setCollections] = useState<DTO_CollectionItem[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [form, setForm] = useState<DTO_CollectionItem | null>(null);
  const [createForm, setCreateForm] = useState<DTO_CreateCollection>({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    deadline: '',
    status: 'Pending',
  });
  const [currentPhase, setCurrentPhase] = useState<any>(null);

  // Hàm xử lý click vào collection để chuyển đến trang task
  const handleCollectionClick = (collectionId: string) => {
    router.push(`/emp/task?collectionId=${collectionId}`);
  };

  // Load collections
  useEffect(() => {
    if (phaseId) {
      CollectionAPIs.getCollectionsByPhase(phaseId).then((response) => {
        const data = (response as ApiResponse<any[]>).body;
        if (data) {
          setCollections(
            data.map((item: any) => ({
              ...item,
              status: item.status as CollectionStatus,
              leaders: Object.fromEntries(
                Object.entries(item.leaders || {}).filter(([_, v]) => v !== undefined)
              ),
            }))
          );
        }
      });
    }
  }, [phaseId]);

  // Lấy thông tin phase nếu có phaseId
  useEffect(() => {
    if (phaseId) {
      PhaseAPIs.getPhaseData().then((response) => {
        const data = (response as ApiResponse<any[]>).body;
        if (data) {
          const phase = data.find((p: any) => p.id === phaseId);
          if (phase) {
            setCurrentPhase(phase);
          }
        }
      });
    }
  }, [phaseId]);

  // Handle update collection
  const handleUpdate = (formData: DTO_CollectionItem | DTO_CreateCollection) => {
    if ('id' in formData) {
      const { id, name, description, startDate, endDate, deadline, status } = formData as DTO_CollectionItem;
      CollectionAPIs.updateCollection(id, { name, description, startDate, endDate, deadline, status: status as CollectionStatus }).then((response) => {
        if (response && typeof response === 'object' && 'body' in response) {
          const updatedCollection = response.body as DTO_CollectionItem;
          setCollections((prev) => prev.map((c) => (c.id === id ? updatedCollection : c)));
          setShowUpdateModal(false);
        }
      }).catch((error) => {
        console.error('Error updating collection:', error);
        alert('An error occurred while updating the collection. Please try again!');
      });
    }
  };

  // Handle create collection
  const handleCreate = (formData: DTO_CollectionItem | DTO_CreateCollection) => {
    if (!('id' in formData) && phaseId) {
      CollectionAPIs.createCollection(phaseId, formData as DTO_CreateCollection).then((response) => {
        if (response && typeof response === 'object' && 'body' in response) {
          const newCollection = response.body as DTO_CollectionItem;
          setCollections(d => [newCollection, ...d]);
          setShowCreateModal(false);
          setCreateForm({
            name: '',
            description: '',
            startDate: '',
            endDate: '',
            deadline: '',
            status: 'Pending',
          });
        }
      }).catch((error) => {
        console.error('Error creating collection:', error);
        alert('An error occurred while creating the collection. Please try again!');
      });
    }
  };

  // Handle open update modal
  const handleOpenUpdate = (collection: DTO_CollectionItem) => {
    setForm({ ...collection });
    setShowUpdateModal(true);
  };

  // Wrapper functions for form change handlers
  const handleCreateFormChange = (formData: DTO_CollectionItem | DTO_CreateCollection) => {
    if (!('id' in formData)) {
      setCreateForm(formData as DTO_CreateCollection);
    }
  };

  const handleUpdateFormChange = (formData: DTO_CollectionItem | DTO_CreateCollection) => {
    if ('id' in formData) {
      setForm(formData as DTO_CollectionItem);
    }
  };

  // Handle delete collection
  const handleDeleteCollection = async (collection: DTO_CollectionItem) => {
    try {
      const hasTasks = await checkCollectionHasTasks(collection.id);
      const message = hasTasks 
        ? 'This collection has child data (tasks). Do you want to disable this collection?'
        : 'Are you sure you want to delete this collection?';
      const title = hasTasks ? 'Disable Collection' : 'Delete Collection';
      
      const ok = await confirm(message, title);
      if (!ok) return;
      
      const request = new DTO_DeleteCollection().bquery(collection.id, !hasTasks);
      const response = await CollectionAPIs.deleteCollection(request);
      const result = (response as ApiResponse<{ collectionId: string; deleted: boolean; softDeleted: boolean }>).body;
      
      if (result) {
        if (result.deleted) {
          setCollections(prev => prev.filter(c => c.id !== collection.id));
        } else if (result.softDeleted) {
          setCollections(prev => prev.map(c => c.id === collection.id ? { ...c, active: false } : c));
        }
      }
    } catch (error) {
      console.error('Error deleting collection:', error);
      alert('An error occurred while deleting the collection. Please try again!');
    }
  };

  // Check if collection has tasks
  const checkCollectionHasTasks = async (collectionId: string): Promise<boolean> => {
    try {
      const response = await CollectionAPIs.checkCollectionHasTasks(collectionId);
      const data = (response as ApiResponse<{ count: number }>).body;
      return data ? data.count > 0 : false;
    } catch (error) {
      console.error('Error checking collection tasks:', error);
      return true;
    }
  };

  return (
    <div className="collection-detail-container">
      <div className="collection-detail-content">
        <CollectionActions 
          onShowCreateModal={() => setShowCreateModal(true)} 
          canCreateCollection={permissions.canCreateCollection}
        />
        
        <CollectionList
          collections={collections}
          onCollectionClick={handleCollectionClick}
          onOpenUpdate={handleOpenUpdate}
          onDeleteCollection={handleDeleteCollection}
          canDeleteCollection={permissions.canDeleteCollection}
        />
      </div>

      {/* Create Modal */}
      <CollectionForm
        isOpen={showCreateModal}
        isCreate={true}
        form={createForm}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreate}
        onFormChange={handleCreateFormChange}
        canUpdateCollection={permissions.canUpdateCollection}
      />

      {/* Update Modal */}
      <CollectionForm
        isOpen={showUpdateModal}
        isCreate={false}
        form={form}
        onClose={() => setShowUpdateModal(false)}
        onSubmit={handleUpdate}
        onFormChange={handleUpdateFormChange}
        canUpdateCollection={permissions.canUpdateCollection}
      />
    </div>
  );
} 