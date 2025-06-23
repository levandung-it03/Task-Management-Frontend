
export interface DTO_PaginatedDataResponse {
  totalPages: number,
  dataList: DTO_ManagedUserInfoResponse[]
}

export interface DTO_ManagedUserInfoResponse {
  username: string,
  createdTime: string,
  active: boolean,
  fullName: string,
  authorities: string,
  coins: number,
  dob: string,
  gender: string,
  oauth2ServiceEnum: string,
}