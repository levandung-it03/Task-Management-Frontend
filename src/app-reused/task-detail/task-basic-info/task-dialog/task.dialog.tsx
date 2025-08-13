import { ClipboardList, X } from "lucide-react";

import "./task.dialog.scss"
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import GlobalValidators from "@/util/global.validators";
import { ApiResponse, GeneralAPIs } from "@/apis/general.api";
import { CreateTaskPageValidators } from "@/app-reused/create-task/page.service";
import { GeneralTools } from "@/util/general.helper";
import { TaskDetailPageAPIs } from "@/apis/task-detail.page.api";
import toast from "react-hot-toast";
import { confirm } from "@/app-reused/confirm-alert/confirm-alert";
import { DTO_TaskDetail, DTO_UpdateBasicTask } from "@/dtos/task-detail.page.dto";
import { DTO_FastUserInfo } from "@/dtos/create-task.page.dto";
import { extractEmailToGetId, getColorByCharacter } from "@/app-reused/create-task/task-creation-form/task-creation.form";
import { AuthHelper } from "@/util/auth.helper";

interface TaskDialogProps {
  openDialog: boolean;
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
  taskInfo: DTO_TaskDetail;
  setTaskInfo: React.Dispatch<React.SetStateAction<DTO_TaskDetail>>;
}

export default function TaskDialog({
  taskInfo,
  setTaskInfo,
  openDialog,
  setOpenDialog,
}: TaskDialogProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const [isOwner, setIsOwner] = useState(false)
  const [startDate, setStartDate] = useState("")
  const [deadline, setDeadline] = useState("")
  const [levelList, setLevelList] = useState<string[]>([])
  const [level, setLevel] = useState("")
  const [priorityList, setPriorityList] = useState<string[]>([])
  const [priority, setPriority] = useState("")
  const [taskTypeList, setTaskTypeList] = useState<string[]>([])
  const [taskType, setTaskType] = useState("")
  const [formTouched, setFormTouched] = useState(false)
  const [formValidation, setFormValidation] = useState({
    deadline: "",
    startDate: ""
  })
  const [addedUsers, setAddedUsers] = useState<Record<string, Record<string, string>>>({})
  const isUpdatable = useMemo(() => isOwner && !taskInfo.hasAtLeastOneReport, [isOwner, taskInfo.hasAtLeastOneReport])

  const onChangeStartDate = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(e.target.value)
    setFormTouched(true)
    setFormValidation(prev => ({ ...prev, deadline: CreateTaskPageValidators.isValidDeadline(e.target.value) }))
  }, [])

  const onChangeDeadline = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setDeadline(e.target.value)
    setFormTouched(true)
    setFormValidation(prev => ({ ...prev, deadline: CreateTaskPageValidators.isValidDeadline(e.target.value) }))
  }, [])

  const onChangeLevel = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setLevel(e.target.value)
    setFormTouched(true)
  }, [])

  const onChangePriority = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setPriority(e.target.value)
    setFormTouched(true)
  }, [])

  const onChangeTaskType = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setTaskType(e.target.value)
    setFormTouched(true)
  }, [])

  const onSubmitUpdateContent = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    async function submitUpdating() {
      if (!await confirm("This change cannot be undone. Are you sure?", "Confirm Updating"))
        return
      if (GlobalValidators.isInvalidValidation(formTouched, formValidation))
        return
      if (new Date(startDate) > new Date(deadline)) {
        toast.error("Invalid Start-date or Deadline!")
        return
      }
      if (priority === taskInfo.priority
        && level === taskInfo.level
        && taskType === taskInfo.taskType
        && startDate === GeneralTools.formatedDateToDateInput(taskInfo.startDate)
        && deadline === GeneralTools.formatedDateToDateInput(taskInfo.deadline)) {
        toast.error("Change data before update!")
        return
      }
      const request = DTO_UpdateBasicTask.withBuilder()
        .bid(taskInfo.id)
        .bpriority(priority)
        .blevel(level)
        .btaskType(taskType)
        .bdeadline(deadline)
        .bstartDate(startDate)
        .baddedUserEmail(GlobalValidators.notEmpty(addedUsers) ? Object.values(addedUsers)[0].email : "")
      const response = await TaskDetailPageAPIs.updateBasicTaskInfo(request) as ApiResponse<void>
      if (String(response.status).startsWith("2")) {
        toast.success(response.msg)
        setTaskInfo(prev => ({
          ...prev,
          priority: priority,
          level: level,
          taskType: taskType,
          deadline: deadline,
          startDate: startDate
        }))
        window.location.reload()
      }
      setOpenDialog(false)
    }
    submitUpdating()
  }, [
    taskInfo.id, taskInfo.deadline, taskInfo.level, taskInfo.taskType, taskInfo.priority,
    priority, level, taskType, deadline, formValidation, setOpenDialog, setTaskInfo,
    formTouched, startDate
  ])

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (overlayRef.current && overlayRef.current.contains(event.target as Node)) {
        setOpenDialog(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [setOpenDialog])

  useEffect(() => {
    async function checkIsOwner() {
      const result = await AuthHelper.isEmailLoggingIn(taskInfo.userInfo.email)
      setIsOwner(result)
    }
    checkIsOwner()
  }, [taskInfo.userInfo.email])

  useEffect(() => setLevel(taskInfo.level), [taskInfo.level])
  useEffect(() => setPriority(taskInfo.priority), [taskInfo.priority])
  useEffect(() => setTaskType(taskInfo.taskType), [taskInfo.taskType])
  useEffect(() => setDeadline(taskInfo.deadline), [taskInfo.deadline])
  useEffect(() => setStartDate(taskInfo.startDate), [taskInfo.startDate])

  return openDialog
    ? <div className="task-dialog">
      <div ref={overlayRef} className="dialog-overlay"></div>
      <div className="dialog-container">
        <div className="dialog-header">
          <div className="dialog-header-content">
            <ClipboardList className="dhc-icon" />
            <span className="dhc-title">Basic Information</span>
          </div>
          <X className="close-dialog-btn" onClick={() => setOpenDialog(false)} />
        </div>
        <div className="input-container">
          <div className="form-group-container half-form-left-container">
            <fieldset className="form-group">
              <legend className="form-label">Start Date</legend>
              <input type="date" id="startDate" className="form-input" placeholder="Type Start Date" required
                value={startDate} onChange={onChangeStartDate} readOnly={!isUpdatable} />
            </fieldset>
            {GlobalValidators.notEmpty(formValidation.startDate) && <span className="input-err-msg">{formValidation.startDate}</span>}
          </div>

          <div className="form-group-container half-form-right-container">
            <fieldset className="form-group">
              <legend className="form-label">Deadline</legend>
              <input type="date" id="deadline" className="form-input" placeholder="Type Deadline" required
                value={deadline} onChange={onChangeDeadline} readOnly={!isUpdatable} />
            </fieldset>
            {GlobalValidators.notEmpty(formValidation.deadline) && <span className="input-err-msg">{formValidation.deadline}</span>}
          </div>

          <div className="form-group-container half-form-left-container">
            <fieldset className="form-group">
              <legend className="form-label">Level</legend>
              <select id="level" className="form-input" value={level} onChange={onChangeLevel} disabled={!isUpdatable}>
                {levelList.map((level, ind) =>
                  <option key={"tdl-" + ind} value={level}>{GeneralTools.convertEnum(level)}</option>
                )}
              </select>
            </fieldset>
          </div>

          <div className="form-group-container half-form-right-container">
            <fieldset className="form-group">
              <legend className="form-label">Priority</legend>
              <select id="priority" className="form-input" value={priority} onChange={onChangePriority} disabled={!isUpdatable}>
                {priorityList.map((priority, ind) =>
                  <option key={"tdp-" + ind} value={priority}>{GeneralTools.convertEnum(priority)}</option>
                )}
              </select>
            </fieldset>
          </div>

          <div className="form-group-container">
            <fieldset className="form-group">
              <legend className="form-label">Task Type</legend>
              <select id="task-type" className="form-input" value={taskType} onChange={onChangeTaskType} disabled={!isUpdatable}>
                {taskTypeList.map((taskType, ind) =>
                  <option key={"tdt-" + ind} value={taskType}>{GeneralTools.convertEnum(taskType)}</option>
                )}
              </select>
            </fieldset>
          </div>

          {isUpdatable && <>
            <div className="form-group-container search-user-container">
              <fieldset className="form-group">
                <legend className="form-label">Search User</legend>
                <SearchUserToAdd
                  rootId={taskInfo.rootTaskId}
                  mainId={taskInfo.id}
                  addedUsers={addedUsers}
                  setAddedUsers={setAddedUsers}
                  setFormTouched={setFormTouched} />
              </fieldset>
            </div>

            <div className="form-group-container added-for-container">
              <fieldset className="form-group">
                <legend className="form-label">Added Users</legend>
                <AddedUser addedUsers={addedUsers} setAddedUsers={setAddedUsers} />
              </fieldset>
            </div>

            <div className="update-btn-container">
              <button className="update-content-btn" onClick={onSubmitUpdateContent} type="button">
                Submit Update
              </button>
            </div>
          </>}
        </div>
      </div>
    </div>
    : <></>
}

function SearchUserToAdd({ rootId, mainId, addedUsers, setAddedUsers, setFormTouched }: {
  rootId: number | null,
  mainId: number,
  addedUsers: Record<string, Record<string, string>>,
  setAddedUsers: React.Dispatch<React.SetStateAction<Record<string, Record<string, string>>>>,
  setFormTouched: React.Dispatch<React.SetStateAction<boolean>>
}) {
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
      const response = !rootId
        ? await TaskDetailPageAPIs.searchNewAddedUsersForRootTask(mainId, value) as ApiResponse<DTO_FastUserInfo[]>
        : await TaskDetailPageAPIs.searchNewAddedUsersForSubTask(rootId, value) as ApiResponse<DTO_FastUserInfo[]>
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

  const toggleAddRemoveAddedUser = useCallback((user: DTO_FastUserInfo) => {
    setFormTouched(true)
    setAddedUsers({
      [extractEmailToGetId(user.email)]: {
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        department: user.department
      }
    })
  }, [setAddedUsers, setFormTouched])

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
    <input type="text" id="searchUser" className="form-input" placeholder="Assign a new User?" autoComplete="off"
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

function AddedUser({ addedUsers, setAddedUsers }: {
  addedUsers: Record<string, Record<string, string>>,
  setAddedUsers: React.Dispatch<React.SetStateAction<Record<string, Record<string, string>>>>,
}) {
  const [shownInfoMap, setShownInfoMap] = useState<Record<string, boolean>>({})

  const onClickRmAssingedUserTag = useCallback((id: string) => {
    setAddedUsers({})
  }, [setAddedUsers])

  useEffect(() => {
    setShownInfoMap(
      Object.entries(addedUsers).reduce<Record<string, boolean>>((acc, pair) => {
        acc[pair[0]] = false;
        return acc;
      }, {})
    );
  }, [addedUsers])

  return <ul className="added-user">
    {Object.keys(addedUsers).length === 0
      ? <li className="added-user-tag direction-tag">Added User</li>
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
