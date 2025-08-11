'use client'

import PhaseDetail from "@/app-reused/phase-detail";
import { useParams } from "next/navigation";

//-- Đây mới là trang PhaseList (xem danh sách phase, đổi cái tên `PhaseDetail` thành `PhaseListPage` gì đó cho rõ nghĩa)
export default function EmpPhasesPage() {
  const params = useParams<{ projectId: string }>()
  const projectId = Number(params.projectId)

  return <PhaseDetail projectId={projectId}/>
}