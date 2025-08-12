import axiosInstance from "@/util/axios.helper"
import { ApiResponse, GeneralAPIs } from "./general.api"
import { DTO_CommentOfReport, DTO_CreateComment, DTO_RejectReport, DTO_ReportRequest, DTO_ReportsComments, DTO_UpdateReport } from "@/dtos/user-task.page.dto"
import { DTO_IdResponse } from "@/dtos/general.dto"
import { AuthHelper } from "@/util/auth.helper"

const LLM_HOST = "http://localhost:1234"

export class LLMSentMsgAndRole {
  role!: string
  content!: string

  public static withBuilder(): LLMSentMsgAndRole { return new LLMSentMsgAndRole() }
  public brole(role: string): LLMSentMsgAndRole { this.role = role; return this }
  public bcontent(content: string): LLMSentMsgAndRole { this.content = content; return this }
}

export class DTO_LLMCompleteion {
  model!: string
  messages!: LLMSentMsgAndRole[]
  max_tokens!: number

  public static withBuilder(): DTO_LLMCompleteion { return new DTO_LLMCompleteion() }
  public bmodel(model: string): DTO_LLMCompleteion { this.model = model; return this }
  public bmessages(messages: LLMSentMsgAndRole[]): DTO_LLMCompleteion { this.messages = messages; return this }
  public bmaxTokens(maxTokens: number): DTO_LLMCompleteion { this.max_tokens = maxTokens; return this }
}

export class UserTaskPageAPIs {

  static async getCompletion(request: DTO_LLMCompleteion): Promise<Record<string, string> | unknown> {
    try {
      const response = await axiosInstance.post(`${LLM_HOST}/chat/completions`, request)
      return response.data
    } catch (error: unknown) {
      console.error("Error From LLM:", error)
      // return GeneralAPIs.extractError(error)
    }
  }

  static async createReport(request: DTO_ReportRequest): Promise<ApiResponse<DTO_IdResponse> | unknown> {
    try {
      const { taskUserId, ...restParams } = request
      const url = `/api/private/${AuthHelper.getRoleFromToken()}/v1/task-user/${taskUserId}/create-report`
      const response = await axiosInstance.post(url, restParams)
      return response.data
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error)
    }
  }

  static async getReportsAndComments(userTaskId: number): Promise<ApiResponse<DTO_ReportsComments[]> | unknown> {
    try {
      const url = `/api/private/${AuthHelper.getRoleFromToken()}/v1/task-user/${userTaskId}/all-reports`
      const response = await axiosInstance.get(url)
      return response.data
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error)
    }
  }

  static async updateReport(request: DTO_UpdateReport): Promise<ApiResponse<void> | unknown> {
    try {
      const url = `/api/private/${AuthHelper.getRoleFromToken()}/v1/report/${request.reportId}`
      const response = await axiosInstance.put(url, { report: request.report })
      return response.data
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error)
    }
  }

  static async createComment(request: DTO_CreateComment): Promise<ApiResponse<DTO_CommentOfReport> | unknown> {
    try {
      const { reportId, ...restParams } = request
      const url = `/api/private/${AuthHelper.getRoleFromToken()}/v1/report/${reportId}/create-comment`
      const response = await axiosInstance.post(url, restParams)
      return response.data
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error)
    }
  }

  static async approveReport(reportId: number): Promise<ApiResponse<void> | unknown> {
    try {
      const url = `/api/private/${AuthHelper.getRoleFromToken()}/v1/report/${reportId}/approve-report`
      const response = await axiosInstance.put(url)
      return response.data
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error)
    }
  }

  static async rejectReport(request: DTO_RejectReport): Promise<ApiResponse<void> | unknown> {
    try {
      const url = `/api/private/${AuthHelper.getRoleFromToken()}/v1/report/${request.reportId}/reject-report`
      const response = await axiosInstance.put(url, { rejectedReason: request.rejectedReason })
      return response.data
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error)
    }
  }
  
  static async isAssignedUser(userTaskId: number): Promise<ApiResponse<Record<string, boolean>> | unknown> {
    try {
      const response = await axiosInstance.get(`/api/private/${AuthHelper.getRoleFromToken()}/v1/task-user/${userTaskId}/is-assigned`)
      return response.data
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error)
    }
  }
}