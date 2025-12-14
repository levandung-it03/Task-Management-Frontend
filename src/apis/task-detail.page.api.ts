import { DTO_LockTaskStatus, DTO_OverviewSubTask, DTO_ReassignUserSubTask, DTO_TaskDelegator, DTO_TaskDetail, DTO_TaskUser, DTO_UpdateBasicTask, DTO_UpdateContentRequest, DTO_UpdateTaskResponse } from "@/dtos/task-detail.page.dto"
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
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error)
    }
  }

  static async reassignUserSubTask(request: DTO_ReassignUserSubTask): Promise<ApiResponse<DTO_UpdateTaskResponse> | unknown> {
    try {
      const { id, ...restParams } = request
      const url = `/api/private/${AuthHelper.getRoleFromToken()}/v1/task/${id}/sub-tasks/re-assign`;
      const response = await axiosInstance.put(url, restParams);
      return response.data
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error)
    }
  }

  static async updateBasicTaskInfo(request: DTO_UpdateBasicTask): Promise<ApiResponse<DTO_UpdateTaskResponse> | unknown> {
    try {
      const { id, ...restParams } = request
      const response = await axiosInstance.put(`/api/private/${AuthHelper.getRoleFromToken()}/v1/task/${id}`, restParams)
      return response.data
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error)
    }
  }

  //--Remember to render just the Assigned-User, when he/she who's seeing this Task is "ROLE_EMP"
  static async getUsersOfTask(taskId: number): Promise<ApiResponse<DTO_TaskUser[]> | unknown> {
    try {
      const response = await axiosInstance.get(`/api/private/${AuthHelper.getRoleFromToken()}/v1/task/${taskId}/get-assigned-users`)
      return response.data
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error)
    }
  }

  static async updateDoneTask(taskId: number): Promise<ApiResponse<void> | unknown> {
    try {
      const response = await axiosInstance.put(`/api/private/${AuthHelper.getRoleFromToken()}/v1/task/${taskId}/done`)
      return response.data
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error)
    }
  }

  static async updateLockTaskStatus(request: DTO_LockTaskStatus): Promise<ApiResponse<void> | unknown> {
    try {
      const response = await axiosInstance.put(`/api/private/${AuthHelper.getRoleFromToken()}/v1/task/${request.id}/update-locked-status`, {
        status: request.locked
      })
      return response.data
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error)
    }
  }

  //--Remember to render just the Assigned-Sub-Task, when he/she who's seeing this Task is "ROLE_EMP"
  static async getOverviewSubTasks(taskId: number): Promise<ApiResponse<DTO_OverviewSubTask[]> | unknown> {
    try {
      const response = await axiosInstance.get(`/api/private/${AuthHelper.getRoleFromToken()}/v1/task/${taskId}/sub-tasks`)
      return response.data
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
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error)
    }
  }
  
  static async kickUserOfTask(taskUserId: number): Promise<ApiResponse<void> | unknown> {
    try {
      const response = await axiosInstance.put(`/api/private/${AuthHelper.getRoleFromToken()}/v1/task-user/${taskUserId}/kick-user`)
      return response.data
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error)
    }
  }
  
  static async deleteUserTask(taskUserId: number): Promise<ApiResponse<void> | unknown> {
    try {
      const response = await axiosInstance.put(`/api/private/${AuthHelper.getRoleFromToken()}/v1/task-user/${taskUserId}/delete-user`)
      return response.data
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error)
    }
  }
  
  static async reAddUserOfTask(taskUserId: number): Promise<ApiResponse<void> | unknown> {
    try {
      const response = await axiosInstance.put(`/api/private/${AuthHelper.getRoleFromToken()}/v1/task-user/${taskUserId}/re-add-user`)
      return response.data
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

  static async startAssignedUserTask(userTaskId: number): Promise<ApiResponse<void> | unknown> {
    try {
      const response = await axiosInstance.put(`/api/private/${AuthHelper.getRoleFromToken()}/v1/task-user/${userTaskId}/start`)
      return response.data
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error)
    }
  }

}