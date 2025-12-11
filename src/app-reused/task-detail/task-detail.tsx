'use client'

import "./task-detail.scss"
import { useEffect, useState } from 'react'
import { TaskDetailPageAPIs } from '@/apis/task-detail.page.api'
import { ApiResponse } from '@/apis/general.api'
import { TaskBasicInfo } from './task-basic-info/task-basic-info'
import AssignedUsers from './assigned-users/assigned-users'
import SubTasks from './sub-tasks/sub-tasks'
import TaskDetailInteractBtns from "./status-buttons/status-buttons"
import { AuthHelper } from "@/util/auth.helper"
import { DTO_TaskDetail, DTO_TaskUser } from "@/dtos/task-detail.page.dto"

/**
 * Prevent weird user accessing (not create this task, not assigned on this task)? API did for us!
 * Business Logics:
 * 1. Task Owner (token.email and taskInfo.userInfo.email) can see "Update" Buttons
 * 2. Assigned Users cannot do anything if Task.isLocked=true
 */
export default function TaskDetail({ taskId }: { taskId: number }) {
  const [isOwner, setIsOwner] = useState(false)
  const [totalUsers, setTotalUsers] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [taskInfo, setTaskInfo] = useState<DTO_TaskDetail>({
    id: 1,
    userInfo: {
      fullName: "",
      email: "",
      role: "",
      department: ""
    },
    rootTaskId: null,
    name: "",
    description: "",
    reportFormat: "",
    level: "",
    taskType: "",
    priority: "",
    startDate: "",
    isLocked: false,
    endDate: null,
    deadline: "",
    createdTime: "",
    updatedTime: "",
    hasAtLeastOneReport: false,
    projectInfo: {
      id: 0,
      name: ""
    },
    phaseInfo: {
      id: 0,
      name: ""
    },
    collectionInfo: {
      id: 0,
      name: ""
    }
  })
  const [assignedUsers, setAssignedUsers] = useState<DTO_TaskUser[]>([])
  const [isRootTask, setIsRootTask] = useState(taskInfo.rootTaskId === null)

  useEffect(() => setIsRootTask(taskInfo.rootTaskId === null), [taskInfo.rootTaskId]);

  useEffect(() => {
    async function checkIsOwner() {
      const result = await AuthHelper.isEmailLoggingIn(taskInfo.userInfo.email)
      setIsOwner(result)
    }
    checkIsOwner()
  }, [taskInfo.userInfo.email])

  useEffect(() => {
    async function getDetail() {
      setIsLoading(true)
      const response = await TaskDetailPageAPIs.getTaskDetail(taskId) as ApiResponse<DTO_TaskDetail>
      if (String(response.status).startsWith("2")) {
        setTaskInfo(response.body)
        setIsLoading(false)
      }
    }
    getDetail()
  }, [taskId])

  return (isLoading
    ? <div className="loading-row">Loading...</div>
    : <div className="task-detail-container">
      <TaskBasicInfo
        taskInfo={taskInfo}
        setTaskInfo={setTaskInfo}
        totalUsers={totalUsers}
        isRootTask={isRootTask}
        setAssignedUsers={setAssignedUsers} />
      <SubTasks taskInfo={taskInfo} />
      <AssignedUsers
        taskInfo={taskInfo}
        isTaskOwner={isOwner}
        setTotalUsers={setTotalUsers}
        isRootTask={isRootTask}
        assignedUsers={assignedUsers}
        setAssignedUsers={setAssignedUsers} />
      {isOwner && <TaskDetailInteractBtns taskInfo={taskInfo} setTaskInfo={setTaskInfo} />}
    </div>
  )
}
