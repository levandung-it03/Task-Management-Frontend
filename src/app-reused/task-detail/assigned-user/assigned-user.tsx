'use client'

import { ApiResponse } from "@/apis/general.api"
import { TaskDetailPageAPIs } from "@/apis/task-detail.page.api"
import { getColorByCharacter } from "@/app-reused/create-task/task-creation-form/task-creation.form"
import { DTO_TaskUser } from "@/dtos/task-detail.page.api"
import { ClipboardList } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import "../assigned-users/assigned-users.scss"

export default function AssignedUser({ userId }: { userId: number }) {
  const [user, setUser] = useState<DTO_TaskUser>({
    username: "",
    fullName: "",
    role: "",
    userTaskStatus: "",
  })
  const firstNameChar = useMemo(() => user.fullName[0]?.toUpperCase() || '', [user.fullName])

  useEffect(() => {
    async function fetchUserInfo() {
      const response = await TaskDetailPageAPIs.getUesrForAssignedTask(userId) as ApiResponse<DTO_TaskUser>
      if (String(response.status)[0] === "2") {
        setUser(response.body)
      }
    }
    fetchUserInfo()
  }, [userId])

  return <div className="analyst-quantities">
    <div className="small-caption">
      <ClipboardList className="sc-icon" />
      <span className="sc-title">Interaction</span>
      <i className="sc-desc">Click to see reports and more.</i>
      <div className="user-short-info">
        <span className="usi-ava" style={getColorByCharacter(firstNameChar)}>{firstNameChar}</span>
        <span className="usi-full-name">{user.fullName}</span>
        <span className="usi-username">{user.username}</span>
        <span className={`usi-role usi-${user.role.toLowerCase().replace("_", "-")}`}>{user.role}</span>
      </div>
    </div>
  </div>
}