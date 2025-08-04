import React, { useEffect, useState } from 'react';
import './home-tasks.scss';
import { DTO_TaskOverview } from '@/dtos/home.page.dto';
import { HomeAPIs } from '@/apis/home.page.api';
import { ApiResponse } from '@/apis/general.api';
import { TriangleAlert } from 'lucide-react';
import { prettierDate } from '@/app-reused/task-detail/task-detail.service';
import { GeneralTools } from '@/util/general.helper';
import { AuthHelper } from '@/util/auth.helper';


export default function UndoneTasks() {
  const [isLoading, setIsLoading] = useState(true)
  const [tasks, setTasks] = useState<DTO_TaskOverview[]>([])

  useEffect(() => {
    async function fetchTasks() {
      setIsLoading(true)
      const response = await HomeAPIs.getUndoneRelatedTasks() as ApiResponse<DTO_TaskOverview[]>
      if (String(response.status)[0] === "2")
        setTasks(response.body)
      setIsLoading(false)
    }
    fetchTasks()
  }, [])

  return <div className="home-tasks">{isLoading
    ? <div className="loading-row">Loading...</div>
    : <>
      <div className="tasks-title">
        <TriangleAlert className="tasks-icon"/>
        Un-done Tasks
      </div>
      <div className="tasks-list">
        {tasks.length === 0
        ? <div className="loading-row">Good job! Every Tasks were done!</div>
        : tasks.map((task, ind) => (
          <a key={"htl-" + ind} className="task-item" href={`/${AuthHelper.getRoleFromToken()}/task-detail/${task.id}`}>
            <span className="task-name">{task.name}</span>
              <span className="quick-blue-tag task-type">
                {GeneralTools.capitalize(task.taskType)}
              </span>
              <span className={`tag-data task-priority-${task.taskPriority.toLowerCase()}`}>
                {GeneralTools.capitalize(task.taskPriority)}
              </span>
            <span className="task-deadline quick-blue-tag">Deadline {prettierDate(task.deadline)}</span>
          </a>
        ))}
      </div>
    </>
  }</div>
}