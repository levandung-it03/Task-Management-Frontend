import { DTO_TaskDetail, DTO_UpdateBasicTask, DTO_UpdateTaskDescription, DTO_UpdateTaskReportFormat } from "@/dtos/task-detail.page.api"
import { ApiResponse, GeneralAPIs } from "./general.api"

export class TaskDetailPageAPIs {

  static async getTaskDetail(id: string): Promise<ApiResponse<DTO_TaskDetail> | unknown> {
    try {
      // const role = AuthHelper.getRoleFromToken()
      // const response = await axiosInstance.get(`/api/private/${role}/.../v1/...`, {
      //   params: request
      // })
      // return response.data
      return {
        code: 11001,
        msg: "Thành công",
        status: 200,
        body: {
          id: 1,
          userInfo: {
            id: 101,
            name: 'Jane Doe',
          },
          isRootTask: true,
          name: 'Design Landing Page',
          description: 'Create a responsive design for the marketing landing page.',
          reportFormat: `
            \nDear Mr. Duy,
            \nToday I've been done:
            \n    + Refactor Java OOP
            \n    + Refactor JUnit with Spring Boot Test on small Project
            \n    + Watched video about microservices technologies
            \nTomorrow I'll
            \n    + Keep going Refactor JUnit with Spring Boot Test on small Project
            \n    + Fix Java OOP Exercises
            \nFinally, thank you for supporting me in these lessions.
            \nRegard,
            \nDung
          `,
          level: 'ADVANCED',
          taskType: 'DEPLOY',
          priority: 'HIGH',
          isLocked: false,
          startDate: "12/12/2025",
          endDate: "12/12/2025",
          deadline: "12/12/2024",
          createdTime: "13:00:00 12/12/2025",
          updatedTime: "13:00:00 12/12/2025",
        },
        time: "12:00:20 30/06/2025"
      }
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error)
    }
  }

  static async updateTaskDescription(request: DTO_UpdateTaskDescription): Promise<ApiResponse<void> | unknown> {
    try {
      // const role = AuthHelper.getRoleFromToken()
      // const response = await axiosInstance.get(`/api/private/${role}/.../v1/...`, {
      //   params: request
      // })
      // return response.data
      return {
        code: 11001,
        msg: "Thành công",
        status: 200,
        body: {},
        time: "12:00:20 30/06/2025"
      }
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error)
    }
  }
  
  static async updateTaskReportFormat(request: DTO_UpdateTaskReportFormat): Promise<ApiResponse<void> | unknown> {
    try {
      // const role = AuthHelper.getRoleFromToken()
      // const response = await axiosInstance.get(`/api/private/${role}/.../v1/...`, {
      //   params: request
      // })
      // return response.data
      return {
        code: 11001,
        msg: "Thành công",
        status: 200,
        body: {},
        time: "12:00:20 30/06/2025"
      }
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error)
    }
  }
  
  static async updateBasicTaskInfo(request: DTO_UpdateBasicTask): Promise<ApiResponse<void> | unknown> {
    try {
      // const role = AuthHelper.getRoleFromToken()
      // const response = await axiosInstance.get(`/api/private/${role}/.../v1/...`, {
      //   params: request
      // })
      // return response.data
      return {
        code: 11001,
        msg: "Thành công",
        status: 200,
        body: {},
        time: "12:00:20 30/06/2025"
      }
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error)
    }
  }
}