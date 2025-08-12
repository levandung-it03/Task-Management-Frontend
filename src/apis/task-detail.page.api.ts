import { DTO_LockTaskStatus, DTO_OverviewSubTask, DTO_TaskDelegator, DTO_TaskDetail, DTO_TaskUser, DTO_UpdateBasicTask, DTO_UpdateContentRequest } from "@/dtos/task-detail.page.dto"
import { ApiResponse, GeneralAPIs } from "./general.api"
import { AuthHelper } from "@/util/auth.helper"
import axiosInstance from "@/util/axios.helper"

export class TaskDetailPageAPIs {

  static async getTaskDetail(id: number): Promise<ApiResponse<DTO_TaskDetail> | unknown> {
    try {
      const response = await axiosInstance.get(`/api/private/${AuthHelper.getRoleFromToken()}/v1/task/${id}`)
      return response.data
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error)
    }
  }

  static async updateTaskDescription(request: DTO_UpdateContentRequest): Promise<ApiResponse<void> | unknown> {
    try {
      const { id, ...restParams } = request
      const url = `/api/private/${AuthHelper.getRoleFromToken()}/v1/task/${id}/update-description`
      const response = await axiosInstance.put(url, restParams)
      return response.data
      // return {
      //   code: 11001,
      //   msg: "Thành công",
      //   status: 200,
      //   body: {},
      //   time: "12:00:20 30/06/2025"
      // }
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error)
    }
  }

  static async updateTaskReportFormat(request: DTO_UpdateContentRequest): Promise<ApiResponse<void> | unknown> {
    try {
      const { id, ...restParams } = request
      const url = `/api/private/${AuthHelper.getRoleFromToken()}/v1/task/${id}/update-report-format`
      const response = await axiosInstance.put(url, restParams)
      return response.data
      // return response.data
      // return {
      //   code: 11001,
      //   msg: "Thành công",
      //   status: 200,
      //   body: {},
      //   time: "12:00:20 30/06/2025"
      // }
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error)
    }
  }

  static async updateBasicTaskInfo(request: DTO_UpdateBasicTask): Promise<ApiResponse<void> | unknown> {
    try {
      const { id, ...restParams } = request
      console.log(restParams)
      const response = await axiosInstance.put(`/api/private/${AuthHelper.getRoleFromToken()}/v1/task/${id}`, restParams)
      return response.data
      // return {
      //   code: 11001,
      //   msg: "Thành công",
      //   status: 200,
      //   body: {},
      //   time: "12:00:20 30/06/2025"
      // }
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error)
    }
  }

  //--Remember to render just the Assigned-User, when he/she who's seeing this Task is "ROLE_EMP"
  static async getUsersOfTask(taskId: number): Promise<ApiResponse<DTO_TaskUser[]> | unknown> {
    try {
      const response = await axiosInstance.get(`/api/private/${AuthHelper.getRoleFromToken()}/v1/task/${taskId}/get-assigned-users`)
      return response.data
      // return {
      //   code: 11001,
      //   msg: "Thành công",
      //   status: 200,
      //   body:
      //     [
      //       { email: "duongminh.18062001.29062025@tmakes.company.vn", fullName: "Dương Minh", role: "ROLE_EMP", userTaskStatus: "ASSIGNED" },
      //       { email: "ngocthuy.30042000.01072025@tmakes.company.vn", fullName: "Ngọc Thúy", role: "ROLE_LEAD", userTaskStatus: "IN_PROGRESS" },
      //       { email: "trankien.12031999.28062025@tmakes.company.vn", fullName: "Trần Kiên", role: "ROLE_ADMIN", userTaskStatus: "ASSIGNED" },
      //       { email: "phamhoang.10022002.27062025@tmakes.company.vn", fullName: "Phạm Hoàng", role: "ROLE_PM", userTaskStatus: "IN_PROGRESS" },
      //       { email: "levinh.07072003.01072025@tmakes.company.vn", fullName: "Lê Vinh", role: "ROLE_EMP", userTaskStatus: "ASSIGNED" },
      //       { email: "vuhoai.21052000.29062025@tmakes.company.vn", fullName: "Vũ Hoài", role: "ROLE_LEAD", userTaskStatus: "KICKED_OUT" },
      //       { email: "dangtuan.03121998.30062025@tmakes.company.vn", fullName: "Đặng Tuấn", role: "ROLE_EMP", userTaskStatus: "KICKED_OUT" },
      //       { email: "bichngan.04082001.28062025@tmakes.company.vn", fullName: "Bích Ngân", role: "ROLE_EMP", userTaskStatus: "KICKED_OUT" },
      //       { email: "trangthu.15092002.27062025@tmakes.company.vn", fullName: "Trang Thư", role: "ROLE_EMP", userTaskStatus: "ASSIGNED" },
      //       { email: "nguyentan.01111997.30062025@tmakes.company.vn", fullName: "Nguyễn Tân", role: "ROLE_LEAD", userTaskStatus: "ASSIGNED" },
      //       { email: "lethu.26062000.01072025@tmakes.company.vn", fullName: "Lê Thư", role: "ROLE_EMP", userTaskStatus: "COMPLETED" },
      //       { email: "khanhhoa.08032001.29062025@tmakes.company.vn", fullName: "Khánh Hòa", role: "ROLE_EMP", userTaskStatus: "COMPLETED" },
      //       { email: "vumanh.17102003.28062025@tmakes.company.vn", fullName: "Vũ Mạnh", role: "ROLE_EMP", userTaskStatus: "COMPLETED" }
      //     ],
      //   time: "12:00:20 30/06/2025"
      // }
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error)
    }
  }

  static async updateDoneTask(taskId: number): Promise<ApiResponse<void> | unknown> {
    try {
      const response = await axiosInstance.put(`/api/private/${AuthHelper.getRoleFromToken()}/v1/task/${taskId}/done`)
      return response.data
      // return {
      //   code: 11001,
      //   msg: "Thành công",
      //   status: 200,
      //   body: null,
      //   time: "12:00:20 30/06/2025"
      // }
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error)
    }
  }

  static async updateLockTaskStatus(request: DTO_LockTaskStatus): Promise<ApiResponse<void> | unknown> {
    try {
      const response = await axiosInstance.put(`/api/private/${AuthHelper.getRoleFromToken()}/v1/task/${request.id}`, {
        status: request.locked
      })
      return response.data
      // return {
      //   code: 11001,
      //   msg: "Thành công",
      //   status: 200,
      //   body: null,
      //   time: "12:00:20 30/06/2025"
      // }
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error)
    }
  }

  //--Remember to render just the Assigned-Sub-Task, when he/she who's seeing this Task is "ROLE_EMP"
  static async getOverviewSubTasks(taskId: number): Promise<ApiResponse<DTO_OverviewSubTask[]> | unknown> {
    try {
      const response = await axiosInstance.get(`/api/private/${AuthHelper.getRoleFromToken()}/v1/task/${taskId}/sub-tasks`)
      return response.data
      // return {
      //   code: 11001,
      //   msg: "Thành công",
      //   status: 200,
      //   body: [
      //     {
      //       id: 1,
      //       name: 'Design Landing Page',
      //       level: 'ADVANCED',
      //       taskType: 'DEPLOY',
      //       priority: 'HIGH',
      //       isLocked: false,
      //       startDate: "12/12/2025",
      //       endDate: "12/12/2024",
      //       deadline: "12/12/2024"
      //     },
      //     {
      //       id: 1,
      //       name: 'Design Landing Page',
      //       level: 'ADVANCED',
      //       taskType: 'DEPLOY',
      //       priority: 'HIGH',
      //       isLocked: false,
      //       startDate: "12/12/2024",
      //       endDate: null,
      //       deadline: "12/12/2024"
      //     },
      //     {
      //       id: 1,
      //       name: 'Design Landing Page',
      //       level: 'ADVANCED',
      //       taskType: 'DEPLOY',
      //       priority: 'HIGH',
      //       isLocked: false,
      //       startDate: "12/12/2023",
      //       endDate: "12/12/2024",
      //       deadline: "12/12/2024"
      //     },
      //     {
      //       id: 1,
      //       name: 'Design Landing Page',
      //       level: 'ADVANCED',
      //       taskType: 'DEPLOY',
      //       priority: 'HIGH',
      //       isLocked: false,
      //       startDate: "12/12/2025",
      //       endDate: null,
      //       deadline: "12/12/2024"
      //     },
      //   ],
      //   time: "12:00:20 30/06/2025"
      // }
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error)
    }
  }

  //--rootId is null -> This is a root task -> query all related Users of this task (not include current user-task)
  static async searchNewAddedUsersForRootTask(rootId: number, query: string): Promise<ApiResponse<void> | unknown> {
    try {
      const url = `/api/private/${AuthHelper.getRoleFromToken()}/v1/task/${rootId}/search-new-users/${query}`
      const response = await axiosInstance.get(url)
      return response.data
      // return {
      //   code: 11001,
      //   msg: "Thành công",
      //   status: 200,
      //   body: [
      //     { email: "trangthu.15092002.27062025@tmakes.company.vn", fullName: "Trang Thư", role: "ROLE_EMP" },
      //     { email: "nguyentan.01111997.30062025@tmakes.company.vn", fullName: "Nguyễn Tân", role: "ROLE_LEAD" },
      //     { email: "lethu.26062000.01072025@tmakes.company.vn", fullName: "Lê Thư", role: "ROLE_EMP" },
      //     { email: "khanhhoa.08032001.29062025@tmakes.company.vn", fullName: "Khánh Hòa", role: "ROLE_EMP" },
      //     { email: "vumanh.17102003.28062025@tmakes.company.vn", fullName: "Vũ Mạnh", role: "ROLE_EMP" }
      //   ],
      //   time: "12:00:20 30/06/2025"
      // }
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error)
    }
  }

  //--rootId is number -> This is a sub task -> query all related Users of root task (include current user-task, doesn't have MOVED_TO_SUB_TASK)
  static async searchNewAddedUsersForSubTask(rootId: number, query: string): Promise<ApiResponse<void> | unknown> {
    try {
      const url = `/api/private/${AuthHelper.getRoleFromToken()}/v1/task/${rootId}/search-users/${query}`
      const response = await axiosInstance.get(url)
      return response.data
      // return {
      //   code: 11001,
      //   msg: "Thành công",
      //   status: 200,
      //   body: [
      //     { email: "trangthu.15092002.27062025@tmakes.company.vn", fullName: "Trang Thư", role: "ROLE_EMP" },
      //     { email: "nguyentan.01111997.30062025@tmakes.company.vn", fullName: "Nguyễn Tân", role: "ROLE_LEAD" },
      //     { email: "lethu.26062000.01072025@tmakes.company.vn", fullName: "Lê Thư", role: "ROLE_EMP" },
      //     { email: "khanhhoa.08032001.29062025@tmakes.company.vn", fullName: "Khánh Hòa", role: "ROLE_EMP" },
      //     { email: "vumanh.17102003.28062025@tmakes.company.vn", fullName: "Vũ Mạnh", role: "ROLE_EMP" }
      //   ],
      //   time: "12:00:20 30/06/2025"
      // }
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error)
    }
  }
  
  static async kickUserOfTask(taskUserId: number): Promise<ApiResponse<void> | unknown> {
    try {
      const response = await axiosInstance.put(`/api/private/${AuthHelper.getRoleFromToken()}/v1/task-user/${taskUserId}/kick-user`)
      return response.data
      // return {
      //   code: 11001,
      //   msg: "Thành công",
      //   status: 200,
      //   body: [
      //     { email: "trangthu.15092002.27062025@tmakes.company.vn", fullName: "Trang Thư", role: "ROLE_EMP" },
      //     { email: "nguyentan.01111997.30062025@tmakes.company.vn", fullName: "Nguyễn Tân", role: "ROLE_LEAD" },
      //     { email: "lethu.26062000.01072025@tmakes.company.vn", fullName: "Lê Thư", role: "ROLE_EMP" },
      //     { email: "khanhhoa.08032001.29062025@tmakes.company.vn", fullName: "Khánh Hòa", role: "ROLE_EMP" },
      //     { email: "vumanh.17102003.28062025@tmakes.company.vn", fullName: "Vũ Mạnh", role: "ROLE_EMP" }
      //   ],
      //   time: "12:00:20 30/06/2025"
      // }
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error)
    }
  }
  
  static async reAddUserOfTask(taskUserId: number): Promise<ApiResponse<void> | unknown> {
    try {
      const response = await axiosInstance.put(`/api/private/${AuthHelper.getRoleFromToken()}/v1/task-user/${taskUserId}/re-add-user`)
      return response.data
      // return {
      //   code: 11001,
      //   msg: "Thành công",
      //   status: 200,
      //   body: [
      //     { email: "trangthu.15092002.27062025@tmakes.company.vn", fullName: "Trang Thư", role: "ROLE_EMP" },
      //     { email: "nguyentan.01111997.30062025@tmakes.company.vn", fullName: "Nguyễn Tân", role: "ROLE_LEAD" },
      //     { email: "lethu.26062000.01072025@tmakes.company.vn", fullName: "Lê Thư", role: "ROLE_EMP" },
      //     { email: "khanhhoa.08032001.29062025@tmakes.company.vn", fullName: "Khánh Hòa", role: "ROLE_EMP" },
      //     { email: "vumanh.17102003.28062025@tmakes.company.vn", fullName: "Vũ Mạnh", role: "ROLE_EMP" }
      //   ],
      //   time: "12:00:20 30/06/2025"
      // }
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error)
    }
  }

  static async deleteTask(taskId: number): Promise<ApiResponse<void> | unknown> {
    try {
      const response = await axiosInstance.delete(`/api/private/${AuthHelper.getRoleFromToken()}/v1/task/${taskId}`)
      return response.data
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error)
    }
  }

  static async getTaskDelegator(taskId: number): Promise<ApiResponse<DTO_TaskDelegator> | unknown> {
    try {
      const response = await axiosInstance.get(`/api/private/${AuthHelper.getRoleFromToken()}/v1/task/${taskId}/delegator`)
      return response.data
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error)
    }
  }
}