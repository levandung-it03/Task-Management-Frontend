'use client'

import { useEffect, useState } from "react"
import { DTO_ViewUserResponse } from "@/dtos/view-user.page.dto"
import { AuthHelper } from "@/util/auth.helper"
import { ViewUserService } from "./page.service"
import "./page.scss"

interface UserProfileProps {
  userId?: number
}

export default function UserProfile({ userId }: UserProfileProps) {
  const [userData, setUserData] = useState<DTO_ViewUserResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const token: string | undefined = AuthHelper.getRefreshTokenFromCookie()
    if (token === undefined) {
      AuthHelper.endClientSession()
      return
    }

    if (!userId) {
      setError("Thiếu ID người dùng")
      setLoading(false)
      return
    }

    fetchUserData(userId)
  }, [userId])

  const fetchUserData = async (userId: number) => {
    try {
      const userData = await ViewUserService.viewUserById(userId)
      setUserData(userData)
    } catch (error) {
      console.error("Error fetching user data:", error)
      setError("Không thể tải thông tin người dùng")
    } finally {
      setLoading(false)
    }
  }

  const getInitials = (email: string): string => {
    return ViewUserService.generateAvatarInitials(email)
  }

  const getAuthorityDisplayName = (authorityName: string): string => {
    return ViewUserService.getAuthorityDisplayName(authorityName)
  }



  if (loading) {
    return (
      <div className="user-profile-container">
        <div className="user-profile-card">
          <div className="loading">Đang tải...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="user-profile-container">
        <div className="user-profile-card">
          <div className="error">{error}</div>
        </div>
      </div>
    )
  }

  if (!userData) {
    return (
      <div className="user-profile-container">
        <div className="user-profile-card">
          <div className="error">Không thể tải thông tin người dùng</div>
        </div>
      </div>
    )
  }

  return (
    <div className="user-profile-container">
      <div className="user-profile-card">
        {/* Header Section */}
        <div className="profile-header">
          <div className="avatar-container">
            <div className="avatar">
              {getInitials(userData.email)}
            </div>
          </div>
          <h2 className="full-name">{userData.fullName}</h2>
          <p className="email">{userData.email}</p>
        </div>

        {/* Details Section */}
        <div className="profile-details">
          <div className="detail-item">
            <div className="detail-icon username-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="detail-label">Tên đăng nhập:</span>
            <span className="detail-value">{userData.username}</span>
          </div>

          <div className="detail-item">
            <div className="detail-icon phone-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 16.92V19.92C22.0011 20.1985 21.9441 20.4742 21.8325 20.7293C21.7209 20.9844 21.5573 21.2136 21.3521 21.4019C21.1469 21.5901 20.9046 21.7335 20.6407 21.8227C20.3769 21.9119 20.0975 21.9452 19.82 21.92C16.7428 21.5856 13.787 20.5341 11.19 18.85C8.77382 17.3146 6.72533 15.2661 5.18999 12.85C3.49997 10.2412 2.44824 7.27099 2.11999 4.18C2.09494 3.90347 2.12787 3.62476 2.21649 3.36162C2.30512 3.09849 2.44756 2.85669 2.63476 2.65189C2.82196 2.44708 3.0498 2.28363 3.30351 2.17189C3.55722 2.06015 3.83149 2.00274 4.10999 2.003H7.10999C7.59522 1.99522 8.06569 2.16708 8.43376 2.48353C8.80182 2.79999 9.042 3.23945 9.10999 3.72C9.23662 4.68007 9.47144 5.62273 9.80999 6.53C9.94454 6.88792 9.97348 7.27675 9.89382 7.65307C9.81416 8.02939 9.62877 8.38336 9.35999 8.67L8.08999 9.94C9.51355 12.3635 11.6365 14.4864 14.06 15.91L15.33 14.64C15.6166 14.3712 15.9706 14.1858 16.3469 14.1062C16.7232 14.0265 17.1121 14.0555 17.47 14.19C18.3773 14.5286 19.3199 14.7634 20.28 14.89C20.7658 14.9585 21.2094 15.2032 21.5265 15.5775C21.8437 15.9518 22.0122 16.4296 22 16.92Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="detail-label">Số điện thoại:</span>
            <span className="detail-value">{userData.phone}</span>
          </div>

          <div className="detail-item">
            <div className="detail-icon authority-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="detail-label">Vai trò:</span>
            <span className="detail-value">{getAuthorityDisplayName(userData.authorityName)}</span>
          </div>

          <div className="detail-item">
            <div className="detail-icon department-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="9,22 9,12 15,12 15,22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="detail-label">Phòng ban:</span>
            <span className="detail-value">{userData.departmentName}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
