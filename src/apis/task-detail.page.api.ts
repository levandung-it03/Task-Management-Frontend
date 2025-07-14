import { DTO_LockTaskStatus, DTO_TaskDetail, DTO_TaskUser, DTO_UpdateBasicTask, DTO_UpdateTaskDescription, DTO_UpdateTaskReportFormat } from "@/dtos/task-detail.page.api"
import { ApiResponse, GeneralAPIs } from "./general.api"

export class TaskDetailPageAPIs {

  static async getTaskDetail(id: number): Promise<ApiResponse<DTO_TaskDetail> | unknown> {
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
            // email: "",
            email: "pm@gmail.com"
            // email: "duongminh.18062001.29062025@tmakes.company.vn"
          },
          rootTaskId: null,
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
          // endDate: "12/12/2025",
          endDate: null,
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

  static async getUsersForTaskOwner(taskId: number): Promise<ApiResponse<DTO_TaskUser[]> | unknown> {
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
        body:
          [
            { username: "duongminh.18062001.29062025@tmakes.company.vn", fullName: "Dương Minh", role: "ROLE_EMP", userTaskStatus: "ASSIGNED" },
            { username: "ngocthuy.30042000.01072025@tmakes.company.vn", fullName: "Ngọc Thúy", role: "ROLE_LEAD", userTaskStatus: "IN_PROGRESS" },
            { username: "trankien.12031999.28062025@tmakes.company.vn", fullName: "Trần Kiên", role: "ROLE_ADMIN", userTaskStatus: "ASSIGNED" },
            { username: "phamhoang.10022002.27062025@tmakes.company.vn", fullName: "Phạm Hoàng", role: "ROLE_PM", userTaskStatus: "IN_PROGRESS" },
            { username: "levinh.07072003.01072025@tmakes.company.vn", fullName: "Lê Vinh", role: "ROLE_EMP", userTaskStatus: "ASSIGNED" },
            { username: "vuhoai.21052000.29062025@tmakes.company.vn", fullName: "Vũ Hoài", role: "ROLE_LEAD", userTaskStatus: "KICKED_OUT" },
            { username: "dangtuan.03121998.30062025@tmakes.company.vn", fullName: "Đặng Tuấn", role: "ROLE_EMP", userTaskStatus: "KICKED_OUT" },
            { username: "bichngan.04082001.28062025@tmakes.company.vn", fullName: "Bích Ngân", role: "ROLE_EMP", userTaskStatus: "KICKED_OUT" },
            { username: "trangthu.15092002.27062025@tmakes.company.vn", fullName: "Trang Thư", role: "ROLE_EMP", userTaskStatus: "ASSIGNED" },
            { username: "nguyentan.01111997.30062025@tmakes.company.vn", fullName: "Nguyễn Tân", role: "ROLE_LEAD", userTaskStatus: "ASSIGNED" },
            { username: "lethu.26062000.01072025@tmakes.company.vn", fullName: "Lê Thư", role: "ROLE_EMP", userTaskStatus: "COMPLETED" },
            { username: "khanhhoa.08032001.29062025@tmakes.company.vn", fullName: "Khánh Hòa", role: "ROLE_EMP", userTaskStatus: "COMPLETED" },
            { username: "vumanh.17102003.28062025@tmakes.company.vn", fullName: "Vũ Mạnh", role: "ROLE_EMP", userTaskStatus: "COMPLETED" }
          ],
        time: "12:00:20 30/06/2025"
      }
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error)
    }
  }
  
  static async getUesrForAssignedTask(taskId: number): Promise<ApiResponse<DTO_TaskUser> | unknown> {
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
        body: { username: "duongminh.18062001.29062025@tmakes.company.vn", fullName: "Dương Minh", role: "ROLE_EMP", userTaskStatus: "ASSIGNED" },
        time: "12:00:20 30/06/2025"
      }
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error)
    }
  }

  static async updateDoneTask(taskId: number): Promise<ApiResponse<void> | unknown> {
    try {
      // const role = AuthHelper.getRoleFromToken()
      // const response = await axiosInstance.put(`/api/private/${role}/.../v1/...`, {
      //   params: request
      // })
      // return response.data
      return {
        code: 11001,
        msg: "Thành công",
        status: 200,
        body: null,
        time: "12:00:20 30/06/2025"
      }
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error)
    }
  }

  static async updateLockTaskStatus(request: DTO_LockTaskStatus): Promise<ApiResponse<void> | unknown> {
    try {
      // const role = AuthHelper.getRoleFromToken()
      // const response = await axiosInstance.put(`/api/private/${role}/.../v1/.../${id}`, {
      //   status: request.locked
      // })
      // return response.data
      return {
        code: 11001,
        msg: "Thành công",
        status: 200,
        body: null,
        time: "12:00:20 30/06/2025"
      }
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error)
    }
  }
}