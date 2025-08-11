
import { ApiResponse } from "@/apis/general.api"
import { TaskDetailPageAPIs } from "@/apis/task-detail.page.api"
import { confirm } from "@/app-reused/confirm-alert/confirm-alert"
import { Bookmark, CheckLine, CircleCheckBig, Lock, LockOpenIcon, Trash2 } from "lucide-react"
import { useCallback, useEffect, useMemo, useState } from "react"
import toast from "react-hot-toast"
import "./status-buttons.scss"
import { DTO_LockTaskStatus, DTO_TaskDetail } from "@/dtos/task-detail.page.dto"

export default function TaskDetailInteractBtns({ taskInfo }: { taskInfo: DTO_TaskDetail }) {
  const [locked, setLocked] = useState(false)
  const isUnder12Hours = useMemo(() => (new Date().getTime() - new Date(taskInfo.createdTime).getTime()) / 3600000 <= 12, [])

  const onClickDoneTask = useCallback(() => {
    async function doneTask() {
      if (!await confirm("This change cannot be undone. Are you sure?", "Confirm Complete"))
        return
      const response = await TaskDetailPageAPIs.updateDoneTask(taskInfo.id) as ApiResponse<void>
      if (String(response.status)[0] === "2") {
        toast.success(response.msg)
        window.location.reload()
        return
      }
    }
    doneTask()
  }, [taskInfo.id])

  const onClickLockTaskStatus = useCallback(() => {
    async function doneTask() {
      if (!await confirm("This change cannot be undone. Are you sure?", "Change Task Status"))
        return
      const request = DTO_LockTaskStatus.withBuilder().bid(taskInfo.id).blocked(!locked)
      const response = await TaskDetailPageAPIs.updateLockTaskStatus(request) as ApiResponse<void>
      if (String(response.status)[0] === "2") {
        toast.success(response.msg)
        setLocked(!locked)
        return
      }
    }
    doneTask()
  }, [taskInfo.id, locked])

  const onClickDeleteTask = useCallback(() => {
    async function deleteTask() {
      if (!await confirm("This change cannot be undone. Are you sure?", "Change Task Status"))
        return
      const response = await TaskDetailPageAPIs.deleteTask(taskInfo.id) as ApiResponse<void>
      if (String(response.status)[0] === "2") {
        toast.success(response.msg)
        window.location.href = "/"
      }
    }
    deleteTask()
  }, [taskInfo.id])

  useEffect(() => setLocked(taskInfo.isLocked), [taskInfo.isLocked])

  return <div className="task-status-container">
    <div className="small-caption">
      <Bookmark className="sc-icon" />
      <span className="sc-title">Task Status</span>
      <i className="sc-desc">Update task status for now</i>
    </div>
    <div className="task-status-buttons">
      {taskInfo.endDate === null
        ? <button className="complete-task-button" onClick={onClickDoneTask}>
          <CircleCheckBig className="tsb-icon" />
          Complete Task
        </button>
        : <div className="completed-task">
          <CheckLine className="tsb-icon" />
          Completed
        </div>}
      <button
        className={`lock-task-button task-${locked ? "unlocked" : "locked"}-btn ${taskInfo.endDate === null ? "" : "disabled-btn"}`}
        onClick={onClickLockTaskStatus}
        disabled={taskInfo.endDate !== null}>
        {locked
          ? <>
            <LockOpenIcon className="tsb-icon" />
            Un-Lock Task
          </>
          : <>
            <Lock className="tsb-icon" />
            Lock Task
          </>}
      </button>
      {isUnder12Hours && <button className="delete-task-button delete-btn" onClick={onClickDeleteTask}>
        <Trash2 className="tsb-icon" />Delete Task
      </button>}
    </div>
  </div>
}