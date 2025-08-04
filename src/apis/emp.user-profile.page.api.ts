import { DTO_GetUserProfileResponse, UserProfileData } from "@/dtos/emp.user-profile.page.dto"
import axiosInstance from "@/util/axios.helper"
import { GeneralAPIs, RecordResponse } from "./general.api"

export class UserProfileAPIs {

  static async getUserProfile(role: string): Promise<RecordResponse | unknown> {
    try {
      const response = await axiosInstance.get(`/api/private/${role}/user-profile/v1/get-user-profile`)
      return response.data
    } catch(error: unknown) {
      return GeneralAPIs.extractError(error)
    }
  }



} 