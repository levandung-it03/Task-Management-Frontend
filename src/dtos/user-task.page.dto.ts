import { DTO_FastUserInfo } from "./create-task.page.dto"

export interface DTO_CommentOfReport {
  id: number
  createdBy: DTO_FastUserInfo
  repliedCommendId: number
  comment: string
  createdTime: string
}

export interface DTO_Report {
  id: number
  createdBy: DTO_FastUserInfo
  title: string
  content: string
  reportStatus: string
  rejectedReason: string | null
  reviewedTime: string | null
  createdTime: string
  updatedTime: string
}

export interface DTO_ReportsComments {
  report: DTO_Report
  comments: DTO_CommentOfReport[]
}

export class DTO_UpdateReport {
  reportId!: number
  report!: string

  public static withBuilder(): DTO_UpdateReport { return new DTO_UpdateReport() }
  public breportId(reportId: number): DTO_UpdateReport { this.reportId = reportId; return this; }
  public breport(report: string): DTO_UpdateReport { this.report = report; return this; }
}

export class DTO_CreateComment {
  reportId!: number
  repliedCommentId!: number | null
  content!: string
  
  public static withBuilder(): DTO_CreateComment { return new DTO_CreateComment() }
  public breportId(reportId: number): DTO_CreateComment { this.reportId = reportId; return this; }
  public brepliedCommentId(repliedCommentId: number): DTO_CreateComment { this.repliedCommentId = repliedCommentId; return this; }
  public bcontent(content: string): DTO_CreateComment { this.content = content; return this; }

}

export class DTO_RejectReport {
  reportId!: number
  rejectedReason!: string

  public static withBuilder(): DTO_RejectReport { return new DTO_RejectReport() }
  public breportId(reportId: number): DTO_RejectReport { this.reportId = reportId; return this; }
  public brejectedReason(rejectedReason: string): DTO_RejectReport { this.rejectedReason = rejectedReason; return this; }
}

export class DTO_ReportRequest {
  taskUserId!: number
  title!: string
  content!: string

  public static withBuilder(): DTO_ReportRequest { return new DTO_ReportRequest() }
  public btaskUserId(taskUserId: number): DTO_ReportRequest { this.taskUserId = taskUserId; return this }  
  public btitle(title: string): DTO_ReportRequest { this.title = title; return this }  
  public bcontent(content: string): DTO_ReportRequest { this.content = content; return this }  
}


export class DTO_ReportGenRequest {
  taskUserId!: number

  public static withBuilder(): DTO_ReportRequest { return new DTO_ReportRequest() }
  public btaskUserId(taskUserId: number): DTO_ReportRequest { this.taskUserId = taskUserId; return this }  
}

export interface DTO_ReportGenResponse {
  report: string
}