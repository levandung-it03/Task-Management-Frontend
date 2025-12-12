import { DTO_CreateDepartment } from "@/dtos/create-task.page.dto";
import { AuthHelper } from "@/util/auth.helper";
import axiosInstance from "@/util/axios.helper";
import { ApiResponse, GeneralAPIs } from "./general.api";
import { DTO_Department } from "@/dtos/user-info.page.dto";
import { DTO_IdResponse } from "@/dtos/general.dto";

export class DepartmentAPIs {
  static async getAll(): Promise<ApiResponse<DTO_Department[]> | unknown> {
    try {
      const res = await axiosInstance.get(`/api/private/${AuthHelper.getRoleFromToken()}/v1/department/all`);
      return res.data;
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error);
    }
  }

  static async create(deptData: DTO_CreateDepartment): Promise<ApiResponse<DTO_IdResponse> | unknown> {
    try {
      const res = await axiosInstance.post(`/api/private/${AuthHelper.getRoleFromToken()}/v1/department`, deptData);
      return res.data;
    } catch (error) {
      return GeneralAPIs.extractError(error);
    }
  }

  static async update(id: number, deptData: DTO_CreateDepartment): Promise<ApiResponse<void> | unknown> {
    try {
      const res = await axiosInstance.put(`/api/private/${AuthHelper.getRoleFromToken()}/v1/department/${id}`, deptData);
      return res.data;
    } catch (error) {
      return GeneralAPIs.extractError(error);
    }
  }

  static async delete(id: number): Promise<ApiResponse<void> | unknown> {
    try {
      const res = await axiosInstance.delete(`/api/private/${AuthHelper.getRoleFromToken()}/v1/department/${id}`);
      return res.data;
    } catch (error) {
      return GeneralAPIs.extractError(error);
    }
  }
}