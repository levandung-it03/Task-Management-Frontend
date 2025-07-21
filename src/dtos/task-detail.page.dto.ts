
export interface BasicUserInfo {
  id: number;
  fullName: string;
  email: string;
}

export interface DTO_TaskDetail {
  id: number;
  userInfo: BasicUserInfo;
  rootTaskId: number | null;
  name: string;
  description: string;
  reportFormat: string;
  level: string;
  taskType: string;
  isLocked: boolean;
  priority: string;
  startDate: string;
  endDate: string | null;
  deadline: string;
  createdTime: string;
  updatedTime: string;

  hasSubTask: boolean;
  hasAtLeastOneReport: boolean;
}

export interface DTO_OverviewSubTask {
  id: number;
  name: string;
  level: string;
  taskType: string;
  priority: string;
  startDate: string;
  endDate: string | null;
  deadline: string;
}

export class DTO_UpdateTaskDescription {
  id!: number
  description!: string
  
  public static withBuilder() { return new DTO_UpdateTaskDescription() }
  public bid(id: number): DTO_UpdateTaskDescription { this.id = id; return this }
  public bdescription(description: string): DTO_UpdateTaskDescription { this.description = description; return this }
}

export class DTO_UpdateTaskReportFormat {
  id!: number
  reportFormat!: string
  
  public static withBuilder() { return new DTO_UpdateTaskReportFormat() }
  public bid(id: number): DTO_UpdateTaskReportFormat { this.id = id; return this }
  public breportFormat(reportFormat: string): DTO_UpdateTaskReportFormat { this.reportFormat = reportFormat; return this }
}

export class DTO_UpdateBasicTask {
  id!: number;
  level!: string;
  taskType!: string;
  priority!: string;
  deadline!: string;

  public static withBuilder() { return new DTO_UpdateBasicTask() }
  public bid(id: number): DTO_UpdateBasicTask { this.id = id; return this }
  public blevel(level: string): DTO_UpdateBasicTask { this.level = level; return this }
  public btaskType(taskType: string): DTO_UpdateBasicTask { this.taskType = taskType; return this }
  public bpriority(priority: string): DTO_UpdateBasicTask { this.priority = priority; return this }
  public bdeadline(deadline: string): DTO_UpdateBasicTask { this.deadline = deadline; return this }
}

export interface DTO_TaskUser {
  id: number
  email: string
  fullName: string
  role: string
  userTaskStatus: string
}

export class DTO_LockTaskStatus {
  id!: number
  locked!: boolean
  
  public static withBuilder() { return new DTO_LockTaskStatus() }
  public bid(id: number): DTO_LockTaskStatus { this.id = id; return this }
  public blocked(locked: boolean): DTO_LockTaskStatus { this.locked = locked; return this }
}