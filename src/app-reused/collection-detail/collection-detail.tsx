import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { CollectionAPIs } from '../../apis/collection.page.api';
import { DTO_CreateCollection, DTO_CollectionItem } from '@/dtos/collection.page.dto';
import { ApiResponse } from '../../apis/general.api';
import { AuthHelper } from '../../util/auth.helper';
import { usePermission } from '../../util/usePermission.hook';
import CollectionActions from './collection-actions/collection-actions';
import CollectionList from './collection-list/collection-list';
import CollectionForm from './collection-form/collection-form';
import './collection-detail.scss';
import PhaseDetail from './phase-detail/phase-detail';
import { confirm } from '../confirm-alert/confirm-alert';
import toast from 'react-hot-toast';

interface CollectionDetailProps {
  phaseId: number;
}

export default function CollectionDetail({ phaseId }: CollectionDetailProps) {
  const router = useRouter();
  const permissions = usePermission();

  const [cachedCollections, setCachedCollections] = useState<DTO_CollectionItem[]>([]);
  const [name, setName] = useState("")
  const [collections, setCollections] = useState<DTO_CollectionItem[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [form, setForm] = useState<DTO_CollectionItem | null>(null);
  const [createForm, setCreateForm] = useState<DTO_CreateCollection>({
    name: '',
    description: '',
    startDate: '',
    dueDate: '',
  });
  const [currentPhase, setCurrentPhase] = useState<any>(null);

  // Hàm xử lý click vào collection để chuyển đến trang task
  const handleCollectionClick = (collectionId: number) => {
    const role = AuthHelper.getRoleFromToken();

    const rolePaths: Record<string, string> = {
      pm: '/pm',
      lead: '/lead',
      emp: '/emp'
    };

    const basePath = rolePaths[role];
    if (!basePath) {
      console.error('Role không hợp lệ:', role);
      return;
    }

    router.push(`${basePath}/collections/${collectionId}/tasks`);
  };


  // Load collections
  useEffect(() => {
    console.log('PhaseId:', phaseId); // Debug phaseId
    if (phaseId) {
      console.log('Calling API with phaseId:', phaseId); // Debug API call

      // Try to get collections directly
      CollectionAPIs.getCollectionsByPhase(phaseId).then((response) => {
        console.log('Collection response:', response); // Debug log
        if (response && typeof response === 'object' && 'body' in response) {
          const apiResponse = response as ApiResponse<DTO_CollectionItem[]>;
          if (apiResponse.body && Array.isArray(apiResponse.body)) {
            console.log('Setting collections:', apiResponse.body); // Debug set collections
            setCollections(apiResponse.body);
            setCachedCollections(apiResponse.body)
          } else {
            console.error('Invalid body format:', apiResponse.body);
            setCollections([]);
          }
        } else {
          console.error('Invalid response format:', response);
          setCollections([]);
        }
      }).catch((error: any) => {
        console.error('Error loading collections:', error);
        // Show user-friendly error message
        if (error && typeof error === 'object' && 'response' in error) {
          const axiosError = error as any;
          if (axiosError.response?.status === 403) {
            console.error('Access denied: You do not have permission to view this phase');
          } else if (axiosError.response?.status === 404) {
            console.error('Phase not found: The phase does not exist');
          } else if (axiosError.response?.status === 500) {
            console.error('Server error: Please try again later');
          }
        }
        setCollections([]);
      });
    } else {
      console.log('No phaseId provided'); // Debug no phaseId
      setCollections([]);
    }
  }, [phaseId]);

  // Lấy thông tin phase nếu có phaseId
  useEffect(() => {
    if (phaseId) {
      // Since we don't have a direct API to get phase by ID, we'll skip this for now
      // The phase information can be passed as props or retrieved differently
      setCurrentPhase(null);
    }
  }, [phaseId]);

  // Handle update collection
  const handleUpdate = (formData: DTO_CollectionItem | DTO_CreateCollection) => {
    if ('id' in formData) {
      const { id, name, description, startDate, dueDate } = formData as DTO_CollectionItem;
      CollectionAPIs.updateCollection(id, { name, description, startDate, dueDate }).then((response) => {
        if (response && typeof response === 'object' && 'status' in response && response.status === 200) {
          // Update the collection in the local state with the form data
          toast.success("Update successfully!");
          setCollections((prev) => prev.map((c) => (c.id === id ? { ...c, name, description, startDate, dueDate, updatedTime: new Date().toISOString().slice(0, 19).replace('T', ' ') } : c)));
          setShowUpdateModal(false);
        } else {
          console.error('Invalid response format:', response);
        }
      }).catch((error: unknown) => {
        console.error('Error updating collection:', error);
      });
    }
  };

  // Handle create collection
  const handleCreate = (formData: DTO_CollectionItem | DTO_CreateCollection) => {
    if (!('id' in formData)) {
      const { name, description, startDate, dueDate } = formData as DTO_CreateCollection;
      CollectionAPIs.createCollection(phaseId, { name, description, startDate, dueDate }).then((response) => {
        if (response && typeof response === 'object' && 'body' in response && response.body) {
          const idResponse = response.body as { id: number };

          if (idResponse && typeof idResponse.id === 'number') {
            // Instead of fetching individual collection details (which causes 403), 
            // just refresh the collections list to show the new collection
            console.log('Collection created successfully, refreshing list...');
            CollectionAPIs.getCollectionsByPhase(phaseId).then((collectionsResponse) => {
              if (collectionsResponse && typeof collectionsResponse === 'object' && 'body' in collectionsResponse) {
                toast.success("Create sucessfully!");
                setCollections(collectionsResponse.body as DTO_CollectionItem[]);
              }
            }).catch((refreshError) => {
              console.error('Error refreshing collections list:', refreshError);
            });
          } else {
            console.error('Invalid ID response structure:', idResponse);
          }
        } else {
          console.error('Invalid response structure:', response);
        }

        setShowCreateModal(false);
        setCreateForm({
          name: '',
          description: '',
          startDate: '',
          dueDate: '',
        });
      }).catch((error) => {
        console.error('Error creating collection:', error);
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

  const handleDeleteCollection = useCallback((collection: DTO_CollectionItem) => {
    async function remove() {
      if (!await confirm('Are you sure you want to delete this collection?', 'Delete Collection'))
        return;

      const response = await CollectionAPIs.deleteCollection(collection.id) as ApiResponse<void>;
      if (String(response.status)[0] === "2") {
        toast.success(response.msg)
        setCollections(prev => prev.filter(c => c.id !== collection.id));
      }
    }
    remove();
  }, []);

  const onChangeName = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  }, []);

  useEffect(() => {
    if (name.length === 0) {
      setCollections(cachedCollections)
    } else {
      setCollections(prev => {
        return [...prev.filter(collection => collection.name.toUpperCase().includes(name.toUpperCase()))]
      })
    }
  }, [name, cachedCollections])

  return (
    <>
      <PhaseDetail phaseId={phaseId} />
      <div className="collection-detail-container">
        <div className="collection-detail-content">
          <CollectionActions
            onShowCreateModal={() => setShowCreateModal(true)}
            canCreateCollection={permissions.canCreateCollection}
          />

          <div className="form-group-container">
            <fieldset className="form-group">
              <legend className="form-label">Search</legend>
              <input type="name" id="name" className="form-input" placeholder="Type Name" required value={name} onChange={onChangeName} />
            </fieldset>
          </div>

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
    </>
  );
} 