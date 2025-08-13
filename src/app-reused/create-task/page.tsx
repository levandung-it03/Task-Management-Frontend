'use client'

import { useCallback, useState } from "react"
import { TaskCreationForm } from "./task-creation-form/task-creation.form"
import GroupListDialog from "./group-list-dialog/group-list.dialog"
import "./page.scss"
import CollectionDetail from "../task-list/collection-detail/collection-detail"
import RootTaskDetail from "./root-task-detail/root-task-detail"
import GlobalValidators from "@/util/global.validators"

export default function CreateTask({ rootId, collectionId }: { collectionId: number, rootId?: number }) {
  const [openDialog, setOpenDialog] = useState(false)
  const [assignedUsers, setAssignedUsers] = useState<Record<string, Record<string, string>>>({})
  const [assignedUsersHist, setAssignedUsersHist] = useState<Record<string, Record<string, string>>>({})
  const [canUndo, setCanUndo] = useState(true)

  const setHistories = useCallback((prev: Record<string, Record<string, string>>) => {
    setAssignedUsersHist(prev)
    setCanUndo(true)
  }, [])

  return <div className="create-task">
    {GlobalValidators.nonNull(rootId) && rootId
      ? <RootTaskDetail taskId={rootId} />
      : <CollectionDetail collectionId={collectionId} showCompleteBtn={false} />}
    <TaskCreationForm
      rootId={rootId}
      collectionId={collectionId}
      assignedUsers={assignedUsers}
      setAssignedUsers={setAssignedUsers}
      setOpenDialog={setOpenDialog}
      canUndo={canUndo}
      setCanUndo={setCanUndo}
      assignedUsersHist={assignedUsersHist}
      setHistories={setHistories} />
    <GroupListDialog
      openDialog={openDialog}
      setAssignedUsers={setAssignedUsers}
      setOpenDialog={setOpenDialog}
      setHistories={setHistories} />
  </div>
}