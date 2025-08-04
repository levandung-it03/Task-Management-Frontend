'use client'

import TaskDetail from "@/app-reused/task-detail/task-detail"
import { useParams } from "next/navigation"

export default function EMPTaskDetailPage() {
  const params = useParams<{ taskId: string }>()
  const taskId = Number(params.taskId)

  return <TaskDetail taskId={taskId} />
}