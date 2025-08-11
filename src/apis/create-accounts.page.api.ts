import axiosInstance from "@/util/axios.helper";
import { ApiResponse, GeneralAPIs } from "./general.api";
import { DTO_ExistsObject } from "@/dtos/create-account,page.dto";

export class AccountCreationPageAPIs {

  static async createAccounts(file: File): Promise<ApiResponse<string> | unknown> {
    try {
      const response = await axiosInstance.post('/api/private/admin/v1/account/create-accounts',
        { file },
        { headers: {
          'Content-Type': 'multipart/form-data'
        } }
      );
      return response.data;
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error);
    }
  }

  static async getExample(): Promise<Blob | unknown> {
    try {
      const response = await axiosInstance.get('/api/private/admin/v1/account/accounts-creation-example', {
      responseType: 'blob', // Important for files
    });
      return response.data;
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error);
    }
  }
  
  static async checkIfExistsLastSavedAccounts(): Promise<ApiResponse<DTO_ExistsObject> | unknown> {
    try {
      const response = await axiosInstance.get('/api/private/admin/v1/account/exists-cached-created-accounts');
      return response.data;
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error);
    }
  }
  
  static async getLastSavedAccounts(): Promise<Blob | unknown> {
    try {
      const response = await axiosInstance.get('/api/private/admin/v1/account/cached-accounts-creation', {
      responseType: 'blob', // Important for files
    });
      return response.data;
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error);
    }
  }

  static async clearSavedFile(): Promise<void | unknown> {
    try {
      const response = await axiosInstance.delete('/api/private/admin/v1/account/cached-accounts-creation');
      return response.data;
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error);
    }
  }
  
}