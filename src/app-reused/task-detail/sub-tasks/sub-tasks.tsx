'use client'

import "./sub-tasks.scss"
import { ApiResponse } from "@/apis/general.api"
import { TaskDetailPageAPIs } from "@/apis/task-detail.page.api"
import { DTO_OverviewSubTask, DTO_TaskDetail } from "@/dtos/task-detail.page.dto"
import { ClipboardList } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { checkOverDue } from "../task-detail.service"
import { GeneralTools } from "@/util/general.helper"

export default function SubTasks({ taskInfo: taskInfo }: { taskInfo: DTO_TaskDetail }) {
  const [subTasks, setSubTasks] = useState<DTO_OverviewSubTask[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchSubTasks() {
      setIsLoading(true)
      const response = await TaskDetailPageAPIs.getOverviewSubTasks(taskInfo.id) as ApiResponse<DTO_OverviewSubTask[]>
      if (String(response.status).startsWith("2")) {
        setSubTasks(response.body)
      }
      setIsLoading(false)
    }
    fetchSubTasks()
  }, [taskInfo])

  return isLoading
    ? <div className="loading-row">Loading...</div>
    : <div className="sub-tasks">
      {subTasks.map((subTask, ind) => <SubTask key={"st-" + ind} subTask={subTask} rootTask={taskInfo} />)}
    </div>
}

function SubTask({ subTask, rootTask }: { 
  subTask: DTO_OverviewSubTask,
  rootTask: DTO_TaskDetail
 }) {
  const pathname = useMemo(() => {
    let extractedPaths = window.location.pathname.split("/")
    extractedPaths.pop()
    return extractedPaths.join("/") + "/" + subTask.id
  }, [])
  return <a className="sub-task" href={pathname}>
    <div className="st-header">
      <span className="sth-name">
        <ClipboardList className="stn-icon" />
        {subTask.name}
      </span>
      <i className="sth-desc">Sub task of <b>"{rootTask.name}"</b></i>
    </div>
    <div className="st-info">
      <span className={`st-level tag-data task-level-${subTask.level.toLowerCase()}`}>
        {subTask.level}
      </span>
      <span className="st-type tag-data quick-blue-tag">{GeneralTools.capitalize(subTask.taskType)}</span>
      <span className={`st-priority tag-data task-priority-${subTask.priority.toLowerCase()}`}>
        {GeneralTools.capitalize(subTask.priority)}
      </span>
    </div>
    <div className="st-dates">
      <span className="quick-blue-tag start-date">Started at {subTask.startDate}</span>
      {subTask.endDate !== null && <span className="quick-blue-tag end-date">Ended at {subTask.endDate}</span>}
      <span className={`st-deadline ${checkOverDue(subTask.deadline)}-date`}>Deadline {subTask.deadline}</span>
    </div>
  </a>
}