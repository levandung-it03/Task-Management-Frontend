'use client'

import { ApiResponse } from "@/apis/general.api"
import { StatisticPageAPIs } from "@/apis/statistic.page"
import { DTO_ProjectOverview } from "@/dtos/statistic.page.dto"
import { useEffect, useState } from "react"
import ProjectInfo from "./project-info/project-info"
import "./statistic.page.scss"
import StatisticReview from "./statistic-review/statistic-review"

export default function StatisticPage({ projectId }: { projectId: number }) {
  const [isLoading, setIsLoading] = useState(true)
  const [project, setProject] = useState<DTO_ProjectOverview>({
    id: 1,
    userInfoCreated: {
      fullName: "",
      email: "",
      role: "",
      department: ""
    },
    name: "",
    description: "",
    startDate: "",
    endDate: null,
    dueDate: "",
    createdTime: "",
    updatedTime: "",
    active: false,
    totalApproved: 0,
    totalRejected: 0,
    totalDoneTaskOnTime: 0,
    totalDoneTaskLate: 0,
  })

  useEffect(() => {
    async function fetchProject() {
      setIsLoading(true)
      const response = await StatisticPageAPIs.getProject(projectId) as ApiResponse<DTO_ProjectOverview>
      if (String(response.status).startsWith("2")) {
        setProject(response.body)
      }
      setIsLoading(false)
    }
    fetchProject()
  }, [])

  return (isLoading
    ? <div className="loading-row">Loading...</div>
    : <div className="project-statistic">
      <ProjectInfo project={project} />
      <StatisticReview projectId={projectId} />
    </div>
  )
}