import { DTO_FastUserInfo } from "./create-task.page.dto"

export interface DTO_PaginatedGroupsResponse {
  totalPages: number,
  dataList: OverviewedGroupInfo[]
}

export interface OverviewedGroupInfo {
  id: number
  createdByUser: DTO_FastUserInfo
  name: string
  createdTime: string
  updatedTime: string
  userQuantity: number
  active: boolean
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
  addedEmails!: string[]
  
  public static withBuilder() { return new DTO_UpdateGroup() }
  public bgroupId(groupId: number): DTO_UpdateGroup { this.groupId = groupId; return this }
  public bname(name: string): DTO_UpdateGroup { this.name = name; return this }
  public baddedEmails(emails: string[]): DTO_UpdateGroup { this.addedEmails = emails; return this }
}

export interface GroupHasUser {
  id: number
  role: string
  joinedUser: DTO_FastUserInfo
  involvedTime: string
  active: boolean
}

export interface DTO_DetailGroupResponse {
  baseInfo: OverviewedGroupInfo
  groupHasUsers: GroupHasUser[]
}

export class DTO_ChangeGroupRole {
  groupUserId!: number
  role!: string

  public static withBuilder(): DTO_ChangeGroupRole { return new DTO_ChangeGroupRole() }
  public bgroupUserId(groupUserId: number): DTO_ChangeGroupRole { this.groupUserId = groupUserId; return this }
  public brole(role: string): DTO_ChangeGroupRole { this.role = role; return this }
}

export class DTO_ChangeGroupStatus {
  groupId!: number
  status!: boolean
  
  public static withBuilder(): DTO_ChangeGroupStatus { return new DTO_ChangeGroupStatus() }
  public bgroupId(groupId: number): DTO_ChangeGroupStatus { this.groupId = groupId; return this }
  public bstatus(status: boolean): DTO_ChangeGroupStatus { this.status = status; return this }
}