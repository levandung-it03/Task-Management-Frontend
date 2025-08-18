import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TaskListAPIs } from '../../apis/task-list.page.api';
import { DTO_TaskListItem } from '../../dtos/task-list.page.dto';
import { ApiResponse } from '../../apis/general.api';


import { usePermission } from '../../util/usePermission.hook';
import TaskListActions from './task-list-actions/task-list-actions';
import TaskListList from './task-list-list/task-list-list';
import './task-list-detail.scss';
import CollectionDetail from './collection-detail/collection-detail';
import { AuthHelper } from '@/util/auth.helper';

interface TaskListDetailProps {
  collectionId: number;
}

export default function TaskListDetail({ collectionId }: TaskListDetailProps) {
  const router = useRouter();
  const permissions = usePermission();

  const [cachedTasks, setCachedTasks] = useState<DTO_TaskListItem[]>([]);
  const [name, setName] = useState("")
  const [tasks, setTasks] = useState<DTO_TaskListItem[]>([]);

  // Load tasks theo collectionId
  useEffect(() => {
    if (collectionId) {
      TaskListAPIs.getTasksByCollection(collectionId).then((response: any) => {
        if (response && typeof response === 'object' && 'body' in response) {
          const apiResponse = response as ApiResponse<DTO_TaskListItem[]>;
          if (apiResponse.body && Array.isArray(apiResponse.body)) {
            setTasks(apiResponse.body);
            setCachedTasks(apiResponse.body)
          } else {
            setTasks([]);
          }
        } else {
          setTasks([]);
        }
      }).catch(() => setTasks([]));
    } else {
      setTasks([]);
    }
  }, [collectionId]);

  const onChangeName = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  }, []);

  useEffect(() => {
    if (name.length === 0) {
      setTasks(cachedTasks)
    } else {
      setTasks(prev => {
        return [...prev.filter(collection => collection.name.toUpperCase().includes(name.toUpperCase()))]
      })
    }
  }, [name, cachedTasks])

  return (
    <>
      <CollectionDetail collectionId={collectionId} showCompleteBtn={true} />
      <div className="task-list-detail-container">
        <div className="task-list-detail-content">
          <TaskListActions
            canCreateTask={permissions.canCreateTask} collectionId={collectionId}
          />

          <div className="form-group-container">
            <fieldset className="form-group">
              <legend className="form-label">Search</legend>
              <input type="name" id="name" className="form-input" placeholder="Type Name" required value={name} onChange={onChangeName} />
            </fieldset>
          </div>

          <TaskListList taskLists={tasks} />
        </div>
      </div>
    </>
  );
} 