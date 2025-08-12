'use client'

import CreateTask from "@/app-reused/create-task/page";
import { useParams } from "next/navigation";

export default function PMCreateTaskPage() {
  const params = useParams<{ collectionId: string }>()
  const collectionId = Number(params.collectionId)

  return <CreateTask collectionId={collectionId} />
}