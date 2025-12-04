import { GeneralAPIs } from "./general.api";
import axiosInstance from "@/util/axios.helper";
import { AuthHelper } from "@/util/auth.helper";
import { DTO_RecUsersRequest } from "@/dtos/users-rec.page.dto";


export class UsersRecAPIs {
  static async recommendUsers(request: DTO_RecUsersRequest) {
    try {
      const url = `/api/private/${AuthHelper.getRoleFromToken()}/v1/task-user-rec/recommend-users`;
      const response = await axiosInstance.post(url, request);
      return response.data;
      // const response = {
      //   status: 200,
      //   msg: "Get the list successfully!",
      //   body: [
      //     {
      //       email: "lvd1@gmail.com",
      //       fullName: "Le Van Dung",
      //       role: "ROLE_LEAD",
      //       department: "IT",
      //       groupId: 2
      //     },
      //     {
      //       email: "lvd2@gmail.com",
      //       fullName: "Le Van Dung",
      //       role: "ROLE_LEAD",
      //       department: "IT",
      //       groupId: 2
      //     },
      //     {
      //       email: "lvd3@gmail.com",
      //       fullName: "Le Van Dung",
      //       role: "ROLE_LEAD",
      //       department: "IT",
      //       groupId: 2
      //     },
      //     {
      //       email: "lvd4@gmail.com",
      //       fullName: "Le Van Dung",
      //       role: "ROLE_LEAD",
      //       department: "IT",
      //       groupId: 1
      //     },
      //     {
      //       email: "lvd5@gmail.com",
      //       fullName: "Le Van Dung",
      //       role: "ROLE_LEAD",
      //       department: "IT",
      //       groupId: 1
      //     },
      //     {
      //       email: "lvd6@gmail.com",
      //       fullName: "Le Van Dung",
      //       role: "ROLE_LEAD",
      //       department: "IT",
      //       groupId: 1
      //     },
      //   ]
      // }
      // await new Promise((resolve) => setTimeout(resolve, 2000));
      // return response;
    } catch(error: unknown) {
      return GeneralAPIs.extractError(error);
    }
  }
  
  static async getMaxUsersInDomain() {
    try {
      const url = `/api/private/${AuthHelper.getRoleFromToken()}/v1/task-user-rec/get-max-users-qty`;
      const response = await axiosInstance.get(url)
      return response.data;
    } catch(error: unknown) {
      return GeneralAPIs.extractError(error);
    }
  }
}