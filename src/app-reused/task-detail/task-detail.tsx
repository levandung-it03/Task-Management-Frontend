'use client'

import "./task-detail.scss"
import { useEffect, useMemo, useState } from 'react'
import { DTO_TaskDetail } from '@/dtos/task-detail.page.api'
import { TaskDetailPageAPIs } from '@/apis/task-detail.page.api'
import { ApiResponse } from '@/apis/general.api'
import { HttpStatusCode } from 'axios'
import { TaskBasicInfo } from './task-basic-info/task-basic-info'
import AssignedUsers from './assigned-users/assigned-users'
import AssignedUser from './assigned-user/assigned-user'
import SubTasks from './sub-tasks/sub-tasks'
import StatusTaskButton from "./status-buttons/status-buttons"
import { AuthHelper } from "@/util/auth.helper"

/**
 * Business Logics:
 * 1. Task Owner (token.email and taskInfo.userInfo.email) can see "Update" Buttons
 * 2. Assigned Users cannot do anything if Task.isLocked=true
 */
export default function TaskDetail({ taskId }: { taskId: number }) {
  const [taskInfo, setTaskInfo] = useState<DTO_TaskDetail>({
    id: 1,
    userInfo: {
      id: 0,
      fullName: "",
      email: ""
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
  })
  const isTaskOwner: boolean = useMemo(() => AuthHelper.isOwner(taskInfo.userInfo.email), [taskInfo.userInfo.email])

  useEffect(() => {
    async function getDetail() {
      const response = await TaskDetailPageAPIs.getTaskDetail(taskId) as ApiResponse<DTO_TaskDetail>
      if (response.status !== HttpStatusCode.Ok)
        return
      setTaskInfo(response.body)
    }
    getDetail()
  }, [taskId])

  return <>
    <div className="task-detail-container">
      <TaskBasicInfo taskInfo={taskInfo} setTaskInfo={setTaskInfo} />
      {taskInfo.rootTaskId === null
        ? isTaskOwner
          ? <AssignedUsers taskInfo={taskInfo} />
          : <AssignedUser userId={taskInfo.userInfo.id} />
        : <SubTasks />
      }
      {isTaskOwner
        ? <StatusTaskButton taskInfo={taskInfo} />
        : <></>
      }
    </div>
  </>
}
