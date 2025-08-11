'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function HomeRedirection() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/admin/manage-users')
  }, [router])

  return null
}
