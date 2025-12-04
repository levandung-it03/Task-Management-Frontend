'use client'

import { useCallback, useEffect, useRef, useState } from 'react';
import { CreateTaskPageAPIs } from '@/apis/create-task.page.api';
import { ApiResponse } from '@/apis/general.api';
import './group-list.dialog.scss'
import { Users, X } from 'lucide-react';
import { extractEmailToGetId, getColorByCharacter } from '../task-creation-form/task-creation.form';
import { DTO_FastUserInfo, DTO_GroupOverview } from '@/dtos/create-task.page.dto';

export interface GroupListDialogProps {
  setAssignedUsers: React.Dispatch<React.SetStateAction<Record<string, DTO_FastUserInfo>>>;
  setOpenGrDialog: React.Dispatch<React.SetStateAction<boolean>>;
  openGrDialog: boolean;
  setHistories: (snapshot: Record<string, DTO_FastUserInfo>) => void;
}

export default function GroupListDialog({
  openGrDialog,
  setOpenGrDialog,
  setAssignedUsers,
  setHistories
}: GroupListDialogProps) {
  const [groups, setGroups] = useState<DTO_GroupOverview[]>([])
  const overlayRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)

  const onClickGroup = useCallback((id: number) => {
    async function findRelatedUsersAndAssign() {
      const response = await CreateTaskPageAPIs.getUsersGroupToAssign(id) as ApiResponse<DTO_FastUserInfo[]>
      setOpenGrDialog(false)

      if (response.status !== 200)
        return
      
      setAssignedUsers(prev => {
        setHistories(prev)
        return {
          ...prev,
          ...response.body.reduce((acc, user) => ({
            ...acc,
            [extractEmailToGetId(user.email)]: user
          }), {})
        }
      })
    }
    findRelatedUsersAndAssign()
  }, [setOpenGrDialog, setAssignedUsers, setHistories])

  const onClickCloseDialog = useCallback(() => setOpenGrDialog(false), [setOpenGrDialog])

  useEffect(() => {
    async function getGroups() {
      setIsLoading(true)
      const response = await CreateTaskPageAPIs.getAllGroupsRelatedToUser() as ApiResponse<DTO_GroupOverview[]>
      if (response.status !== 200) {
        setIsLoading(false)
        return
      }
      setIsLoading(false)
      setGroups(response.body)
    }
    if (openGrDialog) getGroups()
  }, [openGrDialog])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (overlayRef.current && overlayRef.current.contains(event.target as Node)) {
        setOpenGrDialog(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [setOpenGrDialog])

  return <div className={`main-groups-dialog ${openGrDialog ? "" : "hidden"}`}>
    <div ref={overlayRef} className="dialog-overlay"></div>
    <div className="groups-container">
      <div className="groups-container-header">
        <div className="gch-title">
          <div className="gch-title-wrapper">
            <Users className="gch-title-icon"/>
            <span className="gch-title-text">Related Groups</span>
          </div>
          <div className="close-btn-wrapper">
            <X className="close-btn-icon" onClick={onClickCloseDialog}/>
          </div>
        </div>
      </div>
      <div className="groups-container-desc">
        <i className="gch-desc-text">Choose a Group will automatically choose all Users belongs to Group to assign.</i>
      </div>
      <ul className="groups-container-body">
        {isLoading
          ? <li className="loading-row">Loading...</li>
          : (groups.length === 0
            ? <li className="loading-row"><span>You have not joined any Groups</span></li>
            : groups.map((group, ind) => {
              const firstNameChar = group.name[0].toUpperCase()
              return <li key={"glt-" + ind} className="user-short-info gcb-group-line"
                onClick={() => onClickGroup(group.id)}>
                <span className="usi-ava" style={getColorByCharacter(firstNameChar)}>{firstNameChar}</span>
                <span className="usi-email">{group.name}</span>
                <span className={`usi-role gcb-${group.role.toLowerCase().replace("_", "-")}`}>{group.role}</span>
              </li>
            })
          )
        }
      </ul>
    </div>
  </div>
}