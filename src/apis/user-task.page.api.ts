import axiosInstance from "@/util/axios.helper"
import { ApiResponse, GeneralAPIs } from "./general.api"
import { DTO_CommentOfReport, DTO_CreateComment, DTO_RejectReport, DTO_ReportsComments, DTO_UpdateReport } from "@/dtos/user-task.page.dto"
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
      const response = await axiosInstance.post(`${LLM_HOST}/v1/chat/completions`, request)
      return response
    } catch (error: unknown) {
      console.error("Error From LLM:", error)
      // return GeneralAPIs.extractError(error)
    }
  }

  static async getReportsAndComments(userTaskId: number): Promise<ApiResponse<DTO_ReportsComments[]> | unknown> {
    try {
      // const response = await axiosInstance.get(`/api/.../v1/chat/completions/${userTaskId}`)
      // return response
      console.log(AuthHelper.extractToken(AuthHelper.getAccessTokenFromCookie() || ""))
      return {
        code: 11000,
        msg: "Lấy thành công",
        status: 200,
        body: [
          {
            report: {
              id: 1,
              createdBy: {
                id: 1,
                email: "emp@gmail.com",
                fullName: "Le Van Dung"
              },
              title: "Báo cáo phân tích yêu cầu",
              content: "Phân tích yêu cầu hệ thống quản lý kho\n\n- Module quản lý đơn hàng\n- Module theo dõi tồn kho",
              rejectedReason: null,
              reportStatus: "APPROVED",
              reviewedTime: "2025-07-08 08:30:00",
              createdTime: "2025-07-07 10:15:00",
              updatedTime: "2025-07-07 10:15:00"
            },
            comments: [
              {
                id: 1,
                createdBy: {
                  id: 1,
                  email: "pm@gmail.com",
                  fullName: "Le Van Dung"
                },
                repliedCommendId: null,
                comment: "Báo cáo khá chi tiết, nên bổ sung thêm phân tích rủi ro.",
                createdTime: "2025-07-08 09:00:00"
              },
              {
                id: 2,
                createdBy: {
                  id: 1,
                  email: "emp@gmail.com",
                  fullName: "Le Van Dung"
                },
                repliedCommendId: 1,
                comment: "Đồng ý, phần đó đang còn thiếu.",
                createdTime: "2025-07-08 09:30:00"
              },
              {
                id: 3,
                createdBy: {
                  id: 1,
                  email: "emp@gmail.com",
                  fullName: "Le Van Dung"
                },
                repliedCommendId: 1,
                comment: "Đồng ý, phần đó đang còn thiếu.",
                createdTime: "2025-07-08 09:30:00"
              },
              {
                id: 4,
                createdBy: {
                  id: 1,
                  email: "pm@gmail.com",
                  fullName: "Le Van Dung"
                },
                repliedCommendId: null,
                comment: "Báo cáo khá chi tiết, nên bổ sung thêm phân tích rủi ro.",
                createdTime: "2025-07-08 09:00:00"
              },
              {
                id: 5,
                createdBy: {
                  id: 1,
                  email: "emp@gmail.com",
                  fullName: "Le Van Dung"
                },
                repliedCommendId: 4,
                comment: "Đồng ý, phần đó đang còn thiếu.",
                createdTime: "2025-07-08 09:30:00"
              },
              {
                id: 6,
                createdBy: {
                  id: 1,
                  email: "emp@gmail.com",
                  fullName: "Le Van Dung"
                },
                repliedCommendId: null,
                comment: "Đồng ý, phần đó đang còn thiếu.",
                createdTime: "2025-07-08 09:30:00"
              }
            ]
          },
          {
            report: {
              id: 2,
              createdBy: {
                id: 1,
                email: "emp@gmail.com",
                fullName: "Le Van Dung"
              },
              title: "Báo cáo thiết kế cơ sở dữ liệu",
              content: "Thiết kế ERD bao gồm các bảng:\n  - Users\n  - Projects\n  - Tasks\n\nMối quan hệ:\n  - User - Task: N-N\n  - Project - Task: 1-N",
              rejectedReason: "Thiếu mô tả bảng trung gian.",
              reportStatus: "REJECTED",
              reviewedTime: "2025-07-08 11:45:00",
              createdTime: "2025-07-06 14:20:00",
              updatedTime: "2025-07-08 11:00:00"
            },
            comments: [
              {
                id: 3,
                createdBy: {
                  id: 1,
                  email: "emp@gmail.com",
                  fullName: "Le Van Dung"
                },
                repliedCommendId: 0,
                comment: "Bạn cần mô tả rõ hơn về bảng task_assignment.",
                createdTime: "2025-07-08 11:50:00"
              }
            ]
          },
          {
            report: {
              id: 3,
              createdBy: {
                id: 1,
                email: "emp@gmail.com",
                fullName: "Le Van Dung"
              },
              title: "Báo cáo thiết kế cơ sở dữ liệu",
              content: "Thiết kế ERD bao gồm các bảng:\n  - Users\n  - Projects\n  - Tasks\n\nMối quan hệ:\n  - User - Task: N-N\n  - Project - Task: 1-N",
              rejectedReason: null,
              reportStatus: "WAITING",
              reviewedTime: null,
              createdTime: "2025-07-06 14:20:00",
              updatedTime: "2025-07-06 14:20:00"
            },
            comments: [
              {
                id: 4,
                createdBy: {
                  id: 1,
                  email: "emp@gmail.com",
                  fullName: "Le Van Dung"
                },
                repliedCommendId: 0,
                comment: "Bạn cần mô tả rõ hơn về bảng task_assignment.",
                createdTime: "2025-07-08 11:50:00"
              }
            ]
          }
        ],
        time: "2025-07-14 13:00:00"
      }

    } catch (error: unknown) {
      return GeneralAPIs.extractError(error)
    }
  }

  static async updateReport(request: DTO_UpdateReport): Promise<ApiResponse<void> | unknown> {
    try {
      const response = await axiosInstance.put(`/api/.../v1/chat/completions/`)
      return response
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error)
    }
  }

  static async createComment(request: DTO_CreateComment): Promise<ApiResponse<DTO_CommentOfReport> | unknown> {
    try {
      // const response = await axiosInstance.post(`/api/.../v1/report/{request.reportId}/create-comment`)
      // return response
      return {
        code: 11000,
        msg: "Tạo thành công",
        status: 200,
        body: {
          id: 10,
          createdBy: {
            id: 1,
            email: "emp@gmail.com",
            fullName: "Le Van Dung"
          },
          repliedCommendId: request.repliedCommentId,
          comment: request.content,
          createdTime: new Date().toISOString()
        },
        time: "2025/11/12"
      }
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error)
    }
  }

  static async approveReport(reportId: number): Promise<ApiResponse<void> | unknown> {
    try {
      // const response = await axiosInstance.put(`/api/.../v1/report/${reportId}/approve`, request)
      // return response
      return {
        code: 11000,
        msg: "Approve thành công",
        status: 200,
        body: null,
        time: "2025/11/12"
      }
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error)
    }
  }

  static async rejectReport(request: DTO_RejectReport): Promise<ApiResponse<void> | unknown> {
    try {
      // const response = await axiosInstance.put(`/api/.../v1/report/${reportId}/reject`, request)
      // return response
      return {
        code: 11000,
        msg: "Reject thành công",
        status: 200,
        body: null,
        time: "2025/11/12"
      }
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error)
    }
  }
}