'use client'

import StatisticPage from "@/app-reused/statistic/statistic.page";
import { useParams } from "next/navigation";

export default function PMProjectStatistic() {
  const params = useParams<{ projectId: string }>()
  const projectId = Number(params.projectId)

  return <StatisticPage projectId={projectId} />
}