"use client";

import React, { useEffect, useMemo, useState } from "react";
import "./users.table.scss";
import GlobalValidators from "@/util/global.validators";
import { ManageUsersAPIs } from "@/apis/manage-users.page.api";
import { ApiResponse } from "@/apis/general.api";
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
} from "@/components/table.component";
import { DTO_PaginationRequest } from "@/dtos/general.dto";
import {
  DTO_PaginatedDataResponse,
  DTO_ManagedUserInfoResponse,
  DTO_UpdateAccountStatusRequest,
  DTO_UpdateAccountRoleRequest,
} from "@/dtos/manage-users.page.dto";

const USERS_PER_PAGE = 10;

export default function UsersTable() {
  const tableId = useMemo(() => "usif_hist", []);
  const [openingMenu, setOpeningMenu] = useState("");
  const [rawUserList, setRawUserList] = useState<DTO_ManagedUserInfoResponse[]>(
    []
  );
  const [displayedList, setDisplayedList] = useState<
    DTO_ManagedUserInfoResponse[]
  >([]);
  const [tableFields, setTableFields] = useState<string[]>([]);
  const [noResultsFound, setNoResultsFound] = useState(false);

  const [tableState, setTableState] = useState<TableStateWrapper>({
    searchVal: "",
    filterField: "",
    sortedField: "",
    sortedMode: 0,
    page: 1,
    totalPages: 1,
  });

  const ROLE_LABELS: Record<string, string> = {
    ROLE_EMP: "Employee",
    ROLE_LD: "Leader",
    ROLE_PM: "Project Manager",
  };

  const ROLE_OPTIONS = Object.entries(ROLE_LABELS).map(([value, label]) => ({
    value,
    label,
  }));

  const menuAndFuncs = useMemo(
    () => [
      MenuElementWrapper.withBuilder()
        .bname("Go to User Info Page")
        .bfunc((data) => {
          const accountId = data.accountId as number;
          if (accountId) {
            window.location.href = `/emp/user-info/${accountId}`;
          }
        }),
    ],
    []
  );

  async function fetchUsers() {
    const request = DTO_PaginationRequest.fromInterface({
      searchVal: "",
      filterField: "",
      sortedField: "",
      sortedMode: 0,
      page: 1,
      data: {},
    });

    const response = (await ManageUsersAPIs.getPaginatedUsers(
      request
    )) as ApiResponse<DTO_PaginatedDataResponse>;
    const allUsers = response.body.dataList;
    setRawUserList(allUsers);
    setTableFields(Object.keys(allUsers[0] || {}));
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    let result = [...rawUserList];

    // 1. Search
    if (tableState.searchVal) {
      const keyword = tableState.searchVal.toLowerCase();
      result = result.filter(
        (user) =>
          user.fullname.toLowerCase().includes(keyword) ||
          user.email.toLowerCase().includes(keyword) ||
          user.phone.toLowerCase().includes(keyword)
      );
    }

    // 2. Filter
    if (tableState.filterField) {
      result = result.filter((user) => {
        const fieldValue = (user as any)[tableState.filterField];
        return (
          fieldValue !== undefined && fieldValue !== null && fieldValue !== ""
        );
      });
    }

    // 3. Sort
    if (tableState.sortedField && tableState.sortedMode !== 0) {
      result.sort((a, b) => {
        const aVal = (a as any)[tableState.sortedField];
        const bVal = (b as any)[tableState.sortedField];
        if (typeof aVal === "string" && typeof bVal === "string") {
          return tableState.sortedMode === 1
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal);
        }
        return 0;
      });
    }

    const totalPages = Math.ceil(result.length / USERS_PER_PAGE);
    const currentPage = tableState.page;

    // Nếu trang hiện tại vượt quá số trang mới sau khi lọc, reset về trang 1
    if (currentPage > totalPages && totalPages > 0) {
      setTableState((prev) => ({
        ...prev,
        page: 1,
        totalPages,
      }));
      return; // tránh render 2 lần
    }

    const paginatedUsers = result.slice(
      (currentPage - 1) * USERS_PER_PAGE,
      currentPage * USERS_PER_PAGE
    );

    setDisplayedList(paginatedUsers);
    setTableState((prev) => ({
      ...prev,
      totalPages,
    }));
  }, [
    rawUserList,
    tableState.searchVal,
    tableState.filterField,
    tableState.sortedField,
    tableState.sortedMode,
    tableState.page,
  ]);

  const handleToggleStatus = (userInfo: DTO_ManagedUserInfoResponse) => {
    const confirmed = window.confirm(
      `Are you sure you want to ${
        userInfo.status ? "deactivate" : "activate"
      } this user?`
    );
    if (!confirmed) return;

    // Update FE
    // const updated = rawUserList.map((user) =>
    //   user.accountId === userInfo.accountId
    //     ? { ...user, status: !user.status }
    //     : user
    // );
    // setRawUserList(updated);

    // Update BE
    try {
      const request = DTO_UpdateAccountStatusRequest.withBuilder()
        .setId(userInfo.accountId)
        .setStatus(!userInfo.status);

      // const response = await ManageUsersAPIs.updateAccountStatus(request);
      // if (response.success) {
      //   alert("Status updated successfully.");
      //   // fetchUsers();
      // } else {
      //   alert("Failed to update status.");
      // }
    } catch (err) {
      console.error(err);
      alert("Error occurred while updating status.");
    }
  };

  const handleRoleChange = (
    user: DTO_ManagedUserInfoResponse,
    newRole: string
  ) => {
    const confirmed = window.confirm(
      `Are you sure you want to change the role of ${user.email} to ${newRole}?`
    );
    if (!confirmed) return;

    // Update FE
    // const updated = rawUserList.map((u) =>
    //   u.accountId === user.accountId ? { ...u, authorities: newRole } : u
    // );
    // setRawUserList(updated);

    // Update BE
    try {
      const request = DTO_UpdateAccountRoleRequest.withBuilder()
        .setId(user.accountId)
        .setRole(newRole);

      // const response = await ManageUsersAPIs.updateAccountRole(request);
      // if (response.success) {
      //   alert("Role updated successfully.");
      //   fetchUsers();
      // } else {
      //   alert("Failed to update role.");
      // }
    } catch (error) {
      console.error(error);
      alert("Error occurred while updating role.");
    }
  };

  return (
    <div className="customize-table">
      <TableCaption caption="Manage Users" />
      <TableDescription desc="Provide table and tools to manage users information using our system services" />
      <TableSearch
        tableId={tableId}
        setReqData={() => {}}
        tableState={tableState}
        setTableState={setTableState}
        tableFields={tableFields}
      />
      <MainTable>
        <TableHeadWrapper>
          <TableHeadCell name="Avatar" />
          <TableHeadCell name="Email" />
          <TableHeadCell name="Full Name" />
          <TableHeadCell name="Phone" />
          <TableHeadCell name="Department" />
          <TableHeadCell name="Authorities" />
          <TableHeadCell name="Status" />
          <TableTDMenuHead />
        </TableHeadWrapper>
        <TableBodyWrapper>
          {GlobalValidators.isEmpty(displayedList) ? (
            <TableDataLoading />
          ) : (
            displayedList.map((userInfo, index) => (
              <TableRowWrapper key={`tbrw-${index}`}  >
                <td className="table-cell tb-cell-ava">
                  <span className="virtual-ava">
                    {userInfo.fullname[0].toUpperCase()}
                  </span>
                </td>
                <td className="table-cell tb-cell-mullines">
                  {userInfo.email}
                </td>
                <td className="table-cell tb-cell-mullines">
                  {userInfo.fullname}
                </td>
                <td className="table-cell">{userInfo.phone}</td>
                <td className="table-cell">{userInfo.department}</td>
                <td className={`usi-role usi-${userInfo.authorities.toLowerCase().replace("_", "-")}`}>{userInfo.authorities}</td>
                <td className="table-cell">
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={userInfo.status}
                      onChange={() => handleToggleStatus(userInfo)}
                    />
                    <span className="slider round"></span>
                  </label>
                </td>
                <TableTDMenuBtn
                  menuId={`${tableId}-menu-${index}`}
                  openingMenu={openingMenu}
                  setOpeningMenu={setOpeningMenu}
                  menuAndFuncs={menuAndFuncs}
                  data={{
                    email: userInfo.email,
                    accountId: userInfo.accountId,
                  }}
                />
              </TableRowWrapper>
            ))
          )}
        </TableBodyWrapper>
      </MainTable>
      <TablePagination
        totalPages={tableState.totalPages}
        tableState={tableState}
        setTableState={setTableState}
        setReqData={() => {}}
      />
    </div>
  );
}
