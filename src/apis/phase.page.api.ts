import { ApiResponse, GeneralAPIs } from './general.api';
import axiosInstance from '../util/axios.helper';
import { AuthHelper } from '@/util/auth.helper';
import { DTO_CreatePhase, DTO_DeletePhase, DTO_PhaseItem, DTO_ProjectDetail } from '@/dtos/phase.page.dto';
import { DTO_IdResponse } from '@/dtos/general.dto';

export class PhaseAPIs {
  // ===== PHASE CRUD OPERATIONS =====

  // Tạo phase mới
  static async createPhase(projectId: number, phaseData: DTO_CreatePhase): Promise<ApiResponse<DTO_IdResponse> | unknown> {
    try {
      const response = await axiosInstance.post(`/api/private/${AuthHelper.getRoleFromToken()}/v1/project/${projectId}/phase`, phaseData);
      return response.data;
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error);
    }
  }

  // Cập nhật phase
  static async updatePhase(id: number, phaseData: DTO_CreatePhase): Promise<ApiResponse<void> | unknown> {
    try {
      const response = await axiosInstance.put(`/api/private/${AuthHelper.getRoleFromToken()}/v1/phase/${id}`, phaseData);
      return response.data;
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error);
    }
  }

  // Xóa phase
  static async deletePhase(id: number): Promise<ApiResponse<void> | unknown> {
    try {
      const response = await axiosInstance.delete(`/api/private/${AuthHelper.getRoleFromToken()}/v1/phase/${id}`,);
      return response.data;
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error);
    }
  }

  // ===== PHASE DATA RETRIEVAL =====

  // Lấy thông tin chi tiết phase
  static async getPhaseById(id: number): Promise<ApiResponse<DTO_PhaseItem> | unknown> {
    try {
      const response = await axiosInstance.get(`/api/private/${AuthHelper.getRoleFromToken()}/v1/phase/${id}`);
      return response.data;
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error);
    }
  }

  // Lấy danh sách phases của project
  static async getPhasesByProject(projectId: number): Promise<ApiResponse<DTO_PhaseItem[]> | unknown> {
    try {
      const response = await axiosInstance.get(`/api/private/${AuthHelper.getRoleFromToken()}/v1/project/${projectId}/phases`);
      return response.data;
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error);
    }
  }

  // Tạo collection cho phase
  static async createCollectionForPhase(phaseId: number, collectionData: any): Promise<ApiResponse<{ id: number }> | unknown> {
    try {
      const response = await axiosInstance.post(`/api/private/${AuthHelper.getRoleFromToken()}/v1/phase/${phaseId}/create-collection`, collectionData);
      return response.data;
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error);
    }
  }

  static async getProjecDetail(projectId: number): Promise<ApiResponse<DTO_ProjectDetail> | unknown> {
    try {
      // const response = await axiosInstance.get(`/api/private/${AuthHelper.getRoleFromToken()}/v1/project/${projectId}/detail`);
      // return response.data;
      return {
        status: 200,
        body: {
          id: 0,
          name: "fdsafas",
          description: "ádfasdfasdf",
          startDate: "11/12/2003",
          endDate: null,
          dueDate: "11/12/2003",
          status: "PENDING",
          createdTime: "11/12/2003",
          updatedTime: "11/12/2003",
          userInfoCreated: {
            fullName: "fasfasd",
            email: "fasdfasdf",
            department: "ádfasdf",
            role: "ROLE_EMP"
          }
        }
      }
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error);
    }
  }
} 