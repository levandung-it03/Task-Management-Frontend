"use client"

import axios from "axios";
import { AuthHelper } from "./auth.helper";
import { ApiResponse, ErrorResponse, GeneralAPIs, RecordResponse } from "@/apis/general.api";
import GlobalValidators from "./global.validators";
import { DTO_Token } from "@/dtos/general.dto";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_ADDRESS_HOST,
  headers: {
    "Content-Type": "application/json"
  },
  transformResponse: [
    function (data) {
      // GIỮ NGUYÊN JSON, KHÔNG modify field
      try {
        return JSON.parse(data);
      } catch {
        return data;
      }
    }
  ]
});

axiosInstance.interceptors.request.use(
  (config) => {
    const url = config.url || "";
    if (url.includes("/private/auth")) {
      const token = AuthHelper.getRefreshTokenFromCookie();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    } else if (url.includes("/private")) {
      const token = AuthHelper.getAccessTokenFromCookie();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    // return axiosInstance(error.config);
    const err = error as ErrorResponse
    const EXPIRED_TOKEN_CODE: string | undefined = process.env.NEXT_PUBLIC_ERROR_CODES_EXPIRED_TOKEN_CODE
    if (EXPIRED_TOKEN_CODE === undefined
      || GlobalValidators.isNull(err.response)
      || GlobalValidators.isNull(err.response!.data)
      || GlobalValidators.isEmpty(err.response!.data))
      return Promise.reject(error)

    const response = err.response!.data as ApiResponse<null>
    if (response.code !== Number.parseInt(EXPIRED_TOKEN_CODE))
      return Promise.reject(error)

    const token: string | undefined = AuthHelper.getAccessTokenFromCookie()
    if (token === undefined)
      return Promise.reject(error)

    const request = DTO_Token.withBuilder().baccessToken(token)
    const refreshTokenRes = await GeneralAPIs.refreshToken(request) as RecordResponse
    if (refreshTokenRes.status !== 200) {
      // AuthHelper.endClientSession()
      return Promise.reject(error)
    }

    AuthHelper.saveAccessTokenIntoCookie(refreshTokenRes.body.accessToken)
    return axiosInstance(error.config);
  }
);

export default axiosInstance;
