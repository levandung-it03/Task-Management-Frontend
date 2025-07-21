'use client'

import { ApiResponse } from "@/apis/general.api"
import { TaskDetailPageAPIs } from "@/apis/task-detail.page.api"
import { extractEmailToGetId, getColorByCharacter } from "@/app-reused/create-task/task-creation-form/task-creation.form"
import { ClipboardList } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import "./assigned-users.scss"
import { DTO_TaskDetail, DTO_TaskUser } from "@/dtos/task-detail.page.dto"

export default function AssignedUsers({ taskInfo }: { taskInfo: DTO_TaskDetail }) {
  const [assignedUsers, setAssignedUsers] = useState<DTO_TaskUser[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const onClickOpenUserReports = useCallback((id: number) => {
    window.location.href = `${window.location.pathname}/user-task/${id}`
  }, [])

  useEffect(() => {
    async function fetchAssignedUsers() {
      const response = await TaskDetailPageAPIs.getUsersOfTask(taskInfo.id) as ApiResponse<DTO_TaskUser[]>
      if (String(response.status)[0] === "2") {
        setAssignedUsers(response.body)
      }
      setIsLoading(false)
    }
    fetchAssignedUsers()
  }, [taskInfo.id])

  return <>
    <div className="analyst-quantities">
      <div className="small-caption">
        <ClipboardList className="sc-icon" />
        <span className="sc-title">Assigned Users</span>
        <i className="sc-desc">All assigned Users for this Task are here, and a short analyst.</i>
      </div>
      <div className="quantities">
        <div className="quantity-block total-users">
          <h1 className="analyst-number">{assignedUsers.length}</h1>
          <span className="analyst-category">Total Users</span>
        </div>
        <div className="quantity-block total-completed">
          <h1 className="analyst-number">
            {assignedUsers.reduce((acc, user) => user.userTaskStatus === "COMPLETED" ? acc + 1 : acc, 0)}
          </h1>
          <span className="analyst-category">Users Done</span>
        </div>
        <div className="quantity-block total-in-progress">
          <h1 className="analyst-number">
            {assignedUsers.reduce((acc, user) => user.userTaskStatus === "IN_PROGRESS" ? acc + 1 : acc, 0)}
          </h1>
          <span className="analyst-category">In Progress</span>
        </div>
        <div className="quantity-block total-kicked-out">
          <h1 className="analyst-number">
            {assignedUsers.reduce((acc, user) => user.userTaskStatus === "KICKED_OUT" ? acc + 1 : acc, 0)}
          </h1>
          <span className="analyst-category">Kicked Out</span>
        </div>
      </div>
    </div>
    <ul className="assigned-users">
      {isLoading
        ? <li className="loading-row"><span>Loading...</span></li>
        : assignedUsers.map((user, ind) => {
          const firstNameChar = user.fullName[0].toUpperCase()
          return <li
            key={"usi-" + ind}
            className={`user-short-info${(extractEmailToGetId(user.email) in assignedUsers) ? " user-short-info-selected" : ""}`}
            onClick={() => onClickOpenUserReports(user.id)}
          >
            <span className="usi-ava" style={getColorByCharacter(firstNameChar)}>{firstNameChar}</span>
            <span className="usi-full-name">{user.fullName}</span>
            <span className="usi-email">{user.email}</span>
            <span className={`usi-role usi-${user.role.toLowerCase().replace("_", "-")}`}>{user.role}</span>
          </li>
        })
      }
    </ul>
  </>
}