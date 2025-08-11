'use client'

import { CollectionDetail } from "@/app-reused/collection-detail"; // file hiển thị danh sách collection
import { useParams } from "next/navigation";

// Đây là trang CollectionListPage: Xem danh sách collections theo phase
export default function LeadCollectionsPage() {
  const params = useParams<{ phasesId: string }>()
  const phaseId = Number(params.phasesId)

  return <CollectionDetail phaseId={phaseId} />
}
