'use client'

import PhaseDetail from "@/app-reused/phase-detail/phase-detail";
import { useParams } from "next/navigation";

export default function LeadPhasesPage() {
  const params = useParams<{ phasesId: string }>()
  const projectId = Number(params.phasesId)

  return <PhaseDetail projectId={projectId} />
}