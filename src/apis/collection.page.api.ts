import { DTO_CreateCollection, DTO_CollectionItem, DTO_DeleteCollection, DTO_PhaseDetail } from '@/dtos/collection.page.dto';
import { ApiResponse, GeneralAPIs } from './general.api';
import axiosInstance from '../util/axios.helper';
import { AuthHelper } from '@/util/auth.helper';
import { DTO_IdResponse } from '@/dtos/general.dto';

export class CollectionAPIs {
  // API: Lấy thông tin chi tiết collection
  static async getCollectionData(collectionId: number): Promise<ApiResponse<DTO_CollectionItem> | unknown> {
    try {
      const response = await axiosInstance.get(`/api/private/${AuthHelper.getRoleFromToken()}/v1/collection/${collectionId}`);
      return response.data;
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error);
    }
  }

  // API: Lấy danh sách collections của một phase
  static async getCollectionsByPhase(phaseId: number): Promise<ApiResponse<DTO_CollectionItem[]> | unknown> {
    try {
      const response = await axiosInstance.post(`/api/private/${AuthHelper.getRoleFromToken()}/v1/phase/${phaseId}/collections`,);
      return response.data;
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error);
    }
  }

  // API: Tạo collection mới trong phase
  static async createCollection(phaseId: number, collectionData: DTO_CreateCollection): Promise<ApiResponse<DTO_IdResponse> | unknown> {
    try {
      const response = await axiosInstance.post(`/api/private/${AuthHelper.getRoleFromToken()}/v1/phase/${phaseId}/create-collection`, collectionData);
      return response.data;
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error);
    }
  }

  // API: Cập nhật collection
  static async updateCollection(id: number, collectionData: DTO_CreateCollection): Promise<ApiResponse<void> | unknown> {
    try {
      const response = await axiosInstance.put(`/api/private/${AuthHelper.getRoleFromToken()}/v1/collection/${id}`, collectionData);
      return response.data;
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error);
    }
  }

  // API: Xóa collection
  static async deleteCollection(id: number): Promise<ApiResponse<void> | unknown> {
    try {
      const response = await axiosInstance.delete(`/api/private/${AuthHelper.getRoleFromToken()}/v1/collection/${id}`,);
      return response.data;
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error);
    }
  }

  // API: Tạo task trong collection
  static async createTaskInCollection(collectionId: number, taskData: any): Promise<ApiResponse<any> | unknown> {
    try {
      const response = await axiosInstance.post(`/api/private/${AuthHelper.getRoleFromToken()}/v1/collection/${collectionId}/create-task`, taskData);
      return response.data;
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error);
    }
  }

  static async getPhaseDetail(phaseId: number): Promise<ApiResponse<DTO_PhaseDetail> | unknown> {
    try {
      const response = await axiosInstance.get(`/api/private/${AuthHelper.getRoleFromToken()}/v1/phase/${phaseId}/detail`);
      return response.data;
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error);
    }
  }

  static async completePhase(phaseId: number): Promise<ApiResponse<void> | unknown> {
    try {
      const response = await axiosInstance.put(`/api/private/${AuthHelper.getRoleFromToken()}/v1/phase/${phaseId}/complete-phase`);
      return response.data;
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error);
    }
  }
}