export interface DTO_PaginatedDataResponse {
  totalPages: number,
  dataList: DTO_ManagedUserInfoResponse[]
}

export interface DTO_ManagedUserInfoResponse {
  id: number;
  email: string;
  createdTime: string;
  status: boolean;
  fullName: string;
  department: string;
  phone: string;
  identity: string;
  authorities: string;
}