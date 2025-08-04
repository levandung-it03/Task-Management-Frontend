"use client"
import { ApiResponse, GeneralAPIs } from "@/apis/general.api";
import { DTO_EmailResponse } from "@/dtos/general.dto";
import Cookies from "js-cookie";

export class AuthHelper {
  static ACCESS_TOKEN_NAME = "ACCESS"
  static REFRESH_TOKEN_NAME = "REFRESH"
  static EMP_ROLE = "EMP"

  static getRoleFromToken(): string {
    try {
      const rawAccessTok = AuthHelper.getAccessTokenFromCookie()
      if (!rawAccessTok) return 'auth';

      const decoded = AuthHelper.extractToken(rawAccessTok)
      let mainRole = decoded["SCOPES"].split(" ")[0].toLowerCase().trim();
      if (mainRole.includes("role_")) mainRole = mainRole.split("role_")[1]

      return mainRole || 'auth';
    } catch {
      return 'auth';
    }
  }

  static saveAccessTokenIntoCookie(token: string) {
    Cookies.set(AuthHelper.ACCESS_TOKEN_NAME, token, { expires: 7, secure: true, sameSite: "Strict" })
  }

  static saveRefreshTokenIntoCookie(token: string) {
    Cookies.set(AuthHelper.REFRESH_TOKEN_NAME, token, { expires: 7, secure: true, sameSite: "Strict" })
  }

  static getAccessTokenFromCookie(): string | undefined {
    return AuthHelper.getTokenFromCookie(AuthHelper.ACCESS_TOKEN_NAME)
  }

  static getRefreshTokenFromCookie(): string | undefined {
    return AuthHelper.getTokenFromCookie(AuthHelper.REFRESH_TOKEN_NAME)
  }

  static getTokenFromCookie(name: string): string | undefined {
    return Cookies.get(name)
  }

  static extractToken(token: string): Record<string, string> {
    const payloadBase64 = token.split('.')[1];
    if (!payloadBase64) {
      console.error("AuthUtil.extractToken: Extracting Weird JWT Token")
      throw new Error("Invalid JWT token")
    }

    try {
      return JSON.parse(AuthHelper.decodeJwtPayload(payloadBase64));
    } catch (err) {
      console.log("AuthUtil.extractToken: Can not decode JWT Token", err)
      throw new Error("Invalid token payload")
    }
  }

  static decodeJwtPayload(base64: string): string {
    const padded = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, '=');
    const binary = atob(padded);

    return decodeURIComponent([...binary].map(c =>
      '%' + c.charCodeAt(0).toString(16).padStart(2, '0')
    ).join(''));
  }

  static endClientSession() {
    Cookies.remove(AuthHelper.ACCESS_TOKEN_NAME)
    Cookies.remove(AuthHelper.REFRESH_TOKEN_NAME)
    window.location.href = "/auth/login"
  }

  static async isEmailLoggingIn(email: string): Promise<boolean> {
    const response = await GeneralAPIs.getEmail() as ApiResponse<DTO_EmailResponse>
    if (String(response.status)[0] === "2") {
      return response.body.email === email
    }
    return false
  }

  /**
   * 1. PM/Lead -> See created Task/Project/Phase
   * 2. EMP -> See assigned Task/Project/Phase
   *        -> See created Reports
   */
}
