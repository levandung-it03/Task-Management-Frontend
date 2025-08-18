import { DTO_PaginationRequest } from "@/dtos/general.dto";
import { ApiResponse, GeneralAPIs } from "./general.api";
import { DTO_PaginatedDataResponse } from "@/dtos/manage-users.page.dto";
import axiosInstance from "@/util/axios.helper";
import { AuthHelper } from "@/util/auth.helper";

export class ManageUsersAPIs {
  static async getPaginatedUsers(request: DTO_PaginationRequest): Promise<ApiResponse<DTO_PaginatedDataResponse> | unknown> {
    try {
      const response = await axiosInstance.post(`api/private/${AuthHelper.getRoleFromToken()}/v1/user-info/search-full`, request)
      return response.data;
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error);
    }
  }

  static async switchAccountStatus(userInfoId: number): Promise<ApiResponse<void> | unknown> {
    try {
      const url = `api/private/${AuthHelper.getRoleFromToken()}/v1/user-info/${userInfoId}/switch-account-status`
      const response = await axiosInstance.put(url)
      return response.data
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error);
    }
  }
}
