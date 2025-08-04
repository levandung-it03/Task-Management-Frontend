import { DTO_PaginationRequest } from "@/dtos/general.dto"
import { GeneralAPIs } from "./general.api"
import { DTO_PaginatedDataResponse } from "@/dtos/manage-users.page.dto"

export class ManageUsersAPIs {

  static async getPaginatedUsers(request: DTO_PaginationRequest): Promise<DTO_PaginatedDataResponse | unknown> {
    try {
      // const response = await axiosInstance.get(`/api/private/pm/v1/user-info/get-paginated-users`, { params: request })
      console.log(request)
      const response = {
        data: {
          body: {
            totalPages: 9,
            dataList: [
              {
                email: "alice.johnson.assharem.building.student.alcohol@example.com",
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
                email: "alice.johnson.assharem.building.student.alcohol@example.com",
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