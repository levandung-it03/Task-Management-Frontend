
export interface DTO_FastUserInfo {
  username: string
  fullName: string
  role: string
}

export interface DTO_GroupsRelatedToUser {
  groupId: string
  groupName: string
  role: string
}

export class DTO_SearchFastUserInfo {
  private query!: string
  
  public static withBuilder() { return new DTO_SearchFastUserInfo() }
  public bquery(query: string): DTO_SearchFastUserInfo { this.query = query; return this }
}

export class DTO_TaskRequest {
  private deadline!: string
  private level!: string
  private priority!: string
  private taskType!: string
  private assignedEmails!: string[]
  private description!: string
  private reportFormat!: string
  
  public static withBuilder() { return new DTO_TaskRequest() }
  
  public bdeadline(deadline: string): DTO_TaskRequest { this.deadline = deadline; return this }
  public blevel(level: string): DTO_TaskRequest { this.level = level; return this }
  public bpriority(priority: string): DTO_TaskRequest { this.priority = priority; return this }
  public btaskType(taskType: string): DTO_TaskRequest { this.taskType = taskType; return this }
  public bassignedEmails(emails: string[]): DTO_TaskRequest { this.assignedEmails = emails; return this }
  public bdescription(description: string): DTO_TaskRequest { this.description = description; return this }
  public breportFormat(format: string): DTO_TaskRequest { this.reportFormat = format; return this }
}