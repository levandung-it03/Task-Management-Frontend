'use client'

import HelpContainer from "@/app-reused/help-container/page";
import { checkOverDue, prettierDate, prettierTime } from "@/app-reused/task-detail/task-detail.service";
import { Check, CirclePause, CirclePlay, CircleX, Container, FolderKanban, ScrollText } from "lucide-react";
import "./project-detail.scss";
import { useCallback, useEffect, useState } from "react";
import { PhaseAPIs } from "@/apis/phase.page.api";
import { ApiResponse, GeneralAPIs } from "@/apis/general.api";
import { DTO_ProjectDetail } from "@/dtos/phase.page.dto";
import { DTO_EmailResponse } from "@/dtos/general.dto";
import toast from "react-hot-toast";
import { confirm } from "@/app-reused/confirm-alert/confirm-alert";

export default function ProjectDetail({ projectId }: { projectId: number }) {
  const [isOwner, setIsOwner] = useState(false)
  const [project, setProject] = useState<DTO_ProjectDetail>({
    id: 0,
    name: "",
    description: "",
    expectedStartDate: "",
    startDate: null,
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

  const onClickComplete = useCallback(() => {
    async function complete() {
      if (!(await confirm("This action cannot be undone, are you sure?", "Confirm")))
        return
      const response = await PhaseAPIs.completeProject(project.id) as ApiResponse<void>
      if (String(response.status).startsWith("2")) {
        toast.success(response.msg)
        setProject(prev => ({
          ...prev,
          endDate: new Date().toDateString(),
          status: "COMPLETED"
        }))
      }
    }
    complete()
  }, [project.id])

  const onClickStartProject = useCallback(() => {
    async function start() {
      if (!(await confirm("This action cannot be undone, are you sure?", "Confirm")))
        return
      const response = await PhaseAPIs.startProject(project.id) as ApiResponse<void>
      if (String(response.status).startsWith("2")) {
        toast.success(response.msg)
        setProject(prev => ({
          ...prev,
          endDate: new Date().toDateString(),
          status: "IN_PROGRESS"
        }))
        window.location.reload()
      }
    }
    start()
  }, [project.id])

  const onClickCloseProject = useCallback(() => {
    async function close() {
      if (!(await confirm("This action cannot be undone, are you sure?", "Confirm")))
        return
      const response = await PhaseAPIs.closeProject(project.id) as ApiResponse<void>
      if (String(response.status).startsWith("2")) {
        toast.success(response.msg)
        setProject(prev => ({
          ...prev,
          endDate: new Date().toDateString(),
          status: "CLOSED"
        }))
      }
    }
    close()
  }, [project.id])

  const onClickSwitch = useCallback(() => {
    async function close() {
      const response = await PhaseAPIs.switchPauseInProgress(project.id) as ApiResponse<Record<string, string>>
      if (String(response.status).startsWith("2")) {
        toast.success(response.msg)
        setProject(prev => ({
          ...prev,
          endDate: new Date().toDateString(),
          status: response.body?.newStatus
        }))
      }
    }
    close()
  }, [project.id])

  useEffect(() => {
    async function fetchProject() {
      const response = await PhaseAPIs.getProjecDetail(projectId) as ApiResponse<DTO_ProjectDetail>
      if (String(response.status).startsWith("2")) {
        setProject(prev => ({
          ...prev,
          ...response.body
        }))
      }

      const emailRes = await GeneralAPIs.getEmail() as ApiResponse<DTO_EmailResponse>
      if (String(emailRes.status)[0] !== "2")
        return

      setIsOwner(emailRes.body.email === response.body.userInfoCreated.email)
    }
    fetchProject()
  }, [projectId])

  return <div className="project-overview general-detail">
    <div className="form-caption form-caption-wrap">
      <FolderKanban className="caption-icon" />
      <span className="caption-content">
        {project.name}<span className="project-id tag-data quick-green-tag">{project.id}</span>
      </span>
      <i className="desc-content">{project.description}</i>
    </div>
    <div className="project-info">
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
        {project.startDate !== null &&
          <div className="project-info-item">
            <span className="project-info-label">Start Date</span>
            <span className="project-info-value">
              <span className="project-date">{prettierDate(project.startDate)}</span>
            </span>
          </div>
        }
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
    {isOwner && <div className="project-buttons">
      <div className="btn-block">
        {project.status === "CREATED"
          ? <button
            className="general-btn start-btn"
            onClick={onClickStartProject}>
            <Check className="cb-icon" />
            Start
          </button>
          : project.status !== "CLOSED" && project.status !== "COMPLETED"
          && <>
            {project.status === "IN_PROGRESS" && <>
              <button className="general-btn complete-btn" onClick={onClickComplete}>
                <Check className="cb-icon" />
                Complete
              </button>
              <button className="general-btn close-btn" onClick={onClickCloseProject}>
                <CircleX className="cb-icon" />
                Close
              </button>
            </>}
            {project.status === "PAUSED"
              ? <button className="general-btn in-progress-btn" onClick={onClickSwitch}>
                <CirclePlay className="cb-icon" /> Open Project Again
              </button>
              : <button className="general-btn pause-btn" onClick={onClickSwitch}>
                <CirclePause className="cb-icon" />Pause
              </button>
            }
          </>}
      </div>
    </div>}
  </div>

}
