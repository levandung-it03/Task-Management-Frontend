export interface DTO_CreateTaskList {
  name: string;
  description: string;
  startDate: string;
  deadline: string;
}

export interface DTO_TaskListItem {
  id: number;
  name: string;
  level: TaskLevel;
  taskType: TaskType;
  priority: TaskPriority;
  startDate: string;   // yyyy-MM-dd
  endDate: string;
  deadline: string;
}

export type TaskLevel = 'HARD' | 'ADVANCED' | 'NORMAL' | 'LIGHT';

export type TaskType =
  | 'BUSINESS_ANALYSIS'
  | 'BACKEND'
  | 'FRONTEND'
  | 'DEPLOY'
  | 'DESIGN'
  | 'TEST'
  | 'DOCUMENTATION'
  | 'MAINTENANCE'
  | 'RESEARCH'
  | 'TRAINING'
  | 'AI';

export type TaskPriority = 'URGENT' | 'HIGH' | 'NORMAL' | 'LOW';


export class DTO_DeleteTaskList {
  taskListId: number;
  forceDelete: boolean;

  constructor() {
    this.taskListId = 0;
    this.forceDelete = false;
  }

  bquery(taskListId: number, forceDelete: boolean = false): DTO_DeleteTaskList {
    this.taskListId = taskListId;
    this.forceDelete = forceDelete;
    return this;
  }
}

