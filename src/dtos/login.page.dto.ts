
export class DTO_AuthRequest {
  private username!: string
  private password!: string

  public static withBuilder() { return new DTO_AuthRequest() }
  public busername(username: string): DTO_AuthRequest { this.username = username; return this }
  public bpassword(password: string): DTO_AuthRequest { this.password = password; return this }
}

export class DTO_RegisterRequest {
  private email!: string
  private password!: string
  private fullName!: string
  private dob!: Date
  private gender!: string
  private otp!: string

  public static withBuilder() { return new DTO_RegisterRequest() }
  public bemail(email: string): DTO_RegisterRequest { this.email = email; return this }
  public bpassword(password: string): DTO_RegisterRequest { this.password = password; return this }
  public bfullName(fullName: string): DTO_RegisterRequest { this.fullName = fullName; return this }
  public bdob(dob: Date): DTO_RegisterRequest { this.dob = dob; return this }
  public bgender(gender: string): DTO_RegisterRequest { this.gender = gender; return this }
  public botp(otp: string): DTO_RegisterRequest { this.otp = otp; return this }
}

export class DTO_LostPassRequest {
  private email!: string
  private otp!: string

  public static withBuilder(): DTO_LostPassRequest { return new DTO_LostPassRequest() }
  public bemail(email: string): DTO_LostPassRequest { this.email = email; return this }
  public botp(otp: string): DTO_LostPassRequest { this.otp = otp; return this }
}