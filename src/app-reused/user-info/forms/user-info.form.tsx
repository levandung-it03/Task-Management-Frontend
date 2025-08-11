'use client'

import { ApiResponse } from "@/apis/general.api"
import { UserInfoAPIs } from "@/apis/user-info.page.api"
import { AuthHelper } from "@/util/auth.helper"
import GlobalValidators from "@/util/global.validators"
import { useCallback, useEffect, useState } from "react"
import toast from "react-hot-toast"
import "../assets/user-info.form.scss"
import { RotateCcw } from "lucide-react"
import { LoginValidators } from "@/app/auth/login/page.services"
import { DTO_UserInfo, DTO_UserInfoResponse } from "@/dtos/user-info.page.dto"

export default function UserInfoForm() {
  const [isLoading, setIsLoading] = useState(true)
  const [email, setEmail] = useState("")
  const [department, setDepartment] = useState("")
  const [fullName, setFullName] = useState("")
  const [identity, setIdentity] = useState("")
  const [phone, setPhone] = useState("")
  const [formTouched, setFormTouched] = useState(false)
  const [userInfoValidation, setUserInfoValidation] = useState({
    fullName: "",
    identity: "",
    phone: ""
  });
  const [preState, setPreState] = useState({
    fullName: "",
    identity: "",
    phone: ""
  })

  const onChangeFullName = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFullName(e.target.value)
    setFormTouched(true)
    setUserInfoValidation(prev => ({ ...prev, fullName: LoginValidators.isValidFullName(e.target.value) }))
  }, [])

  const onChangePhone = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(e.target.value)
    setFormTouched(true)
    setUserInfoValidation(prev => ({ ...prev, phone: LoginValidators.isValidPhone(e.target.value) }))
  }, [])

  const onChangeIdentity = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setIdentity(e.target.value)
    setFormTouched(true)
    setUserInfoValidation(prev => ({ ...prev, identity: LoginValidators.isValidIdentity(e.target.value) }))
  }, [])

  const clickResetUserInfo = useCallback(() => {
    setFullName(preState.fullName)
    setUserInfoValidation({
      fullName: "",
      identity: "",
      phone: ""
    })
  }, [preState])

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    async function updateUserInfo() {
      setIsLoading(true)
      if (GlobalValidators.isInvalidValidation(formTouched, userInfoValidation))
        return
      const request = DTO_UserInfo.withBuilder()
        .bfullName(fullName)
        .bidentity(identity)
        .bphone(phone)
      const res = await UserInfoAPIs.updateUserInfo(AuthHelper.getRoleFromToken(), request) as ApiResponse<DTO_UserInfo>
      if (String(res.status)[0] === "2") {
        toast.success(res.msg)
        setPreState({ fullName, identity, phone })
      }
      setIsLoading(false)
    }
    updateUserInfo()
  }, [fullName, identity, phone, userInfoValidation, formTouched])

  useEffect(() => {
    async function init() {
      setIsLoading(true)
      const response = await UserInfoAPIs.getUserInfo(AuthHelper.getRoleFromToken()) as ApiResponse<DTO_UserInfoResponse>
      if (GlobalValidators.isNull(response.body)) return
      setFullName(response.body.fullName)
      setIdentity(response.body.identity)
      setPhone(response.body.phone)
      setEmail(response.body.email)
      setDepartment(response.body.department.name)
      setPreState({
        fullName: response.body.fullName,
        identity: response.body.identity,
        phone: response.body.phone,
      })
      setIsLoading(false)
    }
    init()
  }, [])

  return (isLoading
    ? <div className="loading-row">Loading...</div>
    : <>
      <div className="user-info-description">
        <h1 className="page-name">User Information</h1>
        <i className="page-description">
          Enter the required information below to update your profile, nothing changed until the submission.
        </i>
        <button type="button" className="reset-user-info-btn" onClick={clickResetUserInfo}>
          <RotateCcw className="reset-user-info-icon" />
        </button>
      </div>
      <i className="divider"></i>
      <form className="user-info-form" onSubmit={handleSubmit}>
        <div className="user-info-form-container">

          <div className="form-group-container half-form-left-container">
            <fieldset className="form-group">
              <legend className="form-label">Email</legend>
              <input type="text" id="email" className="form-input" required value={email} readOnly />
            </fieldset>
          </div>

          <div className="form-group-container half-form-right-container">
            <fieldset className="form-group">
              <legend className="form-label">Department</legend>
              <input type="text" id="department" className="form-input" required value={department} readOnly />
            </fieldset>
          </div>

          <div className="form-group-container">
            <fieldset className="form-group">
              <legend className="form-label">Full Name</legend>
              <input type="text"
                id="fullName"
                className="form-input"
                placeholder="Type Full Name"
                required value={fullName}
                onChange={onChangeFullName} />
            </fieldset>
            {GlobalValidators.notEmpty(userInfoValidation.fullName)
              && <span className="input-err-msg">{userInfoValidation.fullName}</span>}
          </div>
          
          <div className="form-group-container">
            <fieldset className="form-group">
              <legend className="form-label">Identity Card</legend>
              <input type="text"
                id="identity"
                className="form-input"
                placeholder="Type Full Name"
                required value={identity}
                onChange={onChangeIdentity} />
            </fieldset>
            {GlobalValidators.notEmpty(userInfoValidation.identity)
              && <span className="input-err-msg">{userInfoValidation.identity}</span>}
          </div>
          
          <div className="form-group-container">
            <fieldset className="form-group">
              <legend className="form-label">Phone</legend>
              <input type="text"
                id="fullName"
                className="form-input"
                placeholder="Type Phone Numbers"
                required value={phone}
                onChange={onChangePhone} />
            </fieldset>
            {GlobalValidators.notEmpty(userInfoValidation.phone)
              && <span className="input-err-msg">{userInfoValidation.phone}</span>}
          </div>

          <button type="submit" className="submit-btn">Update</button>
        </div>
      </form>
    </>
  )
}