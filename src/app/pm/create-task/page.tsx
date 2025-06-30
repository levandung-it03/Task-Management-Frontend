'use client'

import { useCallback, useEffect, useRef, useState } from "react"
import "./page.scss"
import TaskInfoForm from "./task-info-form/task-info.form"
import { LoginValidators } from "@/app/auth/login/page.services"
import GlobalValidators from "@/util/global.validators"
import { FileIcon } from "@/assets/file.icon"
import { CreateTaskPageAPIs } from "@/apis/create-task.page.api"
import { DTO_FastUserInfo, DTO_SearchFastUserInfo } from "@/dtos/create-task.page.api"
import { ApiResponse } from "@/apis/general.api"
import toast from "react-hot-toast"

export interface TaskInfo {
  deadline: string,
  assignedUsers: string[],
  description: string,
  reportFormat: string | null
}
export interface UserSelectedTag {
  id: string,
  data: {
    username: string,
    fullName: string,
    role: string
  }
}

interface SearchUserToAssignProps {
  setAssignedUsers: React.Dispatch<React.SetStateAction<Record<string, Record<string, string>>>>;
  assignedUsers: Record<string, Record<string, string>>;
}

export default function PMCreateTask() {
  const [deadline, setDeadline] = useState("")
  const [assignedUsers, setAssignedUsers] = useState<Record<string, Record<string, string>>>({})
  const [description, setDescription] = useState("")
  const [reportFormat, setReportFormat] = useState("")
  const [formValidation, setFormValidation] = useState({
    deadline: "",
    assignedUsers: "",
    description: "",
    reportFormat: "",
  })

  const onChangeDeadline = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setDeadline(e.target.value)
    setFormValidation(prev => ({ ...prev, deadline: LoginValidators.isValidDeadline(e.target.value) }))
  }, [])

  return <div className="pm-create-task">
    <form className="task-info-form">
      <div className="task-info-form-container">
        <div className="form-caption">
          <FileIcon className="caption-icon" />
          <span className="caption-content">Task Assigning</span>
        </div>

        <div className="form-group-container">
          <fieldset className="form-group">
            <legend className="form-label">Deadline</legend>
            <input type="date" id="deadline" className="form-input" placeholder="Type Deadline" required
              value={deadline} onChange={onChangeDeadline} />
          </fieldset>
          {GlobalValidators.notEmpty(formValidation.deadline) && <span className="input-err-msg">{formValidation.deadline}</span>}
        </div>

        <div className="form-group-container search-user-container">
          <fieldset className="form-group">
            <legend className="form-label">Search User</legend>
            <SearchUserToAssign assignedUsers={assignedUsers} setAssignedUsers={setAssignedUsers} />
          </fieldset>
        </div>

        <div className="form-group-container assign-for-container">
          <fieldset className="form-group">
            <legend className="form-label">Assigned Users</legend>
            <AssignedUsers />
          </fieldset>
        </div>

        {/* <div className="form-group-container half-form-right-container half-form-left-container">
          <fieldset className="form-group">
            <legend className="form-label">Birthday</legend>
            <input type="date" id="dob" className="form-input" required value={dob} onChange={onChangeDob} />
          </fieldset>
          {GlobalValidators.notEmpty(userInfoValidation.dob) && <span className="input-err-msg">{userInfoValidation.dob}</span>}
        </div> */}

        <button type="submit" className="submit-btn">Update</button>
      </div>
    </form>
  </div>
}

function SearchUserToAssign({ assignedUsers, setAssignedUsers }: SearchUserToAssignProps) {
  const searchUserRef = useRef<HTMLInputElement>(null)
  const searchedUsersRef = useRef<HTMLTableElement>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [searchedUsers, setSearchedUsers] = useState<DTO_FastUserInfo[]>([])
  const [searchUser, setSearchUser] = useState("")
  const [isOpenSearchUser, setIsOpenSearchUser] = useState(false)

  const onChangeSearchUser = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    async function searchUser() {
      setIsSearching(true)
      const value = e.target.value
      setSearchUser(value)

      if (value.trim().length === 0) {
        setSearchedUsers([])
        setIsSearching(false)
        return
      }
      const request = DTO_SearchFastUserInfo.withBuilder().bquery(value)
      const response = await CreateTaskPageAPIs.fastSearchUsers(request) as ApiResponse<DTO_FastUserInfo[]>
      if (response.status !== 200) {
        toast.error(response.msg)
        setIsSearching(false)
        return
      }
      setSearchedUsers(response.body)
      setIsSearching(false)
    }
    searchUser()
  }, [])

  const onFocusSearchUser = useCallback(() => setIsOpenSearchUser(true), [])

  const toggleAddRemoveAssignedUser = useCallback((user: DTO_FastUserInfo) => {
    setAssignedUsers(prev => {
      const key = extractEmailToGetId(user.username)
      if (key in prev) {
        delete prev[key]
        return prev
      }
      else
        return {...prev, [key]: {
          username: user.username,
          fullName: user.fullName,
          role: user.role
        }}
    })
  }, [])

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
    <input type="text" id="searchUser" className="form-input" placeholder="Who is in charge?" autoComplete="off"
      ref={searchUserRef} value={searchUser}
      onChange={onChangeSearchUser}
      onFocus={onFocusSearchUser} />
    <table ref={searchedUsersRef} className={`searched-users-container${isOpenSearchUser ? "" : " hidden"}`}>
      <thead></thead>
      <tbody className="searched-users">
        {isSearching
          ? <tr className="loading-row"><td>Loading...</td></tr>
          : searchedUsers.map((user, ind) => {
            const firstNameChar = user.fullName[0].toUpperCase()
            return <tr
              key={"usi-" + ind}
              className={`user-short-info${(extractEmailToGetId(user.username) in assignedUsers) ? " user-short-info-selected" : ""}`}
              onClick={() => toggleAddRemoveAssignedUser(user)}
            >
              <td
                className="usi-ava" style={getColorByCharacter(firstNameChar)}
                onClick={() => toggleAddRemoveAssignedUser(user)}>{firstNameChar}</td>
              <td className="usi-full-name" onClick={() => toggleAddRemoveAssignedUser(user)}>{user.fullName}</td>
              <td className="usi-username" onClick={() => toggleAddRemoveAssignedUser(user)}>{user.username}</td>
              <td
                className={`usi-role uri-${user.role.toLowerCase().replace("_", "-")}`}
                onClick={() => toggleAddRemoveAssignedUser(user)}>{user.role}</td>
            </tr>
          })
        }
      </tbody>
    </table>
  </>
}

function getColorByCharacter(character: string): Record<string, string> {
  const colors = [
    { backgroundColor: '#f44336', color: '#fff' }, // A
    { backgroundColor: '#e91e63', color: '#fff' }, // B
    { backgroundColor: '#9c27b0', color: '#fff' }, // C
    { backgroundColor: '#673ab7', color: '#fff' }, // D
    { backgroundColor: '#3f51b5', color: '#fff' }, // E
    { backgroundColor: '#2196f3', color: '#fff' }, // F
    { backgroundColor: '#03a9f4', color: '#000' }, // G
    { backgroundColor: '#00bcd4', color: '#000' }, // H
    { backgroundColor: '#009688', color: '#fff' }, // I
    { backgroundColor: '#4caf50', color: '#fff' }, // J
    { backgroundColor: '#8bc34a', color: '#000' }, // K
    { backgroundColor: '#cddc39', color: '#000' }, // L
    { backgroundColor: '#ffeb3b', color: '#000' }, // M
    { backgroundColor: '#ffc107', color: '#000' }, // N
    { backgroundColor: '#ff9800', color: '#000' }, // O
    { backgroundColor: '#ff5722', color: '#fff' }, // P
    { backgroundColor: '#795548', color: '#fff' }, // Q
    { backgroundColor: '#607d8b', color: '#fff' }, // R
    { backgroundColor: '#9e9e9e', color: '#000' }, // S
    { backgroundColor: '#000000', color: '#fff' }, // T
    { backgroundColor: '#1abc9c', color: '#000' }, // U
    { backgroundColor: '#2ecc71', color: '#000' }, // V
    { backgroundColor: '#3498db', color: '#fff' }, // W
    { backgroundColor: '#9b59b6', color: '#fff' }, // X
    { backgroundColor: '#e67e22', color: '#fff' }, // Y
    { backgroundColor: '#e74c3c', color: '#fff' }  // Z
  ];

  const index = character.toUpperCase().charCodeAt(0) - 65; // A=0
  return colors[index % colors.length] || { backgroundColor: '#ccc', color: '#000' };
}

function extractEmailToGetId(username: string): string {
  return username.slice(0, username.indexOf("@"))
}

function AssignedUsers() {
  return <></>
}