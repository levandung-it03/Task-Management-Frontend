'use client'

import DetailGroupPage from "@/app-reused/group-detail/group-detail.page"
import { useParams } from "next/navigation"

export default function LeadDetailGroup() {
  const params = useParams<{ groupId: string }>()
  const groupId = Number(params.groupId)

  return <DetailGroupPage groupId={groupId}/>
}