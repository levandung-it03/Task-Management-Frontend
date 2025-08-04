'use client'

import UserTask from "@/app-reused/task-detail/user-task/user-task"
import { useParams } from "next/navigation"

export default function LeadUserTask() {
  const params = useParams<{ taskId: string, userTaskId: string }>()
  const taskId: number | undefined = Number(params.taskId)
  const userTaskId: number | undefined = Number(params.userTaskId)

  if (taskId === undefined || userTaskId === undefined)
    throw new Error("404 Not Found")
  else
    return <UserTask userTaskId={userTaskId} taskId={taskId} />
}