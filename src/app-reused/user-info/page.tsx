'use client'

import { AuthHelper } from "@/util/auth.helper"
import UserInfoForm from "./forms/user-info.form"
import AccountForm from "./forms/account.form"
import { useEffect, useState } from "react"
import "./page.scss"

export default function UserInfo() {
  const [email, setEmail] = useState("")
  const [canChangePassword, setCanChangePassword] = useState(false)

  useEffect(() => {
    const token: string | undefined = AuthHelper.getRefreshTokenFromCookie()
    if (token === undefined)
      return
    try {
      const claims: Record<string, string> = AuthHelper.extractToken(token)
      setEmail(claims.sub)
      setCanChangePassword(claims.IS_OAUTH2 === "false")
    } catch {
      AuthHelper.endClientSession()
    }
  }, [])

  return <div className="user-info-container">
    <div className="user-info">
      <UserInfoForm />
    </div>
    <div className="account-info">
      {canChangePassword && <AccountForm email={email} />}
    </div>
  </div>
}