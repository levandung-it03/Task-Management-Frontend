'use client'

import { CreateTaskPageAPIs } from "@/apis/create-task.page.api"
import { ApiResponse, GeneralAPIs } from "@/apis/general.api"
import { confirm } from "@/app-reused/confirm-alert/confirm-alert"
import { extractEmailToGetId, getColorByCharacter } from "@/app-reused/create-task/task-creation-form/task-creation.form"
import { GroupsPageService } from "@/app-reused/groups/groups-container.service"
import { DTO_FastUserInfo, DTO_SearchFastUserInfo } from "@/dtos/create-task.page.dto"
import { DTO_ChangeGroupRole, DTO_ChangeGroupStatus, DTO_GroupResponse, GroupHasUser } from "@/dtos/groups.page.dto"
import GlobalValidators from "@/util/global.validators"
import { Calendar, CalendarCog, CheckCircle, CircleOff, LogOut, SquarePen, SquarePlus, UserPen, Users, UsersRound, X } from "lucide-react"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import toast from "react-hot-toast"
import { AuthHelper } from "@/util/auth.helper"
import { GroupPageAPIs } from "@/apis/groups.page.api"
import "./group-detail.page.scss"
import { useParams } from "next/navigation"

export default function DetailGroupPage({ groupId }: { groupId: number }) {
  const [isLoading, setIsLoading] = useState(true)
  const [group, setGroup] = useState<DTO_GroupResponse>({
    baseInfo: {
      id: 0,
      createdByUser: {
        fullName: "",
        email: "",
        role: ""
      },
      name: "",
      isActive: false,
      createdTime: "",
      updatedTime: "",
      userQuantity: 0,
    },
    groupHasUsers: []
  })

  useEffect(() => {
    async function fetchGroup() {
      setIsLoading(true)
      const response = await GroupPageAPIs.getGroup(groupId) as ApiResponse<DTO_GroupResponse>
      if (String(response.status)[0] === "2")
        setGroup(response.body)
      setIsLoading(false)
    }
    fetchGroup()
  }, [groupId])

  return <div className="detail-group-page">
    {isLoading
      ? <div className="loading-row">Loading...</div>
      : <GroupInfoContainer group={group} setGroup={setGroup} />
    }
  </div>
}

function GroupInfoContainer({ group, setGroup }: {
  group: DTO_GroupResponse,
  setGroup: React.Dispatch<React.SetStateAction<DTO_GroupResponse>>,
}) {
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false)
  const [groupRoles, setGroupRoles] = useState<string[]>([])

  useEffect(() => {
    async function fetchRoles() {
      const response = await GeneralAPIs.getGroupRoleEnums() as ApiResponse<Record<string, string>>
      if (String(response.status)[0] === "2") {
        setGroupRoles(Object.values(response.body))
        return
      }
    }
    fetchRoles()
  }, [])

  return <>
    <GroupBaseInfo group={group} setOpenDialog={setOpenUpdateDialog} setGroup={setGroup} />
    <ul className="joined-users">
      {group.groupHasUsers.map((user, ind) =>
        <UserTag key={"ju-" + ind} userGroup={user} groupRoles={groupRoles} />
      )}
    </ul>
    {openUpdateDialog &&
      <UpdateGroupBaseInfoDialog
        setOpenDialog={setOpenUpdateDialog}
        group={group} />
    }
  </>
}

function GroupBaseInfo({ group, setOpenDialog, setGroup }: {
  group: DTO_GroupResponse,
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>,
  setGroup: React.Dispatch<React.SetStateAction<DTO_GroupResponse>>,
}) {
  const onClickOpenUpdateDialog = useCallback(() => {
    setOpenDialog(true)
  }, [setOpenDialog])

  const onClickChangeGroupStatus = useCallback((status: boolean) => {
    async function changeStatus() {
      if (!(await confirm("This action cannot be undone. Are you sure?", "Change Group status")))
        return
      const request = DTO_ChangeGroupStatus.withBuilder()
        .bgroupId(group.baseInfo.id)
        .bstatus(status)
      const response = await GroupPageAPIs.changeGroupStatus(request) as ApiResponse<void>
      if (String(response.status)[0] === "2") {
        toast.success(response.msg)
        setGroup(prev => ({
          ...prev,
          baseInfo: {
            ...prev.baseInfo,
            isActive: status
          }
        }))
        return
      }
    }
    changeStatus()
  }, [group.baseInfo.id, setGroup])

  return <div className={`group-base-info group-with-sts-${group.baseInfo.isActive}`}>
    <div className="group-header">
      <h1 className="form-caption">
        <Users className="caption-icon" />
        <span className="caption-content-customized">{group.baseInfo.name}</span>
        <span className="group-status">
          <span className={`quick-tag group-active-${group.baseInfo.isActive}`}>
            {group.baseInfo.isActive ? "Active" : "Inactive"}
          </span>
        </span>
        {isAdminLoggingIn(group.groupHasUsers) && <div className="group-buttons">
          {group.baseInfo.isActive
            ? <button className="inactive-group" onClick={() => onClickChangeGroupStatus(false)}>
              <CircleOff className="gb-icon" /> Inactive
            </button>
            : <button className="active-group" onClick={() => onClickChangeGroupStatus(true)}>
              <CheckCircle className="gb-icon" /> Active
            </button>}
          <button className="update-base-info" onClick={onClickOpenUpdateDialog}>
            <SquarePen className="ubi-icon" />
          </button>
        </div>}
      </h1>
    </div>
    <div className="group-info">
      <span className="gi-created-by">
        <UserPen className="gi-quantity-icon gi-icon" />
        By {group.baseInfo.createdByUser.fullName}
        <span className="created-by-email">{group.baseInfo.createdByUser.email}</span>
      </span>
      <span className="gi-quantity">
        <UsersRound className="gi-quantity-icon gi-icon" />
        {group.baseInfo.userQuantity} members
      </span>
      <span className="gi-created-at">
        <Calendar className="gi-created-at-icon gi-icon" />
        Created {GroupsPageService.prettierDateByTime(group.baseInfo.createdTime)}
      </span>
      <span className="gi-updated-at">
        <CalendarCog className="gi-updated-at-icon gi-icon" />
        Updated at {GroupsPageService.prettierDateByTime(group.baseInfo.updatedTime)}
      </span>
    </div>
  </div>
}

function UserTag({ userGroup, groupRoles }: {
  userGroup: GroupHasUser,
  groupRoles: string[]
}) {
  const tagRef = useRef<HTMLLIElement>(null)
  const [role, setRole] = useState(userGroup.role)
  const firstNameChar = useMemo(() => userGroup.joinedUser.fullName[0].toUpperCase(), [userGroup.joinedUser.fullName])
  const onChangeGroupRole = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    async function changeRole() {
      const newRole = e.target.value  //--Copy the value to make it work correctly (changing-value is hold by async)
      if (!(await confirm("This change cannot be undone. Are you sure?")))
        return
      const request = DTO_ChangeGroupRole.withBuilder()
        .buserGroupId(userGroup.id)
        .brole(newRole)
      const response = await GroupPageAPIs.changeUserGroupRole(request) as ApiResponse<void>
      if (String(response.status)[0] === "2") {
        toast.success(response.msg)
        setRole(newRole)
        return
      }
    }
    changeRole()
  }, [userGroup.id])

  const onClickKickUser = useCallback(() => {
    async function kickUser() {
      if (!(await confirm("This action cannot be undone. Are you sure?", "Kick User out")))
        return
      const response = await GroupPageAPIs.kickUserOut(userGroup.id) as ApiResponse<void>
      if (String(response.status)[0] === "2") {
        toast.success(response.msg)
        tagRef.current?.remove()
        return
      }
    }
    kickUser()
  }, [])

  return <li ref={tagRef} className="joined-user">
    <a className="ju-wrapper" href={``}>
      <span className="ju-ava" style={getColorByCharacter(firstNameChar)}>{firstNameChar}</span>
      <span className="ju-full-name">{userGroup.joinedUser.fullName}</span>
      <span className="ju-email">{userGroup.joinedUser.email}</span>
      <span className={`ju-tags ju-${userGroup.joinedUser.role.toLowerCase().replace("_", "-")}`}>
        {userGroup.joinedUser.role}
      </span>
    </a>
    <select
      value={role}
      className={`ju-tags ju-${role.toLowerCase().replace("_", "-")}`}
      onChange={onChangeGroupRole}
    >
      {groupRoles.map((role, ind) =>
        <option key={"jut-" + ind} value={role} className="jut-group-role-opt">
          {role}
        </option>
      )}
    </select>
    <button className="ju-tags kick-user-btn" onClick={onClickKickUser}>
      <LogOut className="kub-icon" />Kick
    </button>
  </li>
}

function UpdateGroupBaseInfoDialog({ setOpenDialog, group }: {
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>,
  group: DTO_GroupResponse
}) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const [addedUsers, setAddedUsers] = useState<Record<string, Record<string, string>>>({})
  const [name, setName] = useState("")
  const [formTouched, setFormTouched] = useState(false)
  const [formValidation, setFormValidation] = useState({
    name: "",
  })
  const existingUsers = useMemo(() => group.groupHasUsers.reduce((acc, groupUser) => ({
    ...acc,
    [extractEmailToGetId(groupUser.joinedUser.email)]: {
      email: groupUser.joinedUser.email,
      fullName: groupUser.joinedUser.fullName,
      role: groupUser.joinedUser.role
    }
  }), {}), [group.groupHasUsers])

  const onClickCloseDialog = useCallback(() => setOpenDialog(false), [setOpenDialog])

  const onChangeName = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
    setFormTouched(true)
    setFormValidation(prev => ({ ...prev, name: GroupsPageService.isValidGroupName(e.target.value.trim()) }))
  }, [])

  const onClickSubmitBtn = useCallback(() => {
    async function createGroup() {
      const trimmedName = name.trim()

      if (GlobalValidators.isInvalidValidation(formTouched, formValidation))
        return

      // const request = DTO_UpdateGroup.withBuilder()
      //   .bgroupId(group.baseInfo.id)
      //   .bname(trimmedName)
      //   .bassignedEmails(Object.entries(addedUsers).map(([key, user]) => user.email))

      // const response = await GroupPageAPIs.updateGroup(request) as ApiResponse<DTO_IdResponse>
      // if (String(response.status)[0] === "2") {
      //   toast.success(response.msg)
      //   window.location.reload()
      //   return
      // }
    }
    createGroup();
  }, [formValidation, name])

  useEffect(() => setAddedUsers(existingUsers), [existingUsers])
  useEffect(() => setName(group.baseInfo.name), [group.baseInfo.name])

  return <div className="group-updating-dialog">
    <div ref={overlayRef} className="dialog-overlay"></div>
    <div className="group-container">
      <div className="group-container-header">
        <div className="gch-title">
          <div className="gch-title-wrapper">
            <SquarePlus className="gch-title-icon" />
            <span className="gch-title-text">Update Group Info</span>
          </div>
          <div className="close-btn-wrapper">
            <X className="close-btn-icon" onClick={onClickCloseDialog} />
          </div>
        </div>
      </div>
      <div className="group-container-desc">
        <i className="gch-desc-text">Fill these fields to create Group (all added Users have default <b>Member</b> Role).</i>
      </div>
      <div className="group-info">
        <div className="form-group-container">
          <fieldset className="form-group">
            <legend className="form-label">Name</legend>
            <input id="name" className="form-input" placeholder="Type Group Name" required
              value={name} onChange={onChangeName} />
          </fieldset>
          {GlobalValidators.notEmpty(formValidation.name) && <span className="input-err-msg">{formValidation.name}</span>}
        </div>

        <div className="form-group-container search-user-container">
          <fieldset className="form-group">
            <legend className="form-label">Search User</legend>
            <SearchUserToAdd addedUsers={addedUsers} setAddedUsers={setAddedUsers} />
          </fieldset>
        </div>

        <div className="form-group-container added-for-container">
          <fieldset className="form-group">
            <legend className="form-label">Added Users</legend>
            <AddedUsers existingUsers={existingUsers} addedUsers={addedUsers} setAddedUsers={setAddedUsers} />
          </fieldset>
        </div>

        <button type="button" className="submit-btn" onClick={onClickSubmitBtn}>Create</button>
      </div>
    </div>
  </div>
}

function SearchUserToAdd({ addedUsers, setAddedUsers }: {
  addedUsers: Record<string, Record<string, string>>,
  setAddedUsers: React.Dispatch<React.SetStateAction<Record<string, Record<string, string>>>>
}) {
  const searchUserRef = useRef<HTMLInputElement>(null)
  const searchedUsersRef = useRef<HTMLTableElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [searchedUsers, setSearchedUsers] = useState<DTO_FastUserInfo[]>([])
  const [searchUser, setSearchUser] = useState("")
  const [isOpenSearchUser, setIsOpenSearchUser] = useState(false)

  const onChangeSearchUser = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    async function searchUser() {
      setIsLoading(true)
      const value = e.target.value
      setSearchUser(value)

      if (value.trim().length === 0) {
        setSearchedUsers([])
        setIsLoading(false)
        return
      }
      const request = DTO_SearchFastUserInfo.withBuilder().bquery(value)
      const response = await CreateTaskPageAPIs.fastSearchUsers(request) as ApiResponse<DTO_FastUserInfo[]>
      if (response.status !== 200) {
        toast.error(response.msg)
      } else {
        setSearchedUsers(response.body)
      }
      setIsLoading(false)
    }
    searchUser()
  }, [])

  const onFocusSearchUser = useCallback(() => setIsOpenSearchUser(true), [])

  const toggleAddRemoveAddedUser = useCallback((user: DTO_FastUserInfo) => {
    setAddedUsers(prev => {
      const key = extractEmailToGetId(user.email)
      if (key in prev)
        return prev //--Do not remove it in search user (cannot remove existing-users on this UI)
      else
        return {
          ...prev, [key]: {
            email: user.email,
            fullName: user.fullName,
            role: user.role
          }
        }
    })
  }, [setAddedUsers])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchUserRef.current && !searchUserRef.current.contains(event.target as Node)
        && searchedUsersRef.current && !searchedUsersRef.current.contains(event.target as Node)
      ) {
        setIsOpenSearchUser(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, []);

  return <>
    <input type="text" id="searchUser" className="form-input" placeholder="Type name/email..." autoComplete="off"
      ref={searchUserRef} value={searchUser}
      onChange={onChangeSearchUser}
      onFocus={onFocusSearchUser} />
    <table ref={searchedUsersRef} className={`searched-users-container${isOpenSearchUser ? "" : " hidden"}`}>
      <thead></thead>
      <tbody className="searched-users">
        {isLoading
          ? <tr className="loading-row"><td>Loading...</td></tr>
          : searchedUsers.map((user, ind) => {
            const firstNameChar = user.fullName[0].toUpperCase()
            return <tr
              key={"usi-" + ind}
              className={`user-short-info${(extractEmailToGetId(user.email) in addedUsers) ? " user-short-info-selected" : ""}`}
              onClick={() => toggleAddRemoveAddedUser(user)}
            >
              <td className="usi-ava" style={getColorByCharacter(firstNameChar)}>{firstNameChar}</td>
              <td className="usi-full-name">{user.fullName}</td>
              <td className="usi-email">{user.email}</td>
              <td className={`usi-role usi-${user.role.toLowerCase().replace("_", "-")}`}>{user.role}</td>
            </tr>
          })
        }
      </tbody>
    </table>
  </>
}

function AddedUsers({ existingUsers, addedUsers, setAddedUsers }: {
  existingUsers: Record<string, Record<string, string>>,
  addedUsers: Record<string, Record<string, string>>,
  setAddedUsers: React.Dispatch<React.SetStateAction<Record<string, Record<string, string>>>>
}) {
  const [shownInfoMap, setShownInfoMap] = useState<Record<string, boolean>>({})

  const onClickRmAddedUserTag = useCallback((id: string) => {
    setAddedUsers(prev => {
      const newData = { ...prev }
      delete newData[id]
      return newData
    })
  }, [setAddedUsers])

  useEffect(() => {
    setShownInfoMap(
      Object.entries(addedUsers).reduce<Record<string, boolean>>((acc, pair) => {
        acc[pair[0]] = false;
        return acc;
      }, {})
    );
  }, [addedUsers])

  return <ul className="added-users">
    {Object.keys(addedUsers).length === 0
      ? <li className="added-user-tag direction-tag">
        Assigned Users <i className="direction-tag">(blank for Root Task)</i>
      </li>
      : Object.entries(addedUsers)
        .filter(([id, user]) => !(id in existingUsers))
        .map(([id, user], ind) => {
          const firstNameChar = user.fullName[0].toUpperCase()
          const normalRole = user.role.toLowerCase().replace("_", "-")
          return <li className="added-user-tag" key={"aut-" + ind}>
            <div className={`aut-main-tag aut-main-tag-${normalRole}`}
              onMouseEnter={() => setShownInfoMap(prev => ({ ...prev, [id]: true }))}
              onMouseLeave={() => setShownInfoMap(prev => ({ ...prev, [id]: false }))}
            >
              <span className="aut-mt-email">{user.email}</span>
              <X className="aut-mt-close-icon" onClick={() => onClickRmAddedUserTag(id)} />
            </div>
            <div className={`aut-full-info ${shownInfoMap[id] ? "" : "hidden"}`}>
              <div className="user-short-info">
                <span className="usi-ava" style={getColorByCharacter(firstNameChar)}>{firstNameChar}</span>
                <span className="usi-full-name">{user.fullName}</span>
                <span className="usi-email">{user.email}</span>
                <span className={`usi-role usi-${normalRole}`}>{user.role}</span>
              </div>
            </div>
          </li>
        })
    }
  </ul>
}

function isAdminLoggingIn(groupHasUsers: GroupHasUser[]) {
  return groupHasUsers.some(groupUser =>
    AuthHelper.extractToken(AuthHelper.getAccessTokenFromCookie() || "").sub === groupUser.joinedUser.email
    && groupUser.role.toUpperCase().includes("ADMIN")
  )
}