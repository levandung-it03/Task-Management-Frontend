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

  static async getUserGroups(): Promise<ApiResponse<DTO_Group[]> | unknown> {
    try {
      return await new Promise<ApiResponse<DTO_Group[]>>(resolve => {
        setTimeout(() => {
          resolve({
            code: 12003,
            msg: "Lấy danh sách nhóm thành công",
            status: 200,
            body: [
              {
                id: 1,
                groupAvatar: '/images/avatar1.png',
                groupName: 'Dev IT batch 48',
                role: 'OWNER',
              },
              {
                id: 2,
                groupAvatar: '/images/avatar2.png',
                groupName: 'Dev IT batch 45',
                role: 'MEMBER',
              },
              {
                id: 3,
                groupAvatar: '/images/avatar3.png',
                groupName: 'Dev IT batch 30',
                role: 'MEMBER',
              },
            ],
            time: "12:04:00 30/06/2025"
          });
        }, 300);
      });
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error);
    }
  }

  static async getUndoneRelatedTasks(): Promise<ApiResponse<DTO_TaskOverview[]> | unknown> {
    try {
      // const response = await axiosInstance.get(`/api/private/${AuthHelper.getRoleFromToken()}/v1/task/get-all-undone`)
      // return response.data
      return {
        status: 200,
        body: [
          {
            id: 1, name: "fdsafsad",
            taskType: "DESIGN",
            taskPriority: "HIGH",
            startDate: "11/12/2025",
            endDate: "11/12/2025",
            deadline: "11/12/2025"
          }
        ]
      }
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error);
    }
  }
} 