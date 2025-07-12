```typescript
'use client'
import { useCallback, useEffect, useState } from "react"
import GlobalValidators from "@/util/global.validators"
import { Eye, EyeOff } from "lucide-react"
import "../assets/register.form.scss"
import { LoginValidators } from "../page.services"
import { GeneralAPIs, RecordResponse } from "@/apis/general.api"
import toast from "react-hot-toast"
import { DTO_VerifyEmailRequest } from "@/dtos/general.dto"
import { DTO_RegisterRequest } from "@/dtos/login.page.dto"
import { LoginAPIs } from "@/apis/login.page.api"

export default function RegisterForm() {
  const [fullName, setFullName] = useState("")
  const [gender, setGender] = useState("")
  const [genders, setGenders] = useState<Record<string, string>>({})
  const [otpTypes, setOtpTypes] = useState<Record<string, string>>({})
  const [dob, setDob] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confPass, setConfPass] = useState("")
  const [otpCode, setOtpCode] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfPass, setShowConfPass] = useState(false)
  const [otpAge, setOtpAge] = useState(0);
  const [formValidation, setFormValidation] = useState({
    fullName: "",
    dob: "",
    email: "",
    otpCode: "",
    password: "",
    confPass: "",
  });

  const onChangeFullName = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFullName(e.target.value)
    setFormValidation(prev => ({ ...prev, fullName: LoginValidators.isValidFullName(e.target.value) }))
  }, [])

  const onChangeGender = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setGender(e.target.value)
  }, [])

  const onChangeDob = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setDob(e.target.value)
    setFormValidation(prev => ({ ...prev, dob: LoginValidators.isValidDob(e.target.value) }))
  }, [])

  const onChangeEmail = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    setFormValidation(prev => ({ ...prev, email: LoginValidators.isValidEmail(e.target.value) }))
  }, [])

  const onChangePassword = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
    setFormValidation(prev => ({
      ...prev,
      password: LoginValidators.isValidPassword(e.target.value),
      confPass: LoginValidators.isValidConfPassword(confPass, e.target.value)
    }))
  }, [confPass])

  const onChangeConfPassword = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setConfPass(e.target.value)
    setFormValidation(prev => ({
      ...prev,
      password: LoginValidators.isValidPassword(e.target.value),
      confPass: LoginValidators.isValidConfPassword(e.target.value, password)
    }))
  }, [password])

  const onChangeOtpCode = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim().toUpperCase();
    setOtpCode(value)
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
      if (GlobalValidators.isInvalidValidation({
        email: LoginValidators.isValidEmail(email)
      }))  return
      const req = DTO_VerifyEmailRequest.withBuilder().bemail(email).botpType(otpTypes.register)
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
      const request = DTO_RegisterRequest.withBuilder()
        .bfullName(fullName)
        .bgender(gender)
        .bdob(new Date(dob))
        .bemail(email)
        .bpassword(password)
        .botp(otpCode)
      const res = await LoginAPIs.register(request) as RecordResponse
      if (String(res.status)[0] === "2") {
        toast.success(res.msg)
        setTimeout(() => {
          window.location.href = "/auth/login"
        }, 500)
      }
    }
    register()
  }, [fullName, email, gender, password, otpCode, dob, formValidation])

  useEffect(() => {
    async function init() {
      const genderRes = await GeneralAPIs.getGenderEnums() as RecordResponse
      if (GlobalValidators.isNull(genderRes.body))  return
      setGenders(genderRes.body)
      setGender(Object.values(genderRes.body)[0])

      const otpTypesRes = await GeneralAPIs.getOtpEnumTypes() as RecordResponse
      if (GlobalValidators.isNull(otpTypesRes.body))  return
      setOtpTypes(otpTypesRes.body)
    }
    init()
  }, [])

  return (
    <form className="register-form" onSubmit={handleSubmit}>
      <div className="register-form-container">

        <div className="form-group-container">
          <fieldset className="form-group">
            <legend className="form-label">Full Name</legend>
            <input type="text" id="fullName" className="form-input" placeholder="Type Full Name" required value={fullName} onChange={onChangeFullName} />
          </fieldset>
          {GlobalValidators.notEmpty(formValidation.fullName) && <span className="input-err-msg">{formValidation.fullName}</span>}
        </div>

        <div className="form-group-container half-form-left-container">
          <fieldset className="form-group">
            <legend className="form-label">Gender</legend>
            <select className="form-select" value={gender} onChange={onChangeGender} required>
              {Object.entries(genders).map(([key, val], index) => <option value={val} key={key + index}>{key}</option>)}
            </select>
          </fieldset>
        </div>

        <div className="form-group-container half-form-right-container">
          <fieldset className="form-group">
            <legend className="form-label">Birthday</legend>
            <input type="date" id="dob" className="form-input" required value={dob} onChange={onChangeDob} />
          </fieldset>
          {GlobalValidators.notEmpty(formValidation.dob) && <span className="input-err-msg">{formValidation.dob}</span>}
        </div>

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
      </div>
    </form>
  )
}
```