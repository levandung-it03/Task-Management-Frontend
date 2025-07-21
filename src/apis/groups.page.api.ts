import { ApiResponse, GeneralAPIs } from "@/apis/general.api";
import { DTO_IdResponse, DTO_PaginationRequest } from "@/dtos/general.dto";
import { DTO_ChangeGroupRole, DTO_ChangeGroupStatus, DTO_GroupRequest, DTO_GroupResponse, DTO_PaginatedGroupsResponse, DTO_UpdateGroup } from "@/dtos/groups.page.dto";
import { AuthHelper } from "@/util/auth.helper";
import axiosInstance from "@/util/axios.helper";

export class GroupPageAPIs {

  static async getGroups(request: DTO_PaginationRequest): Promise<ApiResponse<DTO_PaginatedGroupsResponse> | unknown> {
    try {
      // const role = AuthHelper.getRoleFromToken()
      // const response = await axiosInstance.put(`/api/private/${role}/user-info/v1/update-user-info`, request)
      // return response.data
      return {
        code: 11000,
        status: 200,
        msg: "Groups retrieved successfully",
        time: new Date().toISOString(),
        body: {
          totalPages: 3,
          dataList: [
            {
              id: 1,
              createdByUser: {
                id: 1,
                fullName: "Le Van Dung",
                email: "emp@gmail.com"
              },
              name: "Development Team",
              isActive: true,
              createdTime: "2024-01-15 10:30:00",
              updatedTime: "2024-01-15 10:30:00",
              userQuantity: 10,
              memberCount: 8,
              createdByName: "John Doe",
            },
            {
              id: 2,
              createdByUser: {
                id: 1,
                fullName: "Le Van Dung",
                email: "emp@gmail.com"
              },
              name: "Design Team",
              isActive: true,
              createdTime: "2024-01-16 14:20:00",
              userQuantity: 10,
              memberCount: 5,
              createdByName: "Jane Smith",
            },
            {
              id: 3,
              createdByUser: {
                id: 1,
                fullName: "Le Van Dung",
                email: "emp@gmail.com"
              },
              name: "Marketing Team",
              isActive: false,
              createdTime: "2024-01-10 09:15:00",
              userQuantity: 10,
              memberCount: 3,
              createdByName: "John Doe",
            },
          ]
        },
      }
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error)
    }
  }

  static async createGroup(request: DTO_GroupRequest): Promise<ApiResponse<DTO_IdResponse> | unknown> {
    try {
      const role = AuthHelper.getRoleFromToken()
      const response = await axiosInstance.post(`/api/private/${role}/group/v1/create`, request)
      return response.data
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error)
    }
  }

  static async getGroup(id: number): Promise<ApiResponse<DTO_GroupResponse> | unknown> {
    try {
      // const role = AuthHelper.getRoleFromToken()
      // const response = await axiosInstance.post(`/api/private/${role}/group/v1/get/${id}`)
      // return response.data
      return {
        code: 11000,
        status: 200,
        msg: "Groups retrieved successfully",
        time: new Date().toISOString(),
        body: {
          baseInfo: {
            id: 1,
            name: "Team Alpha",
            isActive: false,
            createdTime: "2024-01-15T10:00:00Z",
            updatedTime: "2024-01-15 10:00:00",
            userQuantity: 10,
            createdByUser: {
              id: 1,
              fullName: "Le Van Dung",
              email: "emp@gmail.com",
            },
          },
          groupHasUsers: [
            {
              id: 1,
              role: "ADMIN",
              joinedUser: { email: "nguyentan.01111997.30062025@tmakes.company.vn", fullName: "Nguyễn Tân", role: "ROLE_LEAD" },
              involedTime: "2024-01-15T10:00:00Z"
            },
            {
              id: 2,
              role: "MEMBER",
              joinedUser: { email: "lethu.26062000.01072025@tmakes.company.vn", fullName: "Lê Thư", role: "ROLE_EMP" },
              involedTime: "2024-01-16T09:30:00Z"
            },
            {
              id: 3,
              role: "MEMBER",
              joinedUser: { email: "khanhhoa.08032001.29062025@tmakes.company.vn", fullName: "Khánh Hòa", role: "ROLE_EMP" },
              involedTime: "2024-01-17T08:45:00Z"
            },
            {
              id: 4,
              role: "MEMBER",
              joinedUser: { email: "vumanh.17102003.28062025@tmakes.company.vn", fullName: "Vũ Mạnh", role: "ROLE_EMP" },
              involedTime: "2024-01-18T12:15:00Z"
            },
            {
              id: 5,
              role: "ADMIN",
              joinedUser: { email: "pm@gmail.com", fullName: "Nguyễn Tân", role: "ROLE_LEAD" },
              involedTime: "2024-01-15T10:00:00Z"
            },
          ]
        }
      }
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error)
    }
  }

  static async changeUserGroupRole(request: DTO_ChangeGroupRole): Promise<ApiResponse<void> | unknown> {
    try {
      // const role = AuthHelper.getRoleFromToken()
      // const response = await axiosInstance.put(`/api/v1/private/${role}/group/get${id}`, request)
      // return response.data
      return {
        code: 11000,
        status: 200,
        msg: "Updated successfully",
        time: new Date().toISOString(),
        body: null
      }
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error)
    }
  }

  static async kickUserOut(userGroupId: number): Promise<ApiResponse<void> | unknown> {
    try {
      // const role = AuthHelper.getRoleFromToken()
      // const response = await axiosInstance.put(`/api/v1/private/${role}/group/get${userGroupId}`, request)
      // return response.data
      return {
        code: 11000,
        status: 200,
        msg: "Delete successfully",
        time: new Date().toISOString(),
        body: null
      }
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error)
    }
  }

  static async updateGroup(request: DTO_UpdateGroup): Promise<ApiResponse<DTO_IdResponse> | unknown> {
    try {
      const role = AuthHelper.getRoleFromToken()
      const response = await axiosInstance.put(`/api/private/${role}/group/v1/update/${request.groupId}`, {
        name: request.name,
        assignedEmails: request.assignedEmails,
      })
      return response.data
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error)
    }
  }

  static async changeGroupStatus(request: DTO_ChangeGroupStatus): Promise<ApiResponse<void> | unknown> {
    try {
      // const role = AuthHelper.getRoleFromToken()
      // const response = await axiosInstance.put(`/api/v1/private/${role}/group/${request.groupId}/change-status`, {
      //   status: request.status
      // })
      // return response.data
      return {
        code: 11000,
        status: 200,
        msg: "Update successfully",
        time: new Date().toISOString(),
        body: null
      }
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error)
    }
  }
}