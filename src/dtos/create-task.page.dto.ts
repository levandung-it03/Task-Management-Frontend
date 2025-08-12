
export interface DTO_FastUserInfo {
  email: string
  fullName: string
  role: string
  department: string
}

export interface DTO_GroupOverview {
  id: number
  name: string
  role: string
}

export class DTO_SearchFastUserInfo {
  query!: string

  public static withBuilder() { return new DTO_SearchFastUserInfo() }
  public bquery(query: string): DTO_SearchFastUserInfo { this.query = query; return this }
}

export class DTO_TaskRequest {
  collectionId!: number
  name!: string
  deadline!: string
  startDate!: string
  level!: string
  priority!: string
  taskType!: string
  assignedEmails!: string[]
  description!: string
  reportFormat!: string

  public static withBuilder() { return new DTO_TaskRequest() }

  public bname(name: string): DTO_TaskRequest { this.name = name; return this }
  public bcollectionId(collectionId: number): DTO_TaskRequest { this.collectionId = collectionId; return this }
  public bdeadline(deadline: string): DTO_TaskRequest { this.deadline = deadline; return this }
  public bstartDate(startDate: string): DTO_TaskRequest { this.startDate = startDate; return this }
  public blevel(level: string): DTO_TaskRequest { this.level = level; return this }
  public bpriority(priority: string): DTO_TaskRequest { this.priority = priority; return this }
  public btaskType(taskType: string): DTO_TaskRequest { this.taskType = taskType; return this }
  public bassignedEmails(emails: string[]): DTO_TaskRequest { this.assignedEmails = emails; return this }
  public bdescription(description: string): DTO_TaskRequest { this.description = description; return this }
  public breportFormat(format: string): DTO_TaskRequest { this.reportFormat = format; return this }
}

export interface DTO_AccountCreation {
  username: string;
  email: string;
  password: string;
  fullName: string;
  identity: string;
  phone: string;
  departmentId: number;
}

export interface DTO_CollectionDetailOnTask {
  id: number
  name: string
  dueDate: string
  startDate: string
  createdTime: string
  updatedTime: string
}