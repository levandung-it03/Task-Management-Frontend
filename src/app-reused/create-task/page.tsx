'use client'

import { useCallback, useState } from "react"
import { TaskCreationForm } from "./task-creation-form/task-creation.form"
import GroupListDialog from "./group-list-dialog/group-list.dialog"
import "./page.scss"
import CollectionDetail from "../task-list/collection-detail/collection-detail"
import RootTaskDetail from "./root-task-detail/root-task-detail"
import GlobalValidators from "@/util/global.validators"
import UsersRecDialog from "./users-rec-dialog/users-rec.dialog"
import { DTO_RecUsersRequest } from "@/dtos/users-rec.page.dto"
import { DTO_FastUserInfo } from "@/dtos/create-task.page.dto"
import { GeneralTools } from "@/util/general.helper"

export interface ReusableRootTaskData {
  startDate: string
  deadline: string
  level: string
  priority: string
  taskType: string
  description: string
  reportFormat: string
}

export default function CreateTask({ rootId, collectionId }: { collectionId: number, rootId?: number }) {
  const [recRequest, setRecRequest] = useState<DTO_RecUsersRequest>({
    domain: "",
    level: "",
    priority: "",
    numOfEmp: 0,
    authority: "",
    groupId: 0
  })
  const [openGrDialog, setOpenGrDialog] = useState(false)
  const [openUsersRecDialog, setOpenUsersRecDialog] = useState(false)
  const [assignedUsers, setAssignedUsers] = useState<Record<string, DTO_FastUserInfo>>({})
  const [assignedUsersHist, setAssignedUsersHist] = useState<Record<string, DTO_FastUserInfo>>({})
  const [canUndo, setCanUndo] = useState(true)
  const [rootData, setRootData] = useState<ReusableRootTaskData>({
    level: "",
    priority: "",
    taskType: "",
    startDate: GeneralTools.formatedDateToDateInput(new Date().toDateString()),
    deadline: GeneralTools.formatedDateToDateInput(new Date().toDateString()),
    description: "",
    reportFormat: ""
  })

  const setHistories = useCallback((prev: Record<string, DTO_FastUserInfo>) => {
    setAssignedUsersHist(prev)
    setCanUndo(true)
  }, [])

  return <div className="create-task">
    {GlobalValidators.nonNull(rootId) && rootId
      ? <RootTaskDetail taskId={rootId} setRootData={setRootData} />
      : <CollectionDetail collectionId={collectionId} showCompleteBtn={false} />}
    <TaskCreationForm
      rootId={rootId}
      rootData={rootData}
      collectionId={collectionId}
      assignedUsers={assignedUsers}
      setAssignedUsers={setAssignedUsers}
      setOpenGrDialog={setOpenGrDialog}
      setOpenUsersRecDialog={setOpenUsersRecDialog}
      canUndo={canUndo}
      setCanUndo={setCanUndo}
      assignedUsersHist={assignedUsersHist}
      setHistories={setHistories}
      setRecRequest={setRecRequest} />
    <GroupListDialog
      openGrDialog={openGrDialog}
      setAssignedUsers={setAssignedUsers}
      setOpenGrDialog={setOpenGrDialog}
      setHistories={setHistories} />
    <UsersRecDialog
      recRequest={recRequest}
      openUsersRecDialog={openUsersRecDialog}
      setOpenUsersRecDialog={setOpenUsersRecDialog}
      assignedUsers={assignedUsers}
      setAssignedUsers={setAssignedUsers}
      setHistories={setHistories} />
  </div>
}