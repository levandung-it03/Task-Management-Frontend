'use client'

import { ApiResponse } from "@/apis/general.api"
import { TaskDetailPageAPIs } from "@/apis/task-detail.page.api"
import HelpContainer from "@/app-reused/help-container/page"
import { checkOverDue, prettierDate, prettierTime } from "@/app-reused/task-detail/task-detail.service"
import { DTO_TaskDelegator, DTO_TaskDetail } from "@/dtos/task-detail.page.dto"
import { AuthHelper } from "@/util/auth.helper"
import { GeneralTools } from "@/util/general.helper"
import { ClipboardList } from "lucide-react"
import { useEffect, useState } from "react"
import "./root-task-detail.scss"
import { ReusableRootTaskData } from "../page"

export default function RootTaskDetail({ taskId, setRootData }: {
  taskId: number,
  setRootData: React.Dispatch<React.SetStateAction<ReusableRootTaskData>>
}) {
  const [isLoading, setIsLoading] = useState(true)
  const [taskDelegator, setTaskDelegator] = useState<DTO_TaskDelegator>({
    taskInfo: null,
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
  const [taskInfo, setTaskInfo] = useState<DTO_TaskDetail>({
    id: 0,
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
  useEffect(() => {
    async function getDetail() {
      setIsLoading(true)
      const response = await TaskDetailPageAPIs.getTaskDetail(taskId) as ApiResponse<DTO_TaskDetail>
      if (String(response.status).startsWith("2")) {
        setTaskInfo(response.body)
        setIsLoading(false)
        setRootData({
          description: response.body.description,
          reportFormat: response.body.reportFormat
        })
      }
    }
    getDetail()
  }, [taskId, setRootData])

  useEffect(() => {
    async function fetchTaskDelegator() {
      const response = await TaskDetailPageAPIs.getTaskDelegator(taskId) as ApiResponse<DTO_TaskDelegator>
      if (String(response.status).startsWith("2")) {
        setTaskDelegator(response.body)
      }
    }
    fetchTaskDelegator()
  }, [taskId])

  return (
    isLoading
      ? <div className="loading-row">Loading...</div>
      : <div className="task-basic-info">
        <div className="detail-delegator">
          <a href={`/${AuthHelper.getRoleFromToken()}/projects/${taskDelegator.projectInfo.id}/phases`}>
            {taskDelegator.projectInfo.name}
          </a>
          <span>&gt;</span>
          <a href={`/${AuthHelper.getRoleFromToken()}/phases/${taskDelegator.phaseInfo.id}/collections`}>
            {taskDelegator.phaseInfo.name}
          </a>
          <span>&gt;</span>
          <a href={`/${AuthHelper.getRoleFromToken()}/collections/${taskDelegator.collectionInfo.id}/tasks`}>
            {taskDelegator.collectionInfo.name}
          </a>
          {taskDelegator.taskInfo !== null && <>
            <span>&gt;</span>
            <a href={`/${AuthHelper.getRoleFromToken()}/task-detail/${taskDelegator.taskInfo.id}`}>
              {taskDelegator.taskInfo.name}
            </a>
          </>}
        </div>
        <div className="form-caption">
          <ClipboardList className="caption-icon" />
          <span className="caption-content">
            Root Task Information<span className="task-id tag-data">{taskInfo.id}</span>
          </span>
          <i className="desc-content">See full Task information, submitted Reportes and related Comments</i>
        </div>
        <div className="task-info">
          <div className="task-info-left">
            <div className="task-info-item">
              <span className="task-info-label">Created by</span>
              <span className="task-info-value">
                <span className="task-date">{taskInfo.userInfo.fullName}</span>
              </span>
            </div>
            <div className="task-info-item">
              <span className="task-info-label">Email</span>
              <span className="task-info-value">
                <span className="task-date">{taskInfo.userInfo.email}</span>
              </span>
            </div>
            <div className="task-info-item">
              <span className="task-info-label">Task Type</span>
              <span className="task-info-value">
                <span className="tag-data task-type">{GeneralTools.capitalize(taskInfo.taskType)}</span>
              </span>
            </div>
            <div className="task-info-item">
              <span className="task-info-label">Level</span>
              <span className="task-info-value">
                <span className={`tag-data task-level-${taskInfo.level.toLowerCase()}`}>
                  {GeneralTools.capitalize(taskInfo.level)}
                </span>
              </span>
            </div>
            <div className="task-info-item">
              <span className="task-info-label">Priority</span>
              <span className="task-info-value">
                <span className={`tag-data task-priority-${taskInfo.priority.toLowerCase()}`}>
                  {GeneralTools.capitalize(taskInfo.priority)}
                </span>
              </span>
            </div>
          </div>
          <div className="task-info-right">
            <div className="task-info-item">
              <span className="task-info-label">Deadline</span>
              <span className="task-info-value">
                <span className="task-date">
                  <span className={`task-date-content ${checkOverDue(taskInfo.deadline)}-date`}>
                    {prettierDate(taskInfo.deadline)}
                  </span>
                  <HelpContainer title="" key="" description="When it's red, it means this Task was overdue" />
                </span>
              </span>
            </div>
            <div className="task-info-item">
              <span className="task-info-label">Start Date</span>
              <span className="task-info-value">
                <span className="task-date">{prettierDate(taskInfo.startDate)}</span>
              </span>
            </div>
            {taskInfo.endDate !== null
              && <div className="task-info-item">
                <span className="task-info-label">End Date</span>
                <span className="task-info-value">
                  <span className="task-date">
                    <span>{prettierDate(taskInfo.endDate)}</span>
                  </span>
                </span>
              </div>}
            <div className="task-info-item">
              <span className="task-info-label">Created Time</span>
              <span className="task-info-value">
                <span className="task-date">
                  <span className="task-time-content tag-data">{prettierTime(taskInfo.createdTime)}</span>
                </span>
              </span>
            </div>
            <div className="task-info-item">
              <span className="task-info-label">Updated Time</span>
              <span className="task-info-value">
                <span className="task-date">
                  <span className="task-time-content tag-data">{prettierTime(taskInfo.updatedTime)}</span>
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
  )
}