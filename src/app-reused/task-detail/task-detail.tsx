'use client'

import "./task-detail.scss"
import { useCallback, useEffect, useMemo, useState } from 'react'
import { TaskDetailPageAPIs } from '@/apis/task-detail.page.api'
import { ApiResponse, GeneralAPIs } from '@/apis/general.api'
import { TaskBasicInfo } from './task-basic-info/task-basic-info'
import AssignedUsers from './assigned-users/assigned-users'
import SubTasks from './sub-tasks/sub-tasks'
import TaskDetailInteractBtns from "./status-buttons/status-buttons"
import { DTO_TaskDetail, DTO_TaskUser } from "@/dtos/task-detail.page.dto"
import { DTO_EmailResponse } from "@/dtos/general.dto"
import { AuthHelper } from "@/util/auth.helper"
import { ArrowLeft, BookmarkCheck, Play, ShieldAlert } from "lucide-react"
import toast from "react-hot-toast"
import { prettierTime } from "./task-detail.service"

/**
 * Prevent weird user accessing (not create this task, not assigned on this task)? API did for us!
 * Business Logics:
 * 1. Task Owner (token.email and taskInfo.userInfo.email) can see "Update" Buttons
 * 2. Assigned Users cannot do anything if Task.isLocked=true
 */
export default function TaskDetail({ taskId }: { taskId: number }) {
  const [curEmail, setCurEmail] = useState("")
  const [totalUsers, setTotalUsers] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [taskInfo, setTaskInfo] = useState<DTO_TaskDetail>({
    id: 1,
    userInfo: {
      fullName: "",
      email: "",
      role: "",
      department: ""
    },
    rootTaskId: null,
    name: "",
    description: "",
    reportFormat: "",
    level: "",
    taskType: "",
    priority: "",
    startDate: "",
    isLocked: false,
    endDate: null,
    deadline: "",
    createdTime: "",
    updatedTime: "",
    hasApprovedReport: false,
    reportsQty: 0,
    projectInfo: {
      id: 0,
      name: ""
    },
    phaseInfo: {
      id: 0,
      name: ""
    },
    collectionInfo: {
      id: 0,
      name: ""
    }
  })
  const [assignedUsers, setAssignedUsers] = useState<DTO_TaskUser[]>([])
  const isRootTask = useMemo(() => taskInfo.rootTaskId === null, [taskInfo.rootTaskId]);
  const isOwner = useMemo(() => taskInfo.userInfo.email === curEmail, [taskInfo.userInfo.email, curEmail]);
  const curUserTask = useMemo<DTO_TaskUser>(() =>
    assignedUsers.filter(user => user.email === curEmail)[0]
  , [curEmail, assignedUsers]);

  useEffect(() => {
    async function fetchCurUserInfo() {
      const response = await GeneralAPIs.getEmail() as ApiResponse<DTO_EmailResponse>
      if (String(response.status).startsWith("2"))
        setCurEmail(response.body.email);
    }
    fetchCurUserInfo()
  }, [taskInfo.userInfo.email])

  useEffect(() => {
    async function getDetail() {
      setIsLoading(true)
      const response = await TaskDetailPageAPIs.getTaskDetail(taskId) as ApiResponse<DTO_TaskDetail>
      if (String(response.status).startsWith("2")) {
        setTaskInfo(response.body)
        setIsLoading(false)
      }
    }
    getDetail()
  }, [taskId])

  return (isLoading
    ? <div className="loading-row">Loading...</div>
    : curUserTask
      && taskInfo.endDate === null
      && curUserTask.startedTime === null
      ? <HoldingPopup
        assignedUser={assignedUsers[0]}
        setAssignedUsers={setAssignedUsers}
        taskInfo={taskInfo}/>
      : <div className="task-detail-container">
        <TaskBasicInfo
          taskInfo={taskInfo}
          setTaskInfo={setTaskInfo}
          totalUsers={totalUsers}
          isRootTask={isRootTask}
          setAssignedUsers={setAssignedUsers}
          curUserTask={curUserTask} />
        <SubTasks taskInfo={taskInfo} />
        <AssignedUsers
          taskInfo={taskInfo}
          isTaskOwner={isOwner}
          setTotalUsers={setTotalUsers}
          isRootTask={isRootTask}
          assignedUsers={assignedUsers}
          setAssignedUsers={setAssignedUsers} />
        {isOwner && <TaskDetailInteractBtns taskInfo={taskInfo} setTaskInfo={setTaskInfo} />
      }
    </div>
  )
}

function HoldingPopup({ assignedUser, setAssignedUsers, taskInfo }: {
  assignedUser: DTO_TaskUser,
  setAssignedUsers: React.Dispatch<React.SetStateAction<DTO_TaskUser[]>>,
  taskInfo: DTO_TaskDetail
}) {
  const redirectUrl = useMemo(() => {
    if (taskInfo.collectionInfo) {
      return `/${AuthHelper.getRoleFromToken()}/collections/${taskInfo.collectionInfo.id}/tasks`;
    }
  }, [taskInfo.collectionInfo]);

  const onClickAssignedUserStartTask = useCallback(() => {
    async function startAssignedTask() {
      const response = await TaskDetailPageAPIs.startAssignedUserTask(assignedUser.id) as ApiResponse<void>
      if (String(response.status).startsWith("2")) {
        toast.success(response.msg);
        setAssignedUsers(prev => {
          const temp = [...prev];
          temp[0].startedTime = prettierTime(new Date().toISOString())
          return temp;
        })
      }
    }
    startAssignedTask();
  }, [setAssignedUsers])

  return <div className="popup-container">
    <div className="pc-hidden-warning">
      <h1 className="pchw-content">
        <ShieldAlert className="pchwc-icon"/>
        Information is hidden!
      </h1>
    </div>
    <div className="pc-overlay"></div>
    <div className="task-info-popup">
      <div className="tip-title">
        <BookmarkCheck className="tipt-icon" />
        Confirm Starting
      </div>
      <div className="ti-line">
        <b className="til-title">Task ID: </b>
        <span className="til-val task-id">{taskInfo.id}</span>
      </div>
      <div className="ti-line">
        <b className="til-title">Task Name: </b>
        <span className="til-val">{taskInfo.name} {taskInfo.name} {taskInfo.name} {taskInfo.name} {taskInfo.name} {taskInfo.name} {taskInfo.name} {taskInfo.name} {taskInfo.name}</span>
      </div>
      <div className="ti-line">
        <b className="til-title">Priority: </b>
        <span className={`til-val task-priority task-priority-${taskInfo.priority.toLowerCase()}`}>
          {taskInfo.priority}
        </span>
      </div>
      <div className="ti-line">
        <b className="til-title">Level: </b>
        <span className={`til-val task-level task-level-${taskInfo.level.toLowerCase()}`}>
          {taskInfo.level}
        </span>
      </div>
      <div className="ti-line">
        <b className="til-title">Type: </b>
        <span className="til-val quick-blue-tag">{taskInfo.taskType}</span>
      </div>
      <div className="ti-line">
        <b className="til-title">Expected Start: </b>
        <span className="til-val quick-blue-tag">{taskInfo.startDate}</span>
      </div>
      <div className="ti-line">
        <b className="til-title">Deadline: </b>
        <span className="til-val quick-blue-tag">{taskInfo.deadline}</span>
      </div>
      <div className="ti-line">
        <b className="til-title">Description: </b>
        <span className="til-val">{shortenByWords(taskInfo.description)}</span>
      </div>
      <div className="ti-btn-block">
        <a className="ti-btn back" href={redirectUrl}>
          <ArrowLeft className="ti-btn-icon" />
          Back to Collection
        </a>
        <button className="ti-btn start" onClick={onClickAssignedUserStartTask}>
          Start
          <Play className="ti-btn-icon" />
        </button>
      </div>
    </div>
  </div>
}

function shortenByWords(text: string, maxWords = 5): string {
  if (!text) return "";

  const words = text.trim().split(/\s+/);
  if (words.length <= maxWords)
    return text;

  return words.slice(0, maxWords).join(" ") + "...";
}