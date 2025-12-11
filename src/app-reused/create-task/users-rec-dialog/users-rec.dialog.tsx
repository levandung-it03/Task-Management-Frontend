import { ArrowDown, Users, X } from "lucide-react"
import React, { useCallback, useEffect, useRef, useState } from "react"
import './users-rec.dialog.scss'
import { DTO_FastUserInfo, DTO_GroupOverview } from "@/dtos/create-task.page.dto";
import HelpContainer from "@/app-reused/help-container/page";
import { extractEmailToGetId, getColorByCharacter } from "../task-creation-form/task-creation.form";
import GlobalValidators from "@/util/global.validators";
import { UsersRecAPIs } from "@/apis/users-rec.page.api";
import { ApiResponse, GeneralAPIs } from "@/apis/general.api";
import toast from "react-hot-toast";
import { DTO_MaxUsersResponse, DTO_RecUserInfo, DTO_RecUsersRequest } from "@/dtos/users-rec.page.dto";
import { CreateTaskPageAPIs } from "@/apis/create-task.page.api";
import { GeneralTools } from "@/util/general.helper";


interface UsersRecDialogProps {
  recRequest: DTO_RecUsersRequest
  setOpenUsersRecDialog: React.Dispatch<React.SetStateAction<boolean>>;
  assignedUsers: Record<string, DTO_FastUserInfo>
  setAssignedUsers: React.Dispatch<React.SetStateAction<Record<string, DTO_FastUserInfo>>>;
  openUsersRecDialog: boolean;
  setHistories: (snapshot: Record<string, DTO_FastUserInfo>) => void;
}

export default function UsersRecDialog({
  recRequest,
  openUsersRecDialog,
  setOpenUsersRecDialog,
  assignedUsers,
  setAssignedUsers,
  setHistories
}: UsersRecDialogProps) {
  const [chosenUsers, setChosenUsers] = useState<Record<string, DTO_FastUserInfo>>({})
  const [recUsers, setRecUsers] = useState<DTO_RecUserInfo[] | null>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const [usersQty, setUsersQty] = useState(1)
  const [maxUsersQty, setMaxUsersQty] = useState(-1)
  const [group, setGroup] = useState<number>(-1)
  const [groups, setGroups] = useState<DTO_GroupOverview[]>([])
  const [authEnumsList, setAuthEnumList] = useState<string[]>([])
  const [authEnum, setAuthEnum] = useState<string>("")


  const onClickToggleChooseUser = useCallback((userInfo: DTO_FastUserInfo) => {
    const id = extractEmailToGetId(userInfo.email);
    setChosenUsers(prev => {
      if (id in prev) {
        const newUsers = { ...prev };
        delete newUsers[id];
        return newUsers;
      }
      else return { ...prev, [id]: userInfo };
    });
  }, [])

  const onClickAssignUsers = useCallback(() => {
    if (Object.keys(chosenUsers).length === 0) {
      toast.error("No Users is chosen, please select one!");
      return;
    }
    setAssignedUsers(prev => {
      setHistories(prev);
      return {
        ...prev,
        ...chosenUsers
      }
    });
    setOpenUsersRecDialog(false);
  }, [chosenUsers, setOpenUsersRecDialog, setHistories, setAssignedUsers])

  const onSelectGroup = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setGroup(Number(e.target.value))
  }, [])

  const onChangeUsersQty = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setUsersQty(Number(e.target.value))
  }, [])

  const onClickCloseDialog = useCallback(() => setOpenUsersRecDialog(false), [setOpenUsersRecDialog])

  const onChangeAuthEnum = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setAuthEnum(e.target.value);
  }, [])

  const onClickRecommendUser = useCallback(() => {
    if (usersQty < 1 || usersQty > maxUsersQty) {
      toast.error("Max Users Quantity is 0 or too BIG!");
      return;
    }

    recRequest.numOfEmp = usersQty;
    recRequest.authority = authEnum;
    recRequest.groupId = group;
    const promise = UsersRecAPIs.recommendUsers(recRequest) as Promise<ApiResponse<DTO_RecUserInfo[]>>
    toast.promise(
      promise,
      {
        loading: 'Wait for Model assembles histories!',
        success: (response) => {
          if (response.status === 200) {
            setRecUsers(response.body);
            return response.msg;
          }
          if (response.status === 204) {
            setRecUsers(response.body);
            throw new Error(response.msg);
          }
          throw new Error();
        },
        error: (err) => err.message || "Error happened",
      }
    );
  }, [recRequest, usersQty, maxUsersQty, authEnum]);

  useEffect(() => {
    async function initValues() {
      const groupsResponse = await CreateTaskPageAPIs.getAllGroupsRelatedToUser() as ApiResponse<DTO_GroupOverview[]>
      if (String(groupsResponse.status)[0] === "2") {
        setGroups(groupsResponse.body);
      }
      const maxUsersRes = await UsersRecAPIs.getMaxUsersInDomain() as ApiResponse<DTO_MaxUsersResponse>
      if (String(maxUsersRes.status)[0] === "2") {
        setMaxUsersQty(maxUsersRes.body.maxQuantity);
      }
      const authEnumsRes = await GeneralAPIs.getAuthorityEnums() as ApiResponse<string[]>
      if (String(authEnumsRes.status)[0] === "2") {
        const enums = authEnumsRes.body.reverse();
        setAuthEnumList(enums);
        setAuthEnum(enums[0])
      }
    }
    initValues();
  }, []);

  return <div className={`main-users-rec-dialog ${openUsersRecDialog ? "" : "hidden"}`}>
    <div ref={overlayRef} className="dialog-overlay"></div>
    <div className="users-rec-scroll-wrapper">
      <div className="users-rec-container">
        <div className="users-rec-container-header">
          <div className="urch-title">
            <div className="urch-title-wrapper">
              <Users className="urch-title-icon" />
              <span className="urch-title-text">Recommend Users with AI</span>
            </div>
            <div className="close-btn-wrapper">
              <X className="close-btn-icon" onClick={onClickCloseDialog} />
            </div>
          </div>
        </div>
        <div className="users-rec-container-desc">
          <i className="urch-desc-text">Recommend Users that fit to the current Task base info.</i>
        </div>
        <div className="users-rec-container-overview">
          <div className="urco-title">
            <i className="urco-title-text">Overview Information</i>
          </div>
          <div className="urco-block urco-domain">
            <b className="urco-label">Task Type</b>
            <span className="urco-value">{recRequest.domain}</span>
          </div>
          <div className="urco-block urco-level">
            <b className="urco-label">Level</b>
            <span className={`urco-value task-level-${recRequest.level.toLowerCase()}`}>
              {recRequest.level}
            </span>
          </div>
          <div className="urco-block urco-priority">
            <b className="urco-label">Priority</b>
            <span className={`urco-value task-priority-${recRequest.priority.toLowerCase()}`}>
              {recRequest.priority}
            </span>
          </div>
          <div className="users-rec-container-more-inp">
            <div className="form-group-container fit-form-container">
              <fieldset className="form-group">
                <legend className="form-label">
                  <HelpContainer
                    title="Max Users quantity"
                    description={maxUsersQty === -1
                      ? "Loading..."
                      : `Maximum ${maxUsersQty} (Last updated ${new Date().toLocaleDateString('en-GB')})`} />
                </legend>
                <input id="num-of-users" className="form-input" type="number" value={usersQty} onChange={onChangeUsersQty} min="0" max={maxUsersQty} />
              </fieldset>
            </div>
            <div className="form-group-container fit-form-container">
              <fieldset className="form-group">
                <legend className="form-label">Task Type</legend>
                <select id="auth-enum" className="form-select" value={authEnum} onChange={onChangeAuthEnum}>
                  {authEnumsList.map((authEnum, ind) =>
                    <option key={"aefs-" + ind} value={authEnum}>{GeneralTools.convertEnum(authEnum)}</option>
                  )}
                </select>
              </fieldset>
            </div>
            <div className="form-group-container fit-form-container">
              <fieldset className="form-group">
                <legend className="form-label">
                  <HelpContainer
                    title="Filtered Group"
                    description="Your joined Groups shown here! (NOT required)" />
                </legend>
                <select id="groud-id" className="form-input" value={group} onChange={onSelectGroup}>
                  <option value="-1">-- No Choice --</option>
                  {groups.map((groupInfo, ind) => <option key={`grrec-${ind}`} className="group-item" value={groupInfo.id}>
                    {groupInfo.name}
                  </option>)}
                </select>
              </fieldset>
            </div>
            <div className="rec-btn-container">
              <button id="rec-btn" className="rec-btn" onClick={onClickRecommendUser}>
                Recommend
                <ArrowDown className="rec-icon" />
              </button>
            </div>
          </div>
        </div>
        <div className="users-rec-container-body">
          <div className="urcb-header">
            <div className="urdb-title">
              <Users className="urcb-title-icon" />
              <span className="urcb-title-text">Recommended Users</span>
            </div>
          </div>
          <table className="rec-users-result">
            <thead></thead>
            <tbody className="rus-body">
              {GlobalValidators.isNull(recUsers)
                ? <tr className="rus-empty-body">
                  <td>
                    <i className="rus-eb-text">Fill information, and let Machine works!</i>
                  </td>
                </tr>
                : recUsers?.length === 0
                  ? <tr className="rus-empty-body">
                    <td>
                      <i className="rus-eb-text">Employees are busy, or no body meets the demand!</i>
                    </td>
                  </tr>
                  : recUsers!
                    .map((user, ind) => {
                      const firstNameChar = user.fullName[0].toUpperCase()
                      const id = extractEmailToGetId(user.email);
                      const isChosenUser = id in chosenUsers || id in assignedUsers;
                      return <tr
                        key={"usi-" + ind}
                        className={`user-short-info${isChosenUser ? " user-short-info-selected" : ""}`}
                        onClick={() => onClickToggleChooseUser(user)}
                      >
                        <td className="usi-ava" style={getColorByCharacter(firstNameChar)}>{firstNameChar}</td>
                        <td className="usi-full-name">{user.fullName}</td>
                        <td className="usi-email">{user.email}</td>
                        <td className="usi-dep quick-blue-tag">{user.department}</td>
                        <td className={`usi-role usi-${user.role.toLowerCase().replace("_", "-")}`}>{user.role}</td>
                        <td className="usi-pred-score quick-blue-tag">{user.score}% (Model Truth)</td>
                      </tr>
                    })
              }
            </tbody>
          </table>
        </div>
        <button className="assign-btn" onClick={onClickAssignUsers}>
          Assign
          <ArrowDown className="assign-icon" />
        </button>
      </div>
    </div>
  </div>
}