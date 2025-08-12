import { DTO_ChangePasswordRequest, DTO_EmailResponse, DTO_Token, DTO_VerifyEmailRequest } from "@/dtos/general.dto";
import { DTO_ViewUserResponse } from "@/dtos/view-user.page.dto";
import { AuthHelper } from "@/util/auth.helper";
import axiosInstance from "@/util/axios.helper"
import GlobalValidators from "@/util/global.validators";
import toast from "react-hot-toast";

export interface ApiResponse<T> {
  code: number;
  msg: string;
  status: number;
  body: T;
  time: string;
}

export type RecordResponse = ApiResponse<Record<string, string>>;
export type NestedRecordResponse = ApiResponse<Record<string, unknown>>;
export type ListRecordResponse = ApiResponse<Record<string, string>[]>;
export type ListStringResponse = ApiResponse<string[]>;
export type ListNumberResponse = ApiResponse<number[]>;

export interface ErrorResponse {
  response?: {
    data?: unknown;
    status?: number;
  };
  [key: string]: unknown;
}

export class GeneralAPIs {
  static extractError(error: unknown): unknown {
    if (typeof error === "object" && error !== null && "response" in error) {
      const err = error as ErrorResponse;
      if (GlobalValidators.nonNull(err.response?.data) && GlobalValidators.notEmpty(err.response?.data)) {
        const response = err.response!.data as ApiResponse<null>
        toast.error(response.msg)
        return response
      }
      return err
    }
    return error;
  }
  
  static extractRawError(error: unknown): unknown {
    if (typeof error === "object" && error !== null && "response" in error) {
      const err = error as ErrorResponse;
      if (GlobalValidators.nonNull(err.response?.data) && GlobalValidators.notEmpty(err.response?.data)) {
        const response = err.response
        toast.error("Request failed, try again!")
        return response
      }
      return err
    }
    return error;
  }

  static async getOtpEnumTypes(): Promise<RecordResponse | unknown> {
    try {
      const response = await axiosInstance.get(`/api/public/v1/enum/otp-type`)
      return response.data
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error)
    }
  }

  static async getOauth2ServiceEnums(): Promise<RecordResponse | unknown> {
    try {
      const response = await axiosInstance.get(`/api/public/v1/enum/get-oauth2-service-enums`)
      return response.data
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error)
    }
  }

  static async verifyEmailByOtp(request: DTO_VerifyEmailRequest): Promise<RecordResponse | unknown> {
    try {
      const response = await axiosInstance.post(`/api/public/auth/v1/account/verify-email`, request)
      return response.data
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error)
    }
  }

  static async authorizeEmailByOtp(): Promise<RecordResponse | unknown> {
    try {
      const response = await axiosInstance.post(`/api/private/${AuthHelper.getRoleFromToken()}/v1/account/authorize-email`)
      return response.data
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error)
    }
  }

  static async logout(request: DTO_Token): Promise<RecordResponse | unknown> {
    try {
      const response = await axiosInstance.post(`/api/private/auth/v1/account/log-out`, request)
      return response.data
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error)
    }
  }

  static async refreshToken(request: DTO_Token): Promise<RecordResponse | unknown> {
    try {
      const response = await axiosInstance.post(`/api/private/auth/v1/account/refresh-token`, request)
      return response.data
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error)
    }
  }

  static async changePassword(request: DTO_ChangePasswordRequest): Promise<RecordResponse | unknown> {
    try {
      const response = await axiosInstance.put(`/api/private/${AuthHelper.getRoleFromToken()}/v1/account/change-password`, request)
      return response.data
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error)
    }
  }

  static async getTaskLevelEnums(): Promise<ApiResponse<string[]> | unknown> {
    try {
      const response = await axiosInstance.get(`/api/public/v1/enum/task-level`)
      console.log(response.data)
      return response.data
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error)
    }
  }

  static async getTaskPriorityEnums(): Promise<ApiResponse<string[]> | unknown> {
    try {
      const response = await axiosInstance.get(`/api/public/v1/enum/task-priority`)
      return response.data
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error)
    }
  }

  static async getTaskTypeEnums(): Promise<ApiResponse<string[]> | unknown> {
    try {
      const response = await axiosInstance.get(`/api/public/v1/enum/task-type`)
      return response.data
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error)
    }
  }

  static async getGroupRoleEnums(): Promise<ApiResponse<string[]> | unknown> {
    try {
      const response = await axiosInstance.get(`/api/public/v1/enum/group-role`)
      return response.data
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error)
    }
  }

  static async getEmail(): Promise<ApiResponse<DTO_EmailResponse> | unknown> {
    try {
      const response = await axiosInstance.get(`/api/private/${AuthHelper.getRoleFromToken()}/v1/account/email`)
      return response.data
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error)
    }
  }

  static async viewUserById(userId: number): Promise<ApiResponse<DTO_ViewUserResponse> | unknown> {
    try {
      const response = await axiosInstance.get(`/api/private/${AuthHelper.getRoleFromToken()}/v1/user-info/${userId}`)
      return response.data
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error)
    }
  }

}