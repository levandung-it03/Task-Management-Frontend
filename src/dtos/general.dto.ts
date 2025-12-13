import { RequestDataWrapper } from "@/components/table.component";

export class DTO_VerifyEmailRequest {
  private email!: string
  private otpType!: string

  public static withBuilder(): DTO_VerifyEmailRequest { return new DTO_VerifyEmailRequest() }
  public bemail(email: string): DTO_VerifyEmailRequest { this.email = email; return this }
  public botpType(otpType: string): DTO_VerifyEmailRequest { this.otpType = otpType; return this }
}

export class DTO_Token {
  private accessToken!: string

  public static withBuilder(): DTO_Token { return new DTO_Token() }
  public baccessToken(token: string): DTO_Token { this.accessToken = token; return this }
}

export class DTO_GetOauth2Authorizer {
  private oauth2Service!: string

  public static withBuilder(): DTO_GetOauth2Authorizer { return new DTO_GetOauth2Authorizer() }
  public boauth2Service(token: string): DTO_GetOauth2Authorizer { this.oauth2Service = token; return this }
}

export class DTO_Oauth2Authenticate {
  private code!: string
  private oauth2Service!: string

  public static withBuilder(): DTO_Oauth2Authenticate { return new DTO_Oauth2Authenticate() }
  public bcode(code: string): DTO_Oauth2Authenticate { this.code = code; return this }
  public boauth2Service(oauth2Service: string): DTO_Oauth2Authenticate { this.oauth2Service = oauth2Service; return this }
}

export class DTO_ChangePasswordRequest {
  private password!: string
  private otp!: string

  public static withBuilder() { return new DTO_ChangePasswordRequest() }
  public bpassword(password: string) { this.password = password; return this }
  public botp(otp: string) { this.otp = otp; return this }
}


export class DTO_PaginationRequest {
  public searchVal!: string
  public filterField!: string
  public sortedField!: string
  public sortedMode!: number
  public page!: number
  public data!: Record<string, string>

  public static withBuilder(): DTO_PaginationRequest { return new DTO_PaginationRequest() }
  public bsearchVal(searchVal: string): DTO_PaginationRequest { this.searchVal = searchVal; return this }
  public bfilterField(filterField: string): DTO_PaginationRequest { this.filterField = filterField; return this }
  public bsortedField(sortedField: string): DTO_PaginationRequest { this.sortedField = sortedField; return this }
  public bsortedMode(sortedMode: number): DTO_PaginationRequest { this.sortedMode = sortedMode; return this }
  public bpage(page: number): DTO_PaginationRequest { this.page = page; return this }
  public bdata(data: Record<string, string>): DTO_PaginationRequest { this.data = data; return this }

  public static fromInterface(data: RequestDataWrapper): DTO_PaginationRequest {
    return DTO_PaginationRequest.withBuilder()
      .bsearchVal(data.searchVal)
      .bfilterField(data.filterField)
      .bsortedField(data.sortedField)
      .bsortedMode(data.sortedMode)
      .bpage(data.page)
      .bdata(data.data)
  }
}

export interface DTO_IdResponse {
  id: number
}

export interface DTO_EmailResponse {
  email: string
}

export interface DTO_StatusResponse {
  status: boolean
}