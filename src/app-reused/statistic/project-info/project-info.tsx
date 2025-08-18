'use client'

import HelpContainer from "@/app-reused/help-container/page";
import { checkOverDue, prettierDate, prettierTime } from "@/app-reused/task-detail/task-detail.service";
import { DTO_ProjectOverview } from "@/dtos/statistic.page.dto";
import { Container, ScrollText } from "lucide-react";
import "./project-info.scss";
import ApprovalDonut from "../project-chart/project-chart";

export default function ProjectInfo({ project }: { project: DTO_ProjectOverview }) {
  return <div className="project-overview">
    <div className="form-caption">
      <Container className="caption-icon" />
      <span className="caption-content">
        Project Information<span className="project-id tag-data">{project.id}</span>
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
            <span className="project-info-label">Expected Start Date</span>
            <span className="project-info-value">
              <span className="project-date">{prettierDate(project.expectedStartDate)}</span>
            </span>
          </div>
        {project.startDate !== null
          && <div className="project-info-item">
            <span className="project-info-label">Start Date</span>
            <span className="project-info-value">
              <span className="project-date">{prettierDate(project.startDate)}</span>
            </span>
          </div>
        }
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
              <span className="task-time-content tag-data">{prettierTime(project.createdTime)}</span>
            </span>
          </span>
        </div>
        <div className="project-info-item">
          <span className="project-info-label">Updated Time</span>
          <span className="project-info-value">
            <span className="project-date">
              <span className="task-time-content tag-data">{prettierTime(project.updatedTime)}</span>
            </span>
          </span>
        </div>
      </div>
      <div className="project-info-right">
        <ApprovalDonut data={{ Approved: project.totalApproved, Rejected: project.totalRejected }} />
        <ApprovalDonut data={{ ["On-Time"]: project.totalDoneTaskOnTime, ["Late-Tasks"]: project.totalDoneTaskLate }} />
      </div>
    </div>
  </div>

}
