'use client'
import type React from "react"
import { useCallback, useEffect, useState } from "react"
import { Eye, EyeOff, Github } from "lucide-react"
import GoogleIcon from "../../../../assets/google.icon"
import GlobalValidators from "@/util/global.validators"
import toast from "react-hot-toast"
import "../assets/login.form.scss"
import { LoginValidators } from "../page.services"
import { LoginAPIs } from "@/apis/login.page.api"
import { AuthHelper } from "@/util/auth.helper"
import { DTO_AuthRequest } from "@/dtos/login.page.dto"
import { GeneralAPIs, RecordResponse } from "@/apis/general.api"
import { DTO_GetOauth2Authorizer } from "@/dtos/general.dto"

export default function LoginForm() {
  const [oauth2Enums, setOauth2Enums] = useState<Record<string, string>>({})
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [formValidation, setFormValidation] = useState({
    email: "",
    password: "",
  });

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev)
  }, [])

  const onChangeEmail = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    setFormValidation(prev => ({ ...prev, email: LoginValidators.isValidEmail(e.target.value) }))
  }, [])

  const onChangePassword = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
    setFormValidation(prev => ({ ...prev, password: LoginValidators.isValidPassword(e.target.value) }))
  }, [])

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    async function send() {
      if (GlobalValidators.isInvalidValidation(formValidation))
        return
      const request = DTO_AuthRequest.withBuilder().bemail(email).bpassword(password)
      const response = await LoginAPIs.authenticate(request) as RecordResponse
      if (GlobalValidators.isNull(response.body))
        return
      toast.success(response.msg)
      AuthHelper.saveAccessTokenIntoCookie(response.body.accessToken)
      AuthHelper.saveRefreshTokenIntoCookie(response.body.refreshToken)
      const role = AuthHelper.getRoleFromToken().toUpperCase()
      if (role.includes("PM"))
        window.location.href = "/pm/dashboard"
      else if (role.includes("LEAD"))
        window.location.href = "/lead/dashboard"
      else
        window.location.href = "/emp/home"
    }
    send()
  }, [formValidation, email, password])

  const handleGoogleLogin = useCallback(() => {
    async function getOauth2Authorizer() {
      const request = DTO_GetOauth2Authorizer.withBuilder().boauth2Service(oauth2Enums.google)
      const response = await LoginAPIs.getOauth2Authorizer(request) as RecordResponse
      if (response.status !== 200 || GlobalValidators.isNull(response.body))
        return

      localStorage.setItem("oauth2Enums", JSON.stringify(oauth2Enums))
      window.location.href = response.body.authorizer
    }
    getOauth2Authorizer()
  }, [oauth2Enums])

  useEffect(() => {
    async function init() {
      const response = await GeneralAPIs.getOauth2ServiceEnums() as RecordResponse
      if (response.status !== 200 || GlobalValidators.isNull(response.body))
        return
      setOauth2Enums(response.body)
    }
    init()
  }, [])

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <div className="login-form-container">
        <div className="form-group-container">
          <fieldset className="form-group">
            <legend className="form-label">Email</legend>
            <input type="email" id="email" className="form-input" placeholder="Type Email" required value={email} onChange={onChangeEmail} />
          </fieldset>
          {GlobalValidators.notEmpty(formValidation.email) && <span className="input-err-msg">{formValidation.email}</span>}
        </div>

        <div className="form-group-container">
          <fieldset className="form-group password-group">
            <legend className="form-label">Password</legend>
            <div className="input-with-icon">
              <input type={showPassword ? "text" : "password"} id="password" className="form-input" placeholder="Type Password"
                required value={password} onChange={onChangePassword} />
              <button type="button" className="toggle-eye-btn" onClick={togglePasswordVisibility}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </fieldset>
          {GlobalValidators.notEmpty(formValidation.password) &&
            <span className="input-err-msg">{formValidation.password}</span>}
        </div>

        <button type="submit" className="submit-btn">Submit</button>

        <div className="divider"><span>or</span></div>

        <div className="oauth2-btns">
          <button type="button" className="google-btn" onClick={handleGoogleLogin}>
            <GoogleIcon />
          </button>
        </div>
      </div>
    </form>
  )
}
