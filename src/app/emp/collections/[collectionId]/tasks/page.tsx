'use client'

import { TaskListDetail } from "@/app-reused/task-list"; // file hiển thị danh sách collection
import { useParams } from "next/navigation";

// Đây là trang CollectionListPage: Xem danh sách collections theo phase
export default function EmpCollectionsPage() {
  const params = useParams<{ collectionId: string }>()
  const collectionId = Number(params.collectionId)

  return <TaskListDetail collectionId={collectionId} />
}
