import { DTO_PaginationRequest } from "@/dtos/general.dto"
import { GeneralAPIs } from "./general.api"
import { DTO_PaginatedDataResponse } from "@/dtos/manage-users.page"

export class ManageUsersAPIs {

  static async getPaginatedUsers(request: DTO_PaginationRequest): Promise<DTO_PaginatedDataResponse | unknown> {
    try {
      // const response = await axiosInstance.get(`/api/private/admin/user-info/v1/get-paginated-users`, { params: request })
      console.log(request)
      const response = {
        data: {
          body: {
            totalPages: 9,
            dataList: [
              {
                username: "alice.johnson.assharem.building.student.alcohol@example.com",
                createdTime: "2025-06-12 06:59:32",
                active: true,
                fullName: "Lê Văn Dũng",
                authorities: "ROLE_USER,ROLE_READ",
                coins: 2000,
                dob: "2003-12-11",
                gender: "MALE",
                oauth2ServiceEnum: "FACEBOOK",
              },
              {
                username: "alice.johnson.assharem.building.student.alcohol@example.com",
                createdTime: "2025-06-12 06:59:32",
                active: false,
                fullName: "Lê Văn Dũng",
                authorities: "ROLE_USER,ROLE_READ",
                coins: 2000,
                dob: "2003-12-11",
                gender: "MALE",
                oauth2ServiceEnum: "FACEBOOK",
              },
            ]
          }
        }
      }
      return response.data
    } catch(error: unknown) {
      return GeneralAPIs.extractError(error)
    }
  }
}