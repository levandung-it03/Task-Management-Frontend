
import { ApiResponse } from "@/apis/general.api"
import { TaskDetailPageAPIs } from "@/apis/task-detail.page.api"
import { confirm } from "@/app-reused/confirm-alert/confirm-alert"
import { Bookmark, CheckLine, CircleCheckBig, Lock, LockOpenIcon, Play, Trash2 } from "lucide-react"
import { useCallback, useEffect, useMemo, useState } from "react"
import toast from "react-hot-toast"
import "./status-buttons.scss"
import { DTO_LockTaskStatus, DTO_TaskDetail } from "@/dtos/task-detail.page.dto"
import { AuthHelper } from "@/util/auth.helper"
import { prettierTime } from "../task-detail.service"

interface TaskDeatilInteractBtnsProps {
  taskInfo: DTO_TaskDetail;
  setTaskInfo: React.Dispatch<React.SetStateAction<DTO_TaskDetail>>;
}

export default function TaskDetailInteractBtns({ taskInfo, setTaskInfo }: TaskDeatilInteractBtnsProps) {
  const [locked, setLocked] = useState(false);
  const [isNew, setIsNew] = useState(true);
  const isUnder12Hours = useMemo(() => (new Date().getTime() - new Date(taskInfo.createdTime).getTime()) / 3600000 <= 12, []);

  const onClickDoneTask = useCallback(() => {
    async function doneTask() {
      if (!await confirm("This change cannot be undone. Are you sure?", "Confirm Complete"))
        return
      const response = await TaskDetailPageAPIs.updateDoneTask(taskInfo.id) as ApiResponse<void>
      if (String(response.status).startsWith("2")) {
        toast.success(response.msg)
        window.location.reload()
        return
      }
    }
    doneTask()
  }, [taskInfo.id]);

  const onClickLockTaskStatus = useCallback(() => {
    async function doneTask() {
      if (!await confirm("This change cannot be undone. Are you sure?", "Change Task Status"))
        return
      const request = DTO_LockTaskStatus.withBuilder().bid(taskInfo.id).blocked(!locked)
      const response = await TaskDetailPageAPIs.updateLockTaskStatus(request) as ApiResponse<void>
      if (String(response.status).startsWith("2")) {
        toast.success(response.msg)
        setLocked(!locked)
        if (isNew) {
          setTaskInfo(prev => ({
            ...prev,
            updatedTime: prettierTime(new Date().toISOString())
          }));
        }
        setIsNew(false) //--Prevent turn back to Start in both cases.
        return
      }
    }
    doneTask()
  }, [taskInfo.id, locked, setTaskInfo, isNew]);

  const onClickDeleteTask = useCallback(() => {
    async function deleteTask() {
      if (!await confirm("This change cannot be undone. Are you sure?", "Change Task Status"))
        return
      const response = await TaskDetailPageAPIs.deleteTask(taskInfo.id) as ApiResponse<void>
      if (String(response.status).startsWith("2")) {
        toast.success(response.msg)
        if (taskInfo.rootTaskId !== null)
          window.location.href = `/${AuthHelper.getRoleFromToken()}/task-detail/${taskInfo.rootTaskId}`
        else
          window.location.href = `/${AuthHelper.getRoleFromToken()}/collections/${taskInfo.collectionInfo.id}/tasks`
      }
    }
    deleteTask()
  }, [taskInfo.id]);

  useEffect(() => setLocked(taskInfo.isLocked), [taskInfo.isLocked]);

  useEffect(() => {
    setIsNew(taskInfo.createdTime === taskInfo.updatedTime && taskInfo.isLocked);
  }, [taskInfo.createdTime, taskInfo.updatedTime, taskInfo.isLocked]);

  return <div className="task-status-container">
    <div className="small-caption">
      <Bookmark className="sc-icon" />
      <span className="sc-title">Task Status</span>
      <i className="sc-desc">Update task status for now</i>
    </div>
    <div className="task-status-buttons">
      <button
        className={`lock-task-button task-${locked ? "unlocked" : "locked"}-btn ${taskInfo.endDate === null ? "" : "disabled-btn"}`}
        onClick={onClickLockTaskStatus}
        disabled={taskInfo.endDate !== null}>
          {locked
            ? (isNew ? <>
                <Play className="tsb-icon" />
                Start
              </>
              : <>
                <LockOpenIcon className="tsb-icon" />
                Un-Lock Task
              </>)
            : <>
              <Lock className="tsb-icon" />
              Lock Task
          </>}
      </button>
      {taskInfo.endDate === null
        ? <button className="complete-task-button" onClick={onClickDoneTask}>
          <CircleCheckBig className="tsb-icon" />
          Complete Task
        </button>
        : <div className="completed-task">
          <CheckLine className="tsb-icon" />
          Completed
        </div>}
      {isUnder12Hours && <button className="delete-task-button delete-btn" onClick={onClickDeleteTask}>
        <Trash2 className="tsb-icon" />Delete Task
      </button>}
    </div>
  </div>
}