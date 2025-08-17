'use client'

import HelpContainer from "@/app-reused/help-container/page";
import { checkOverDue, prettierDate, prettierTime } from "@/app-reused/task-detail/task-detail.service";
import { Check, Container, ScrollText } from "lucide-react";
import "./collection-detail.scss";
import { useCallback, useEffect, useState } from "react";
import { TaskListAPIs } from "@/apis/task-list.page.api";
import { ApiResponse, GeneralAPIs } from "@/apis/general.api";
import { DTO_CollectionDetail } from "@/dtos/task-list.page.dto";
import { AuthHelper } from "@/util/auth.helper";
import GlobalValidators from "@/util/global.validators";
import toast from "react-hot-toast";
import { DTO_EmailResponse } from "@/dtos/general.dto";

export default function CollectionDetail({ collectionId, showCompleteBtn=true }: {
  collectionId: number,
  showCompleteBtn: boolean
}) {
  const [isOwner, setIsOwner] = useState(false)
  const [collection, setCollection] = useState<DTO_CollectionDetail>({
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
      id: 0,
      name: ""
    },
    phaseInfo: {
      id: 0,
      name: ""
    }
  })

  const onClickComplete = useCallback(() => {
    async function complete() {
      const response = await TaskListAPIs.completeCollection(collection.id) as ApiResponse<void>
      if (String(response.status).startsWith("2")) {
        toast.success(response.msg)
        setCollection(prev => ({
          ...prev,
          endDate: new Date().toDateString()
        }))
      }
    }
    complete()
  }, [collection])

  useEffect(() => {
    async function fetchCollection() {
      const response = await TaskListAPIs.getCollectionDetail(collectionId) as ApiResponse<DTO_CollectionDetail>
      if (String(response.status).startsWith("2")) {
        setCollection(response.body)
      }

      const emailRes = await GeneralAPIs.getEmail() as ApiResponse<DTO_EmailResponse>
      if (String(emailRes.status)[0] !== "2")
        return

      setIsOwner(emailRes.body.email === response.body.userInfoCreated.email)
    }
    fetchCollection()
  }, [collectionId])

  return <div className="collection-overview general-detail">
    <div className="detail-delegator">
      <a href={`/${AuthHelper.getRoleFromToken()}/projects/${collection.projectInfo.id}/phases`}>
        {collection.projectInfo.name}
      </a>
      <span>&gt;</span>
      <a href={`/${AuthHelper.getRoleFromToken()}/phases/${collection.phaseInfo.id}/collections`}>
        {collection.phaseInfo.name}
      </a>
      <span>&gt;</span>
      <a href={`/${AuthHelper.getRoleFromToken()}/collections/${collection.id}/tasks`}>
        {collection.name}
      </a>
    </div>
    <div className="form-caption">
      <Container className="caption-icon" />
      <span className="caption-content">
        Collection Information<span className="collection-id tag-data quick-green-tag">{collection.id}</span>
      </span>
      <i className="desc-content">{collection.description}</i>
    </div>
    <div className="collection-info">
      <div className="collection-info-item collection-header">
        <div className="collection-name">
          <ScrollText className="collection-name-icon" />
          <span className="collection-info-value">{collection.name}</span>
        </div>
      </div>
      <div className="collection-info-left">
        <div className="collection-info-item">
          <span className="collection-info-label">Created by</span>
          <span className="collection-info-value">
            <span className="collection-date">{collection.userInfoCreated.fullName}</span>
          </span>
        </div>
        <div className="collection-info-item">
          <span className="collection-info-label">Email</span>
          <span className="collection-info-value">
            <span className="collection-date">{collection.userInfoCreated.email}</span>
          </span>
        </div>
        <div className="collection-info-item">
          <span className="collection-info-label">Due Date</span>
          <span className="collection-info-value">
            <span className="collection-date">
              <span className={`collection-date-content ${checkOverDue(collection.dueDate)}-date`}>
                {prettierDate(collection.dueDate)}
              </span>
              <HelpContainer title="" key="" description="When it's red, it means this Collection was overdue" />
            </span>
          </span>
        </div>
        <div className="collection-info-item">
          <span className="collection-info-label">Start Date</span>
          <span className="collection-info-value">
            <span className="collection-date">{prettierDate(collection.startDate)}</span>
          </span>
        </div>
      </div>
      <div className="collection-info-right">
        {collection.endDate !== null
          && <div className="collection-info-item">
            <span className="collection-info-label">End Date</span>
            <span className="collection-info-value">
              <span className="collection-date">
                <span>{prettierDate(collection.endDate)}</span>
              </span>
            </span>
          </div>}
        <div className="collection-info-item">
          <span className="collection-info-label">Created Time</span>
          <span className="collection-info-value">
            <span className="collection-date">
              <span className="task-time-content quick-blue-tag tag-data">{prettierTime(collection.createdTime)}</span>
            </span>
          </span>
        </div>
        <div className="collection-info-item">
          <span className="collection-info-label">Updated Time</span>
          <span className="collection-info-value">
            <span className="collection-date">
              <span className="task-time-content quick-blue-tag tag-data">{prettierTime(collection.updatedTime)}</span>
            </span>
          </span>
        </div>
      </div>
    </div>
    {isOwner && showCompleteBtn && <div className="complete-btn-block">
      <button
        className={`complete-btn ${GlobalValidators.nonNull(collection.endDate) ? "btn-disabled" : ""}`}
        disabled={GlobalValidators.nonNull(collection.endDate)}
        onClick={onClickComplete}>
        <Check className="cb-icon" />
        Complete
      </button>
    </div>}
  </div>

}
