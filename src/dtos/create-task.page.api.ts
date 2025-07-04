
export interface DTO_FastUserInfo {
  username: string
  fullName: string
  role: string
}

export interface DTO_GroupsRelatedToUser {
  groupId: number
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
  private assignedEmails!: string[]
  private description!: string
  private reportFormat!: string
  
  public static withBuilder() { return new DTO_TaskRequest() }
  
  public bdeadline(deadline: string): DTO_TaskRequest { this.deadline = deadline; return this }
  public bassignedEmails(emails: string[]): DTO_TaskRequest { this.assignedEmails = emails; return this }
  public bdescription(description: string): DTO_TaskRequest { this.description = description; return this }
  public breportFormat(format: string): DTO_TaskRequest { this.reportFormat = format; return this }
}