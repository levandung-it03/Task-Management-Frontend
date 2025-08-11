import { DTO_DashboardStats, DTO_Group, DTO_TaskOverview, DTO_UserInfo } from '@/dtos/home.page.dto';
import { ApiResponse, GeneralAPIs } from './general.api';
import axiosInstance from '@/util/axios.helper';
import { AuthHelper } from '@/util/auth.helper';

export class HomeAPIs {
  static async getUserInfo(): Promise<ApiResponse<DTO_UserInfo> | unknown> {
    try {
      const response = await axiosInstance.get(`/api/private/${AuthHelper.getRoleFromToken()}/v1/user-info`)
      return response.data
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error);
    }
  }

  static async getHomeStats(): Promise<ApiResponse<DTO_DashboardStats> | unknown> {
    try {
      const response = await axiosInstance.get(`/api/private/${AuthHelper.getRoleFromToken()}/v1/project/get-statistic`)
      return response.data
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error);
    }
  }

  static async getUndoneRelatedTasks(): Promise<ApiResponse<DTO_TaskOverview[]> | unknown> {
    try {
      const response = await axiosInstance.get(`/api/private/${AuthHelper.getRoleFromToken()}/v1/task/get-all-undone`)
      return response.data
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error);
    }
  }
} 