'use client'

import HelpContainer from "@/app-reused/help-container/page";
import { checkOverDue, prettierDate, prettierTime } from "@/app-reused/task-detail/task-detail.service";
import { Container, ScrollText } from "lucide-react";
import "./project-detail.scss";
import { useEffect, useState } from "react";
import { PhaseAPIs } from "@/apis/phase.page.api";
import { ApiResponse } from "@/apis/general.api";
import { DTO_ProjectDetail } from "@/dtos/phase.page.dto";

export default function ProjectDetail({ projectId }: { projectId: number }) {
  const [project, setProject] = useState<DTO_ProjectDetail>({
    id: 0,
    name: "",
    description: "",
    startDate: "",
    endDate: null,
    dueDate: "",
    status: "",
    createdTime: "",
    updatedTime: "",
    userInfoCreated: {
      fullName: "",
      email: "",
      department: "",
      role: ""
    }
  })

  useEffect(() => {
    async function fetchProject() {
      const response = await PhaseAPIs.getProjecDetail(projectId) as ApiResponse<DTO_ProjectDetail>
      if (String(response.status).startsWith("2")) {
        setProject(response.body)
      }
    }
    fetchProject()
  }, [projectId])

  return <div className="project-overview general-detail">
    <div className="form-caption">
      <Container className="caption-icon" />
      <span className="caption-content">
        Project Information<span className="project-id tag-data quick-green-tag">{project.id}</span>
      </span>
      <i className="desc-content">Shorten Project information, and statistic!</i>
    </div>
    <div className="project-info">
      <div className="project-info-item project-header">
        <div className="project-name">
          <ScrollText className="project-name-icon" />
          <span className="project-info-value">{project.name}</span>
        </div>
      </div>
      <div className="project-info-left">
        <div className="project-info-item">
          <span className="project-info-label">Created by</span>
          <span className="project-info-value">
            <span className="project-date">{project.userInfoCreated.fullName}</span>
          </span>
        </div>
        <div className="project-info-item">
          <span className="project-info-label">Email</span>
          <span className="project-info-value">
            <span className="project-date">{project.userInfoCreated.email}</span>
          </span>
        </div>
        <div className="project-info-item">
          <span className="project-info-label">Due Date</span>
          <span className="project-info-value">
            <span className="project-date">
              <span className={`project-date-content ${checkOverDue(project.dueDate)}-date`}>
                {prettierDate(project.dueDate)}
              </span>
              <HelpContainer title="" key="" description="When it's red, it means this Project was overdue" />
            </span>
          </span>
        </div>
        <div className="project-info-item">
          <span className="project-info-label">Start Date</span>
          <span className="project-info-value">
            <span className="project-date">{prettierDate(project.startDate)}</span>
          </span>
        </div>
      </div>
      <div className="project-info-right">
        {project.endDate !== null
          && <div className="project-info-item">
            <span className="project-info-label">End Date</span>
            <span className="project-info-value">
              <span className="project-date">
                <span>{prettierDate(project.endDate)}</span>
              </span>
            </span>
          </div>}
        <div className="project-info-item">
          <span className="project-info-label">Created Time</span>
          <span className="project-info-value">
            <span className="project-date">
              <span className="task-time-content quick-blue-tag tag-data">{prettierTime(project.createdTime)}</span>
            </span>
          </span>
        </div>
        <div className="project-info-item">
          <span className="project-info-label">Updated Time</span>
          <span className="project-info-value">
            <span className="project-date">
              <span className="task-time-content quick-blue-tag tag-data">{prettierTime(project.updatedTime)}</span>
            </span>
          </span>
        </div>
        <div className="project-info-item">
          <span className="project-info-label">Status</span>
          <span className="project-info-value">
            <span className={`project-status `}>
              <span className={`ps-icon ps-${project.status.replaceAll("_", "-").toLocaleLowerCase()}`}>
                {project.status}
              </span>
            </span>
          </span>
        </div>
      </div>
    </div>
  </div>

}
