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
      // return {
      //   code: 11001,
      //   msg: "Thành công",
      //   status: 200,
      //   body:
      //     [
      //       { email: "duongminh.18062001.29062025@tmakes.company.vn", fullName: "Dương Minh", role: "ROLE_EMP" },
      //       { email: "ngocthuy.30042000.01072025@tmakes.company.vn", fullName: "Ngọc Thúy", role: "ROLE_LEAD" },
      //       { email: "trankien.12031999.28062025@tmakes.company.vn", fullName: "Trần Kiên", role: "ROLE_ADMIN" },
      //       { email: "phamhoang.10022002.27062025@tmakes.company.vn", fullName: "Phạm Hoàng", role: "ROLE_PM" },
      //       { email: "levinh.07072003.01072025@tmakes.company.vn", fullName: "Lê Vinh", role: "ROLE_EMP" },
      //       { email: "vuhoai.21052000.29062025@tmakes.company.vn", fullName: "Vũ Hoài", role: "ROLE_LEAD" },
      //       { email: "dangtuan.03121998.30062025@tmakes.company.vn", fullName: "Đặng Tuấn", role: "ROLE_EMP" },
      //       { email: "bichngan.04082001.28062025@tmakes.company.vn", fullName: "Bích Ngân", role: "ROLE_EMP" },
      //       { email: "trangthu.15092002.27062025@tmakes.company.vn", fullName: "Trang Thư", role: "ROLE_EMP" },
      //       { email: "nguyentan.01111997.30062025@tmakes.company.vn", fullName: "Nguyễn Tân", role: "ROLE_LEAD" },
      //       { email: "lethu.26062000.01072025@tmakes.company.vn", fullName: "Lê Thư", role: "ROLE_EMP" },
      //       { email: "khanhhoa.08032001.29062025@tmakes.company.vn", fullName: "Khánh Hòa", role: "ROLE_EMP" },
      //       { email: "vumanh.17102003.28062025@tmakes.company.vn", fullName: "Vũ Mạnh", role: "ROLE_EMP" }
      //     ],
      //   time: "12:00:20 30/06/2025"
      // }
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error)
    }
  }

  static async fastSearchUsersTask(request: DTO_SearchFastUserInfo): Promise<ApiResponse<DTO_FastUserInfo[]> | unknown> {
    try {
      const url = `/api/private/${AuthHelper.getRoleFromToken()}/v1/user-info/search-for-new-task/${request.query}`
      const response = await axiosInstance.get(url)
      return response.data
      // return {
      //   code: 11001,
      //   msg: "Thành công",
      //   status: 200,
      //   body:
      //     [
      //       { email: "duongminh.18062001.29062025@tmakes.company.vn", fullName: "Dương Minh", role: "ROLE_EMP" },
      //       { email: "ngocthuy.30042000.01072025@tmakes.company.vn", fullName: "Ngọc Thúy", role: "ROLE_LEAD" },
      //       { email: "trankien.12031999.28062025@tmakes.company.vn", fullName: "Trần Kiên", role: "ROLE_ADMIN" },
      //       { email: "phamhoang.10022002.27062025@tmakes.company.vn", fullName: "Phạm Hoàng", role: "ROLE_PM" },
      //       { email: "levinh.07072003.01072025@tmakes.company.vn", fullName: "Lê Vinh", role: "ROLE_EMP" },
      //       { email: "vuhoai.21052000.29062025@tmakes.company.vn", fullName: "Vũ Hoài", role: "ROLE_LEAD" },
      //       { email: "dangtuan.03121998.30062025@tmakes.company.vn", fullName: "Đặng Tuấn", role: "ROLE_EMP" },
      //       { email: "bichngan.04082001.28062025@tmakes.company.vn", fullName: "Bích Ngân", role: "ROLE_EMP" },
      //       { email: "trangthu.15092002.27062025@tmakes.company.vn", fullName: "Trang Thư", role: "ROLE_EMP" },
      //       { email: "nguyentan.01111997.30062025@tmakes.company.vn", fullName: "Nguyễn Tân", role: "ROLE_LEAD" },
      //       { email: "lethu.26062000.01072025@tmakes.company.vn", fullName: "Lê Thư", role: "ROLE_EMP" },
      //       { email: "khanhhoa.08032001.29062025@tmakes.company.vn", fullName: "Khánh Hòa", role: "ROLE_EMP" },
      //       { email: "vumanh.17102003.28062025@tmakes.company.vn", fullName: "Vũ Mạnh", role: "ROLE_EMP" }
      //     ],
      //   time: "12:00:20 30/06/2025"
      // }
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error)
    }
  }

  static async fastSearchUsersTaskOfRootTask(rootId: number, request: DTO_SearchFastUserInfo): Promise<ApiResponse<DTO_FastUserInfo[]> | unknown> {
    try {
      const url = `/api/private/${AuthHelper.getRoleFromToken()}/v1/task-user/search/${request.query}?taskId=${rootId}`
      const response = await axiosInstance.get(url)
      return response.data
      // return {
      //   code: 11001,
      //   msg: "Thành công",
      //   status: 200,
      //   body:
      //     [
      //       { email: "duongminh.18062001.29062025@tmakes.company.vn", fullName: "Dương Minh", role: "ROLE_EMP" },
      //       { email: "ngocthuy.30042000.01072025@tmakes.company.vn", fullName: "Ngọc Thúy", role: "ROLE_LEAD" },
      //       { email: "trankien.12031999.28062025@tmakes.company.vn", fullName: "Trần Kiên", role: "ROLE_ADMIN" },
      //       { email: "phamhoang.10022002.27062025@tmakes.company.vn", fullName: "Phạm Hoàng", role: "ROLE_PM" },
      //       { email: "levinh.07072003.01072025@tmakes.company.vn", fullName: "Lê Vinh", role: "ROLE_EMP" },
      //       { email: "vuhoai.21052000.29062025@tmakes.company.vn", fullName: "Vũ Hoài", role: "ROLE_LEAD" },
      //       { email: "dangtuan.03121998.30062025@tmakes.company.vn", fullName: "Đặng Tuấn", role: "ROLE_EMP" },
      //       { email: "bichngan.04082001.28062025@tmakes.company.vn", fullName: "Bích Ngân", role: "ROLE_EMP" },
      //       { email: "trangthu.15092002.27062025@tmakes.company.vn", fullName: "Trang Thư", role: "ROLE_EMP" },
      //       { email: "nguyentan.01111997.30062025@tmakes.company.vn", fullName: "Nguyễn Tân", role: "ROLE_LEAD" },
      //       { email: "lethu.26062000.01072025@tmakes.company.vn", fullName: "Lê Thư", role: "ROLE_EMP" },
      //       { email: "khanhhoa.08032001.29062025@tmakes.company.vn", fullName: "Khánh Hòa", role: "ROLE_EMP" },
      //       { email: "vumanh.17102003.28062025@tmakes.company.vn", fullName: "Vũ Mạnh", role: "ROLE_EMP" }
      //     ],
      //   time: "12:00:20 30/06/2025"
      // }
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error)
    }
  }

  static async getAllGroupsRelatedToUser(): Promise<ApiResponse<DTO_GroupOverview[]> | unknown> {
    try {
      const response = await axiosInstance.get(`/api/private/${AuthHelper.getRoleFromToken()}/v1/group/get-related-groups`)
      return response.data
      // return {
      //     code: 11001,
      //     msg: "Thành công",
      //     status: 200,
      //     body:
      //       [
      //         { groupId: 1, groupName: "Dev IT Batch 48", role: "OWNER" },
      //         { groupId: 2, groupName: "Dev IT Batch 45", role: "MEMBER" },
      //         { groupId: 3, groupName: "Dev IT Batch 30", role: "MEMBER" },
      //         // { groupId: 1, groupName: "Dev IT Batch 48", role: "OWNER" },
      //         // { groupId: 2, groupName: "Dev IT Batch 45", role: "MEMBER" },
      //         // { groupId: 3, groupName: "Dev IT Batch 30", role: "MEMBER" },
      //         // { groupId: 1, groupName: "Dev IT Batch 48", role: "OWNER" },
      //         // { groupId: 2, groupName: "Dev IT Batch 45", role: "MEMBER" },
      //         // { groupId: 3, groupName: "Dev IT Batch 30", role: "MEMBER" },
      //         // { groupId: 1, groupName: "Dev IT Batch 48", role: "OWNER" },
      //         // { groupId: 2, groupName: "Dev IT Batch 45", role: "MEMBER" },
      //         // { groupId: 3, groupName: "Dev IT Batch 30", role: "MEMBER" },
      //         // { groupId: 1, groupName: "Dev IT Batch 48", role: "OWNER" },
      //         // { groupId: 2, groupName: "Dev IT Batch 45", role: "MEMBER" },
      //         // { groupId: 3, groupName: "Dev IT Batch 30", role: "MEMBER" },
      //       ],
      //     time: "12:00:20 30/06/2025"
      //   }
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error)
    }
  }

  static async getUsersGroupToAssign(groupId: number): Promise<ApiResponse<DTO_FastUserInfo[]> | unknown> {
    try {
      const url = `/api/private/${AuthHelper.getRoleFromToken()}/v1/group/${groupId}/get-users-to-assign`
      const response = await axiosInstance.get(url)
      return response.data
      // return {
      //     code: 11003,
      //     msg: "Thành công",
      //     status: 200,
      //     body:
      //       [
      //         { email: "nguyentan.01111997.30062025@tmakes.company.vn", fullName: "Nguyễn Tân", role: "ROLE_LEAD" },
      //         { email: "lethu.26062000.01072025@tmakes.company.vn", fullName: "Lê Thư", role: "ROLE_EMP" },
      //         { email: "khanhhoa.08032001.29062025@tmakes.company.vn", fullName: "Khánh Hòa", role: "ROLE_EMP" },
      //         { email: "vumanh.17102003.28062025@tmakes.company.vn", fullName: "Vũ Mạnh", role: "ROLE_EMP" }
      //       ],
      //     time: "12:00:20 30/06/2025"
      //   }
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error)
    }
  }

  static async createTask(request: DTO_TaskRequest): Promise<ApiResponse<RecordResponse> | unknown> {
    try {
      const { collectionId, ...restParams } = request
      const url = `/api/private/${AuthHelper.getRoleFromToken()}/v1/collection/${collectionId}/create-task`
      const response = await axiosInstance.post(url, request)
      return response.data
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error)
    }
  }

  static async createSubTask(rootId: number, request: DTO_TaskRequest): Promise<ApiResponse<RecordResponse> | unknown> {
    try {
      const url = `/api/private/${AuthHelper.getRoleFromToken()}/v1/task/${rootId}/create-sub-task`
      const response = await axiosInstance.post(url, request)
      return response.data
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error)
    }
  }
}