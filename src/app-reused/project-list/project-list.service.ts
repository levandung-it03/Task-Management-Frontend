import { ProjectAPIs } from '../../apis/emp.project.page.api';
import { DTO_ProjectItem } from '../@/dtos/home.page.dto';
import { ApiResponse } from '../../apis/general.api';

export class ProjectListService {
  static async fetchProjects(): Promise<DTO_ProjectItem[]> {
    try {
      const response = await ProjectAPIs.getProjectData();
      const data = (response as ApiResponse<DTO_ProjectItem[]>).body;
      return data || [];
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }
  }
} 