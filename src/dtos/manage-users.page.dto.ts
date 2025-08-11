export interface DTO_PaginatedDataResponse {
  dataList: DTO_ManagedUserInfoResponse[];
}

export interface DTO_ManagedUserInfoResponse {
  accountId: number;
  fullname: string;
  email: string;
  phone: string;
  department: string;
  authorities: string;
  status: boolean;
}

export class DTO_UpdateAccountStatusRequest {
  id!: number;
  status!: boolean;

  public static withBuilder() {
    return new DTO_UpdateAccountStatusRequest();
  }

  public setId(id: number) {
    this.id = id;
    return this;
  }

  public setStatus(status: boolean) {
    this.status = status;
    return this;
  }
}


export class DTO_UpdateAccountRoleRequest {
  id!: number;
  role!: string;

  public static withBuilder() {
    return new DTO_UpdateAccountRoleRequest();
  }
 
  public setId(id: number) {
    this.id = id;
    return this;
  }

  public setRole(role: string) {
    this.role = role;
    return this;
  }
}
