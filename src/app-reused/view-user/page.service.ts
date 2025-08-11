import { GeneralAPIs } from "@/apis/general.api"
import { DTO_ViewUserResponse } from "@/dtos/view-user.page.dto"

export class ViewUserService {
  static async viewUserById(userId: number): Promise<DTO_ViewUserResponse> {
    const response = await GeneralAPIs.viewUserById(userId) as any
    if (response && response.body) {
      return response.body
    }
    throw new Error("Failed to fetch user data")
  }

  static generateAvatarInitials(email: string): string {
    return email.substring(0, 2).toUpperCase()
  }

  static getAuthorityDisplayName(authorityName: string): string {
    const authorityMap: Record<string, string> = {
      'ROLE_ADMIN': 'Quản trị viên',
      'ROLE_PM': 'Project Manager',
      'ROLE_LEAD': 'Trưởng nhóm',
      'ROLE_EMP': 'Nhân viên'
    }
    return authorityMap[authorityName] || authorityName
  }
} 