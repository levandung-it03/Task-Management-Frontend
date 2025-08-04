import { DTO_UpdateCollection } from '../dtos/update-collection.page.dto';
import { DTO_ProjectItem } from '@/dtos/home.page.dto';

export async function updateCollection(data: DTO_UpdateCollection): Promise<DTO_ProjectItem> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        id: data.id,
        name: data.name || 'Default Name',
        description: data.description || '',
        startDate: data.startDate || '',
        endDate: data.endDate || '',
        deadline: data.deadline || '',
        status: data.status || 'Pending',
        leaders: {},
      });
    }, 500);
  });
} 