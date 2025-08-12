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

interface TaskListDetailProps {
  collectionId: number;
}

export default function TaskListDetail({ collectionId }: TaskListDetailProps) {
  const router = useRouter();
  const permissions = usePermission();
  
  const [tasks, setTasks] = useState<DTO_TaskListItem[]>([]);

  // Hàm xử lý click vào task để chuyển đến trang task detail
  const handleTaskClick = (taskId: string) => {
    router.push(`pm/task-detail/${taskId}`);
  };

  // Load tasks theo collectionId
  useEffect(() => {
    if (collectionId) {
      TaskListAPIs.getTasksByCollection(collectionId).then((response: any) => {
        if (response && typeof response === 'object' && 'body' in response) {
          const apiResponse = response as ApiResponse<DTO_TaskListItem[]>;
          if (apiResponse.body && Array.isArray(apiResponse.body)) {
            setTasks(apiResponse.body);
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





  return (
    <>
    <CollectionDetail collectionId={collectionId} />
    <div className="task-list-detail-container">
      <div className="task-list-detail-content">
        <TaskListActions 
          canCreateTask={permissions.canCreateTask}
        />
        
        <TaskListList
          taskLists={tasks}
          onTaskListClick={handleTaskClick}
        />
      </div>
    </div>
    </>
  );
} 