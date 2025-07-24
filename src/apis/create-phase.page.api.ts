import { DTO_CreatePhase, DTO_PhaseItem } from '../dtos/create-phase.page.dto';

export async function createPhase(data: DTO_CreatePhase): Promise<DTO_PhaseItem> {
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
      });
    }, 500);
  });
}

export async function updatePhase(id: string, data: DTO_CreatePhase): Promise<DTO_PhaseItem> {
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