import { DTO_PaginationRequest } from "@/dtos/general.dto";
import { ApiResponse, GeneralAPIs } from "./general.api";
import { DTO_PaginatedDataResponse } from "@/dtos/manage-users.page.dto";
import { DTO_UpdateAccountStatusRequest, DTO_UpdateAccountRolesRequest } from "@/dtos/manage-users.page.dto";
import { AuthHelper } from "@/util/auth.helper";
import axiosInstance from "@/util/axios.helper";

export class ManageUsersAPIs {
  static async getPaginatedUsers(
    request: DTO_PaginationRequest
  ): Promise<DTO_PaginatedDataResponse | unknown> {
    try {
      // const response = await axiosInstance.get(
      //   `/api/private/${AuthHelper.getRoleFromToken()}/v1/manage-users/user-list`
      // );
      // return response.data;
      console.log(request);
      const response = {
        data: {
          body: {
            dataList: [
              {
                accountId: 1,
                fullname: "Alice Nguyen",
                email: "alice.nguyen@example.com",
                phone: "0901234567",
                department: "Engineering",
                authorities: "ROLE_EMP",
                status: true,
              },
              {
                accountId: 2,
                fullname: "Bob Tran",
                email: "bob.tran@example.com",
                phone: "0902345678",
                department: "Design",
                authorities: "ROLE_EMP",
                status: true,
              },
              {
                accountId: 3,
                fullname: "Charlie Pham",
                email: "charlie.pham@example.com",
                phone: "0903456789",
                department: "Marketing",
                authorities: "ROLE_PM",
                status: true,
              },
              {
                accountId: 4,
                fullname: "Diana Le",
                email: "diana.le@example.com",
                phone: "0904567890",
                department: "Sales",
                authorities: "ROLE_EMP",
                status: true,
              },
              {
                accountId: 5,
                fullname: "Ethan Vo",
                email: "ethan.vo@example.com",
                phone: "0905678901",
                department: "Engineering",
                authorities:"ROLE_LD",
                status: false,
              },
              {
                accountId: 6,
                fullname: "Fiona Bui",
                email: "fiona.bui@example.com",
                phone: "0906789012",
                department: "Support",
                authorities: "ROLE_EMP",
                status: true,
              },
              {
                accountId: 7,
                fullname: "George Do",
                email: "george.do@example.com",
                phone: "0907890123",
                department: "QA",
                authorities: "ROLE_EMP",
                status: true,
              },
              {
                accountId: 8,
                fullname: "Hannah Ngo",
                email: "hannah.ngo@example.com",
                phone: "0908901234",
                department: "Engineering",
                authorities: "ROLE_EMP",
                status: true,
              },
              {
                accountId: 9,
                fullname: "Ivan Dinh",
                email: "ivan.dinh@example.com",
                phone: "0909012345",
                department: "Design",
                authorities: "ROLE_LD",
                status: false,
              },
              {
                accountId: 10,
                fullname: "Julia Ly",
                email: "julia.ly@example.com",
                phone: "0910123456",
                department: "Support",
                authorities: "ROLE_EMP",
                status: true,
              },
              {
                accountId: 11,
                fullname: "Kevin Nguyen",
                email: "kevin.nguyen@example.com",
                phone: "0911234567",
                department: "Marketing",
                authorities: "ROLE_PM",
                status: true,
              },
              {
                accountId: 12,
                fullname: "Linda Trinh",
                email: "linda.trinh@example.com",
                phone: "0912345678",
                department: "QA",
                authorities: "ROLE_LD",
                status: true,
              },
              {
                accountId: 13,
                fullname: "Mike Hoang",
                email: "mike.hoang@example.com",
                phone: "0913456789",
                department: "Engineering",
                authorities: "ROLE_EMP",
                status: false,
              },
              {
                accountId: 14,
                fullname: "Nina Chau",
                email: "nina.chau@example.com",
                phone: "0914567890",
                department: "Sales",
                authorities: "ROLE_EMP",
                status: true,
              },
              {
                accountId: 15,
                fullname: "Oscar Le",
                email: "oscar.le@example.com",
                phone: "0915678901",
                department: "HR",
                authorities: "ROLE_LD",
                status: false,
              },
            ],
          },
        },
      };
      return response.data;
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error);
    }
  }

  static async updateAccountStatus(
    request: DTO_UpdateAccountStatusRequest
  ): Promise<ApiResponse<void> | unknown> {
    try {
      // const { id, status } = request;
      // const response = await axiosInstance.post(
      //   `/api/private/${AuthHelper.getRoleFromToken()}/v1/...`,
      //   {
      //     id,
      //     status,
      //   }
      // );
      // return response.data;
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error);
    }
  }

  static async updateAccountRole(
    request: DTO_UpdateAccountRolesRequest
  ): Promise<ApiResponse<void> | unknown> {
    try {
      // const response = await axiosInstance.post(
      //   `/api/private/${AuthHelper.getRoleFromToken()}/v1/...`,
      //   {
      //     id: request.id,
      //     roles: request.roles,
      //   }
      // ); 
      // return response.data;
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error);
    }
  }
}
