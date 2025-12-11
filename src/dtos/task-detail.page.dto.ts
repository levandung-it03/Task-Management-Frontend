import { DTO_FastUserInfo } from "./create-task.page.dto";

export interface DTO_EntityDelegator {
  id: number;
  name: string
}

export interface DTO_TaskDetail {
  id: number;
  userInfo: DTO_FastUserInfo;
  rootTaskId: number | null;
  name: string;
  description: string;
  reportFormat: string;
  level: string;
  taskType: string;
  locked: boolean;
  isLocked: boolean;
  priority: string;
  startDate: string;
  endDate: string | null;
  deadline: string;
  createdTime: string;
  updatedTime: string;

  hasAtLeastOneReport: boolean;

  projectInfo: DTO_EntityDelegator,
  phaseInfo: DTO_EntityDelegator,
  collectionInfo: DTO_EntityDelegator
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

export class DTO_UpdateContentRequest {
  id!: number
  content!: string

  public static withBuilder() { return new DTO_UpdateContentRequest() }
  public bid(id: number): DTO_UpdateContentRequest { this.id = id; return this }
  public bcontent(content: string): DTO_UpdateContentRequest { this.content = content; return this }
}

export class DTO_UpdateBasicTask {
  id!: number;
  level!: string;
  taskType!: string;
  priority!: string;
  deadline!: string;
  addedUserEmail!: string
  startDate!: string

  public static withBuilder() { return new DTO_UpdateBasicTask() }
  public bid(id: number): DTO_UpdateBasicTask { this.id = id; return this }
  public blevel(level: string): DTO_UpdateBasicTask { this.level = level; return this }
  public btaskType(taskType: string): DTO_UpdateBasicTask { this.taskType = taskType; return this }
  public bpriority(priority: string): DTO_UpdateBasicTask { this.priority = priority; return this }
  public bstartDate(startDate: string): DTO_UpdateBasicTask { this.startDate = startDate; return this }
  public bdeadline(deadline: string): DTO_UpdateBasicTask { this.deadline = deadline; return this }
  public baddedUserEmail(addedUserEmail: string): DTO_UpdateBasicTask { this.addedUserEmail = addedUserEmail; return this }
}

export interface DTO_TaskUser {
  id: number
  email: string
  fullName: string
  department: string
  role: string
  userTaskStatus: string
  wasDone: boolean
  totalReports: number
}

export class DTO_LockTaskStatus {
  id!: number
  locked!: boolean

  public static withBuilder() { return new DTO_LockTaskStatus() }
  public bid(id: number): DTO_LockTaskStatus { this.id = id; return this }
  public blocked(locked: boolean): DTO_LockTaskStatus { this.locked = locked; return this }
}

export interface DTO_TaskDelegator {
  taskInfo: DTO_EntityDelegator | null;
  projectInfo: DTO_EntityDelegator;
  phaseInfo: DTO_EntityDelegator;
  collectionInfo: DTO_EntityDelegator;
}

export interface DTO_UpdateTaskResponse {
  newUsers: DTO_TaskUser[]
}