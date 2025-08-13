
export class ViewUserService {
  static generateAvatarInitials(email: string): string {
    return email.substring(0, 2).toUpperCase()
  }
} 