'use client'

import HelpContainer from "@/app-reused/help-container/page";
import { checkOverDue, prettierDate, prettierTime } from "@/app-reused/task-detail/task-detail.service";
import { Check, Container, ScrollText } from "lucide-react";
import "./phase-detail.scss";
import { useCallback, useEffect, useState } from "react";
import { CollectionAPIs } from "@/apis/collection.page.api";
import { ApiResponse } from "@/apis/general.api";
import { DTO_PhaseDetail } from "@/dtos/collection.page.dto";
import { AuthHelper } from "@/util/auth.helper";
import toast from "react-hot-toast";
import GlobalValidators from "@/util/global.validators";

export default function PhaseDetail({ phaseId }: { phaseId: number }) {
  const [phase, setPhase] = useState<DTO_PhaseDetail>({
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
    },
    projectInfo: {
      id: 1,
      name: ""
    }
  })

  const onClickComplete = useCallback(() => {
    async function complete() {
      const response = await CollectionAPIs.completePhase(phase.id) as ApiResponse<void>
      if (String(response.status).startsWith("2")) {
        toast.success(response.msg)
        setPhase(prev => ({
          ...prev,
          endDate: new Date().toDateString()
        }))
      }
    }
    complete()
  }, [phase])

  useEffect(() => {
    async function fetchPhase() {
      const response = await CollectionAPIs.getPhaseDetail(phaseId) as ApiResponse<DTO_PhaseDetail>
      if (String(response.status).startsWith("2")) {
        setPhase(response.body)
      }
    }
    fetchPhase()
  }, [phaseId])

  return <div className="phase-overview general-detail">
    <div className="detail-delegator">
      <a href={`/${AuthHelper.getRoleFromToken()}/projects/${phase.projectInfo.id}/phases`}>
        {phase.projectInfo.name}
      </a>
      <span>&gt;</span>
      <a>{phase.name}</a>
    </div>
    <div className="form-caption">
      <Container className="caption-icon" />
      <span className="caption-content">
        Phase Information<span className="phase-id tag-data quick-green-tag">{phase.id}</span>
      </span>
      <i className="desc-content">Shorten Phase information, and statistic!</i>
    </div>
    <div className="phase-info">
      <div className="phase-info-item phase-header">
        <div className="phase-name">
          <ScrollText className="phase-name-icon" />
          <span className="phase-info-value">{phase.name}</span>
        </div>
      </div>
      <div className="phase-info-left">
        <div className="phase-info-item">
          <span className="phase-info-label">Created by</span>
          <span className="phase-info-value">
            <span className="phase-date">{phase.userInfoCreated.fullName}</span>
          </span>
        </div>
        <div className="phase-info-item">
          <span className="phase-info-label">Email</span>
          <span className="phase-info-value">
            <span className="phase-date">{phase.userInfoCreated.email}</span>
          </span>
        </div>
        <div className="phase-info-item">
          <span className="phase-info-label">Due Date</span>
          <span className="phase-info-value">
            <span className="phase-date">
              <span className={`phase-date-content ${checkOverDue(phase.dueDate)}-date`}>
                {prettierDate(phase.dueDate)}
              </span>
              <HelpContainer title="" key="" description="When it's red, it means this Phase was overdue" />
            </span>
          </span>
        </div>
        <div className="phase-info-item">
          <span className="phase-info-label">Start Date</span>
          <span className="phase-info-value">
            <span className="phase-date">{prettierDate(phase.startDate)}</span>
          </span>
        </div>
      </div>
      <div className="phase-info-right">
        {phase.endDate !== null
          && <div className="phase-info-item">
            <span className="phase-info-label">End Date</span>
            <span className="phase-info-value">
              <span className="phase-date">
                <span>{prettierDate(phase.endDate)}</span>
              </span>
            </span>
          </div>}
        <div className="phase-info-item">
          <span className="phase-info-label">Created Time</span>
          <span className="phase-info-value">
            <span className="phase-date">
              <span className="task-time-content quick-blue-tag tag-data">{prettierTime(phase.createdTime)}</span>
            </span>
          </span>
        </div>
        <div className="phase-info-item">
          <span className="phase-info-label">Updated Time</span>
          <span className="phase-info-value">
            <span className="phase-date">
              <span className="task-time-content quick-blue-tag tag-data">{prettierTime(phase.updatedTime)}</span>
            </span>
          </span>
        </div>
      </div>
    </div>
    <div className="complete-btn-block">
      <button
        className={`complete-btn ${GlobalValidators.nonNull(phase.endDate) ? "btn-disabled" : ""}`}
        disabled={GlobalValidators.nonNull(phase.endDate)}
        onClick={onClickComplete}>
        <Check className="cb-icon" />
        Complete
      </button>
    </div>
  </div>

}
