import axiosInstance from "@/util/axios.helper"
import { ApiResponse, GeneralAPIs, RecordResponse } from "./general.api"
import { DTO_FastUserInfo, DTO_GroupsRelatedToUser, DTO_SearchFastUserInfo } from "@/dtos/create-task.page.api"

export class CreateTaskPageAPIs {

  static async fastSearchUsers(request: DTO_SearchFastUserInfo): Promise<ApiResponse<DTO_FastUserInfo[]> | unknown> {
    try {
      // Get current role in Cookie
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
            { username: "duongminh.18062001.29062025@tmakes.company.vn", fullName: "Dương Minh", role: "ROLE_EMP" },
            { username: "ngocthuy.30042000.01072025@tmakes.company.vn", fullName: "Ngọc Thúy", role: "ROLE_LEAD" },
            { username: "trankien.12031999.28062025@tmakes.company.vn", fullName: "Trần Kiên", role: "ROLE_ADMIN" },
            { username: "phamhoang.10022002.27062025@tmakes.company.vn", fullName: "Phạm Hoàng", role: "ROLE_PM" },
            { username: "levinh.07072003.01072025@tmakes.company.vn", fullName: "Lê Vinh", role: "ROLE_EMP" },
            { username: "vuhoai.21052000.29062025@tmakes.company.vn", fullName: "Vũ Hoài", role: "ROLE_LEAD" },
            { username: "dangtuan.03121998.30062025@tmakes.company.vn", fullName: "Đặng Tuấn", role: "ROLE_EMP" },
            { username: "bichngan.04082001.28062025@tmakes.company.vn", fullName: "Bích Ngân", role: "ROLE_EMP" },
            { username: "trangthu.15092002.27062025@tmakes.company.vn", fullName: "Trang Thư", role: "ROLE_EMP" },
            { username: "nguyentan.01111997.30062025@tmakes.company.vn", fullName: "Nguyễn Tân", role: "ROLE_LEAD" },
            { username: "lethu.26062000.01072025@tmakes.company.vn", fullName: "Lê Thư", role: "ROLE_EMP" },
            { username: "khanhhoa.08032001.29062025@tmakes.company.vn", fullName: "Khánh Hòa", role: "ROLE_EMP" },
            { username: "vumanh.17102003.28062025@tmakes.company.vn", fullName: "Vũ Mạnh", role: "ROLE_EMP" }
          ],
        time: "12:00:20 30/06/2025"
      }
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error)
    }
  }
  
  static async getAllGroupsRelatedToUser(): Promise<ApiResponse<DTO_GroupsRelatedToUser[]> | unknown> {
    try {
      // Get current role in Cookie
      // const response = await axiosInstance.get(`/api/private/${role}/.../v1/...`)
      // return response.data
      // return setTimeout(() => {
        
      // }, 1000)
      return {
          code: 11001,
          msg: "Thành công",
          status: 200,
          body:
            [
              { groupId: 1, groupName: "Dev IT Batch 48", role: "OWNER" },
              { groupId: 2, groupName: "Dev IT Batch 45", role: "MEMBER" },
              { groupId: 3, groupName: "Dev IT Batch 30", role: "MEMBER" },
              // { groupId: 1, groupName: "Dev IT Batch 48", role: "OWNER" },
              // { groupId: 2, groupName: "Dev IT Batch 45", role: "MEMBER" },
              // { groupId: 3, groupName: "Dev IT Batch 30", role: "MEMBER" },
              // { groupId: 1, groupName: "Dev IT Batch 48", role: "OWNER" },
              // { groupId: 2, groupName: "Dev IT Batch 45", role: "MEMBER" },
              // { groupId: 3, groupName: "Dev IT Batch 30", role: "MEMBER" },
              // { groupId: 1, groupName: "Dev IT Batch 48", role: "OWNER" },
              // { groupId: 2, groupName: "Dev IT Batch 45", role: "MEMBER" },
              // { groupId: 3, groupName: "Dev IT Batch 30", role: "MEMBER" },
              // { groupId: 1, groupName: "Dev IT Batch 48", role: "OWNER" },
              // { groupId: 2, groupName: "Dev IT Batch 45", role: "MEMBER" },
              // { groupId: 3, groupName: "Dev IT Batch 30", role: "MEMBER" },
            ],
          time: "12:00:20 30/06/2025"
        }
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error)
    }
  }
  
  static async getAllUsersCanBeAssignedAndRelatedToGroup(groupId: number): Promise<ApiResponse<DTO_FastUserInfo[]> | unknown> {
    try {
      // Get current role in Cookie
      // const response = await axiosInstance.get(`/api/private/${role}/.../v1/.../${groupId}`)
      // return response.data
      return {
          code: 11003,
          msg: "Thành công",
          status: 200,
          body:
            [
              { username: "nguyentan.01111997.30062025@tmakes.company.vn", fullName: "Nguyễn Tân", role: "ROLE_LEAD" },
              { username: "lethu.26062000.01072025@tmakes.company.vn", fullName: "Lê Thư", role: "ROLE_EMP" },
              { username: "khanhhoa.08032001.29062025@tmakes.company.vn", fullName: "Khánh Hòa", role: "ROLE_EMP" },
              { username: "vumanh.17102003.28062025@tmakes.company.vn", fullName: "Vũ Mạnh", role: "ROLE_EMP" }
            ],
          time: "12:00:20 30/06/2025"
        }
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error)
    }
  }
}