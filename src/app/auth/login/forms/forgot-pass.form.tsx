'use client'
import { useCallback, useEffect, useState } from "react"
import GlobalValidators from "@/util/global.validators"
import { LoginValidators } from "../page.services"
import { GeneralAPIs, RecordResponse } from "@/apis/general.api"
import toast from "react-hot-toast"
import { DTO_VerifyEmailRequest } from "@/dtos/general.dto"
import { DTO_LostPassRequest } from "@/dtos/login.page.dto"
import { LoginAPIs } from "@/apis/login.page.api"
import "../assets/forgot-pass.form.scss"

export default function ForgotPassForm() {
  const [otpTypes, setOtpTypes] = useState<Record<string, string>>({})
  const [email, setEmail] = useState("")
  const [otpCode, setOtpCode] = useState("")
  const [otpAge, setOtpAge] = useState(0);
  const [formValidation, setFormValidation] = useState({
    email: "",
    otpCode: "",
  });

  const onChangeEmail = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    setFormValidation(prev => ({ ...prev, email: LoginValidators.isValidEmail(e.target.value) }))
  }, [])

  const onChangeOtpCode = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim().toUpperCase();
    setOtpCode(value)
    setFormValidation(prev => ({ ...prev, otpCode: LoginValidators.isValidOtpCode(value) }))
  }, [])

  const onClickGetOtp = useCallback(() => {
    async function getOtp() {
      if (GlobalValidators.isInvalidValidation({
        email: LoginValidators.isValidEmail(email)
      }))  return
      const req = DTO_VerifyEmailRequest.withBuilder().bemail(email).botpType(otpTypes.lostPassword)
      const res = await GeneralAPIs.verifyEmailByOtp(req) as RecordResponse
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
  }, [email, otpTypes]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    async function register() {
      if (GlobalValidators.isInvalidValidation(formValidation))
        return
      const request = DTO_LostPassRequest.withBuilder()
        .bemail(email)
        .botp(otpCode)
      const res = await LoginAPIs.lostPassword(request) as RecordResponse
      if (res.status === 200) {
        toast.success(res.msg)
        setTimeout(() => {
          window.location.href = "/auth/login"
        }, 500)
      }
    }
    register()
  }, [email, otpCode, formValidation])

  useEffect(() => {
    async function init() {
      const otpTypesRes = await GeneralAPIs.getOtpEnumTypes() as RecordResponse
      if (GlobalValidators.isNull(otpTypesRes.body))  return
      setOtpTypes(otpTypesRes.body)
    }
    init()
  }, [])

  return (
    <form className="forgot-pass-form" onSubmit={handleSubmit}>
      <div className="forgot-pass-form-container">

        <div className="form-group-container">
          <fieldset className="form-group">
            <legend className="form-label">Email</legend>
            <input type="email" id="email" className="form-input" placeholder="Type Email" required value={email} onChange={onChangeEmail} />
          </fieldset>
          {GlobalValidators.notEmpty(formValidation.email) && <span className="input-err-msg">{formValidation.email}</span>}
        </div>

        <div className="form-group-container">
          <fieldset className="form-group otp-group">
            <legend className="form-label">OTP Code</legend>
            <div className="input-with-btn">
              <input id="otpCode" className="form-input" placeholder="To verify Email" required value={otpCode} onChange={onChangeOtpCode} />
              <button className={"get-otp " + (otpAge === 0 ? "not-showing-otp-age" : "showing-otp-age")}
                onClick={onClickGetOtp} disabled={otpAge !== 0} type="button">
                {otpAge === 0 ? "GET" : otpAge + "s"}
              </button>
            </div>
          </fieldset>
          {GlobalValidators.notEmpty(formValidation.otpCode) &&
            <span className="input-err-msg">{formValidation.otpCode}</span>}
        </div>

        <button type="submit" className="submit-btn">Submit</button>
      </div>
    </form>
  )
}