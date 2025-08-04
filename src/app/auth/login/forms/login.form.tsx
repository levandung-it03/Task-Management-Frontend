'use client'
import type React from "react"
import { useCallback, useEffect, useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import GlobalValidators from "@/util/global.validators"
import toast from "react-hot-toast"
import "../assets/login.form.scss"
import { LoginValidators } from "../page.services"
import { LoginAPIs } from "@/apis/login.page.api"
import { AuthHelper } from "@/util/auth.helper"
import { DTO_AuthRequest } from "@/dtos/login.page.dto"
import { RecordResponse } from "@/apis/general.api"

export default function LoginForm() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [formTouched, setFormTouched] = useState(false)
  const [formValidation, setFormValidation] = useState({
    username: "",
    password: "",
  })

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev)
  }, [])

  const onChangeUsername = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value)
    setFormTouched(true)
    setFormValidation(prev => ({ ...prev, username: LoginValidators.isValidUsername(e.target.value) }))
  }, [])

  const onChangePassword = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
    setFormTouched(true)
    setFormValidation(prev => ({ ...prev, password: LoginValidators.isValidPassword(e.target.value) }))
  }, [])

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    async function send() {
      if (GlobalValidators.isInvalidValidation(formTouched, formValidation))
        return
      const request = DTO_AuthRequest.withBuilder().busername(username).bpassword(password)
      const response = await LoginAPIs.authenticate(request) as RecordResponse
      if (GlobalValidators.isNull(response.body))
        return
      toast.success(response.msg)
      AuthHelper.saveAccessTokenIntoCookie(response.body.accessToken)
      AuthHelper.saveRefreshTokenIntoCookie(response.body.refreshToken)
      
      window.location.href = `/${AuthHelper.getRoleFromToken()}/home`
    }
    send()
  }, [formValidation, username, password])

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <div className="login-form-container">
        <div className="form-group-container">
          <fieldset className="form-group">
            <legend className="form-label">Username</legend>
            <input type="username" id="username" className="form-input" placeholder="Type Username" required value={username} onChange={onChangeUsername} />
          </fieldset>
          {GlobalValidators.notEmpty(formValidation.username) && <span className="input-err-msg">{formValidation.username}</span>}
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
      </div>
    </form>
  )
}
