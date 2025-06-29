'use client'

import React, { JSX, useEffect, useMemo, useState } from "react"
import "./users.table.scss"
import { GeneralTools } from "@/util/general.helper"
import GlobalValidators from "@/util/global.validators"
import { DTO_PaginatedDataResponse } from "@/dtos/manage-users.page"
import { ManageUsersAPIs } from "@/apis/manage-users.page.api"
import { ApiResponse } from "@/apis/general.api"
import {
  MenuElementWrapper,
  TablePagination,
  TableSearch,
  TableStateWrapper,
  TableTDMenuHead,
  TableTDMenuBtn,
  TableCaption,
  TableDescription,
  TableHeadWrapper,
  TableBodyWrapper,
  TableHeadCell,
  MainTable,
  TableDataLoading,
  TableRowWrapper,
  RequestDataWrapper
} from "@/components/table.component"
import { DTO_PaginationRequest } from "@/dtos/general.dto"

export default function UsersTable() {
  const tableId = useMemo(() => "usif_hist", [])
  const [openingMenu, setOpeningMenu] = useState("")
  const [data, setData] = useState<DTO_PaginatedDataResponse>({
    totalPages: 1,
    dataList: []
  })
  const [tableFields, setTableFields] = useState<string[]>([])
  const [tableState, setTableState] = useState<TableStateWrapper>({
    searchVal: "",
    filterField: "",
    sortedField: "",
    sortedMode: 0,
    page: 1,
    totalPages: 1
  })
  const [reqData, setReqData] = useState<RequestDataWrapper>({
    searchVal: "",
    filterField: "",
    sortedField: "",
    sortedMode: 0,
    page: 1,
    data: {}
  })

  const menuAndFuncs = useMemo(() => [
    MenuElementWrapper.withBuilder()
      .bname("Show Coins Histories")
      .bfunc((data: Record<string, unknown>) => {
        console.log("Histories Showed", data)
      }),
    MenuElementWrapper.withBuilder()
      .bname("Print User Info PDF")
      .bfunc((data: Record<string, unknown>) => {
        console.log("Print PDF Successfully", data)
      }),
  ], [])

  useEffect(() => {
    async function init() {
      const request = DTO_PaginationRequest.fromInterface(reqData)
      const response = await ManageUsersAPIs.getPaginatedUsers(request) as ApiResponse<DTO_PaginatedDataResponse>
      setData(response.body)
      setTableState(prev => ({
        ...prev,
        page: reqData.page,
        totalPages: response.body.totalPages
      }))
      setTableFields([...Object.keys(response.body.dataList[0])])
    }
    init()
  }, [reqData])

  return (
    <div className="customize-table">
      <TableCaption caption={"Manage Users"} />
      <TableDescription desc={"Provide table and tools to manage users information using our system services"} />
      <TableSearch
        tableId={tableId}
        setReqData={setReqData}
        tableState={tableState}
        setTableState={setTableState}
        tableFields={tableFields}
      />
      <MainTable>
        <TableHeadWrapper>
          <TableHeadCell name={"Avatar"} />
          <TableHeadCell name={"Username"} />
          <TableHeadCell name={"Service"} />
          <TableHeadCell name={"Authorities"} />
          <TableHeadCell name={"Created Time"} />
          <TableHeadCell name={"Full Name"} />
          <TableHeadCell name={"Coins"} />
          <TableHeadCell name={"Birthday"} />
          <TableHeadCell name={"Gender"} />
          <TableHeadCell name={"Status"} />
          <TableTDMenuHead />
        </TableHeadWrapper>
        <TableBodyWrapper>
          {GlobalValidators.isEmpty(data.dataList)
            ? <TableDataLoading />
            : data!.dataList.map((userInfo, ind) => (
              <TableRowWrapper key={"tbrw" + ind} props={{}}>
                <td className="table-cell tb-cell-ava">
                  <span className="virtual-ava">{userInfo.fullName[0].toUpperCase()}</span>
                </td>
                <td className="table-cell tb-cell-mullines">{userInfo.username}</td>
                <td className="table-cell">{GeneralTools.capitalize(userInfo.oauth2ServiceEnum)}</td>
                <td className="table-cell">
                  {extractRoles(userInfo.authorities)}
                </td>
                <td className="table-cell tb-cell-mullines">{userInfo.createdTime}</td>
                <td className="table-cell tb-cell-mullines">{userInfo.fullName}</td>
                <td className="table-cell">{userInfo.coins}</td>
                <td className="table-cell">{userInfo.dob}</td>
                <td className="table-cell">
                  <span className="quick-tag">{GeneralTools.capitalize(userInfo.gender)}</span>
                </td>
                <td className="table-cell">
                  <button className={`user-status status-${userInfo.active + ""}`}
                    onMouseLeave={e => {
                      const btn = e.target as HTMLElement
                      btn.classList.remove(`status-${!userInfo.active + ""}`)
                      btn.classList.add(`status-${userInfo.active + ""}`)
                      btn.textContent = userInfo.active ? "Activated" : "In-activated"
                    }}
                    onMouseEnter={e => {
                      const btn = e.target as HTMLElement
                      btn.classList.remove(`status-${userInfo.active + ""}`)
                      btn.classList.add(`status-${!userInfo.active + ""}`)
                      btn.textContent = !userInfo.active ? "Activate" : "In-activate"
                    }}>
                    {userInfo.active ? "Activated" : "In-activated"}
                  </button>
                </td>
                <TableTDMenuBtn
                  menuId={tableId + "-menu-" + ind}
                  openingMenu={openingMenu}
                  setOpeningMenu={setOpeningMenu}
                  menuAndFuncs={menuAndFuncs}
                  data={{
                    username: userInfo.username,
                    authorities: userInfo.authorities
                  }}
                />
              </TableRowWrapper>
            ))
          }
        </TableBodyWrapper>
      </MainTable>
      <TablePagination
        totalPages={data.totalPages}
        tableState={tableState}
        setTableState={setTableState}
        setReqData={setReqData}
        />
    </div>
  )
}

function extractRoles(scopes: string): JSX.Element[] {
  return scopes.split(",").map((scope, ind) => {
    const role = scope.split("ROLE_")[1].toLowerCase()
    return <span key={scope + ind} className="user-role quick-tag">{role}</span>
  })
}