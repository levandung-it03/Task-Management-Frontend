import { DTO_ChangePasswordRequest, DTO_Token, DTO_VerifyEmailRequest } from "@/dtos/general.dto";
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

  static async getGenderEnums(): Promise<RecordResponse | unknown> {
    try {
      const response = await axiosInstance.get(`/api/public/enums/v1/get-gender-enums`)
      return response.data
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error)
    }
  }

  static async getOtpEnumTypes(): Promise<RecordResponse | unknown> {
    try {
      const response = await axiosInstance.get(`/api/public/enums/v1/get-otp-enum-types`)
      return response.data
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error)
    }
  }

  static async getOauth2ServiceEnums(): Promise<RecordResponse | unknown> {
    try {
      const response = await axiosInstance.get(`/api/public/enums/v1/get-oauth2-service-enums`)
      return response.data
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error)
    }
  }

  static async verifyEmailByOtp(request: DTO_VerifyEmailRequest): Promise<RecordResponse | unknown> {
    try {
      const response = await axiosInstance.post(`/api/public/auth/account/v1/verify-email`, request)
      return response.data
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error)
    }
  }

  static async authorizeEmailByOtp(role: string): Promise<RecordResponse | unknown> {
    try {
      const response = await axiosInstance.post(`/api/private/${role}/account/v1/authorize-email`)
      return response.data
    } catch (error: unknown) {
      console.log(error)
      return GeneralAPIs.extractError(error)
    }
  }

  static async logout(request: DTO_Token): Promise<RecordResponse | unknown> {
    try {
      const response = await axiosInstance.post(`/api/private/auth/account/v1/log-out`, request)
      return response.data
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error)
    }
  }

  static async refreshToken(request: DTO_Token): Promise<RecordResponse | unknown> {
    try {
      const response = await axiosInstance.post(`/api/private/auth/account/v1/refresh-token`, request)
      return response.data
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error)
    }
  }

  static async changePassword(role: string, request: DTO_ChangePasswordRequest): Promise<RecordResponse | unknown> {
    try {
      const response = await axiosInstance.put(`/api/private/${role}/account/v1/change-password`, request)
      return response.data
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error)
    }
  }

  static async getTaskLevelEnums(): Promise<string[] | unknown> {
    try {
      // const response = await axiosInstance.put(`/api/public/enum/v1/get-task-level-enums`)
      // return response.data
      return {
        code: 11003,
        msg: "Thành công",
        status: 200,
        body: ["HARD", "ADVANCED", "NORMAL", "LIGHT"],
        time: "12:00:20 30/06/2025"
      }
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error)
    }
  }

  static async getTaskPriorityEnums(): Promise<string[] | unknown> {
    try {
      // const response = await axiosInstance.put(`/api/public/enum/v1/get-priority-enums`)
      // return response.data
      return {
        code: 11003,
        msg: "Thành công",
        status: 200,
        body: ["URGENT", "HIGH", "NORMAL", "LOW"],
        time: "12:00:20 30/06/2025"
      }
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error)
    }
  }

  static async getTaskTypeEnums(): Promise<string[] | unknown> {
    try {
      // const response = await axiosInstance.put(`/api/public/enum/v1/get-task-types-enums`)
      // return response.data
      return {
        code: 11003,
        msg: "Thành công",
        status: 200,
        body: [
          "BUSINESS_ANALYSIS",
          "BACKEND",
          "FRONTEND",
          "DEPLOY",
          "DESIGN",
          "TEST",
          "DOCUMENTATION",
          "MAINTENANCE",
          "RESEARCH",
          "TRAINING",
          "AI"
        ],
        time: "12:00:20 30/06/2025"
      }
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error)
    }
  }

  static async getGroupRoleEnums(): Promise<string[] | unknown> {
    try {
      // const response = await axiosInstance.put(`/api/public/enum/v1/get-group-role-enums`)
      // return response.data
      return {
        code: 11003,
        msg: "Thành công",
        status: 200,
        body: [
          "ADMIN",
          "MEMBER",
        ],
        time: "12:00:20 30/06/2025"
      }
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error)
    }
  }

}