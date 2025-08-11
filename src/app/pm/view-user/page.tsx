'use client'

import { useSearchParams } from "next/navigation"
import UserProfile from "@/app-reused/view-user/page"

export default function PmUserProfilePage() {
  const searchParams = useSearchParams()
  const userId = searchParams.get('id')
  
  if (userId) {
    return <UserProfile userId={parseInt(userId)} />
  }
  
  // Fallback to user-info page if no userId provided
  return <div>Vui lòng cung cấp ID người dùng</div>
} 