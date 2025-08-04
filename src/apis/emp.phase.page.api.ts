import { ApiResponse, GeneralAPIs } from './general.api';
import axiosInstance from '../util/axios.helper';
import { AuthHelper } from '@/util/auth.helper';
import { DTO_CreatePhase, DTO_DeletePhase, DTO_PhaseItem } from '@/dtos/phase.page.dto';

export class PhaseAPIs {
  static async createPhase(projectId: number, data: DTO_CreatePhase): Promise<ApiResponse<DTO_PhaseItem> | unknown> {
    try {
      const response = await axiosInstance.post(`/api/private/${AuthHelper.getRoleFromToken()}/v1/project/${projectId}//phase`)
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error);
    }
  }

  static async updatePhase(id: string, data: DTO_CreatePhase): Promise<ApiResponse<DTO_PhaseItem> | unknown> {
    try {
      const response = await axiosInstance.put(`/api/v1/private/pm/phase/${id}`, {
        name: data.name,
        description: data.description,
        startDate: data.startDate,
        deadline: data.deadline
      });
      return response.data;
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error);
    }
  }

  static async deletePhase(request: DTO_DeletePhase): Promise<ApiResponse<{ phaseId: string; deleted: boolean; softDeleted: boolean }> | unknown> {
    try {
      const response = await axiosInstance.delete(`/api/v1/private/pm/phase/${request.phaseId}`);
      return {
        code: 20002,
        msg: "Xóa phase thành công",
        status: 200,
        body: {
          phaseId: request.phaseId,
          deleted: true,
          softDeleted: false
        },
        time: new Date().toLocaleString('vi-VN', { hour12: false })
      };
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error);
    }
  }

  // Backend chưa có API kiểm tra phase có collections hay không 
  static async checkPhaseHasCollections(phaseId: string): Promise<ApiResponse<{ count: number }> | unknown> {
    try {
      return await new Promise<ApiResponse<{ count: number }>>(resolve => {
        setTimeout(() => {
          const hasCollections = ['1', '2'].includes(phaseId);
          resolve({
            code: 12005,
            msg: "Kiểm tra collections thành công",
            status: 200,
            body: {
              count: hasCollections ? 2 : 0
            },
            time: new Date().toLocaleString('vi-VN', { hour12: false })
          });
        }, 300);
      });
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error);
    }
  }

  static async getPhaseData(projectId: number): Promise<ApiResponse<DTO_PhaseItem[]> | unknown> {
    try {
      const response = await axiosInstance.get(`/api/private/${AuthHelper.getRoleFromToken()}/v1/project/${projectId}/phase`)
      return response.data
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error);
    }
  }

  // API mới từ backend - Lấy thông tin chi tiết phase
  static async getPhaseById(id: string): Promise<ApiResponse<DTO_PhaseItem> | unknown> {
    try {
      const response = await axiosInstance.get(`/api/v1/private/emp/phase/${id}`);
      return response.data;
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error);
    }
  }

  // API mới từ backend - Tạo collection cho phase
  static async createCollectionForPhase(phaseId: string, collectionData: any): Promise<ApiResponse<{ id: string }> | unknown> {
    try {
      const response = await axiosInstance.post(`/api/v1/private/pm/phase/${phaseId}/create-collection`, collectionData);
      return response.data;
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error);
    }
  }

  // API mới từ backend - Lấy tất cả collections của phase
  static async getAllRelatedCollections(phaseId: string): Promise<ApiResponse<any[]> | unknown> {
    try {
      const response = await axiosInstance.post(`/api/v1/private/emp/phase/${phaseId}/get-all-related-collections`);
      return response.data;
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error);
    }
  }
} 