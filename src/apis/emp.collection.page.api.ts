import { DTO_CreateCollection, DTO_CollectionItem, DTO_DeleteCollection } from '../dtos/emp.collection.page.dto';
import { ApiResponse, GeneralAPIs } from './general.api';
import axiosInstance from '../util/axios.helper';

export class CollectionAPIs {
  // API: Lấy thông tin chi tiết collection
  static async getCollectionData(collectionId: string): Promise<ApiResponse<DTO_CollectionItem> | unknown> {
    try {
      const response = await axiosInstance.get(`/api/v1/private/collection/${collectionId}`);
      return response.data;
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error);
    }
  }

  // API: Lấy danh sách collections của một phase
  static async getCollectionsByPhase(phaseId: string): Promise<ApiResponse<DTO_CollectionItem[]> | unknown> {
    try {
      const response = await axiosInstance.post(`/api/v1/private/phase/${phaseId}/get-all-related-collections`);
      return response.data;
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error);
    }
  }

  // API: Tạo collection mới trong phase
  static async createCollection(phaseId: string, data: DTO_CreateCollection): Promise<ApiResponse<DTO_CollectionItem> | unknown> {
    try {
      const response = await axiosInstance.post(`/api/v1/private/phase/${phaseId}/create-collection`, {
        name: data.name,
        description: data.description,
        startDate: data.startDate,
        endDate: data.endDate,
        deadline: data.deadline
      });
      return response.data;
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error);
    }
  }

  // API: Cập nhật collection
  static async updateCollection(id: string, data: DTO_CreateCollection): Promise<ApiResponse<DTO_CollectionItem> | unknown> {
    try {
      const response = await axiosInstance.put(`/api/v1/private/collection/${id}`, {
        name: data.name,
        description: data.description,
        startDate: data.startDate,
        endDate: data.endDate,
        deadline: data.deadline
      });
      return response.data;
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error);
    }
  }

  // API: Xóa collection
  static async deleteCollection(request: DTO_DeleteCollection): Promise<ApiResponse<{ collectionId: string; deleted: boolean; softDeleted: boolean }> | unknown> {
    try {
      const response = await axiosInstance.delete(`/api/v1/private/collection/${request.collectionId}`);
      return {
        code: 13004,
        msg: "Xóa collection thành công",
        status: 200,
        body: {
          collectionId: request.collectionId,
          deleted: true,
          softDeleted: false
        },
        time: new Date().toLocaleString('vi-VN', { hour12: false })
      };
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error);
    }
  }

  // API: Lấy tất cả task của collection
  static async getCollectionTasks(collectionId: string): Promise<ApiResponse<any[]> | unknown> {
    try {
      const response = await axiosInstance.post(`/api/v1/private/collection/${collectionId}/get-all-related-tasks`);
      return response.data;
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error);
    }
  }

  // API: Tạo task trong collection
  static async createTaskInCollection(collectionId: string, taskData: any): Promise<ApiResponse<any> | unknown> {
    try {
      const response = await axiosInstance.post(`/api/v1/private/collection/${collectionId}/create-task`, taskData);
      return response.data;
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error);
    }
  }

  static async checkCollectionHasTasks(collectionId: string): Promise<ApiResponse<{ count: number }> | unknown> {
    try {
      const tasksResponse = await this.getCollectionTasks(collectionId);
      if (tasksResponse && typeof tasksResponse === 'object' && 'body' in tasksResponse) {
        const tasks = tasksResponse.body as any[];
        return {
          code: 13005,
          msg: "Kiểm tra collection tasks thành công",
          status: 200,
          body: {
            count: tasks.length
          },
          time: new Date().toLocaleString('vi-VN', { hour12: false })
        };
      }
      return {
        code: 13005,
        msg: "Kiểm tra collection tasks thành công",
        status: 200,
        body: {
          count: 0
        },
        time: new Date().toLocaleString('vi-VN', { hour12: false })
      };
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error);
    }
  }
}