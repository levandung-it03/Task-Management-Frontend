
export interface DTO_RecUsersRequest {
  numOfEmp: number
  level: string
  priority: string
  domain: string
  authority: string
  groupId: number
}

export interface DTO_MaxUsersResponse {
  maxQuantity: number;
}

export class DTO_RecUserInfo {
  email!: string;
  fullName!: string;
  role!: string;
  department!: string;
  score!: number
}