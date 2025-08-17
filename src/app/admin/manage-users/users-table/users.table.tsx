'use client'

import React, { JSX, useCallback, useEffect, useMemo, useState } from "react"
import "./users.table.scss"
import GlobalValidators from "@/util/global.validators"
import { DTO_PaginatedDataResponse } from "@/dtos/manage-users.page.dto"
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
import { getColorByCharacter } from "@/app-reused/create-task/task-creation-form/task-creation.form"
import { AuthHelper } from "@/util/auth.helper"
import toast from "react-hot-toast"

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
    page: 1
  })

  const menuAndFuncs = useMemo(() => [
    MenuElementWrapper.withBuilder()
      .bname("View detail")
      .bfunc((data: Record<string, unknown>) => {
        window.location.href = `/${AuthHelper.getRoleFromToken()}/view-user/${data.email}`
      }),
  ], [])

  const onClickSwitchUserStatus = useCallback((id: number, index: number) => {
    async function switchUserStatus() {
      const response = await ManageUsersAPIs.switchAccountStatus(id) as ApiResponse<void>
      if (String(response.status).startsWith("2")) {
        toast.success(response.msg)
        setData(prev => {
          const tempDataList = [...prev.dataList]
          tempDataList[index].status = !tempDataList[index].status
          return {
            ...prev,
            dataList: tempDataList
          }
        })
      }
    }
    switchUserStatus()
  }, [])

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
          <TableHeadCell name="Avatar" />
          <TableHeadCell name="Full Name" />
          <TableHeadCell name="Email" />
          <TableHeadCell name="Department" />
          <TableHeadCell name="Phone" />
          <TableHeadCell name="Identity" />
          <TableHeadCell name="Authorities" />
          <TableHeadCell name="Created Time" />
          <TableHeadCell name="Status" />
          <TableTDMenuHead />
        </TableHeadWrapper>
        <TableBodyWrapper>
          {GlobalValidators.isEmpty(data.dataList)
            ? <TableDataLoading />
            : data.dataList.map((userInfo, ind) => {
              const firstNameChar = userInfo.fullName[0].toUpperCase()
              return <TableRowWrapper key={"tbrw" + ind}>
                <td className="table-cell usi-ava">
                  <span className="virtual-ava" style={getColorByCharacter(firstNameChar)}>
                    {firstNameChar}
                  </span>
                </td>
                <td className="table-cell tb-cell-mullines">{userInfo.fullName}</td>
                <td className="table-cell tb-cell-mullines">{userInfo.email}</td>
                <td className="table-cell tb-cell-mullines">{userInfo.department}</td>
                <td className="table-cell tb-cell-mullines">{userInfo.phone}</td>
                <td className="table-cell tb-cell-mullines">{userInfo.identity}</td>
                <td className="table-cell">
                  {ExtractedRoles(userInfo.authorities)}
                </td>
                <td className="table-cell tb-cell-mullines">{ExtractedTime(userInfo.createdTime)}</td>
                <td className="table-cell">
                  <button className={`user-status status-${userInfo.status + ""}`}
                  onClick={() => onClickSwitchUserStatus(userInfo.id, ind)}
                    onMouseLeave={e => {
                      const btn = e.target as HTMLElement
                      btn.classList.remove(`status-${!userInfo.status + ""}`)
                      btn.classList.add(`status-${userInfo.status + ""}`)
                      btn.textContent = userInfo.status ? "Activated" : "In-activated"
                    }}
                    onMouseEnter={e => {
                      const btn = e.target as HTMLElement
                      btn.classList.remove(`status-${userInfo.status + ""}`)
                      btn.classList.add(`status-${!userInfo.status + ""}`)
                      btn.textContent = !userInfo.status ? "Activate" : "In-activate"
                    }}>
                    {userInfo.status ? "Activated" : "In-activated"}
                  </button>
                </td>
                <TableTDMenuBtn
                  menuId={tableId + "-menu-" + ind}
                  openingMenu={openingMenu}
                  setOpeningMenu={setOpeningMenu}
                  menuAndFuncs={menuAndFuncs}
                  data={{
                    email: userInfo.email
                  }}
                />
              </TableRowWrapper>
            })
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

function ExtractedRoles(scopes: string): JSX.Element[] {
  return scopes.split(",").map((scope, ind) =>
    <span
      key={scope + ind}
      className={`user-role usi-role usi-role-${scope.replace("ROLE_", "").toLowerCase()}`}
    >
      {scope}
    </span>
  )
}

function ExtractedTime(time: string): JSX.Element {
  const extractedTime = time.split(" ");
  return <>
    <span className="quick-green-tag">{extractedTime[0]}</span>
    <span className="quick-green-tag">{extractedTime[1]}</span>
  </>
}