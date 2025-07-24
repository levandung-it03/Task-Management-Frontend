import { DTO_CreateCollection, DTO_CollectionItem } from '../dtos/create-collection.page.dto';

export async function createCollection(data: DTO_CreateCollection): Promise<DTO_CollectionItem> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        id: Math.random().toString(36).slice(2),
        name: data.name,
        description: data.description,
        startDate: data.startDate,
        endDate: data.endDate,
        deadline: data.deadline,
        status: data.status,
        leaders: {},
      });
    }, 500);
  });
} 

export async function updateCollection(id: string, data: DTO_CreateCollection): Promise<DTO_CollectionItem> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          id,
          name: data.name,
          description: data.description,
          startDate: data.startDate,
          endDate: data.endDate,
          deadline: data.deadline,
          status: data.status,
        });
      }, 500);
    });
  } 