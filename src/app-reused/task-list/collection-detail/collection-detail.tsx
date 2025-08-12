'use client'

import HelpContainer from "@/app-reused/help-container/page";
import { checkOverDue, prettierDate, prettierTime } from "@/app-reused/task-detail/task-detail.service";
import { Container, ScrollText } from "lucide-react";
import "./collection-detail.scss";
import { useEffect, useState } from "react";
import { TaskListAPIs } from "@/apis/task-list.page.api";
import { ApiResponse } from "@/apis/general.api";
import { DTO_CollectionDetail } from "@/dtos/task-list.page.dto";

export default function CollectionDetail({ collectionId }: { collectionId: number }) {
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
    // project: {
    //   id: 1,
    //   name: "fsdfsd"
    // },
    // phase: {
    //   id: 1,
    //   name: "fsdfsd"
    // },
    // collection: {
    //   id: 1,
    //   name: "fsdfsd"
    // }
  })

  useEffect(() => {
    async function fetchCollection() {
      const response = await TaskListAPIs.getCollectionDetail(collectionId) as ApiResponse<DTO_CollectionDetail>
      if (String(response.status).startsWith("2")) {
        setCollection(response.body)
      }
    }
    fetchCollection()
  }, [collectionId])

  return <div className="collection-overview general-detail">
    <div className="form-caption">
      <Container className="caption-icon" />
      <span className="caption-content">
        Collection Information<span className="collection-id tag-data quick-green-tag">{collection.id}</span>
      </span>
      <i className="desc-content">Shorten Collection information, and statistic!</i>
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
  </div>

}
