
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