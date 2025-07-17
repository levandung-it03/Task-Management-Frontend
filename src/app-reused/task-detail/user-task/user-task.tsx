'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import "./user-task.scss"
import { DTO_CommentOfReport, DTO_Report, DTO_ReportsComments, DTO_UpdateReport } from "@/dtos/user-task.page.dto"
import CreateReportForm from "./create-report/create-report"
import { UserTaskPageAPIs } from "@/apis/user-task.page.api"
import { ApiResponse } from "@/apis/general.api"
import toast from "react-hot-toast"
import { TextEditor } from "@/app-reused/text-editor/text-editor"
import { ClipboardMinus, Pencil, Send, SendHorizontal, X } from "lucide-react"
import { AuthHelper } from "@/util/auth.helper"
import { DTO_IdResponse } from "@/dtos/general.dto"

interface Comment {
  rootComment: DTO_CommentOfReport
  repliedComments: DTO_CommentOfReport[]
}

export default function UserTask({ userTaskId, taskId }: { userTaskId: number, taskId: number }) {

  return <div className="main-user-task">
    <CreateReportForm userTaskId={userTaskId} />
    <ReportList userTaskId={userTaskId} />
  </div>
}

function ReportList({ userTaskId }: { userTaskId: number }) {
  const [reportComments, setReportComments] = useState<DTO_ReportsComments[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isOwner, setIsOwner] = useState(false)

  useEffect(() => {
    async function fetchReports() {
      setIsLoading(true)
      const response = await UserTaskPageAPIs.getReportsAndComments(userTaskId) as ApiResponse<DTO_ReportsComments[]>
      if (String(response.status)[0] === "2") {
        setReportComments(response.body)
        setIsOwner(AuthHelper.isOwner(response.body[0].report.createdBy.email))
      }
      setIsLoading(false)
    }
    fetchReports()
  }, [])

  return <div className="report-list">
    {isLoading
      ? <span className="is-loading">Loading...</span>
      : reportComments.map((reportInfo, ind) =>
        <ReportFrame key={"rf-" + ind} reportInfo={reportInfo} isOwner={isOwner} />
      )}
  </div>
}

function ReportFrame({ reportInfo, isOwner }: { reportInfo: DTO_ReportsComments, isOwner: boolean }) {
  const [report, setReport] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)
  const canUpdated = useMemo(() =>
    reportInfo.report.createdTime === reportInfo.report.updatedTime
    , [reportInfo.report.createdTime, reportInfo.report.updatedTime])

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
      if (String(response.status)[0] === "2") {

      }
    }
    updateReport()
  }, [])

  const onClickCancelUpdate = useCallback(() => {
    setIsUpdating(false)
    setReport(reportInfo.report.content)
  }, [reportInfo.report.content])

  useEffect(() => setReport(reportInfo.report.content), [reportInfo.report.content])

  return <div className="report-and-comments">
    <div className="report-header">
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
          <span className={`quick-tag rh-status-${reportInfo.report.reportStatus.toLowerCase()}`}>
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
            <div className="report-btn-group">
              <button className="cancel-report-btn" onClick={onClickCancelUpdate}>
                <X className="report-btn-icon" />Cancel Update
              </button>
              <button className="report-btn" onClick={onClickUpdateReport}>
                <Send className="report-btn-icon" />Submit Report
              </button>
            </div>
          </>
          : <>
            <textarea id="desc-textarea" className="desc-textarea" value={report} disabled></textarea>
            {isOwner && <button
              className={`report-btn ${canUpdated ? "" : "report-btn-disabled"}`}
              type="button"
              onClick={() => setIsUpdating(true)}
              disabled={!canUpdated}
            >
              <Pencil className="report-btn-icon" />Update Report
            </button>}
          </>
        }
      </div>
      <CommentsGroup reportInfo={reportInfo} />
    </div>
  </div>
}

function CommentsGroup({ reportInfo }: { reportInfo: DTO_ReportsComments }) {
  const replyRef = useRef<HTMLInputElement>(null)
  const [comments, setComments] = useState<Record<number, Comment>>({})
  const [comment, setComment] = useState("")
  const [isReplying, setIsReplying] = useState(false)

  const onClickReplyComment = useCallback(() => {
    setIsReplying(true)
  }, [])

  const onChangeComment = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setComment(e.target.value)
  }, [])

  useEffect(() => setComments(buildNestedTwoLevelsComment(reportInfo.comments)), [reportInfo.comments])
  useEffect(() => replyRef.current?.focus(), [isReplying])

  return <div className="comments-wrapper">
    <div className="comments-group">
      {reportInfo.comments.length === 0
        ? <span className="empty-comment">There's no comment here.</span>
        : Object.entries(comments).map(([key, rootComment]) => (
          <div key={"ec-" + key} className="comment-group">
            <RootCommentFrame comment={rootComment.rootComment} onClickReplyComment={onClickReplyComment} />
            <div className="sub-comment-group">
              {rootComment.repliedComments.map(subComment => (
                <SubCommentFrame key={"ec-" + subComment.id} comment={subComment} />
              ))}
              {isReplying && <ReplyCommentFrame replyRef={replyRef} setIsReplying={setIsReplying} />}
            </div>

          </div>
        ))
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
        <SendHorizontal className="comment-send-btn" />
      </fieldset>
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

function ReplyCommentFrame({ replyRef, setIsReplying }: {
  replyRef: React.RefObject<HTMLInputElement>,
  setIsReplying: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const [replying, setReplying] = useState("")

  const onChangeReplying = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setReplying(e.target.value)
  }, [])

  const onClickReplyComment = useCallback(() => {
    async function replyComment() {
      const response = await UserTaskPageAPIs.createReplyComment(replying) as ApiResponse<DTO_IdResponse>
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
        <SendHorizontal className="comment-send-btn" onClick={onClickReplyComment}/>
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

  for (let rawComment of copiedComments) {
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