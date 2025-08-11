import { DTO_TaskListItem } from '@/dtos/task-list.page.dto';
import { ApiResponse, GeneralAPIs } from './general.api';
import axiosInstance from '../util/axios.helper';
import { AuthHelper } from '@/util/auth.helper';

export class TaskListAPIs {
  // API: Lấy thông tin chi tiết task-list
  static async getTaskListData(collectionId: number): Promise<ApiResponse<DTO_TaskListItem> | unknown> {
    try {
      const response = await axiosInstance.get(`/api/private/${AuthHelper.getRoleFromToken()}/v1/task-list/${collectionId}`);
      return response.data;
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error);
    }
  }





  // API: Lấy danh sách task theo collectionId
  static async getTasksByCollection(collectionId: number): Promise<ApiResponse<DTO_TaskListItem[]> | unknown> {
    try {
      const response = await axiosInstance.get(`/api/private/${AuthHelper.getRoleFromToken()}/v1/collection/${collectionId}/tasks`,);
      return response.data;
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error);
    }
  }


}

