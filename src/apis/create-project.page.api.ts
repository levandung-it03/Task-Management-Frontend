import { CreateProjectDto } from '../dtos/create-project.page.dto';
import { ProjectItem } from '../dtos/emp.home.page.dto';

export async function createProject(data: CreateProjectDto): Promise<ProjectItem> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        id: Math.random().toString(36).slice(2),
        name: data.name,
        dueDate: data.dueDate,
      });
    }, 500);
  });
} 