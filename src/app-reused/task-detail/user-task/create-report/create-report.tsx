'use client'

import { TextEditor } from "@/app-reused/text-editor/text-editor";
import { DTO_TaskDetail } from "@/dtos/task-detail.page.dto";
import React, { useCallback, useEffect, useState } from "react";
import "./create-report.scss";
import HelpContainer from "@/app-reused/help-container/page";
import GlobalValidators from "@/util/global.validators";
import CreateReportService from "./create-report.service";
import { FileIcon } from "@/assets/file.icon";
import { UserTaskPageAPIs } from "@/apis/user-task.page.api";
import { DTO_ReportRequest } from "@/dtos/user-task.page.dto";
import { ApiResponse } from "@/apis/general.api";
import { DTO_IdResponse } from "@/dtos/general.dto";
import toast from "react-hot-toast";
import { GeneralTools } from "@/util/general.helper";

export interface CreateReportFormProps {
  userTaskId: number;
  taskInfo: DTO_TaskDetail;
}

export default function CreateReportForm({ userTaskId, taskInfo }: CreateReportFormProps) {
  const [format, setFormat] = useState("")
  const [report, setReport] = useState("")
  const [title, setTitle] = useState("")
  const [formTouched, setFormTouched] = useState(false)
  const [formValidation, setFormValidation] = useState({
    title: ""
  })

  const onChangeName = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
    setFormTouched(true)
    setFormValidation(prev => ({ ...prev, title: CreateReportService.isValidName(e.target.value) }))
  }, [])

  const onClickSubmitReport = useCallback(() => {
    async function submitReport() {
      if (GlobalValidators.isInvalidValidation(formTouched, formValidation))
        return
      if (report.trim().length === 0) {
        toast.error("Report cannot be empty")
        return
      }
      const request = DTO_ReportRequest.withBuilder()
        .btitle(title)
        .bcontent(report)
        .btaskUserId(userTaskId)
      const response = await UserTaskPageAPIs.createReport(request) as ApiResponse<DTO_IdResponse>
      if (String(response.status).startsWith("2")) {
        toast.success(response.msg)
        GeneralTools.reloadAfterDelay();
      }
    }
    submitReport()
  }, [title, report, userTaskId])

  useEffect(() => setFormat(taskInfo.reportFormat), [taskInfo.reportFormat])

  return <div className="report-creation">
    <div className="form-caption">
      <FileIcon className="caption-icon" />
      <span className="caption-content">Submit Report</span>
      <i className="desc-content">Fill these information to submit Report to complete the Task.</i>
    </div>
    <div className="form-group-container">
      <fieldset className="form-group">
        <legend className="form-label">Report Title</legend>
        <input type="text" id="title" className="form-input" placeholder="Type Report title" required
          value={title} onChange={onChangeName} />
      </fieldset>
      {GlobalValidators.notEmpty(formValidation.title) && <span className="input-err-msg">{formValidation.title}</span>}
    </div>
    <div className="form-group-container desc-container half-form-left-container">
      <fieldset className="form-group">
        <legend className="form-label">
          <HelpContainer title="Your Report" description="Prepare your Report that related to your Task and submit" />
        </legend>
        <TextEditor state={report} setState={setReport} />
      </fieldset>
    </div>
    <div className="form-group-container desc-container half-form-right-container">
      <fieldset className="form-group">
        <legend className="form-label">
          <HelpContainer title="Format Example" description="From Task Owner, to support your Report writing" />
        </legend>
        <TextEditor state={format} setState={setFormat} />
      </fieldset>
    </div>
    <button className="submit-btn" onClick={onClickSubmitReport}>Submit</button>
  </div>
}