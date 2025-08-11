'use client'

import { SquarePlus, X } from "lucide-react"
import "./create-group.dialog.scss"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { ApiResponse } from "@/apis/general.api"
import { extractEmailToGetId, getColorByCharacter } from "@/app-reused/create-task/task-creation-form/task-creation.form"
import { CreateTaskPageAPIs } from "@/apis/create-task.page.api"
import toast from "react-hot-toast"
import GlobalValidators from "@/util/global.validators"
import { DTO_FastUserInfo, DTO_SearchFastUserInfo } from "@/dtos/create-task.page.dto"
import { GroupsPageService } from "../groups-container.service"
import { DTO_GroupRequest } from "@/dtos/groups.page.dto"
import { GroupPageAPIs } from "@/apis/groups.page.api"
import { DTO_IdResponse } from "@/dtos/general.dto"
import { AuthHelper } from "@/util/auth.helper"

export function GroupCreationDialog({ openDialog, setOpenDialog }: {
  openDialog: boolean,
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const [name, setName] = useState("")
  const [addedUsers, setAddedUsers] = useState<Record<string, Record<string, string>>>({})
  const [formTouched, setFormTouched] = useState(false)
  const [formValidation, setFormValidation] = useState({
    name: "",
  })

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

      const request = DTO_GroupRequest.withBuilder()
      .bname(trimmedName)
      .bassignedEmails(Object.entries(addedUsers).map(([key, user]) => user.email))

      const response = await GroupPageAPIs.createGroup(request) as ApiResponse<DTO_IdResponse>
      if (String(response.status)[0] !== "2") {
        return
      }
      toast.success(response.msg)
      const role = AuthHelper.getRoleFromToken()
      window.location.href = `/${role}/groups/${response.body.id}`
    }
    createGroup();
  }, [formValidation, name, addedUsers, formTouched])

  return <div className={`group-creation-dialog ${openDialog ? "" : "hidden"}`}>
    <div ref={overlayRef} className="dialog-overlay"></div>
    <div className="group-container">
      <div className="group-container-header">
        <div className="gch-title">
          <div className="gch-title-wrapper">
            <SquarePlus className="gch-title-icon" />
            <span className="gch-title-text">Create Group</span>
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
            <AddedUsers addedUsers={addedUsers} setAddedUsers={setAddedUsers} />
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
      if (key in prev) {
        const newData = { ...prev }
        delete newData[key]
        return newData
      }
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
          ? <tr><td className="loading-row">Loading...</td></tr>
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
              <td className="usi-dep quick-blue-tag">{user.department}</td>
              <td className={`usi-role usi-${user.role.toLowerCase().replace("_", "-")}`}>{user.role}</td>
            </tr>
          })
        }
      </tbody>
    </table>
  </>
}

function AddedUsers({ addedUsers, setAddedUsers }: {
  addedUsers: Record<string, Record<string, string>>,
  setAddedUsers: React.Dispatch<React.SetStateAction<Record<string, Record<string, string>>>>
}) {
  const [shownInfoMap, setShownInfoMap] = useState<Record<string, boolean>>({})

  const onClickRmAssingedUserTag = useCallback((id: string) => {
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
      : Object.entries(addedUsers).map(([id, user], ind) => {
        const firstNameChar = user.fullName[0].toUpperCase()
        const normalRole = user.role.toLowerCase().replace("_", "-")
        return <li className="added-user-tag" key={"aut-" + ind}>
          <div className={`aut-main-tag aut-main-tag-${normalRole}`}
            onMouseEnter={() => setShownInfoMap(prev => ({ ...prev, [id]: true }))}
            onMouseLeave={() => setShownInfoMap(prev => ({ ...prev, [id]: false }))}
          >
            <span className="aut-mt-email">{user.email}</span>
            <X className="aut-mt-close-icon" onClick={() => onClickRmAssingedUserTag(id)} />
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
      }
      )
    }
  </ul>
}