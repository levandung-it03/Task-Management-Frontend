'use client'

import { BookUser, Calendar, Plus, Search, UsersRound } from "lucide-react"
import "./groups-container.page.scss"
import React, { useCallback, useEffect, useMemo, useState } from "react"
import { OverviewedGroupInfo, DTO_PaginatedGroupsResponse } from "@/dtos/groups.page.dto"
import { GroupPageAPIs } from "@/apis/groups.page.api"
import { ApiResponse } from "@/apis/general.api"
import { DTO_PaginationRequest } from "@/dtos/general.dto"
import { RequestDataWrapper, TablePagination, TableStateWrapper } from "@/components/table.component"
import { GroupsPageService } from "./groups-container.service"
import { AuthHelper } from "@/util/auth.helper"
import { GroupCreationDialog } from "./create-group-dialog/create-group.dialog"

export default function GroupsPage() {
  const role = useMemo(() => AuthHelper.getRoleFromToken().toUpperCase(), [])
  const [openDialog, setOpenDialog] = useState(false)

  return <div className="groups-page">
    <div className="groups-page-header form-caption-wrap">
      <div className="form-caption">
        <BookUser className="caption-icon" />
        <span className="caption-content">Groups</span>
        <i className="desc-content">All your related Groups shown here.</i>
      </div>
      {role !== AuthHelper.EMP_ROLE && <div className="create-group-wrapper">
        <button className="cgw-btn" onClick={() => setOpenDialog(true)}>
          <Plus className="cgw-btn-icon" />
          Create Group
        </button>
      </div>}
    </div>
    <GroupsContainer />
    {openDialog && <GroupCreationDialog openDialog={openDialog} setOpenDialog={setOpenDialog} />}
  </div>
}

function GroupsContainer() {
  const [searchVal, setSearchVal] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [tableState, setTableState] = useState<TableStateWrapper>({
    searchVal: "",
    filterField: "",
    sortedField: "",
    sortedMode: 0,
    page: 0,
    totalPages: 0
  })
  const [groups, setGroups] = useState<OverviewedGroupInfo[]>([])
  const [reqData, setReqData] = useState<RequestDataWrapper>({
    searchVal: "",
    filterField: "",
    sortedField: "",
    sortedMode: 0,
    page: 1,
    data: {}
  })

  const onChangeSearchVal = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchVal(e.target.value)
  }, [])

  const onClickSearchGroups = useCallback(() => {
    setReqData(prev => ({ ...prev, page: 1, searchVal }))
  }, [searchVal])

  useEffect(() => {
    async function loadGroups() {
      setIsLoading(true)
      const request = DTO_PaginationRequest.withBuilder()
        .bpage(reqData.page)
        .bsearchVal(reqData.searchVal)

      const response = await GroupPageAPIs.getGroups(request) as ApiResponse<DTO_PaginatedGroupsResponse>
      if (String(response.status).startsWith("2")) {
        setGroups(response.body.dataList)
        setTableState(prev => ({
          ...prev,
          totalPages: response.body.totalPages,
          page: reqData.page
        }))
      }

      setIsLoading(false)
    }
    loadGroups()
  }, [reqData.page, reqData.searchVal])

  return <div className="groups-container">
    <div className="groups-search">
      <input className="gs-inp" name="gs-inp"
        value={searchVal}
        onChange={onChangeSearchVal}
        placeholder="Type Group name..." />
      <button className="gs-submit-btn" onClick={onClickSearchGroups}>
        <Search className="gs-btn-icon" />
      </button>
    </div>
    <div className="group-blocks-wrapper">
      {isLoading
        ? <div className="loading-row">Loading...</div>
        : (groups.length === 0
          ? <div className="loading-row">There is no Group related to you.</div>
          : <>
            {groups.map((group, ind) => <GroupBlock key={`gb-` + ind} group={group} />)}
            <TablePagination
              totalPages={tableState.totalPages}
              tableState={tableState}
              setTableState={setTableState}
              setReqData={setReqData}
            />
          </>
        )
      }
    </div>
  </div>
}

function GroupBlock({ group }: { group: OverviewedGroupInfo }) {
  return <a className="group-block" href={`${window.location.pathname}/${group.id}`}>
    <div className="group-header">
      <h1 className="group-name">{group.name}</h1>
      <span className="group-status">
        <span className={`quick-blue-tag group-active-${group.active}`}>
          {group.active ? "Active" : "Inactive"}
        </span>
      </span>
    </div>
    <div className="group-info">
      <span className="gi-quantity">
        <UsersRound className="gi-quantity-icon gi-icon" />
        {group.userQuantity} members
      </span>
      <span className="gi-created-at">
        <Calendar className="gi-created-at-icon gi-icon" />
        {`Created ${
          GroupsPageService.prettierDateByTime(group.createdTime)
        } by ${
          group.createdByUser.fullName
        }`}
      </span>
    </div>
  </a>
}