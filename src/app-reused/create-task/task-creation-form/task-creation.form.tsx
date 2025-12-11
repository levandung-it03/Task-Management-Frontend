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
import { AuthHelper } from "@/util/auth.helper"
import { ReusableRootTaskData } from "../page"
import { DTO_RecUsersRequest } from "@/dtos/users-rec.page.dto"
import { UserInfoAPIs } from "@/apis/user-info.page.api"
import { DTO_UserInfoResponse } from "@/dtos/user-info.page.dto"

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
    role: string,
    deparment: string
  }
}

export interface ChooseUserToAssignProps {
  rootId: number
  setHistories: (snapshot: Record<string, DTO_FastUserInfo>) => void;
  setAssignedUsers: React.Dispatch<React.SetStateAction<Record<string, DTO_FastUserInfo>>>;
  assignedUsers: Record<string, DTO_FastUserInfo>;
}

interface SearchUserToAssignProps {
  setHistories: (snapshot: Record<string, DTO_FastUserInfo>) => void;
  setAssignedUsers: React.Dispatch<React.SetStateAction<Record<string, DTO_FastUserInfo>>>;
  assignedUsers: Record<string, DTO_FastUserInfo>;
}

interface TaskCreationFormProps {
  rootId: number | undefined;
  rootData: ReusableRootTaskData;
  collectionId: number;
  assignedUsersHist: Record<string, DTO_FastUserInfo>;
  setAssignedUsers: React.Dispatch<React.SetStateAction<Record<string, DTO_FastUserInfo>>>;
  assignedUsers: Record<string, DTO_FastUserInfo>;
  setOpenGrDialog: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenUsersRecDialog: React.Dispatch<React.SetStateAction<boolean>>;
  canUndo: boolean;
  setCanUndo: React.Dispatch<React.SetStateAction<boolean>>;
  setHistories: (snapshot: Record<string, DTO_FastUserInfo>) => void;
  setRecRequest: React.Dispatch<React.SetStateAction<DTO_RecUsersRequest>>;
}

export function TaskCreationForm({
  rootId,
  rootData,
  collectionId,
  assignedUsers,
  setAssignedUsers,
  setOpenGrDialog,
  setOpenUsersRecDialog,
  canUndo,
  setCanUndo,
  assignedUsersHist,
  setHistories,
  setRecRequest
}: TaskCreationFormProps) {
  const [name, setName] = useState("")
  const [deadline, setDeadline] = useState("")
  const [startDate, setStartDate] = useState("")
  const [description, setDescription] = useState("")
  const [reportFormat, setReportFormat] = useState("")
  const [levels, setLevels] = useState<Record<string, string>[]>([])
  const [level, setLevel] = useState("")
  const [priorityList, setPriorityList] = useState<string[]>([])
  const [priority, setPriority] = useState("")
  const [taskTypeList, setTaskTypeList] = useState<string[]>([])
  const [taskType, setTaskType] = useState("")
  const [formTouched, setFormTouched] = useState(false)
  const [formValidation, setFormValidation] = useState({
    name: "",
    deadline: "",
    startDate: "",
  })
  const [isRootTask, setIsRootTask] = useState(!rootId);

  const onChangeName = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
    setFormTouched(true)
    setFormValidation(prev => ({ ...prev, deadline: CreateTaskPageValidators.isValidName(e.target.value) }))
  }, [])

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
    const val = e.target.value;
    setLevel(val)
    setRecRequest((prev: DTO_RecUsersRequest) => ({ ...prev, level: val}))
  }, [])

  const onChangePriority = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setPriority(val)  
    setRecRequest((prev: DTO_RecUsersRequest) => ({ ...prev, priority: val}))
  }, [])

  const onChangeTaskType = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setTaskType(val)
    setRecRequest((prev: DTO_RecUsersRequest) => ({ ...prev, domain: val}))
  }, [])

  const onClickSubmitBtn = useCallback(() => {
    async function createTask() {
      const formattedDeadline = new Date(deadline)
      const formattedStartDate = new Date(startDate)
      const trimmedDescription = description.trim()
      const trimmedReportFormat = reportFormat.trim()

      if (GlobalValidators.isEmpty(deadline)
        || GlobalValidators.isEmpty(startDate)
        || formattedDeadline < formattedStartDate) {
        toast.error("Check for error dates")
        return
      }

      if (GlobalValidators.isEmpty(trimmedDescription)
        || Object.keys(assignedUsers).length === 0
      ) {
        toast.error("Please fill all required fields correctly")
        return
      }

      if (GlobalValidators.isInvalidValidation(formTouched, formValidation))
        return

      const request = DTO_TaskRequest.withBuilder()
        .bname(name)
        .bcollectionId(collectionId)
        .bdeadline(deadline)
        .bstartDate(startDate)
        .blevel(level)
        .bpriority(priority)
        .btaskType(taskType)
        .bassignedEmails(Object.entries(assignedUsers).map(([key, user]) => user.email))
        .bdescription(trimmedDescription)
        .breportFormat(trimmedReportFormat)

      const response = isRootTask
        ? await CreateTaskPageAPIs.createTask(request) as ApiResponse<Record<string, string>>
        : await CreateTaskPageAPIs.createSubTask(rootId!, request) as ApiResponse<Record<string, string>>

      if (String(response.status).startsWith("2")) {
        toast.success(response.msg)
        const role = AuthHelper.getRoleFromToken()
        window.location.href = `${window.location.origin}/${role}/task-detail/${response.body.id}`
      }
    }
    createTask();
  }, [collectionId, rootId, name, startDate, deadline, description, reportFormat, level, priority, taskType, assignedUsers, formValidation, formTouched])

  useEffect(() => setIsRootTask(!rootId), [rootId])

  useEffect(() => {
    async function initValues() {
      const levelsResponse = await GeneralAPIs.getTaskLevelEnums() as ApiResponse<Record<string, number>[]>
      if (String(levelsResponse.status)[0] === "2") {
        const levelDefVal = Object.entries(levelsResponse.body[0])[0][0];
        setLevel(!rootData.level ? levelDefVal : rootData.level)
        setLevels(levelsResponse.body.map((levelEntry: Record<string, number>) => {
          const levelEntries = Object.entries(levelEntry)[0]
          return {
            [levelEntries[0]]: GeneralTools.floatNumberFormat(levelEntries[1])
          }
        }))
        setRecRequest(prev => ({ ...prev, level: levelDefVal }))
      }
      const prioritiesResponse = await GeneralAPIs.getTaskPriorityEnums() as ApiResponse<string[]>
      if (String(prioritiesResponse.status)[0] === "2") {
        setPriority(!rootData.priority ? prioritiesResponse.body[0] : rootData.priority)
        setPriorityList(prioritiesResponse.body)
        setRecRequest(prev => ({ ...prev, priority: prioritiesResponse.body[0] }))
      }
      const taskTypesResponse = await GeneralAPIs.getTaskTypeEnums() as ApiResponse<string[]>
      if (String(taskTypesResponse.status)[0] === "2") {
        setTaskType(!rootData.taskType ? taskTypesResponse.body[0] : rootData.taskType)
        setTaskTypeList(taskTypesResponse.body)
        setRecRequest(prev => ({ ...prev, domain: taskTypesResponse.body[0] }))
      }
      setStartDate(rootData.startDate)
      setDeadline(rootData.deadline)
      setDescription(rootData.description)
      setReportFormat(rootData.reportFormat)
    }
    initValues()
  }, [rootData])

  return <form className="task-info-form">
    <div className="task-info-form-container">
      <div className="form-caption">
        <FileIcon className="caption-icon" />
        <span className="caption-content">Task Assigning</span>
        <i className="desc-content">Fill these information to create a Task and assign Users.</i>
      </div>

      <div className="form-group-container">
        <fieldset className="form-group">
          <legend className="form-label">Task Name</legend>
          <input type="text" id="name" className="form-input" placeholder="Type Task Name" required
            value={name} onChange={onChangeName} />
        </fieldset>
        {GlobalValidators.notEmpty(formValidation.name) && <span className="input-err-msg">{formValidation.name}</span>}
      </div>

      <div className="form-group-container half-form-left-container">
        <fieldset className="form-group">
          <legend className="form-label">Start Date</legend>
          <input type="date" id="start-date" className="form-input" placeholder="Type Start Date" required
            value={startDate} onChange={onChangeStartDate} />
        </fieldset>
        {GlobalValidators.notEmpty(formValidation.startDate) && <span className="input-err-msg">{formValidation.startDate}</span>}
      </div>

      <div className="form-group-container half-form-right-container">
        <fieldset className="form-group">
          <legend className="form-label">Deadline</legend>
          <input type="date" id="deadline" className="form-input" placeholder="Type Deadline" required
            value={deadline} onChange={onChangeDeadline} />
        </fieldset>
        {GlobalValidators.notEmpty(formValidation.deadline) && <span className="input-err-msg">{formValidation.deadline}</span>}
      </div>

      <div className="form-group-container half-form-left-container">
        <fieldset className="form-group">
          <legend className="form-label task-level-label">
            Level
            <HelpContainer title="" key="" description="Task-Level-Ratio will be used to calculate statistic project information" />
          </legend>
          <select id="level" className="form-select" value={level} onChange={onChangeLevel}>
            {levels.map((levelEntry, ind) => {
              const levelEntries = Object.entries(levelEntry)[0]
              return <option key={"tcl-" + ind} value={levelEntries[0]}>
                {GeneralTools.convertEnum(levelEntries[0])} (x{levelEntries[1]} Score)
              </option>
            })}
          </select>
        </fieldset>
      </div>

      <div className="form-group-container half-form-right-container">
        <fieldset className="form-group">
          <legend className="form-label">Priority</legend>
          <select id="priority" className="form-select" value={priority} onChange={onChangePriority}>
            {priorityList.map((priority, ind) =>
              <option key={"tcp-" + ind} value={priority}>{GeneralTools.convertEnum(priority)}</option>
            )}
          </select>
        </fieldset>
      </div>

      <div className="form-group-container">
        <fieldset className="form-group">
          <legend className="form-label">Task Type</legend>
          <select id="task-type" className="form-select" value={taskType} onChange={onChangeTaskType}>
            {taskTypeList.map((taskType, ind) =>
              <option key={"tctt-" + ind} value={taskType}>{GeneralTools.convertEnum(taskType)}</option>
            )}
          </select>
        </fieldset>
      </div>

      {isRootTask && <div className="form-group-container">
        <div className="open-dialog-container">
          <button type="button" className="odc-users-rec-btn" onClick={() => setOpenUsersRecDialog(true)}>
            Recommend?
          </button>
          <button type="button" className="odc-groups-btn" onClick={() => setOpenGrDialog(true)}>
            Groups
          </button>
        </div>
      </div>}

      <div className="form-group-container search-user-container">
        <fieldset className="form-group">
          <legend className="form-label">Search User</legend>
          {isRootTask
            ? <SearchUserToAssign
              assignedUsers={assignedUsers}
              setAssignedUsers={setAssignedUsers}
              setHistories={setHistories} />
            : <ChooseUserToAssign
              rootId={rootId!}
              assignedUsers={assignedUsers}
              setAssignedUsers={setAssignedUsers}
              setHistories={setHistories} />}
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

      {/* <div className="form-group-container desc-container">
        <fieldset className="form-group">
          <legend className="form-label">
            <HelpContainer title="Report Format" description="This Format supports Users prepare the Report better" />
          </legend>
          <TextEditor state={reportFormat} setState={setReportFormat} />
        </fieldset>
      </div> */}

      <button type="button" className="submit-btn" onClick={onClickSubmitBtn}>Assign</button>
    </div>
  </form>
}

//export { SearchUserToAssign, AssignedUsers };

export function ChooseUserToAssign({ rootId, assignedUsers, setAssignedUsers, setHistories }: ChooseUserToAssignProps) {
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
      const response = await CreateTaskPageAPIs.fastSearchUsersTaskOfRootTask(rootId, request) as ApiResponse<DTO_FastUserInfo[]>
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
    setAssignedUsers((prev) => {
      setHistories(prev)
      const key = extractEmailToGetId(user.email)
      if (key in prev) {
        const newData = { ...prev }
        delete newData[key]
        return newData
      }
      else
        return { [key]: user }
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
          ? <tr><td className="loading-row">Loading...</td></tr>
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
              <td className="usi-dep quick-blue-tag">{user.department}</td>
              <td className={`usi-role usi-${user.role.toLowerCase().replace("_", "-")}`}>{user.role}</td>
            </tr>
          })
        }
      </tbody>
    </table>
  </>
}

function SearchUserToAssign({ assignedUsers, setAssignedUsers, setHistories }: SearchUserToAssignProps) {
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
      const response = await CreateTaskPageAPIs.fastSearchUsersTask(request) as ApiResponse<DTO_FastUserInfo[]>
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
    setAssignedUsers((prev) => {
      setHistories(prev)
      const key = extractEmailToGetId(user.email)
      if (key in prev) {
        const newData = { ...prev }
        delete newData[key]
        return newData
      }
      else
        return { ...prev, [key]: user }
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

  //--Default setting task-creator is the first-assigned-person.
  useEffect(() => {
    async function fetchCurUser() {
      const token = AuthHelper.getAccessTokenFromCookie();
      if (token) {
        const response = await UserInfoAPIs.getUserInfo() as ApiResponse<DTO_UserInfoResponse>
        if (String(response.status)[0] === "2") {
          const token = AuthHelper.getAccessTokenFromCookie()
          if (!token)   return;

          const decoded = AuthHelper.extractToken(token);
          const user: DTO_FastUserInfo = {
            email: response.body.email,
            fullName: response.body.fullName,
            role: decoded["SCOPES"].split(" ")[0],
            department: response.body.department.name
          };
          setAssignedUsers({ [user.email]: user });
        }
      }
    }
    fetchCurUser();
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
          ? <tr><td className="loading-row">Loading...</td></tr>
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
              <td className="usi-dep quick-blue-tag">{user.department}</td>
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

function AssignedUsers({ assignedUsers, setAssignedUsers, setHistories }: {
  setHistories: (snapshot: Record<string, DTO_FastUserInfo>) => void;
  setAssignedUsers: React.Dispatch<React.SetStateAction<Record<string, DTO_FastUserInfo>>>;
  assignedUsers: Record<string, DTO_FastUserInfo>;
}) {
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
      ? <li className="assigned-user-tag direction-tag">Assigned Users</li>
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
              <span className="usi-dep quick-blue-tag">{user.department}</span>
              <span className={`usi-role usi-${normalRole}`}>{user.role}</span>
            </div>
          </div>
        </li>
      }
      )
    }
  </ul>
}
