
export class DTO_UpdateUserInfoRequest {
  private fullName!: string

  public static withBuilder() { return new DTO_UpdateUserInfoRequest() }
  public bfullName(fullName: string): DTO_UpdateUserInfoRequest { this.fullName = fullName; return this }
}