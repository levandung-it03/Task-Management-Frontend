'use client'

import CreateTask from "@/app-reused/create-task/page";
import { useParams } from "next/navigation"

export default function LeadCreateSubTaskPage() {
  const params = useParams<{ rootId: string }>()
  const rootId = Number(params.rootId)

  return <CreateTask rootId={rootId} />
}