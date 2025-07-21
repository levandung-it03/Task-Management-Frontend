'use client'

import { BookUser, Plus } from "lucide-react"
import "./page.scss"
import React, { useMemo, useState } from "react"
import { GroupCreationDialog } from "@/app-reused/groups/create-group-dialog/create-group.dialog"
import { GroupsContainer } from "@/app-reused/groups/groups-container.page"
import { AuthHelper } from "@/util/auth.helper"

export default function GroupsPage() {
  const role = useMemo(() => AuthHelper.getRoleFromToken().toUpperCase(), [])
  const [openDialog, setOpenDialog] = useState(false)

  return <div className="groups-page">
    <div className="groups-page-header">
      <div className="form-caption">
        <BookUser className="caption-icon" />
        <span className="caption-content">Groups</span>
        <i className="desc-content">All your related Groups shown here.</i>
      </div>
      {role !== AuthHelper.EMP_ROLE && <div className="create-group-wrapper">
        <button className="cgw-btn" onClick={() => setOpenDialog(true)}>
          <Plus className="cgw-btn-icon" />
          Create Group
        </button>
      </div>}
    </div>
    <GroupsContainer />
    {openDialog && <GroupCreationDialog openDialog={openDialog} setOpenDialog={setOpenDialog} />}
  </div>
}