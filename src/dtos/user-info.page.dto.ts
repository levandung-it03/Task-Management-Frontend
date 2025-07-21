
export class DTO_UpdateUserInfoRequest {
  private fullName!: string
  private dob!: Date
  private gender!: string

  public static withBuilder() { return new DTO_UpdateUserInfoRequest() }
  public bfullName(fullName: string): DTO_UpdateUserInfoRequest { this.fullName = fullName; return this }
  public bdob(dob: Date): DTO_UpdateUserInfoRequest { this.dob = dob; return this }
  public bgender(gender: string): DTO_UpdateUserInfoRequest { this.gender = gender; return this }
}