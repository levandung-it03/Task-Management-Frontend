'use client'

import { useSearchParams } from "next/navigation"
import UserProfile from "@/app-reused/view-user/page"

export default function LeadUserProfilePage() {
  const searchParams = useSearchParams()
  const userId = searchParams.get('id')
  
  if (userId) {
    return <UserProfile userId={parseInt(userId)} />
  }
  
  return <div>Vui lòng cung cấp ID người dùng</div>
}


