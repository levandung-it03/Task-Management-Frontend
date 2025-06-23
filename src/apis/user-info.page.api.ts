import { DTO_UpdateUserInfoRequest } from "@/dtos/user-info.page"
import axiosInstance from "@/util/axios.helper"
import { GeneralAPIs, RecordResponse } from "./general.api"

export class UserInfoAPIs {

  static async getUserInfo(role: string): Promise<RecordResponse | unknown> {
    try {
      const response = await axiosInstance.get(`/api/private/${role}/user-info/v1/get-user-info`)
      return response.data
    } catch(error: unknown) {
      return GeneralAPIs.extractError(error)
    }
  }

  static async updateUserInfo(role: string, request: DTO_UpdateUserInfoRequest): Promise<RecordResponse | unknown> {
    try {
      const response = await axiosInstance.put(`/api/private/${role}/user-info/v1/update-user-info`, request)
      return response.data
    } catch(error: unknown) {
      return GeneralAPIs.extractError(error)
    }
  }

}