import { ApiResponse } from '@/apis/general.api'
import { TaskDetailPageAPIs } from '@/apis/task-detail.page.api'
import HelpContainer from '@/app-reused/help-container/page'
import { DTO_TaskDetail, DTO_UpdateTaskDescription, DTO_UpdateTaskReportFormat } from '@/dtos/task-detail.page.api'
import { ClipboardList, LetterText, Pencil, ScrollText, SquareChevronRight } from 'lucide-react'
import { useCallback, useState } from 'react'
import toast from 'react-hot-toast'
import { checkOverDue, prettierDate, prettierTime } from '../page'
import TextDialog from './text-dialog/text.dialog'
import TaskDialog from './task-dialog/task.dialog'
import "./task-basic-info.scss"

interface TaskBasicInfoProps {
  taskInfo: DTO_TaskDetail,
  setTaskInfo: React.Dispatch<React.SetStateAction<DTO_TaskDetail>>
}

export function TaskBasicInfo({ taskInfo, setTaskInfo }: TaskBasicInfoProps) {
  const [openTextDialog, setOpenTextDialog] = useState(false)
  const [openTaskDialog, setOpenTaskDialog] = useState(false)
  const [dialogTitle, setDialogTitle] = useState("")
  const [dialogContent, setDialogContent] = useState("")
  const [onSubmitUpdateContent, setOnSubmitUpdateContent] = useState<
    (content: string) => Promise<void>
  >(() => {
    return () => Promise.resolve();
  });

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
        const request = DTO_UpdateTaskDescription.withBuilder()
          .bid(taskInfo.id)
          .bdescription(content)
        const response = await TaskDetailPageAPIs.updateTaskDescription(request) as ApiResponse<void>
        if (String(response.status)[0] === "2") {
          toast.success(response.msg)
          setTaskInfo(prev => ({ ...prev, description: content }))
          setOpenTextDialog(false)
          return
        }
      }
    })
  }, [taskInfo.id, taskInfo.description])

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
        const request = DTO_UpdateTaskReportFormat.withBuilder()
          .bid(taskInfo.id)
          .breportFormat(taskInfo.reportFormat)
        const response = await TaskDetailPageAPIs.updateTaskReportFormat(request) as ApiResponse<void>
        if (String(response.status)[0] === "2") {
          toast.success(response.msg)
          setTaskInfo(prev => ({ ...prev, reportFormat: content }))
          setOpenTextDialog(false)
          return
        }
      }
    })
  }, [taskInfo.id, taskInfo.reportFormat])

  return <>
    <div className="task-basic-info">
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
            <button className={`update-info-btn ${}`} onClick={() => setOpenTaskDialog(true)}>
              <Pencil className="task-header-icon" />
            </button>
          </div>
        </div>
        <div className="task-info-left">
          <div className="task-info-item">
            <span className="task-info-label">Task Type</span>
            <span className="task-info-value">
              <span className="tag-data task-type">{taskInfo.taskType}</span>
            </span>
          </div>
          <div className="task-info-item">
            <span className="task-info-label">Level</span>
            <span className="task-info-value">
              <span className={`tag-data task-level-${taskInfo.level.toLowerCase()}`}>
                {taskInfo.level}
              </span>
            </span>
          </div>
          <div className="task-info-item">
            <span className="task-info-label">Priority</span>
            <span className="task-info-value">
              <span className={`tag-data task-priority-${taskInfo.priority.toLowerCase()}`}>
                {taskInfo.priority}
              </span>
            </span>
          </div>
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
        </div>
        <div className="task-info-right">
          <div className="task-info-item">
            <span className="task-info-label">Start Date</span>
            <span className="task-info-value">
              <span className="task-date">{prettierDate(taskInfo.startDate)}</span>
            </span>
          </div>
          {taskInfo.endDate !== undefined
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
    <TextDialog
      onSubmitUpdateContent={onSubmitUpdateContent}
      title={dialogTitle}
      inpContent={dialogContent}
      openDialog={openTextDialog}
      setOpenDialog={setOpenTextDialog}
    />
    <TaskDialog
      taskInfo={taskInfo}
      setTaskInfo={setTaskInfo}
      openDialog={openTaskDialog}
      setOpenDialog={setOpenTaskDialog}
    />
  </>

}