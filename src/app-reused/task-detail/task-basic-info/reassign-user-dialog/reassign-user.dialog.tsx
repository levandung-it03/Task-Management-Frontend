import { ClipboardList, X } from "lucide-react";

import "./reassign-user.dialog.scss"
import { useCallback, useEffect, useRef, useState } from "react";
import GlobalValidators from "@/util/global.validators";
import { ApiResponse } from "@/apis/general.api";
import { TaskDetailPageAPIs } from "@/apis/task-detail.page.api";
import toast from "react-hot-toast";
import { confirm } from "@/app-reused/confirm-alert/confirm-alert";
import { DTO_ReassignUserSubTask, DTO_TaskDetail, DTO_TaskUser, DTO_UpdateTaskResponse } from "@/dtos/task-detail.page.dto";
import { DTO_FastUserInfo } from "@/dtos/create-task.page.dto";
import { ChooseUserToAssign, extractEmailToGetId, getColorByCharacter } from "@/app-reused/create-task/task-creation-form/task-creation.form";
import { prettierTime } from "../../task-detail.service";

interface TaskDialogProps {
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
  taskInfo: DTO_TaskDetail;
  setTaskInfo: React.Dispatch<React.SetStateAction<DTO_TaskDetail>>;
  setAssignedUsers: React.Dispatch<React.SetStateAction<DTO_TaskUser[]>>;
}

export default function ReassignUserDialog({
  taskInfo,
  setTaskInfo,
  setOpenDialog,
  setAssignedUsers
}: TaskDialogProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const [addedUsers, setAddedUsers] = useState<Record<string, DTO_FastUserInfo>>({})

  const onSubmitUpdateContent = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    async function submitUpdating() {
      if (!await confirm("This change cannot be undone. Are you sure?", "Confirm Updating"))
        return
      
      const request = DTO_ReassignUserSubTask.withBuilder()
        .bid(taskInfo.id)
        .baddedUserEmail(Object.values(addedUsers)[0].email)
      const response = await TaskDetailPageAPIs.reassignUserSubTask(request) as ApiResponse<DTO_UpdateTaskResponse>
      if (String(response.status).startsWith("2")) {
        toast.success(response.msg)
        if (response.body.newUsers) {
          setTaskInfo(prev => ({
            ...prev,
            updatedTime: prettierTime(new Date().toISOString())
          }))
          setAssignedUsers(prev => [
            ...response.body.newUsers
          ])
          window.location.reload();
        }
      }
      setOpenDialog(false)
    }
    submitUpdating()
  }, [setOpenDialog, setAssignedUsers, setTaskInfo, addedUsers])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (overlayRef.current && overlayRef.current.contains(event.target as Node)) {
        setOpenDialog(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [setOpenDialog])

  return <div className="task-dialog">
    <div ref={overlayRef} className="dialog-overlay"></div>
    <div className="dialog-container">
      <div className="dialog-header">
        <div className="dialog-header-content">
          <ClipboardList className="dhc-icon" />
          <span className="dhc-title">Assign Other User</span>
        </div>
        <X className="close-dialog-btn" onClick={() => setOpenDialog(false)} />
      </div>
      <div className="input-container">
        <div className="form-group-container search-user-container">
            <fieldset className="form-group">
              <legend className="form-label">Search User</legend>
              <ChooseUserToAssign
                rootId={taskInfo.rootTaskId!}
                assignedUsers={addedUsers}
                setAssignedUsers={setAddedUsers}
                setHistories={() => {}} />
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
      </div>
    </div>
  </div>
}

function SearchUserToAdd({ rootId, mainId, addedUsers, setAddedUsers, setFormTouched }: {
  rootId: number | null,
  mainId: number,
  addedUsers: Record<string, DTO_FastUserInfo>,
  setAddedUsers: React.Dispatch<React.SetStateAction<Record<string, DTO_FastUserInfo>>>,
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
  addedUsers: Record<string, DTO_FastUserInfo>,
  setAddedUsers: React.Dispatch<React.SetStateAction<Record<string, DTO_FastUserInfo>>>,
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
