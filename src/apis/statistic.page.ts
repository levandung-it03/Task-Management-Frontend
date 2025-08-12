import axiosInstance from "@/util/axios.helper";
import { ApiResponse, GeneralAPIs } from "./general.api";
import { AuthHelper } from "@/util/auth.helper";
import { DTO_ProjectOverview, DTO_UserStatistic } from "@/dtos/statistic.page.dto";

export class StatisticPageAPIs {

  static async getProject(projectId: number): Promise<ApiResponse<DTO_ProjectOverview> | unknown> {
    try {
      const response = await axiosInstance.get(`/api/private/${AuthHelper.getRoleFromToken()}/v1/project/${projectId}/overview`);
      return response.data;
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error);
    }
  }

  static async fetchSimplePhases(projectId: number): Promise<ApiResponse<Record<number, string>> | unknown> {
    try {
      const url = `/api/private/${AuthHelper.getRoleFromToken()}/v1/project/${projectId}/simple-phases`;
      const response = await axiosInstance.get(url);
      return response.data;
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error);
    }
  }

  static async fetchSimpleCollections(phaseId: number): Promise<ApiResponse<Record<number, string>> | unknown> {
    try {
      const url = `/api/private/${AuthHelper.getRoleFromToken()}/v1/phase/${phaseId}/simple-collections`;
      const response = await axiosInstance.get(url);
      return response.data;
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error);
    }
  }

  static async fetchUsersStatisticByProjectId(projectId: number): Promise<ApiResponse<DTO_UserStatistic> | unknown> {
    try {
      const url = `/api/private/${AuthHelper.getRoleFromToken()}/v1/project/${projectId}/users-statistic`;
      const response = await axiosInstance.get(url);
      return response.data;
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error);
    }
  }
  

  static async fetchUsersStatisticByPhaseId(phaseId: number): Promise<ApiResponse<DTO_UserStatistic> | unknown> {
    try {
      const url = `/api/private/${AuthHelper.getRoleFromToken()}/v1/phase/${phaseId}/users-statistic`;
      const response = await axiosInstance.get(url);
      return response.data;
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error);
    }
  }
  

  static async fetchUsersStatisticByCollectionId(collectionId: number): Promise<ApiResponse<DTO_UserStatistic> | unknown> {
    try {
      const url = `/api/private/${AuthHelper.getRoleFromToken()}/v1/collection/${collectionId}/users-statistic`;
      const response = await axiosInstance.get(url);
      return response.data;
    } catch (error: unknown) {
      return GeneralAPIs.extractError(error);
    }
  }
}