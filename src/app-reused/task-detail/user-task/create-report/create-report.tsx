'use client'

import { TextEditor } from "@/app-reused/text-editor/text-editor";
import { DTO_TaskDetail } from "@/dtos/task-detail.page.dto";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import "./create-report.scss";
import HelpContainer from "@/app-reused/help-container/page";
import GlobalValidators from "@/util/global.validators";
import CreateReportService from "./create-report.service";
import { FileIcon } from "@/assets/file.icon";
import { UserTaskPageAPIs } from "@/apis/user-task.page.api";
import { DTO_ReportGenRequest, DTO_ReportGenResponse, DTO_ReportRequest, DTO_ReportsComments } from "@/dtos/user-task.page.dto";
import { ApiResponse } from "@/apis/general.api";
import { DTO_IdResponse } from "@/dtos/general.dto";
import toast from "react-hot-toast";
import { GeneralTools } from "@/util/general.helper";
import { IndexDBHelper } from "@/util/indexdb.helper";
import { UserInfoAPIs } from "@/apis/user-info.page.api";
import { DTO_UserInfoResponse } from "@/dtos/user-info.page.dto";
import { Atom, CalendarCheck, ClipboardCheck, NotebookPen } from "lucide-react";

export interface CreateReportFormProps {
  userTaskId: number;
  taskInfo: DTO_TaskDetail;
  reportComments: DTO_ReportsComments[];
  isTaskOwner: boolean;
}

export default function CreateReportForm({ userTaskId, taskInfo, reportComments, isTaskOwner }: CreateReportFormProps) {
  // const [format, setFormat] = useState("")
  const [report, setReport] = useState("")
  const [title, setTitle] = useState("")
  const [formTouched, setFormTouched] = useState(false)
  const [formValidation, setFormValidation] = useState({
    title: ""
  })
  const [openReportGenBtns, setOpenReportGenBtns] = useState(false);

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

  useEffect(() => {
    async function initWithFetchingUser() {
      // setFormat(taskInfo.reportFormat)

      const lastReportIdx = reportComments.length - 1;
      if (lastReportIdx !== -1)
        setReport(reportComments[lastReportIdx].report.content);


      const response = await UserInfoAPIs.getUserInfo() as ApiResponse<DTO_UserInfoResponse>
      if (String(response.status).startsWith("2")) {
        setTitle(`Report for ${taskInfo.name} by ${response.body.fullName}`);
      }
      setFormTouched(true);
    }
    initWithFetchingUser();
  }, [reportComments])

  useEffect(() => {
    async function fetchDraft() {
      const draft = await IndexDBHelper.loadDraft(`report-${userTaskId}`);
      if (draft && typeof draft.content === "string") setReport(draft.content);
    }
    fetchDraft();
  }, [userTaskId]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      async function save() {
        await IndexDBHelper.saveDraft(`report-${userTaskId}`, report);
      }
      save()
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [report, userTaskId]);

  // useEffect(() => {
  //   async function generateReport() {
  //     const request = DTO_ReportGenRequest.withBuilder().btaskUserId(userTaskId)
  //     const promise = UserTaskPageAPIs.generateCompletedReport(request) as Promise<ApiResponse<DTO_ReportGenResponse>>
  //     callToastPromiser({ promise, setReport });
  //   }
  //   generateReport()
  // }, []);

  return <>
    <div className="report-creation">
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
      {/* <div className="form-group-container desc-container half-form-left-container"> */}

      <div className="form-group-container">
        <div className="report-gen-container">
          <button type="button" className="report-gen-btn" onClick={() => setOpenReportGenBtns(true)}>
            Generate Example
          </button>
        </div>
      </div>

      <div className="form-group-container desc-container">
        <fieldset className="form-group">
          <legend className="form-label">
            <HelpContainer title="Your Report" description="Prepare your Report that related to your Task and submit" />
          </legend>
          <TextEditor state={report} setState={setReport} />
        </fieldset>
      </div>
      {/* <div className="form-group-container desc-container half-form-right-container">
      <fieldset className="form-group">
        <legend className="form-label">
          <HelpContainer title="Format Example" description="From Task Owner, to support your Report writing" />
        </legend>
        <TextEditor state={format} setState={setFormat} />
      </fieldset>
    </div> */}
      <button className="submit-btn" onClick={onClickSubmitReport}>Submit</button>
    </div>
    {openReportGenBtns && <ReportGenerationBtns
      isTaskOwner={isTaskOwner}
      userTaskId={userTaskId}
      setReport={setReport}
      setOpenReportGenBtns={setOpenReportGenBtns}
    />}
  </>
}

function callToastPromiser({ promise, setReport }: {
  promise: Promise<ApiResponse<DTO_ReportGenResponse>>,
  setReport: React.Dispatch<React.SetStateAction<string>>
}) {
  toast.promise(
    promise,
    {
      loading: 'Wait for Model generating Report!',
      success: (response) => {
        if (String(response.status).startsWith("2")) {
          setReport(response.body.report)
          toast.success(response.msg)
        }
        throw new Error();
      },
    },
    {
      success: {
        duration: 7000,
      },
      error: {
        duration: 7000,
      },
      loading: {
        duration: 120000
      }
    }
  );
}

function ReportGenerationBtns({ isTaskOwner, userTaskId, setReport, setOpenReportGenBtns }: {
  isTaskOwner: boolean,
  userTaskId: number,
  setReport: React.Dispatch<React.SetStateAction<string>>,
  setOpenReportGenBtns: React.Dispatch<React.SetStateAction<boolean>>
}) {


  const onClickGenCompletedReport = useCallback(() => {
    async function generateReport() {
      const request = DTO_ReportGenRequest.withBuilder().btaskUserId(userTaskId)
      const promise = UserTaskPageAPIs.generateCompletedReport(request) as Promise<ApiResponse<DTO_ReportGenResponse>>
      callToastPromiser({ promise, setReport });
      setOpenReportGenBtns(false);
    }
    generateReport()
  }, [setReport, setOpenReportGenBtns, userTaskId])

  const onClickGenProcessingReport = useCallback(() => {
    async function generateReport() {
      const request = DTO_ReportGenRequest.withBuilder().btaskUserId(userTaskId)
      const promise = UserTaskPageAPIs.generateProcessingReport(request) as Promise<ApiResponse<DTO_ReportGenResponse>>
      callToastPromiser({ promise, setReport });
      setOpenReportGenBtns(false);
    }
    generateReport()
  }, [setReport, setOpenReportGenBtns, userTaskId])

  const onClickGenDailyReport = useCallback(() => {
    async function generateReport() {
      const request = DTO_ReportGenRequest.withBuilder().btaskUserId(userTaskId)
      const promise = UserTaskPageAPIs.generateDailyReport(request) as Promise<ApiResponse<DTO_ReportGenResponse>>
      callToastPromiser({ promise, setReport });
      setOpenReportGenBtns(false);
    }
    generateReport()
  }, [setReport, setOpenReportGenBtns, userTaskId])

  return <>
    <div className="report-btns-overlay" onClick={() => setOpenReportGenBtns(false)}></div>
    <div className="btns-block">
      <div className="btns-title">
        <Atom className="btns-icon" />
        Report Generation
      </div>
      <div className="btn-container">
        <button className="complete-report-btn" onClick={onClickGenCompletedReport}>
          Completed Report
          <ClipboardCheck className="btn-icon" />
        </button>
      </div>
      <div className="btn-container">
        <button className="processing-report-btn" onClick={onClickGenProcessingReport}>
          Report Processing
          <NotebookPen className="btn-icon" />
        </button>
      </div>
      {isTaskOwner && <div className="btn-container">
        <button className="daily-report-btn" onClick={onClickGenDailyReport}>
          Daily Report
          <CalendarCheck className="btn-icon" />
        </button>
      </div>}
    </div>
  </>
}