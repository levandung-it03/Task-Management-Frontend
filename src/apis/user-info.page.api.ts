import axiosInstance from "@/util/axios.helper"
import { ApiResponse, GeneralAPIs, RecordResponse } from "./general.api"
import { DTO_UserInfo, DTO_UserInfoResponse } from "@/dtos/user-info.page.dto"

export class UserInfoAPIs {

  static async getUserInfo(role: string): Promise<ApiResponse<DTO_UserInfoResponse> | unknown> {
    try {
      const response = await axiosInstance.get(`/api/private/${role}/v1/user-info`)
      return response.data
    } catch(error: unknown) {
      return GeneralAPIs.extractError(error)
    }
  }

  static async updateUserInfo(role: string, request: DTO_UserInfo): Promise<ApiResponse<void> | unknown> {
    try {
      const response = await axiosInstance.put(`/api/private/${role}/v1/user-info`, request)
      return response.data
    } catch(error: unknown) {
      return GeneralAPIs.extractError(error)
    }
  }

}