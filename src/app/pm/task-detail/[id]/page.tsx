'use client'

import { useParams } from 'next/navigation'
import "./page.scss"
import { useEffect, useState } from 'react'
import { DTO_TaskDetail } from '@/dtos/task-detail.page.api'
import { TaskDetailPageAPIs } from '@/apis/task-detail.page.api'
import { ApiResponse } from '@/apis/general.api'
import { HttpStatusCode } from 'axios'
import { TaskBasicInfo } from './task-basic-info/task-basic-info'

export default function PMTaskDetailPage() {
  const params = useParams<{ id: string }>()
  const [taskInfo, setTaskInfo] = useState<DTO_TaskDetail>({
    id: 1,
    userInfo: {
      id: 0,
      fullName: ""
    },
    isRootTask: false,
    name: "",
    description: "",
    reportFormat: "",
    level: "",
    taskType: "",
    priority: "",
    startDate: "",
    endDate: "",
    deadline: "",
    createdTime: "",
    updatedTime: "",
  })
  const id = Number(params.id)

  useEffect(() => {
    async function getDetail() {
      const response = await TaskDetailPageAPIs.getTaskDetail(id.toString()) as ApiResponse<DTO_TaskDetail>
      if (response.status !== HttpStatusCode.Ok)
        return
      setTaskInfo(response.body)
    }
    getDetail()
  }, [id])

  return <>
    <div className="task-detail-container">
      <TaskBasicInfo taskInfo={taskInfo} setTaskInfo={setTaskInfo} />
      {taskInfo.isRootTask
        ? <SubTasks />
        : <AssignedUsers />
      }
    </div>
  </>
}

function AssignedUsers() {
  return <>
    <div className="assigned-users">

    </div>
  </>
}

function SubTasks() {
  return <>
    <div className="sub-tasks">

    </div>
  </>
}


export function checkOverDue(dateStr: string | undefined) {
  if (dateStr === undefined)
    return null
  return new Date(dateStr) <= new Date() ? "late" : "working"
}

export function prettierDate(dateStr: string | undefined): string {
  if (dateStr === undefined)
    return ""

  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  };

  return date.toLocaleDateString('en-US', options);
}

export function prettierTime(timeStr: string | undefined): string {
  if (!timeStr) return "";

  const date = new Date(timeStr);
  const time = date.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return `${time} ${prettierDate(timeStr)}`;
}
