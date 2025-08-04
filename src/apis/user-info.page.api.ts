import axiosInstance from "@/util/axios.helper"
import { GeneralAPIs, RecordResponse } from "./general.api"
import { DTO_UpdateUserInfoRequest } from "@/dtos/user-info.page.dto"

export class UserInfoAPIs {

  static async getUserInfo(role: string): Promise<RecordResponse | unknown> {
    try {
      const response = await axiosInstance.get(`/api/private/${role}/v1/user-info/get-user-info`)
      return response.data
    } catch(error: unknown) {
      return GeneralAPIs.extractError(error)
    }
  }

  static async updateUserInfo(role: string, request: DTO_UpdateUserInfoRequest): Promise<RecordResponse | unknown> {
    try {
      const response = await axiosInstance.put(`/api/private/${role}/v1/user-info/update-user-info`, request)
      return response.data
    } catch(error: unknown) {
      return GeneralAPIs.extractError(error)
    }
  }

}