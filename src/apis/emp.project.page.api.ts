import { DTO_CreateProject } from '../dtos/emp.project.page.dto';
import { DTO_ProjectItem } from '@/dtos/home.page.dto';
import { DTO_AddLeaderToProjectRequest, DTO_SearchFastUserInfo_Project, DTO_RemoveLeaderFromProject, DTO_DeleteProject } from '../dtos/emp.project.page.dto';
import { DTO_FastUserInfo } from '../dtos/create-task.page.dto';
import { ApiResponse, GeneralAPIs } from './general.api';
import axiosInstance from '@/util/axios.helper';

export class ProjectAPIs {
  // Tạo project mới - API thực tế từ backend
  static async createProject(data: DTO_CreateProject): Promise<ApiResponse<{ id: number }> | unknown> {
    try {
      const response = await axiosInstance.post('/api/v1/private/pm/project', {
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

  // Cập nhật thông tin project - API thực tế từ backend
  static async updateProject(id: string, data: DTO_CreateProject): Promise<ApiResponse<void> | unknown> {
    try {
      const response = await axiosInstance.put(`/api/v1/private/pm/project/${id}`, {
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

  // Thêm leaders vào project - API thực tế từ backend
  static async addLeadersToProject(request: DTO_AddLeaderToProjectRequest): Promise<ApiResponse<void> | unknown> {
    try {
      const response = await axiosInstance.put(`/api/v1/private/pm/project/${request.projectId}/add-leaders`, {
        assignedEmails: request.leaderEmails
      });
      return response.data;
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error);
    }
  }

  // Xóa leader khỏi project - API thực tế từ backend
  static async removeLeaderFromProject(request: DTO_RemoveLeaderFromProject): Promise<ApiResponse<void> | unknown> {
    try {
      const response = await axiosInstance.post(`/api/v1/private/pm/project/${request.projectId}/kick-leader`, {
        kickedEmail: request.leaderEmail
      });
      return response.data;
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error);
    }
  }

  // Xóa/vô hiệu hóa project - API thực tế từ backend
  static async deleteProject(request: DTO_DeleteProject): Promise<ApiResponse<void> | unknown> {
    try {
      const response = await axiosInstance.delete(`/api/v1/private/lead/project/${request.projectId}`);
      return response.data;
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error);
    }
  }

  // Lấy danh sách project liên quan - API thực tế từ backend
  static async getRelatedProjects(): Promise<ApiResponse<any[]> | unknown> {
    try {
      const response = await axiosInstance.get('/api/v1/private/emp/project/get-related-projects');
      return response.data;
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error);
    }
  }

  // Lấy danh sách leaders của project - API thực tế từ backend
  static async getProjectLeaders(projectId: string): Promise<ApiResponse<any[]> | unknown> {
    try {
      const response = await axiosInstance.get(`/api/v1/private/pm/project/${projectId}/get-leaders`);
      return response.data;
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error);
    }
  }

  // Đánh dấu project hoàn thành - API thực tế từ backend
  static async completeProject(projectId: string): Promise<ApiResponse<void> | unknown> {
    try {
      const response = await axiosInstance.put(`/api/v1/private/pm/project/${projectId}/complete`);
      return response.data;
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error);
    }
  }

  // Tạo phase cho project - API thực tế từ backend
  static async createPhase(projectId: string, phaseData: any): Promise<ApiResponse<{ id: number }> | unknown> {
    try {
      const response = await axiosInstance.post(`/api/v1/private/pm/project/${projectId}/create-phase`, phaseData);
      return response.data;
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error);
    }
  }

  // Lấy tất cả phases của project - API thực tế từ backend
  static async getAllRelatedPhases(projectId: number): Promise<ApiResponse<any[]> | unknown> {
    try {
      const response = await axiosInstance.post(`/api/v1/private/pm/project/${projectId}/get-all-related-phase`);
      return response.data;
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error);
    }
  }
  // Tìm kiếm users để thêm làm leader - CHƯA CÓ API TRONG BACKEND
  static async searchLeadersForProject(request: DTO_SearchFastUserInfo_Project): Promise<ApiResponse<DTO_FastUserInfo[]> | unknown> {
    try {
      // Mock data
      return {
        code: 11001,
        msg: "Tìm kiếm leader thành công",
        status: 200,
        body: [
          { email: "duongminh.18062001.29062025@tmakes.company.vn", fullName: "Dương Minh", role: "ROLE_EMP" },
          { email: "ngocthuy.30042000.01072025@tmakes.company.vn", fullName: "Ngọc Thúy", role: "ROLE_LEAD" },
          { email: "trankien.12031999.28062025@tmakes.company.vn", fullName: "Trần Kiên", role: "ROLE_ADMIN" },
          { email: "phamhoang.10022002.27062025@tmakes.company.vn", fullName: "Phạm Hoàng", role: "ROLE_PM" },
          { email: "levinh.07072003.01072025@tmakes.company.vn", fullName: "Lê Vinh", role: "ROLE_EMP" },
          { email: "vuhoai.21052000.29062025@tmakes.company.vn", fullName: "Vũ Hoài", role: "ROLE_LEAD" },
          { email: "dangtuan.03121998.30062025@tmakes.company.vn", fullName: "Đặng Tuấn", role: "ROLE_EMP" },
          { email: "bichngan.04082001.28062025@tmakes.company.vn", fullName: "Bích Ngân", role: "ROLE_EMP" },
          { email: "trangthu.15092002.27062025@tmakes.company.vn", fullName: "Trang Thư", role: "ROLE_EMP" },
          { email: "nguyentan.01111997.30062025@tmakes.company.vn", fullName: "Nguyễn Tân", role: "ROLE_LEAD" },
          { email: "lethu.26062000.01072025@tmakes.company.vn", fullName: "Lê Thư", role: "ROLE_EMP" },
          { email: "khanhhoa.08032001.29062025@tmakes.company.vn", fullName: "Khánh Hòa", role: "ROLE_EMP" },
          { email: "vumanh.17102003.28062025@tmakes.company.vn", fullName: "Vũ Mạnh", role: "ROLE_EMP" }
        ],
        time: new Date().toLocaleString('vi-VN', { hour12: false })
      };
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error);
    }
  }

  // Kiểm tra project có phases hay không 
  static async checkProjectHasPhases(projectId: number): Promise<ApiResponse<{ count: number }> | unknown> {
    try {
      const phasesResponse = await this.getAllRelatedPhases(projectId);
      if (phasesResponse && typeof phasesResponse === 'object' && 'body' in phasesResponse) {
        const phases = (phasesResponse as ApiResponse<any[]>).body;
        return {
          code: 11007,
          msg: "Kiểm tra phase thành công",
          status: 200,
          body: {
            count: phases ? phases.length : 0
          },
          time: new Date().toLocaleString('vi-VN', { hour12: false })
        };
      }
      return {
        code: 11007,
        msg: "Kiểm tra phase thành công",
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

  // Lấy dữ liệu project với mock data - CHƯA CÓ API TRONG BACKEND
  static async getProjectData(): Promise<ApiResponse<DTO_ProjectItem[]> | unknown> {
    try {
      return await new Promise<ApiResponse<DTO_ProjectItem[]>>(resolve => {
        setTimeout(() => {
          resolve({
            code: 11008,
            msg: "Lấy danh sách dự án thành công",
            status: 200,
            body: [
              {
                id: 1,
                name: 'Develop API Endpoints',
                description: 'Xây dựng các endpoint RESTful cho hệ thống.',
                startDate: '2024-10-01',
                endDate: '2024-11-25',
                deadline: '2024-11-26',
                status: 'Running',
                active: true,
                leaders: {
                  'ngocthuy.30042000.01072025@tmakes.company.vn': {
                    username: 'ngocthuy.30042000.01072025@tmakes.company.vn',
                    fullName: 'Ngọc Thúy',
                    role: 'ROLE_LEAD',
                  }
                }
              },
              {
                id: 2,
                name: 'Onboarding Flow',
                description: 'Thiết kế luồng onboarding cho người dùng mới.',
                startDate: '2024-10-10',
                endDate: '2024-11-29',
                deadline: '2024-11-30',
                status: 'Pending',
                active: true,
                leaders: {}
              },
              {
                id: 3,
                name: 'Build Dashboard',
                description: 'Phát triển dashboard quản lý dự án.',
                startDate: '2024-10-15',
                endDate: '2024-11-28',
                deadline: '2024-11-30',
                status: 'Completed',
                active: true,
                leaders: {
                  'phamhoang.10022002.27062025@tmakes.company.vn': {
                    username: 'phamhoang.10022002.27062025@tmakes.company.vn',
                    fullName: 'Phạm Hoàng',
                    role: 'ROLE_PM',
                  }
                }
              },
              {
                id: 4,
                name: 'Optimize Page Load',
                description: 'Tối ưu tốc độ tải trang cho hệ thống.',
                startDate: '2024-11-01',
                endDate: '2024-12-04',
                deadline: '2024-12-05',
                status: 'Running',
                active: true,
                leaders: {}
              },
              {
                id: 5,
                name: 'Cross-Browser Testing',
                description: 'Kiểm thử hệ thống trên nhiều trình duyệt.',
                startDate: '2024-11-05',
                endDate: '2024-12-05',
                deadline: '2024-12-06',
                status: 'Pending',
                active: false,
                leaders: {}
              },
            ],
            time: "12:35:00 30/06/2025"
          });
        }, 300);
      });
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error);
    }
  }
} 