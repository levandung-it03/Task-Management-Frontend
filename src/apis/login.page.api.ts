import axiosInstance from "@/util/axios.helper"
import { GeneralAPIs, RecordResponse } from "./general.api"
import { DTO_AuthRequest, DTO_LostPassRequest, DTO_RegisterRequest } from "@/dtos/login.page.dto"
import { DTO_GetOauth2Authorizer, DTO_Oauth2Authenticate } from "@/dtos/general.dto"

export class LoginAPIs {

  static async authenticate(request: DTO_AuthRequest): Promise<RecordResponse | unknown> {
    try {
      const response = await axiosInstance.post(`/api/public/auth/account/v1/authenticate`, request)
      return response.data
    } catch(error: unknown) {
      return GeneralAPIs.extractError(error)
    }
  }
  
  static async register(request: DTO_RegisterRequest): Promise<RecordResponse | unknown> {
    try {
      const response = await axiosInstance.post(`/api/public/auth/account/v1/register`, request)
      return response.data
    } catch(error: unknown) {
      return GeneralAPIs.extractError(error)
    }
  }

  static async lostPassword(request: DTO_LostPassRequest): Promise<RecordResponse | unknown> {
    try {
      const response = await axiosInstance.post(`/api/public/auth/account/v1/lost-password`, request)
      return response.data
    } catch(error: unknown) {
      return GeneralAPIs.extractError(error)
    }
  }

  static async getOauth2Authorizer(request: DTO_GetOauth2Authorizer): Promise<RecordResponse | unknown> {
    try {
      const response = await axiosInstance.get(`/api/public/auth/account/v1/get-oauth2-authorizer`, { params: request })
      return response.data
    } catch(error: unknown) {
      return GeneralAPIs.extractError(error)
    }
  }

  static async oauth2Authenticate(request: DTO_Oauth2Authenticate): Promise<RecordResponse | unknown> {
    try {
      const response = await axiosInstance.post(`/api/public/auth/account/v1/oauth2-authenticate`, request)
      return response.data
    } catch(error: unknown) {
      return GeneralAPIs.extractError(error)
    }
  }

}