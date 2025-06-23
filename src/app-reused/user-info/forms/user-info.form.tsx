'use client'

import { GeneralAPIs, RecordResponse } from "@/apis/general.api"
import { UserInfoAPIs } from "@/apis/user-info.page.api"
import { LoginValidators } from "@/app/auth/login/page.services"
import { DTO_UpdateUserInfoRequest } from "@/dtos/user-info.page"
import { AuthHelper } from "@/util/auth.helper"
import GlobalValidators from "@/util/global.validators"
import { useCallback, useEffect, useState } from "react"
import toast from "react-hot-toast"
import "../assets/user-info.form.scss"
import { RotateCcw } from "lucide-react"

export default function UserInfoForm() {
  const [fullName, setFullName] = useState("")
  const [gender, setGender] = useState("")
  const [genders, setGenders] = useState<Record<string, string>>({})
  const [dob, setDob] = useState("")
  const [userInfoValidation, setUserInfoValidation] = useState({
    fullName: "",
    dob: "",
  });
  const [preState, setPreState] = useState({
    fullName: "",
    gender: "",
    dob: "",
  })

  const onChangeFullName = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFullName(e.target.value)
    setUserInfoValidation(prev => ({ ...prev, fullName: LoginValidators.isValidFullName(e.target.value) }))
  }, [])

  const onChangeGender = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setGender(e.target.value)
  }, [])

  const onChangeDob = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setDob(e.target.value)
    setUserInfoValidation(prev => ({ ...prev, dob: LoginValidators.isValidDob(e.target.value) }))
  }, [])

  const clickResetUserInfo = useCallback(() => {
    setFullName(preState.fullName)
    setDob(preState.dob)
    setGender(preState.gender)
    setUserInfoValidation({
      fullName: "",
      dob: "",
    })
  }, [preState])

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    async function updateUserInfo() {
      if (GlobalValidators.isInvalidValidation(userInfoValidation))
        return
      const request = DTO_UpdateUserInfoRequest.withBuilder()
        .bfullName(fullName)
        .bgender(gender)
        .bdob(new Date(dob))
      const res = await UserInfoAPIs.updateUserInfo(AuthHelper.getRoleFromToken(), request) as RecordResponse
      if (res.status === 200) {
        toast.success(res.msg)
        setPreState({ fullName, gender, dob })
      }
    }
    updateUserInfo()
  }, [fullName, gender, dob, userInfoValidation])

  useEffect(() => {
    async function init() {
      const genderRes = await GeneralAPIs.getGenderEnums() as RecordResponse
      if (GlobalValidators.isNull(genderRes.body)) return
      setGenders(genderRes.body)
      setGender(Object.values(genderRes.body)[0])

      const userInfoRes = await UserInfoAPIs.getUserInfo(AuthHelper.getRoleFromToken()) as RecordResponse
      if (GlobalValidators.isNull(userInfoRes.body))  return
      setFullName(userInfoRes.body.fullName)
      setDob(userInfoRes.body.dob)
      setGender(userInfoRes.body.gender)  //--Change on HTML too
      setPreState({
        fullName: userInfoRes.body.fullName,
        gender: userInfoRes.body.gender,
        dob: userInfoRes.body.dob,
      })
    }
    init()
  }, [])

  return (
    <>
      <div className="user-info-description">
        <h1 className="page-name">User Information</h1>
        <p className="page-description">
          Enter the required information below to update your profile, nothing changed until the submission.
        </p>
        <button type="button" className="reset-user-info-btn" onClick={clickResetUserInfo}>
          <RotateCcw className="reset-user-info-icon" />
        </button>
      </div>
      <i className="divider"></i>
      <form className="user-info-form" onSubmit={handleSubmit}>
        <div className="user-info-form-container">

          <div className="form-group-container">
            <fieldset className="form-group">
              <legend className="form-label">Full Name</legend>
              <input type="text" id="fullName" className="form-input" placeholder="Type Full Name" required value={fullName} onChange={onChangeFullName} />
            </fieldset>
            {GlobalValidators.notEmpty(userInfoValidation.fullName) && <span className="input-err-msg">{userInfoValidation.fullName}</span>}
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
            {GlobalValidators.notEmpty(userInfoValidation.dob) && <span className="input-err-msg">{userInfoValidation.dob}</span>}
          </div>

          <button type="submit" className="submit-btn">Update</button>
        </div>
      </form>
    </>
  )
}