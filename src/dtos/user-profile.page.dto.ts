export interface UserProfileData {
  fullName: string
  email: string
  username: string
  phone: string
  identity: string
  status: string
  createdTime: string
}

export class DTO_GetUserProfileResponse {
  private data!: UserProfileData

  public static withBuilder() { return new DTO_GetUserProfileResponse() }
  public bdata(data: UserProfileData): DTO_GetUserProfileResponse { this.data = data; return this }
  public getData(): UserProfileData { return this.data }
}

 