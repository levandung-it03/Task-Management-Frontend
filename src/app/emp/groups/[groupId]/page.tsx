'use client'

import DetailGroupPage from "@/app-reused/group-detail/group-detail.page"
import { useParams } from "next/navigation"
import { useMemo } from "react"

export default function EMPDetailGroup() {
  const params = useParams<{ groupId: string }>()
  const groupId = useMemo(() => Number(params.groupId), [params.groupId])

  return <DetailGroupPage groupId={groupId}/>
}