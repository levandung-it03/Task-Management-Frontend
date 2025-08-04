'use client'

import "./task-detail.scss"
import { useEffect, useMemo, useState } from 'react'
import { TaskDetailPageAPIs } from '@/apis/task-detail.page.api'
import { ApiResponse } from '@/apis/general.api'
import { TaskBasicInfo } from './task-basic-info/task-basic-info'
import AssignedUsers from './assigned-users/assigned-users'
import SubTasks from './sub-tasks/sub-tasks'
import StatusTaskButton from "./status-buttons/status-buttons"
import { AuthHelper } from "@/util/auth.helper"
import { DTO_TaskDetail } from "@/dtos/task-detail.page.dto"

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
      role: ""
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
  })

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
      if (String(response.status)[0] !== "2")
        return
      setTaskInfo(response.body)
      setIsLoading(false)
    }
    getDetail()
  }, [taskId])

  return (isLoading
    ? <div className="loading-row">Loading...</div>
    : <div className="task-detail-container">
      <TaskBasicInfo taskInfo={taskInfo} setTaskInfo={setTaskInfo} totalUsers={totalUsers} />
      <SubTasks taskId={taskInfo.id} />
      <AssignedUsers taskInfo={taskInfo} isTaskOwner={isOwner} setTotalUsers={setTotalUsers} />
      {isOwner && <StatusTaskButton taskInfo={taskInfo} />}
    </div>
  )
}
