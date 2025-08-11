import axiosInstance from "@/util/axios.helper"
import { ApiResponse, GeneralAPIs, RecordResponse } from "./general.api"
import { DTO_FastUserInfo, DTO_GroupOverview, DTO_SearchFastUserInfo, DTO_TaskRequest } from "@/dtos/create-task.page.dto"
import { AuthHelper } from "@/util/auth.helper"

export class CreateTaskPageAPIs {

  static async fastSearchUsers(request: DTO_SearchFastUserInfo): Promise<ApiResponse<DTO_FastUserInfo[]> | unknown> {
    try {
      const url = `/api/private/${AuthHelper.getRoleFromToken()}/v1/user-info/search/${request.query}`
      const response = await axiosInstance.get(url)
      return response.data
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error)
    }
  }

  static async fastSearchUsersTask(request: DTO_SearchFastUserInfo): Promise<ApiResponse<DTO_FastUserInfo[]> | unknown> {
    try {
      const url = `/api/private/${AuthHelper.getRoleFromToken()}/v1/user-info/search-for-new-task/${request.query}`
      const response = await axiosInstance.get(url)
      return response.data
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error)
    }
  }

  static async fastSearchUsersTaskOfRootTask(rootId: number, request: DTO_SearchFastUserInfo): Promise<ApiResponse<DTO_FastUserInfo[]> | unknown> {
    try {
      const url = `/api/private/${AuthHelper.getRoleFromToken()}/v1/task/${rootId}/search-users/${request.query}`
      const response = await axiosInstance.get(url)
      return response.data
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error)
    }
  }

  static async getAllGroupsRelatedToUser(): Promise<ApiResponse<DTO_GroupOverview[]> | unknown> {
    try {
      const response = await axiosInstance.get(`/api/private/${AuthHelper.getRoleFromToken()}/v1/group/get-related-groups`)
      return response.data
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error)
    }
  }

  static async getUsersGroupToAssign(groupId: number): Promise<ApiResponse<DTO_FastUserInfo[]> | unknown> {
    try {
      const url = `/api/private/${AuthHelper.getRoleFromToken()}/v1/group/${groupId}/get-users-to-assign`
      const response = await axiosInstance.get(url)
      return response.data
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error)
    }
  }

  static async createTask(request: DTO_TaskRequest): Promise<ApiResponse<RecordResponse> | unknown> {
    try {
      const { collectionId, ...restParams } = request
      const url = `/api/private/${AuthHelper.getRoleFromToken()}/v1/collection/${collectionId}/create-task`
      const response = await axiosInstance.post(url, restParams)
      return response.data
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error)
    }
  }

  static async createSubTask(rootId: number, request: DTO_TaskRequest): Promise<ApiResponse<RecordResponse> | unknown> {
    try {
      const { collectionId, ...restParams } = request
      const url = `/api/private/${AuthHelper.getRoleFromToken()}/v1/task/${rootId}/create-sub-task`
      const response = await axiosInstance.post(url, restParams)
      return response.data
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error)
    }
  }
}