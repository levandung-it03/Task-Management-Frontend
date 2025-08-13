import { ApiResponse } from '@/apis/general.api'
import { TaskDetailPageAPIs } from '@/apis/task-detail.page.api'
import HelpContainer from '@/app-reused/help-container/page'
import { CirclePlus, ClipboardList, LetterText, Pencil, ScrollText, SquareChevronRight } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { checkOverDue, prettierDate, prettierTime } from '../task-detail.service'
import TextDialog from './text-dialog/text.dialog'
import TaskDialog from './task-dialog/task.dialog'
import "./task-basic-info.scss"
import { AuthHelper } from '@/util/auth.helper'
import { DTO_TaskDelegator, DTO_TaskDetail, DTO_UpdateContentRequest } from '@/dtos/task-detail.page.dto'
import { GeneralTools } from '@/util/general.helper'

interface TaskBasicInfoProps {
  taskInfo: DTO_TaskDetail,
  setTaskInfo: React.Dispatch<React.SetStateAction<DTO_TaskDetail>>,
  totalUsers: number
}

export function TaskBasicInfo({ taskInfo, setTaskInfo, totalUsers }: TaskBasicInfoProps) {
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
  const [isOwner, setIsOwner] = useState(false)
  const [openTextDialog, setOpenTextDialog] = useState(false)
  const [openTaskDialog, setOpenTaskDialog] = useState(false)
  const [dialogTitle, setDialogTitle] = useState("")
  const [dialogContent, setDialogContent] = useState("")
  const [onSubmitUpdateContent, setOnSubmitUpdateContent] = useState<
    (content: string) => void
  >(() => {
    return () => Promise.resolve();
  });
  const isUpdatable = useMemo(() => isOwner && !taskInfo.hasAtLeastOneReport, [isOwner, taskInfo.hasAtLeastOneReport])

  const onClickOpenDescription = useCallback(() => {
    setOpenTextDialog(true)
    setDialogTitle("Description")
    setDialogContent(taskInfo.description || "")
    setOnSubmitUpdateContent(() => {
      return async (content: string) => {
        if (taskInfo.id === undefined) return;
        if (content.trim().length === 0) {
          toast.error("Content cannot be empty")
          return
        }
        const request = DTO_UpdateContentRequest.withBuilder()
          .bid(taskInfo.id)
          .bcontent(content)
        const response = await TaskDetailPageAPIs.updateTaskDescription(request) as ApiResponse<void>
        if (String(response.status).startsWith("2")) {
          toast.success(response.msg)
          setTaskInfo(prev => ({ ...prev, description: content }))
          setOpenTextDialog(false)
          return
        }
      }
    })
  }, [taskInfo.id, taskInfo.description, taskInfo, setTaskInfo])

  const onClickOpenReportFormat = useCallback(() => {
    setOpenTextDialog(true)
    setDialogTitle("Report Format")
    setDialogContent(taskInfo.reportFormat || "")
    setOnSubmitUpdateContent(() => {
      return async (content: string) => {
        if (taskInfo.id === undefined) return;
        if (content.trim().length === 0) {
          toast.error("Content cannot be empty")
          return
        }
        const request = DTO_UpdateContentRequest.withBuilder()
          .bid(taskInfo.id)
          .bcontent(content)
        const response = await TaskDetailPageAPIs.updateTaskReportFormat(request) as ApiResponse<void>
        if (String(response.status).startsWith("2")) {
          toast.success(response.msg)
          setTaskInfo(prev => ({ ...prev, reportFormat: content }))
          setOpenTextDialog(false)
          return
        }
      }
    })
  }, [taskInfo.id, taskInfo.reportFormat, taskInfo, setTaskInfo])

  useEffect(() => {
    async function checkIsOwner() {
      const result = await AuthHelper.isEmailLoggingIn(taskInfo.userInfo.email)
      setIsOwner(result)
    }
    checkIsOwner()
  }, [taskInfo.userInfo.email])

  useEffect(() => {
    async function fetchTaskDelegator() {
      const response = await TaskDetailPageAPIs.getTaskDelegator(taskInfo.id) as ApiResponse<DTO_TaskDelegator>
      if (String(response.status).startsWith("2")) {
        setTaskDelegator(response.body)
      }
    }
    fetchTaskDelegator()
  }, [taskInfo.id])

  return <>
    <div className="task-basic-info">
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
          Task Information<span className="task-id tag-data">{taskInfo.id}</span>
        </span>
        <i className="desc-content">See full Task information, submitted Reportes and related Comments</i>
      </div>
      <div className="task-info">
        <div className="task-info-item task-header">
          <div className="task-name">
            <SquareChevronRight className="task-name-icon" />
            <span className="task-info-value">{taskInfo.name}</span>
          </div>
          <div className="task-more-info">
            <button className="description-btn" onClick={onClickOpenDescription}>
              <ScrollText className="task-header-icon" />
              Description
            </button>
            <button className="report-format-btn" onClick={onClickOpenReportFormat}>
              <LetterText className="task-header-icon" />
              Report
            </button>
            {isOwner && <button className="update-info-btn" onClick={() => setOpenTaskDialog(true)}>
              <Pencil className="task-header-icon" />
            </button>}
          </div>
        </div>
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
      {totalUsers !== 0 && isOwner && taskInfo.rootTaskId === null && <a
        className="create-sub-task"
        href={`/${AuthHelper.getRoleFromToken().toLowerCase()}/collections/${taskDelegator.collectionInfo.id}/create-task/${taskInfo.id}`}
      >
        <CirclePlus className="cst-icon" />Create Sub-Task
      </a>}
    </div>
    <TextDialog
      onSubmitUpdateContent={onSubmitUpdateContent}
      title={dialogTitle}
      inpContent={dialogContent}
      openDialog={openTextDialog}
      setOpenDialog={setOpenTextDialog}
      isUpdatabale={isUpdatable}
    />
    <TaskDialog
      taskInfo={taskInfo}
      setTaskInfo={setTaskInfo}
      openDialog={openTaskDialog}
      setOpenDialog={setOpenTaskDialog}
    />
  </>
}