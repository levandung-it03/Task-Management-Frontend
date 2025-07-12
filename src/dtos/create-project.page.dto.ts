export const PROJECT_STATUS = ['Pending', 'Running', 'Completed', 'Cancelled'] as const;
export type ProjectStatus = typeof PROJECT_STATUS[number];

export interface CreateProjectDto {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  dueDate: string;
  status: ProjectStatus;
} 