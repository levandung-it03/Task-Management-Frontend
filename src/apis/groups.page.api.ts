import { ApiResponse, GeneralAPIs } from "@/apis/general.api";
import { DTO_EmailResponse, DTO_IdResponse, DTO_PaginationRequest } from "@/dtos/general.dto";
import { DTO_ChangeGroupRole, DTO_ChangeGroupStatus, DTO_GroupRequest, DTO_DetailGroupResponse, DTO_PaginatedGroupsResponse, DTO_UpdateGroup } from "@/dtos/groups.page.dto";
import { AuthHelper } from "@/util/auth.helper";
import axiosInstance from "@/util/axios.helper";

export class GroupPageAPIs {

  static async getGroups(request: DTO_PaginationRequest): Promise<ApiResponse<DTO_PaginatedGroupsResponse> | unknown> {
    try {
      const response = await axiosInstance.post(`/api/private/${AuthHelper.getRoleFromToken()}/v1/group/search`, request)
      return response.data;
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error)
    }
  }

  static async createGroup(request: DTO_GroupRequest): Promise<ApiResponse<DTO_IdResponse> | unknown> {
    try {
      const response = await axiosInstance.post(`/api/private/${AuthHelper.getRoleFromToken()}/v1/group`, request)
      return response.data
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error)
    }
  }

  static async getGroup(id: number): Promise<ApiResponse<DTO_DetailGroupResponse> | unknown> {
    try {
      const response = await axiosInstance.get(`/api/private/${AuthHelper.getRoleFromToken()}/v1/group/${id}`)
      return response.data
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error)
    }
  }

  static async changeUserGroupRole(request: DTO_ChangeGroupRole): Promise<ApiResponse<void> | unknown> {
    try {
      const response = await axiosInstance.put(`/api/private/${AuthHelper.getRoleFromToken()}/v1/group-user/${request.groupUserId}`, {
        groupRole: request.role
      })
      return response.data
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error)
    }
  }

  static async kickUserOut(groupUserId: number): Promise<ApiResponse<void> | unknown> {
    try {
      const response = await axiosInstance.put(`/api/private/${AuthHelper.getRoleFromToken()}/v1/group-user/${groupUserId}/kick-user`)
      return response.data
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error)
    }
  }

  static async reAddGroupUser(groupUserId: number): Promise<ApiResponse<void> | unknown> {
    try {
      const response = await axiosInstance.put(`/api/private/${AuthHelper.getRoleFromToken()}/v1/group-user/${groupUserId}/re-add-user`)
      return response.data
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error)
    }
  }

  static async updateGroup(request: DTO_UpdateGroup): Promise<ApiResponse<DTO_IdResponse> | unknown> {
    try {
      const response = await axiosInstance.put(`/api/private/${AuthHelper.getRoleFromToken()}/v1/group/${request.groupId}`, {
        name: request.name,
        addedEmails: request.addedEmails,
      })
      return response.data
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error)
    }
  }

  static async changeGroupStatus(request: DTO_ChangeGroupStatus): Promise<ApiResponse<void> | unknown> {
    try {
      const response = await axiosInstance.put(`/api/private/${AuthHelper.getRoleFromToken()}/v1/group/${request.groupId}/change-status`, {
        status: request.status
      })
      return response.data
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error)
    }
  }

  static async checkIfAdmin(groupId: number): Promise<ApiResponse<DTO_EmailResponse> | unknown> {
    try {
      const response = await axiosInstance.get(`/api/private/${AuthHelper.getRoleFromToken()}/v1/group/${groupId}/is-admin`)
      return response.data
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error)
    }
  }
}