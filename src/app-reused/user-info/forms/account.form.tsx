'use client'

import { GeneralAPIs, RecordResponse } from "@/apis/general.api";
import { LoginValidators } from "@/app/auth/login/page.services";
import GlobalValidators from "@/util/global.validators";
import { Eye, EyeOff } from "lucide-react";
import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import "../assets/account-info.form.scss";
import { DTO_ChangePasswordRequest } from "@/dtos/general.dto";

interface AccountComponentProps {
  username: string;
}

export default function AccountForm({ username }: AccountComponentProps) {
  const [password, setPassword] = useState("")
  const [confPass, setConfPass] = useState("")
  const [otpCode, setOtpCode] = useState("")
  const [otpAge, setOtpAge] = useState(0);
  const [showPassword, setShowPassword] = useState(false)
  const [showConfPass, setShowConfPass] = useState(false)
  const [formTouched, setFormTouched] = useState(false)
  const [formValidation, setFormValidation] = useState({
    otpCode: "",
    password: "",
    confPass: "",
  })

  const onChangePassword = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
    setFormTouched(true)
    setFormValidation(prev => ({
      ...prev,
      password: LoginValidators.isValidPassword(e.target.value),
      confPass: LoginValidators.isValidConfPassword(confPass, e.target.value)
    }))
  }, [confPass])

  const onChangeConfPassword = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setConfPass(e.target.value)
    setFormTouched(true)
    setFormValidation(prev => ({
      ...prev,
      password: LoginValidators.isValidPassword(e.target.value),
      confPass: LoginValidators.isValidConfPassword(e.target.value, password)
    }))
  }, [password])

  const onChangeOtpCode = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim().toUpperCase();
    setOtpCode(value)
    setFormTouched(true)
    setFormValidation(prev => ({ ...prev, otpCode: LoginValidators.isValidOtpCode(value) }))
  }, [])

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev)
  }, [])

  const toggleConfPassVisibility = useCallback(() => {
    setShowConfPass(prev => !prev)
  }, [])

  const onClickGetOtp = useCallback(() => {
    async function getOtp() {
      const res = await GeneralAPIs.authorizeEmailByOtp() as RecordResponse
      if (GlobalValidators.isNull(res.body)) return

      toast.success(res.msg)
      setOtpAge(Number.parseInt(res.body.otpAgeInSeconds));
      const otpCountDownInterval = setInterval(() => {
        setOtpAge(prev => {
          if (prev > 1) return prev - 1
          clearInterval(otpCountDownInterval)
          return 0
        });
      }, 1000);
    }
    getOtp()
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    async function changePassowrd() {
      if (GlobalValidators.isInvalidValidation(formTouched, formValidation))
        return
      const request = DTO_ChangePasswordRequest.withBuilder().bpassword(password).botp(otpCode)
      const res = await GeneralAPIs.changePassword(request) as RecordResponse
      if (String(res.status).startsWith("2")) {
        toast.success(res.msg)
        window.location.reload()
      }
    }
    changePassowrd()
  }, [password, otpCode, formValidation, formTouched])

  return (
    <form className="account-info-form" onSubmit={handleSubmit}>
      <div className="user-info-description">
        <h1 className="page-name">Password</h1>
        <i className="page-description">
          Complete these steps to change your password.
        </i>
      </div>
      <i className="divider"></i>

      <div className="form-group-container">
        <fieldset className="form-group">
          <legend className="form-label">Username</legend>
          <input type="email" id="email" className="form-input" placeholder="Type Email" required value={username} disabled />
        </fieldset>
      </div>

      <div className="form-group-container">
        <fieldset className="form-group otp-group">
          <legend className="form-label">OTP Code</legend>
          <div className="input-with-btn">
            <input id="otpCode" className="form-input" placeholder="To authorize" required value={otpCode} onChange={onChangeOtpCode} />
            <button className={"get-otp " + (otpAge === 0 ? "not-showing-otp-age" : "showing-otp-age")}
              onClick={onClickGetOtp} disabled={otpAge !== 0} type="button">
              {otpAge === 0 ? "GET" : otpAge + "s"}
            </button>
          </div>
        </fieldset>
        {GlobalValidators.notEmpty(formValidation.otpCode) &&
          <span className="input-err-msg">{formValidation.otpCode}</span>}
      </div>

      <div className="form-group-container">
        <fieldset className="form-group password-group">
          <legend className="form-label">New Password</legend>
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

      <div className="form-group-container">
        <fieldset className="form-group password-group">
          <legend className="form-label">Confirm Password</legend>
          <div className="input-with-icon">
            <input type={showConfPass ? "text" : "password"} id="password" className="form-input" placeholder="Type Password"
              required value={confPass} onChange={onChangeConfPassword} />
            <button type="button" className="toggle-eye-btn" onClick={toggleConfPassVisibility}>
              {showConfPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </fieldset>
        {GlobalValidators.notEmpty(formValidation.confPass) &&
          <span className="input-err-msg">{formValidation.confPass}</span>}
      </div>

      <button type="submit" className="submit-btn">Submit</button>
    </form>
  )
} 