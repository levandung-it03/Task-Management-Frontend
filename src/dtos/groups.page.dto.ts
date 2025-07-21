import { DTO_FastUserInfo } from "./create-task.page.dto"

export interface DTO_PaginatedGroupsResponse {
  totalPages: number,
  dataList: OverviewedGroupInfo[]
}

export interface OverviewedGroupInfo {
  id: number
  createdByUser: DTO_FastUserInfo
  name: string
  isActive: boolean
  createdTime: string
  updatedTime: string
  userQuantity: number
}

export class DTO_GroupRequest {
  name!: string
  assignedEmails!: string[]
  
  public static withBuilder() { return new DTO_GroupRequest() }
  
  public bname(name: string): DTO_GroupRequest { this.name = name; return this }
  public bassignedEmails(emails: string[]): DTO_GroupRequest { this.assignedEmails = emails; return this }
}

export class DTO_UpdateGroup {
  groupId!: number
  name!: string
  assignedEmails!: string[]
  
  public static withBuilder() { return new DTO_UpdateGroup() }
  public bgroupId(groupId: number): DTO_UpdateGroup { this.groupId = groupId; return this }
  public bname(name: string): DTO_UpdateGroup { this.name = name; return this }
  public bassignedEmails(emails: string[]): DTO_UpdateGroup { this.assignedEmails = emails; return this }

}

export interface GroupHasUser {
  id: number
  role: string
  joinedUser: DTO_FastUserInfo
  involed_time: string
}

export interface DTO_GroupResponse {
  baseInfo: OverviewedGroupInfo
  groupHasUsers: GroupHasUser[]
}

export class DTO_ChangeGroupRole {
  userGroupId!: number
  role!: string

  public static withBuilder(): DTO_ChangeGroupRole { return new DTO_ChangeGroupRole() }
  public buserGroupId(userGroupId: number): DTO_ChangeGroupRole { this.userGroupId = userGroupId; return this }
  public brole(role: string): DTO_ChangeGroupRole { this.role = role; return this }
}

export class DTO_ChangeGroupStatus {
  groupId!: number
  status!: boolean

  
  public static withBuilder(): DTO_ChangeGroupStatus { return new DTO_ChangeGroupStatus() }
  public bgroupId(groupId: number): DTO_ChangeGroupStatus { this.groupId = groupId; return this }
  public bstatus(status: boolean): DTO_ChangeGroupStatus { this.status = status; return this }
}