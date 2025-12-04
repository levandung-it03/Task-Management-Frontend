'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import "./user-task.scss"
import { DTO_CommentOfReport, DTO_CreateComment, DTO_RejectReport, DTO_ReportsComments, DTO_UpdateReport } from "@/dtos/user-task.page.dto"
import CreateReportForm from "./create-report/create-report"
import { UserTaskPageAPIs } from "@/apis/user-task.page.api"
import { ApiResponse, GeneralAPIs } from "@/apis/general.api"
import toast from "react-hot-toast"
import { TextEditor } from "@/app-reused/text-editor/text-editor"
import { BookmarkX, Check, CircleCheckBig, CircleSlash, ClipboardMinus, Pencil, Send, SendHorizontal, X } from "lucide-react"
import { TaskDetailPageAPIs } from "@/apis/task-detail.page.api"
import { DTO_TaskDelegator, DTO_TaskDetail } from "@/dtos/task-detail.page.dto"
import GlobalValidators from "@/util/global.validators"
import { UserTaskService } from "./user-task.service"
import { confirm } from "@/app-reused/confirm-alert/confirm-alert"
import { DTO_EmailResponse } from "@/dtos/general.dto"
import { AuthHelper } from "@/util/auth.helper"
import { FileIcon } from "@/assets/file.icon"

interface Comment {
  rootComment: DTO_CommentOfReport
  repliedComments: DTO_CommentOfReport[]
}
/**
 * [IMPLEMENTED]
 * 1. PM/LEAD can see their own Task
 * 2. EMP can see assigned User-Task
 * Prevent? API did it!
 * Why do we need to query taskInfo? To check if this is owner (to show Reject/Approve buttons).
 */
export default function UserTask({ userTaskId, taskId }: { userTaskId: number, taskId: number }) {
  const [reportComments, setReportComments] = useState<DTO_ReportsComments[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isReportOwner, setIsReportOwner] = useState(false)
  const [canReviewReport, setCanReviewReport] = useState(false)
  const [taskInfo, setTaskInfo] = useState<DTO_TaskDetail>({
    id: 0,
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
    hasAtLeastOneReport: false,
    projectInfo: { id: 0, name: "" },
    phaseInfo: { id: 0, name: "" },
    collectionInfo: { id: 0, name: "" }
  })

  useEffect(() => {
    async function getDetail() {
      let result = {}
      const response = await TaskDetailPageAPIs.getTaskDetail(taskId) as ApiResponse<DTO_TaskDetail>
      if (String(response.status)[0] !== "2")
        return

      result = { ...response.body }
      const delegatorRes = await TaskDetailPageAPIs.getTaskDelegator(taskId) as ApiResponse<DTO_TaskDelegator>
      if (String(delegatorRes.status).startsWith("2")) {
        result = { ...result, ...delegatorRes.body }
      }
      setTaskInfo(prev => ({ ...prev, ...result }))
    }
    getDetail()
  }, [taskId])

  useEffect(() => {
    if (!taskInfo.userInfo.email)
      return
    async function fetchReports() {
      setIsLoading(true)
      const response = await UserTaskPageAPIs.getReportsAndComments(userTaskId) as ApiResponse<DTO_ReportsComments[]>
      if (String(response.status)[0] !== "2")
        return

      const emailRes = await GeneralAPIs.getEmail() as ApiResponse<DTO_EmailResponse>
      if (String(emailRes.status)[0] !== "2")
        return

      const assignedRes = await UserTaskPageAPIs.isAssignedUser(userTaskId) as ApiResponse<Record<string, boolean>>
      if (String(assignedRes.status)[0] !== "2")
        return

      setIsLoading(false)
      const isTaskOwner = emailRes.body.email === taskInfo.userInfo.email
      const isAssignedUser = assignedRes.body.result

      //--Just "Task-Owner", "Assigned-User" and "Project-Owner" can see this page.
      setIsReportOwner(isAssignedUser)
      setCanReviewReport(isTaskOwner) //--Is the Task Creater (PM, LEAD not own this Task cannot Review them)

      setReportComments(response.body)
    }
    fetchReports()
  }, [userTaskId, taskInfo.userInfo.email])

  return <div className="main-user-task">
    <div className="introduction">
      <Delegator taskInfo={taskInfo} />
      <CreateReportForm userTaskId={userTaskId} taskInfo={taskInfo} reportComments={reportComments}/>
      {isReportOwner
        ? <CreateReportForm userTaskId={userTaskId} taskInfo={taskInfo} reportComments={reportComments}/>
        : <div className="form-caption">
          <FileIcon className="caption-icon" />
          <span className="caption-content">Reports</span>
          <i className="desc-content">All reports of Assigned User are shown here.</i>
        </div>}
    </div>
    {isLoading
      ? <span className="loading-row">Loading...</span>
      : (reportComments.length === 0
        ? <div className="loading-row">There are no Report submitted</div>
        : <ReportList
          reportComments={reportComments}
          isReportOwner={isReportOwner}
          canReviewReport={canReviewReport}
          setReportComments={setReportComments} />
      )}
  </div>
}

function Delegator({ taskInfo }: { taskInfo: DTO_TaskDetail }) {
  return <div className="detail-delegator">
    <a href={`/${AuthHelper.getRoleFromToken()}/projects/${taskInfo.projectInfo.id}/phases`}>
      {taskInfo.projectInfo.name}
    </a>
    <span>&gt;</span>
    <a href={`/${AuthHelper.getRoleFromToken()}/phases/${taskInfo.phaseInfo.id}/collections`}>
      {taskInfo.phaseInfo.name}
    </a>
    <span>&gt;</span>
    <a href={`/${AuthHelper.getRoleFromToken()}/collections/${taskInfo.collectionInfo.id}/tasks`}>
      {taskInfo.collectionInfo.name}
    </a>
    {taskInfo !== null && <>
      <span>&gt;</span>
      <a href={`/${AuthHelper.getRoleFromToken()}/task-detail/${taskInfo.id}`}>
        {taskInfo.name}
      </a>
    </>}
  </div>
}

function ReportList({ reportComments, isReportOwner, canReviewReport, setReportComments }: {
  reportComments: DTO_ReportsComments[],
  isReportOwner: boolean,
  canReviewReport: boolean,
  setReportComments: React.Dispatch<React.SetStateAction<DTO_ReportsComments[]>>
}) {

  return <div className="report-list">
    {reportComments.map((reportInfo, ind) =>
      <ReportFrame
        key={"rf-" + ind}
        reportInd={ind}
        reportInfo={reportInfo}
        isReportOwner={isReportOwner}
        canReviewReport={canReviewReport}
        setReportComments={setReportComments} />
    )}
  </div>
}

function ReportFrame({ reportInd, reportInfo, isReportOwner, canReviewReport, setReportComments }: {
  reportInd: number,
  reportInfo: DTO_ReportsComments,
  isReportOwner: boolean,
  canReviewReport: boolean,
  setReportComments: React.Dispatch<React.SetStateAction<DTO_ReportsComments[]>>
}) {
  const [openRejectDialog, setIsRejecting] = useState(false)
  const [report, setReport] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)
  const canUpdated = useMemo(() =>
    reportInfo.report.createdTime === reportInfo.report.updatedTime
      && reportInfo.report.reportStatus === "WAITING"
    , [reportInfo.report.createdTime, reportInfo.report.updatedTime])

  const addNewComment = useCallback((response: DTO_CommentOfReport) => {
    setReportComments(prev => {
      const newReports = [...prev];
      const targetReport = { ...newReports[reportInd] };
      targetReport.comments = [...targetReport.comments, response];
      newReports[reportInd] = targetReport;
      return newReports;
    })
  }, [setReportComments, reportInd])

  const onClickUpdateReport = useCallback(() => {
    async function updateReport() {
      if (report.trim() === reportInfo.report.content) {
        toast.error("Report unchanges and cannot be updated.")
        return
      }
      const request = DTO_UpdateReport.withBuilder()
        .breportId(reportInfo.report.id)
        .breport(report)
      const response = await UserTaskPageAPIs.updateReport(request) as ApiResponse<void>
      if (String(response.status).startsWith("2")) {
        toast.success(response.msg)
        window.location.reload()
        return
      }
    }
    updateReport()
  }, [report, reportInfo.report.content, reportInfo.report.id])

  const onClickCancelUpdate = useCallback(() => {
    setIsUpdating(false)
    setReport(reportInfo.report.content)
  }, [reportInfo.report.content])

  const onClickApproveReport = useCallback(() => {
    async function reviewReport() {
      if (!(await confirm("This action cannot be undone. Are you sure?")))
        return
      if (report.trim() === reportInfo.report.content) {
        toast.error("Report unchanges and cannot be updated.")
        return
      }
      const response = await UserTaskPageAPIs.approveReport(reportInfo.report.id) as ApiResponse<void>
      if (String(response.status).startsWith("2")) {
        toast.success(response.msg)
        window.location.reload()
        return
      }
    }
    reviewReport()
  }, [])

  const ButtonsWhenUpdating = useCallback(() => (
    <div className="report-btn-group">
      <button className="cancel-report-btn" onClick={onClickCancelUpdate}>
        <X className="report-btn-icon" />Cancel Update
      </button>
      <button className="report-btn" onClick={onClickUpdateReport}>
        <Send className="report-btn-icon" />Submit Report
      </button>
    </div>
  ), [report, onClickCancelUpdate, onClickUpdateReport])

  const ButtonWhenSuperiorSeeing = useCallback(() => (
    <div className="report-btn-group">
      <button className="cancel-report-btn" onClick={() => setIsRejecting(true)}>
        <CircleSlash className="report-btn-icon" />Reject Report
      </button>
      <button className="report-btn" onClick={onClickApproveReport}>
        <Check className="report-btn-icon" />Approve Report
      </button>
    </div>
  ), [onClickApproveReport])

  const ButtonsWhenNotUpdating = useCallback(() => {
    if (isReportOwner)
      return <button
        className={`report-btn ${canUpdated ? "" : "report-btn-disabled"}`}
        onClick={() => setIsUpdating(true)}
        disabled={!canUpdated}
      >
        <Pencil className="report-btn-icon" />Update Report
      </button>

    if (canReviewReport && reportInfo.report.reviewedTime === null)
      return <ButtonWhenSuperiorSeeing />

    if (reportInfo.report.reviewedTime !== null)
      return <button className="disabled-btn reviewed-btn" disabled>
        <CircleCheckBig className="reviewed-icon" />
        Reviewed
      </button>
  }, [canReviewReport, isReportOwner, canUpdated])

  useEffect(() => setReport(reportInfo.report.content), [reportInfo.report.content])

  return <>
    <div className="report-and-comments">
      <div className={`report-header report-header-${reportInfo.report.reportStatus.toLowerCase()}`}>
        <h1 className="rh-title">
          <ClipboardMinus className="rh-title-icon" />
          {reportInfo.report.title}
        </h1>
        <div className="rh-info created-by-user">
          <span className="rh-label">OWNER</span>
          <span className="rh-value">{reportInfo.report.createdBy.fullName}</span>
        </div>
        <div className="rh-info created-time">
          <span className="rh-label">CREATED</span>
          <span className="rh-value">{reportInfo.report.createdTime}</span>
        </div>
        <div className="rh-info updated-time">
          <span className="rh-label">UPDATED</span>
          <span className="rh-value">{reportInfo.report.updatedTime}</span>
        </div>
        <div className="rh-info status">
          <span className="rh-label">STATUS</span>
          <span className="rh-value">
            <span className={`quick-blue-tag rh-status-${reportInfo.report.reportStatus.toLowerCase()}`}>
              {reportInfo.report.reportStatus}
            </span>
          </span>
        </div>
        {reportInfo.report.reviewedTime && <div className="rh-info reviewed-time">
          <span className="rh-label">REVIEWED</span>
          <span className="rh-value">{reportInfo.report.reviewedTime}</span>
        </div>}
      </div>
      {reportInfo.report.rejectedReason && <div className="rejected-reason">
        <span className="rejected-value">
          <b className="rejected-label">Rejected Reason: </b>
          {reportInfo.report.rejectedReason}
        </span>
      </div>}
      <div className="report-info-wrapper">
        <div className="report-content">
          {isUpdating
            ? <>
              <TextEditor state={report} setState={setReport} />
              <ButtonsWhenUpdating />
            </>
            : <>
              <textarea id="desc-textarea" className="desc-textarea" value={report} disabled></textarea>
              <ButtonsWhenNotUpdating />
            </>}
        </div>
        <CommentsGroup
          reportInfo={reportInfo}
          addNewComment={addNewComment}
        />
      </div>
    </div>
    {openRejectDialog && <RejectingReportDialog reportId={reportInfo.report.id} setIsRejecting={setIsRejecting} />}
  </>
}

function CommentsGroup({ reportInfo, addNewComment }: {
  reportInfo: DTO_ReportsComments,
  addNewComment: (response: DTO_CommentOfReport) => void
}) {
  const [comments, setComments] = useState<Record<number, Comment>>({})
  const [comment, setComment] = useState("")

  const onChangeComment = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setComment(e.target.value)
  }, [])

  const onClickCreateRootComment = useCallback(() => {
    async function replyComment() {
      if (comment.trim().length === 0) {
        toast.error("Plesae type comment!")
        return
      }
      const request = DTO_CreateComment.withBuilder()
        .breportId(reportInfo.report.id)
        .bcontent(comment)
      const response = await UserTaskPageAPIs.createComment(request) as ApiResponse<DTO_CommentOfReport>
      if (String(response.status).startsWith("2")) {
        toast.success(response.msg)
        addNewComment(response.body)
        setComment("")
        return
      }
    }
    replyComment()
  }, [comment, reportInfo.report.id])

  useEffect(() => {
    const res = buildNestedTwoLevelsComment(reportInfo.comments)
    setComments(res)
  }, [reportInfo.comments])

  return <div className="comments-wrapper">
    <div className="comments-group">
      {reportInfo.comments.length === 0
        ? <span className="empty-comment">There is no comment here.</span>
        : Object.entries(comments).map(([key, commentAndReplies]) =>
          <AllRelativeCommentsContainer
            key={"ec-" + key}
            commentAndReplies={commentAndReplies}
            reportId={reportInfo.report.id}
            addNewComment={addNewComment}
          />)
      }
    </div>
    <div className="form-group-container create-comment">
      <fieldset className="form-group">
        <legend className="form-label">Comment</legend>
        <input
          name={"comment-" + reportInfo.report}
          className="form-input"
          value={comment}
          autoComplete="off"
          onChange={onChangeComment}
        />
        <SendHorizontal className="comment-send-btn" onClick={onClickCreateRootComment} />
      </fieldset>
    </div>
  </div>
}

function AllRelativeCommentsContainer({ commentAndReplies, reportId, addNewComment }: {
  commentAndReplies: Comment,
  reportId: number,
  addNewComment: (response: DTO_CommentOfReport) => void
}) {
  const replyRef = useRef<HTMLInputElement>(null)
  const [isReplying, setIsReplying] = useState(false)

  const onClickReplyComment = useCallback(() => {
    setIsReplying(true)
  }, [])

  useEffect(() => replyRef.current?.focus(), [isReplying])

  return <div className="comment-group">
    <RootCommentFrame comment={commentAndReplies.rootComment} onClickReplyComment={onClickReplyComment} />
    <div className="sub-comment-group">
      {commentAndReplies.repliedComments.map(repliedComment => (
        <SubCommentFrame key={"ec-" + repliedComment.id} comment={repliedComment} />
      ))}
      {isReplying && <ReplyCommentFrame
        reportId={reportId}
        rootCommentId={commentAndReplies.rootComment.id}
        replyRef={replyRef}
        setIsReplying={setIsReplying}
        addNewComment={addNewComment}
      />}
    </div>
  </div>
}

function RootCommentFrame({ comment, onClickReplyComment }: {
  onClickReplyComment: () => void,
  comment: DTO_CommentOfReport
}) {
  return <div className="root-comment comment-frame">
    <div className="comment-header rcf-header">
      <b className="comment-owner rcf-owner">{comment.createdBy.fullName}</b>
      <span className="comment-time rcf-time">{comment.createdTime}</span>
    </div>
    <span className="comment-content rcf-content">{comment.comment}</span>
    <div className="rcf-reply-btn-wrapper">
      <button className="rcf-reply-btn" onClick={onClickReplyComment}>
        Reply
      </button>
    </div>
  </div>
}

function SubCommentFrame({ comment }: { comment: DTO_CommentOfReport }) {
  return <div className="sub-comment comment-frame">
    <div className="comment-header scf-header">
      <b className="comment-owner scf-owner">{comment.createdBy.fullName}</b>
      <span className="comment-time scf-time">{comment.createdTime}</span>
    </div>
    <span className="comment-content scf-content">{comment.comment}</span>
  </div>
}

function ReplyCommentFrame({ replyRef, setIsReplying, reportId, rootCommentId, addNewComment }: {
  replyRef: React.RefObject<HTMLInputElement>,
  setIsReplying: React.Dispatch<React.SetStateAction<boolean>>,
  reportId: number,
  rootCommentId: number,
  addNewComment: (response: DTO_CommentOfReport) => void
}) {
  const [replying, setReplying] = useState("")

  const onChangeReplying = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setReplying(e.target.value)
  }, [])

  const onClickReplyComment = useCallback(() => {
    async function replyComment() {
      if (replying.trim().length === 0) {
        toast.error("Plesae type comment!")
        return
      }
      const request = DTO_CreateComment.withBuilder()
        .breportId(reportId)
        .brepliedCommentId(rootCommentId)
        .bcontent(replying)
      const response = await UserTaskPageAPIs.createComment(request) as ApiResponse<DTO_CommentOfReport>
      if (String(response.status).startsWith("2")) {
        toast.success(response.msg)
        addNewComment(response.body)
        setIsReplying(false)
        return
      }
    }
    replyComment()
  }, [replying])

  return <>
    <div className="form-group-container reply-comment">
      <fieldset className="form-group">
        <legend className="form-label">Replying</legend>
        <input
          ref={replyRef}
          name={"replied-comment"}
          className="form-input"
          value={replying}
          autoComplete="off"
          onChange={onChangeReplying}
        />
        <SendHorizontal className="comment-send-btn" onClick={onClickReplyComment} />
      </fieldset>
    </div>
    <div className="rcf-cancel-btn-wrapper">
      <button className="rcf-cancel-btn" onClick={() => setIsReplying(false)}>
        Cancel Reply
      </button>
    </div>
  </>
}

function buildNestedTwoLevelsComment(rawComments: DTO_CommentOfReport[]) {
  if (rawComments.length === 0)
    return {}
  const comments: Record<number, Comment> = {}
  const copiedComments: DTO_CommentOfReport[] = [...rawComments].sort((a, b) =>
    new Date(a.createdTime).getTime() - new Date(b.createdTime).getTime()
  );

  for (const rawComment of copiedComments) {
    if (!comments[rawComment.repliedCommendId])
      comments[rawComment.id] = {
        rootComment: rawComment,
        repliedComments: []
      }
    else
      comments[rawComment.repliedCommendId].repliedComments.push(rawComment)
  }
  return comments
}

function RejectingReportDialog({ reportId, setIsRejecting }: {
  reportId: number,
  setIsRejecting: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const [content, setContent] = useState<string>("")
  const [formTouched, setFormTouched] = useState(false)
  const [formValidation, setFormValidation] = useState({
    content: ""
  })

  const onClickRejectReport = useCallback(() => {
    async function rejectReport() {
      if (GlobalValidators.isInvalidValidation(formTouched, formValidation))
        return
      const request = DTO_RejectReport.withBuilder()
        .breportId(reportId)
        .brejectedReason(content)
      const response = await UserTaskPageAPIs.rejectReport(request) as ApiResponse<void>
      if (String(response.status).startsWith("2")) {
        toast.success(response.msg)
        return
      }
      setIsRejecting(false)
      window.location.reload()
    }
    rejectReport()
  }, [reportId, content, setIsRejecting, formTouched])

  const onClickCancelDialog = useCallback(() => {
    setIsRejecting(false)
  }, [setIsRejecting])

  const onChangeContent = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setContent(e.target.value)
    setFormTouched(true)
    setFormValidation(prev => ({ ...prev, content: UserTaskService.isValidContent(e.target.value.trim()) }))
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (overlayRef.current && overlayRef.current.contains(event.target as Node)) {
        setIsRejecting(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [setIsRejecting])

  return <div className="reject-dialog">
    <div ref={overlayRef} className="dialog-overlay"></div>
    <div className="dialog-container">
      <span className="dialog-header">
        <BookmarkX className="dhc-icon" />
        Rejecting Report
      </span>
      <div className="form-group-container reject-content">
        <fieldset className="form-group">
          <legend className="form-label">Reason</legend>
          <input
            name="rejected-comment"
            className="form-input"
            value={content}
            autoComplete="off"
            onChange={onChangeContent}
            placeholder="Why do you reject?"
          />
        </fieldset>
        {GlobalValidators.notEmpty(formValidation.content) && <span className="input-err-msg">{formValidation.content}</span>}
      </div>
      <div className="reject-btn-container">
        <button className="cancel-content-btn" onClick={onClickCancelDialog} >
          Cancel
        </button>
        <button className="submit-content-btn" onClick={onClickRejectReport} >
          Submit
        </button>
      </div>
    </div>
  </div>
}