'use client'

import { useCallback, useEffect, useRef, useState } from "react"
import "./task-creation.form.scss"
import GlobalValidators from "@/util/global.validators"
import { FileIcon } from "@/assets/file.icon"
import { CreateTaskPageAPIs } from "@/apis/create-task.page.api"
import { ApiResponse, GeneralAPIs } from "@/apis/general.api"
import toast from "react-hot-toast"
import { X } from "lucide-react"
import { CreateTaskPageValidators } from "../page.service"
import HelpContainer from "@/app-reused/help-container/page"
import { TextEditor } from "@/app-reused/text-editor/text-editor"
import { GeneralTools } from "@/util/general.helper"
import { DTO_FastUserInfo, DTO_SearchFastUserInfo, DTO_TaskRequest } from "@/dtos/create-task.page.dto"

export interface TaskInfo {
  deadline: string,
  assignedUsers: string[],
  description: string,
  reportFormat: string | null
}

export interface UserSelectedTag {
  id: string,
  data: {
    email: string,
    fullName: string,
    role: string
  }
}

interface SearchUserToAssignProps {
  rootId: number | undefined
  setHistories: (snapshot: Record<string, Record<string, string>>) => void;
  setAssignedUsers: React.Dispatch<React.SetStateAction<Record<string, Record<string, string>>>>;
  assignedUsers: Record<string, Record<string, string>>;
}

interface TaskCreationFormProps {
  rootId: number | undefined;
  assignedUsersHist: Record<string, Record<string, string>>;
  setAssignedUsers: React.Dispatch<React.SetStateAction<Record<string, Record<string, string>>>>;
  assignedUsers: Record<string, Record<string, string>>;
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
  canUndo: boolean;
  setCanUndo: React.Dispatch<React.SetStateAction<boolean>>;
  setHistories: (snapshot: Record<string, Record<string, string>>) => void;
}

export function TaskCreationForm({
  rootId,
  assignedUsers,
  setAssignedUsers,
  setOpenDialog,
  canUndo,
  setCanUndo,
  assignedUsersHist,
  setHistories
}: TaskCreationFormProps) {
  const [deadline, setDeadline] = useState("")
  const [startDate, setStartDate] = useState("")
  const [description, setDescription] = useState("")
  const [reportFormat, setReportFormat] = useState("")
  const [levelList, setLevelList] = useState<string[]>([])
  const [level, setLevel] = useState("")
  const [priorityList, setPriorityList] = useState<string[]>([])
  const [priority, setPriority] = useState("")
  const [taskTypeList, setTaskTypeList] = useState<string[]>([])
  const [taskType, setTaskType] = useState("")
  const [formTouched, setFormTouched] = useState(false)
  const [formValidation, setFormValidation] = useState({
    deadline: "",
    startDate: "",
  })

  const onChangeDeadline = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setDeadline(e.target.value)
    setFormTouched(true)
    setFormValidation(prev => ({ ...prev, deadline: CreateTaskPageValidators.isValidDeadline(e.target.value) }))
  }, [])

  const onChangeStartDate = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(e.target.value)
    setFormTouched(true)
    setFormValidation(prev => ({ ...prev, startDate: CreateTaskPageValidators.isValidDeadline(e.target.value) }))
  }, [])

  const onClickUndoBtn = useCallback(() => {
    setAssignedUsers(assignedUsersHist)
    setCanUndo(false)
  }, [assignedUsersHist, setAssignedUsers, setCanUndo])

  const onChangeLevel = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setLevel(e.target.value)
  }, [])

  const onChangePriority = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setPriority(e.target.value)
  }, [])

  const onChangeTaskType = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setTaskType(e.target.value)
  }, [])

  const onClickSubmitBtn = useCallback(() => {
    async function createTask() {
      const formattedDeadline = new Date(deadline)
      const formattedStartDate = new Date(startDate)
      const trimmedDescription = description.trim()
      const trimmedReportFormat = reportFormat.trim()

      if (GlobalValidators.isEmpty(deadline)
        || GlobalValidators.isEmpty(startDate)
        || formattedDeadline < new Date()
        || formattedDeadline < formattedStartDate) {
        toast.error("Check for error dates")
        return
      }

      if (GlobalValidators.isEmpty(trimmedDescription)
        || GlobalValidators.isEmpty(trimmedReportFormat)
        || Object.keys(assignedUsers).length === 0
      ) {
        toast.error("Please fill all required fields correctly")
        return
      }

      if (GlobalValidators.isInvalidValidation(formTouched, formValidation))
        return

      const request = DTO_TaskRequest.withBuilder()
        .bdeadline(deadline)
        .bstartDate(startDate)
        .blevel(level)
        .bpriority(priority)
        .btaskType(taskType)
        .bassignedEmails(Object.entries(assignedUsers).map(([key, user]) => user.email))
        .bdescription(trimmedDescription)
        .breportFormat(trimmedReportFormat)

      const response = !rootId
        ? await CreateTaskPageAPIs.createTask(request) as ApiResponse<Record<string, string>>
        : await CreateTaskPageAPIs.createSubTask(rootId, request) as ApiResponse<Record<string, string>>
      // if (String(response.status)[0] === "2") {
        // toast.success(response.msg)
        // const role = AuthHelper.getRoleFromToken()
        // window.location.href = `${role}/task/${response.body.id}`
      // }
    }
    createTask();
  }, [rootId, startDate, deadline, description, reportFormat, level, priority, taskType, assignedUsers, formValidation])

  useEffect(() => {
    async function initValues() {
      const levelsResponse = await GeneralAPIs.getTaskLevelEnums() as ApiResponse<string[]>
      if (String(levelsResponse.status)[0] === "2")
        setLevelList(levelsResponse.body)

      const prioritiesResponse = await GeneralAPIs.getTaskPriorityEnums() as ApiResponse<string[]>
      if (String(prioritiesResponse.status)[0] === "2")
        setPriorityList(prioritiesResponse.body)

      const taskTypesResponse = await GeneralAPIs.getTaskTypeEnums() as ApiResponse<string[]>
      if (String(taskTypesResponse.status)[0] === "2")
        setTaskTypeList(taskTypesResponse.body)
    }
    initValues()
  }, [])

  return <form className="task-info-form">
    <div className="task-info-form-container">
      <div className="form-caption">
        <FileIcon className="caption-icon" />
        <span className="caption-content">Task Assigning</span>
        <i className="desc-content">Fill these information to create a Task and assign Users.</i>
      </div>

      <div className="form-group-container half-form-left-container">
        <fieldset className="form-group">
          <legend className="form-label">Deadline</legend>
          <input type="date" id="deadline" className="form-input" placeholder="Type Deadline" required
            value={deadline} onChange={onChangeDeadline} />
        </fieldset>
        {GlobalValidators.notEmpty(formValidation.deadline) && <span className="input-err-msg">{formValidation.deadline}</span>}
      </div>

      <div className="form-group-container half-form-right-container">
        <fieldset className="form-group">
          <legend className="form-label">Start Date</legend>
          <input type="date" id="start-date" className="form-input" placeholder="Type Start Date" required
            value={startDate} onChange={onChangeStartDate} />
        </fieldset>
        {GlobalValidators.notEmpty(formValidation.startDate) && <span className="input-err-msg">{formValidation.startDate}</span>}
      </div>

      <div className="form-group-container half-form-left-container">
        <fieldset className="form-group">
          <legend className="form-label">Level</legend>
          <select id="level" className="form-input" value={level} onChange={onChangeLevel}>
            {levelList.map((level, ind) =>
              <option key={"tcl-" + ind} value={level}>{GeneralTools.convertEnum(level)}</option>
            )}
          </select>
        </fieldset>
      </div>

      <div className="form-group-container half-form-right-container">
        <fieldset className="form-group">
          <legend className="form-label">Priority</legend>
          <select id="priority" className="form-input" value={priority} onChange={onChangePriority}>
            {priorityList.map((priority, ind) =>
              <option key={"tcp-" + ind} value={priority}>{GeneralTools.convertEnum(priority)}</option>
            )}
          </select>
        </fieldset>
      </div>

      <div className="form-group-container">
        <fieldset className="form-group">
          <legend className="form-label">Task Type</legend>
          <select id="task-type" className="form-input" value={taskType} onChange={onChangeTaskType}>
            {taskTypeList.map((taskType, ind) =>
              <option key={"tctt-" + ind} value={taskType}>{GeneralTools.convertEnum(taskType)}</option>
            )}
          </select>
        </fieldset>
      </div>

      {!rootId && <div className="form-group-container">
        <div className="open-groups-dialog-container">
          <button type="button" className="ogd-btn" onClick={() => setOpenDialog(true)}>
            Groups?
          </button>
        </div>
      </div>}

      <div className="form-group-container search-user-container">
        <fieldset className="form-group">
          <legend className="form-label">Search User</legend>
          <SearchUserToAssign
            rootId={rootId}
            assignedUsers={assignedUsers}
            setAssignedUsers={setAssignedUsers}
            setHistories={setHistories} />
        </fieldset>
      </div>

      <div className="form-group-container">
        <div className="undo-btn-container">
          <button type="button" className={`undo-btn ${canUndo ? "" : "disabled-btn"}`} onClick={onClickUndoBtn} disabled={!canUndo}>
            Undo
          </button>
        </div>
      </div>

      <div className="form-group-container assign-for-container">
        <fieldset className="form-group">
          <legend className="form-label">Assigned Users</legend>
          <AssignedUsers assignedUsers={assignedUsers} setAssignedUsers={setAssignedUsers} setHistories={setHistories} />
        </fieldset>
      </div>

      <div className="form-group-container desc-container">
        <fieldset className="form-group">
          <legend className="form-label">
            <HelpContainer title="Description" description="Description helps assigned Users understand Task" />
          </legend>
          <TextEditor state={description} setState={setDescription} />
        </fieldset>
      </div>

      <div className="form-group-container desc-container">
        <fieldset className="form-group">
          <legend className="form-label">
            <HelpContainer title="Report Format" description="This Format supports Users prepare the Report better" />
          </legend>
          <TextEditor state={reportFormat} setState={setReportFormat} />
        </fieldset>
      </div>

      <button type="button" className="submit-btn" onClick={onClickSubmitBtn}>Assign</button>
    </div>
  </form>
}

//export { SearchUserToAssign, AssignedUsers };

function SearchUserToAssign({ rootId, assignedUsers, setAssignedUsers, setHistories }: SearchUserToAssignProps) {
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
      const response = !rootId
        ? await CreateTaskPageAPIs.fastSearchUsers(request) as ApiResponse<DTO_FastUserInfo[]>
        : await CreateTaskPageAPIs.fastSearchUsersOfRootTask(rootId, request) as ApiResponse<DTO_FastUserInfo[]>
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
      setHistories(prev)
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
  }, [setAssignedUsers, setHistories])

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
              className={`user-short-info${(extractEmailToGetId(user.email) in assignedUsers) ? " user-short-info-selected" : ""}`}
              onClick={() => toggleAddRemoveAssignedUser(user)}
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

export function getColorByCharacter(character: string): Record<string, string> {
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

export function extractEmailToGetId(email: string): string {
  return email.slice(0, email.indexOf("@"))
}

function AssignedUsers({ assignedUsers, setAssignedUsers, setHistories }: SearchUserToAssignProps) {
  const [shownInfoMap, setShownInfoMap] = useState<Record<string, boolean>>({})

  const onClickRmAssingedUserTag = useCallback((id: string) => {
    setAssignedUsers(prev => {
      setHistories(prev)
      const newData = { ...prev }
      delete newData[id]
      return newData
    })
  }, [setAssignedUsers, setHistories])

  useEffect(() => {
    setShownInfoMap(
      Object.entries(assignedUsers).reduce<Record<string, boolean>>((acc, pair) => {
        acc[pair[0]] = false;
        return acc;
      }, {})
    );
  }, [assignedUsers])

  return <ul className="assigned-users">
    {Object.keys(assignedUsers).length === 0
      ? <li className="assigned-user-tag direction-tag">
        Assigned Users <i className="direction-tag">(blank for Root Task)</i>
      </li>
      : Object.entries(assignedUsers).map(([id, user], ind) => {
        const firstNameChar = user.fullName[0].toUpperCase()
        const normalRole = user.role.toLowerCase().replace("_", "-")
        return <li className="assigned-user-tag" key={"aut-" + ind}>
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
