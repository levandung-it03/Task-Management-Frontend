'use client'

import { ApiResponse } from "@/apis/general.api"
import { TaskDetailPageAPIs } from "@/apis/task-detail.page.api"
import { extractEmailToGetId, getColorByCharacter } from "@/app-reused/create-task/task-creation-form/task-creation.form"
import { ClipboardList, LogIn, LogOut } from "lucide-react"
import { useCallback, useEffect, useMemo, useState } from "react"
import "./assigned-users.scss"
import { DTO_TaskDetail, DTO_TaskUser } from "@/dtos/task-detail.page.dto"
import toast from "react-hot-toast"
import { confirm } from "@/app-reused/confirm-alert/confirm-alert"

export default function AssignedUsers({ taskInfo, isTaskOwner, setTotalUsers }: {
  taskInfo: DTO_TaskDetail,
  isTaskOwner: boolean,
  setTotalUsers: React.Dispatch<React.SetStateAction<number>>
}) {
  const [assignedUsers, setAssignedUsers] = useState<DTO_TaskUser[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const totalUsersDone = useMemo(() =>
    assignedUsers.reduce((acc, user) => user.wasDone ? acc + 1 : acc, 0)
    , [assignedUsers])
  const totalUsersKickedOut = useMemo(() =>
    assignedUsers.reduce((acc, user) => user.userTaskStatus === "KICKED_OUT" ? acc + 1 : acc, 0)
    , [])

  useEffect(() => {
    async function fetchAssignedUsers() {
      const response = await TaskDetailPageAPIs.getUsersOfTask(taskInfo.id) as ApiResponse<DTO_TaskUser[]>
      if (String(response.status).startsWith("2")) {
        setAssignedUsers(response.body)
        setTotalUsers(response.body.length)
      }
      setIsLoading(false)
    }
    fetchAssignedUsers()
  }, [taskInfo.id])

  return (assignedUsers.length > 0
    && <>
      <div className="analyst-quantities">
        <div className="small-caption">
          <ClipboardList className="sc-icon" />
          <span className="sc-title">Assigned Users</span>
          <i className="sc-desc">All assigned Users for this Task are here{assignedUsers.length > 1 && ", and a short analyst."}</i>
        </div>
        <div className="quantities">
          <div className="quantity-block total-users">
            <h1 className="analyst-number">{assignedUsers.length}</h1>
            <span className="analyst-category">Total Users</span>
          </div>
          <div className="quantity-block total-completed">
            <h1 className="analyst-number">
              {totalUsersDone}
            </h1>
            <span className="analyst-category">Users Done</span>
          </div>
          <div className="quantity-block total-in-progress">
            <h1 className="analyst-number">
              {assignedUsers.length - totalUsersDone - totalUsersKickedOut}
            </h1>
            <span className="analyst-category">In Progress</span>
          </div>
          <div className="quantity-block total-kicked-out">
            <h1 className="analyst-number">
              {totalUsersKickedOut}
            </h1>
            <span className="analyst-category">Kicked Out</span>
          </div>
        </div>
      </div>
      <ul className="assigned-users">
        {isLoading
          ? <li className="loading-row">Loading...</li>
          : assignedUsers.map((user, ind) => 
            <UserTag key={"usi-" + ind} isTaskOwner={isTaskOwner} userTask={user} assignedUsers={assignedUsers} />
          )
        }
      </ul>
    </>)
}

function UserTag({ isTaskOwner, userTask, assignedUsers }: { 
  isTaskOwner: boolean,
  userTask: DTO_TaskUser,
  assignedUsers: DTO_TaskUser[]
 }) {
  const [userKicked, setUserKicked] = useState(false)
  const firstNameChar = useMemo(() => userTask.fullName ? userTask.fullName[0].toUpperCase() : "", [userTask.fullName])
  
  const onClickReaddUser = useCallback((e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    async function kickUser() {
      e.preventDefault()
      if (!(await confirm("This action cannot be undone. Are you sure?", "Re-add User")))
        return
      const response = await TaskDetailPageAPIs.reAddUserOfTask(userTask.id) as ApiResponse<void>
      if (String(response.status).startsWith("2")) {
        toast.success(response.msg)
        setUserKicked(false)
        return
      }
    }
    kickUser()
  }, [])

  const onClickKickUser = useCallback((e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    async function kickUser() {
      e.preventDefault()
      if (!(await confirm("This action cannot be undone. Are you sure?", "Kick User out")))
        return
      const response = await TaskDetailPageAPIs.kickUserOfTask(userTask.id) as ApiResponse<void>
      if (String(response.status).startsWith("2")) {
        toast.success(response.msg)
        setUserKicked(true)
        window.location.reload()
        return
      }
    }
    kickUser()
  }, [])

  useEffect(() => setUserKicked(userTask.userTaskStatus == "KICKED_OUT"), [userTask.userTaskStatus])

  return <a
    className={`user-short-info${(extractEmailToGetId(userTask.email) in assignedUsers) ? " user-short-info-selected" : ""}`}
    href={`${window.location.pathname}/user-task/${userTask.id}`}
  >
    <span className="usi-ava" style={getColorByCharacter(firstNameChar)}>{firstNameChar}</span>
    <span className="usi-full-name">{userTask.fullName}</span>
    <span className="usi-email">{userTask.email}</span>
    <span className="usi-dep quick-blue-tag">{userTask.department}</span>
    <span className={`usi-role usi-${userTask.role.toLowerCase().replace("_", "-")}`}>{userTask.role}</span>
    {userTask.wasDone
      ? <span className="usi-status quick-green-tag">Done</span>
      : <span className="usi-status quick-blue-tag">In-progress</span>}
    {isTaskOwner && (userKicked
      ? <button className="usi-tag re-add-user-btn" onClick={onClickReaddUser}>
        <LogIn className="usgb-icon" />Re-add
      </button>
      : <button className="usi-tag kick-user-btn" onClick={onClickKickUser}>
        <LogOut className="usgb-icon" />Kick
      </button>)}
  </a>
}