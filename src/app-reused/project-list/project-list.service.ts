import { ProjectAPIs } from '../../apis/project.page.api';
import { DTO_ProjectItem1 } from '../../dtos/home.page.dto';
import { ApiResponse } from '../../apis/general.api';

export class ProjectListService {
  static async fetchProjects(): Promise<DTO_ProjectItem1[]> {
    try {
      const response = await ProjectAPIs.getProjectData();
      const data = (response as ApiResponse<DTO_ProjectItem1[]>).body;
      return data || [];
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }
  }
} 