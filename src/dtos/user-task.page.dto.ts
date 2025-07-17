import { BasicUserInfo } from "./task-detail.page.api"

export interface DTO_CommentOfReport {
  id: number
  createdBy: BasicUserInfo
  repliedCommendId: number
  comment: string
  createdTime: string
}

export interface DTO_Report {
  id: number
  createdBy: BasicUserInfo
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