import { DTO_CreateProject, DTO_UpdateProject } from '@/dtos/project.page.dto';
import { DTO_ProjectItem } from '@/dtos/home.page.dto';
import { DTO_AddLeaderToProjectRequest, DTO_SearchFastUserInfo_Project,DTO_ProjectRoleResponse, DTO_KickedLeaderRequest, DTO_DeleteProject } from '@/dtos/project.page.dto';
import { DTO_FastUserInfo } from '@/dtos/create-task.page.dto';
import { ApiResponse, GeneralAPIs } from './general.api';
import axiosInstance from '@/util/axios.helper';
import { AuthHelper } from '@/util/auth.helper';


export class ProjectAPIs {
  // Tạo project mới - API thực tế từ backend
  static async createProject(projectData: DTO_CreateProject): Promise<ApiResponse<{ id: number }> | unknown> {
    try {
      const response = await axiosInstance.post(`/api/private/${AuthHelper.getRoleFromToken()}/v1/project`, projectData);
      return response.data;
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error);
    }
  }

  // Cập nhật thông tin project - API thực tế từ backend
  static async updateProject(id: number, projectData: DTO_UpdateProject): Promise<ApiResponse<void> | unknown> {
    try {
      const response = await axiosInstance.put(`/api/private/${AuthHelper.getRoleFromToken()}/v1/project/${id}`, projectData);
      return response.data;
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error);
    }
  }

  // Thêm leaders vào project - API thực tế từ backend
  static async addLeadersToProject(projectId: number, requestData: DTO_AddLeaderToProjectRequest): Promise<ApiResponse<void> | unknown> {
    try {
      const response = await axiosInstance.put(`/api/private/${AuthHelper.getRoleFromToken()}/v1/project/${projectId}/add-leaders`,requestData);
    return response.data;
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error);
    }
  }

  // Xóa leader khỏi project - API thực tế từ backend
  static async removeLeaderFromProject(  projectId: number,requestData: DTO_KickedLeaderRequest): Promise<ApiResponse<void> | unknown> {
    try {
      const response = await axiosInstance.post(`/api/private/${AuthHelper.getRoleFromToken()}/v1/project/${projectId}/kick-leader`,
      requestData
    );
    return response.data;
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error);
    }
  }

  // Xóa/vô hiệu hóa project - API thực tế từ backend
  static async deleteProject(id: number): Promise<ApiResponse<void> | unknown> {
    try {
      const response = await axiosInstance.delete(`/api/private/${AuthHelper.getRoleFromToken()}/v1/project/${id}`);
      return response.data;
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error);
    }
  }

  // Lấy danh sách leaders của project - API thực tế từ backend
  static async getProjectLeaders(projectId: number): Promise<ApiResponse<DTO_ProjectRoleResponse[]> | unknown> {
    try {
      const response = await axiosInstance.get(`/api/private/${AuthHelper.getRoleFromToken()}/v1/project/${projectId}/get-leaders`);
      return response.data;
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error);
    }
  }

  // Đánh dấu project hoàn thành - API thực tế từ backend
  static async completeProject(id: number,): Promise<ApiResponse<void> | unknown> {
    try {
      const response = await axiosInstance.put(`/api/private/${AuthHelper.getRoleFromToken()}/v1/project/${id}/complete`);
      return response.data;
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error);
    }
  }

  // Tìm kiếm users để thêm làm leader - CHƯA CÓ API TRONG BACKEND
  static async searchLeadersForProject(projectId: number, query: string): Promise<ApiResponse<DTO_FastUserInfo[]> | unknown> {
    try {
      const response = await axiosInstance.get(`/api/private/${AuthHelper.getRoleFromToken()}/v1/project/${projectId}/search-new-leaders/${encodeURIComponent(query)}`
      );
      return response.data;
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error);
    }
  }

  // Lấy dữ liệu project với mock data - CHƯA CÓ API TRONG BACKEND
  static async getProjectData(): Promise<ApiResponse<DTO_ProjectItem[]> | unknown> {
    try {
      const response = await axiosInstance.get(`/api/private/${AuthHelper.getRoleFromToken()}/v1/project/get-related-projects`)
      return response.data
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error);
    }
  }

  // Kiểm tra project có phases hay không - API thực tế từ backend
  static async checkProjectHasPhases(projectId: number): Promise<ApiResponse<{ count: number }> | unknown> {
    try {
      const response = await axiosInstance.get(`/api/private/${AuthHelper.getRoleFromToken()}/v1/project/${projectId}/phases-count`);
      return response.data;
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error);
    }
  }
  

} 