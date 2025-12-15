import axiosInstance from "@/util/axios.helper"
import { ApiResponse, GeneralAPIs } from "./general.api"
import { DTO_CommentOfReport, DTO_CreateComment, DTO_RejectReport, DTO_ReportGenRequest, DTO_ReportRequest, DTO_ReportsComments, DTO_UpdateReport } from "@/dtos/user-task.page.dto"
import { DTO_IdResponse } from "@/dtos/general.dto"
import { AuthHelper } from "@/util/auth.helper"

export class UserTaskPageAPIs {

  static async generateCompletedReport(request: DTO_ReportGenRequest): Promise<Record<string, string> | unknown> {
    try {
      const url = `/api/private/${AuthHelper.getRoleFromToken()}/v1/report/completed-gen`;
      const response = await axiosInstance.post(url, request)
      return response.data
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error)
    }
  }

  static async generateProcessingReport(request: DTO_ReportGenRequest): Promise<Record<string, string> | unknown> {
    try {
      const url = `/api/private/${AuthHelper.getRoleFromToken()}/v1/report/processing-gen`;
      const response = await axiosInstance.post(url, request)
      return response.data
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error)
    }
  }

  static async generateDailyReport(request: DTO_ReportGenRequest): Promise<Record<string, string> | unknown> {
    try {
      const url = `/api/private/${AuthHelper.getRoleFromToken()}/v1/report/daily-gen`;
      const response = await axiosInstance.post(url, request)
      return response.data
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error)
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