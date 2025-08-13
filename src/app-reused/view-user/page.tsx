'use client'

import { useEffect, useState } from "react"
import { DTO_ViewUserResponse } from "@/dtos/view-user.page.dto"
import { ViewUserService } from "./page.service"
import "./page.scss"
import { ApiResponse, GeneralAPIs } from "@/apis/general.api"
import { Phone, Shield, Building2 } from "lucide-react"

export default function UserProfile({ email }: { email: string }) {
  const [userData, setUserData] = useState<DTO_ViewUserResponse>({
    authorityName: "",
    departmentName: "",
    username: "",
    email: "",
    fullName: "",
    phone: "",
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchUserData() {
      setLoading(true)
      const response = await GeneralAPIs.viewUserByEmail(email) as ApiResponse<DTO_ViewUserResponse>
      if (String(response.status).startsWith("2")) {
        setUserData(response.body)
      }
      setLoading(false)
    }
    fetchUserData()
  }, [email])

  const getInitials = (email: string): string => {
    return ViewUserService.generateAvatarInitials(email)
  }

  if (!userData) {
    return (
      <div className="user-profile-container">
        <div className="user-profile-card">
          <div className="error">Can't load User Info!</div>
        </div>
      </div>
    )
  }

  return (loading
    ? <div className="loading-row">Loading...</div>
    : <div className="user-profile-container">
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
            <Phone size={16} className="detail-icon" />
            <span className="detail-label">Phone:</span>
            <span className="detail-value">{userData.phone}</span>
          </div>

          <div className="detail-item">
            <Shield size={16} className="detail-icon" />
            <span className="detail-label">Role:</span>
            <span className="detail-value">{userData.authorityName}</span>
          </div>

          <div className="detail-item">
            <Building2 size={16} className="detail-icon" />
            <span className="detail-label">Department:</span>
            <span className="detail-value">{userData.departmentName}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
