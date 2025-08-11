'use client'

import { useCallback, useState } from "react"
import { TaskCreationForm } from "./task-creation-form/task-creation.form"
import GroupListDialog from "./group-list-dialog/group-list.dialog"
import "./page.scss"

export default function CreateTask({ rootId }: { rootId?: number }) {
  const [openDialog, setOpenDialog] = useState(false)
  const [assignedUsers, setAssignedUsers] = useState<Record<string, Record<string, string>>>({})
  const [assignedUsersHist, setAssignedUsersHist] = useState<Record<string, Record<string, string>>>({})
  const [canUndo, setCanUndo] = useState(true)

  const setHistories = useCallback((prev: Record<string, Record<string, string>>) => {
    setAssignedUsersHist(prev)
    setCanUndo(true)
  }, [])

  return <div className="create-task">
    <TaskCreationForm
      rootId={rootId}
      collectionId={1}
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