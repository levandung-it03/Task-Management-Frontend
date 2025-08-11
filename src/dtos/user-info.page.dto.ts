
export class DTO_UserInfo {
  fullName!: string
  identity!: string
  phone!: string

  public static withBuilder() { return new DTO_UserInfo() }
  public bfullName(fullName: string): DTO_UserInfo { this.fullName = fullName; return this }
  public bidentity(identity: string): DTO_UserInfo { this.identity = identity; return this }
  public bphone(phone: string): DTO_UserInfo { this.phone = phone; return this }
}

export interface DTO_UserInfoResponse {
  fullName: string
  identity: string
  phone: string
  email: string
  department: DTO_Department
}

export interface DTO_Department {
  id: number
  name: string
}