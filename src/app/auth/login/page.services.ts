import GlobalValidators from "@/util/global.validators"

export class LoginValidators {
  static isValidUsername(value: string): string {
    return GlobalValidators.notEmpty(value) ? "" : "Email is invalid"
  }

  static isValidPassword(value: string): string {
    value = value.trim()
    if (GlobalValidators.isNull(value))
      return "Password is invalid"
    else if (value.length < 6)
      return "Password too short"
    else if (value.length > 20)
      return "Password too long"
    else
      return ""
  }

  static isValidConfPassword(value: string, rawPass: string): string {
    const msg = this.isValidPassword(value)
    if (GlobalValidators.notEmpty(msg))
      return msg
    else
      return value === rawPass ? "" : "Confirm Password is not corrected"
  }

  static isValidOtpCode(value: string): string {
    return (value.length === 6 && GlobalValidators.OTP_REGEX.test(value.trim())) ? "" : "OTP Code is invalid";
  }

  static isValidFullName(value: string): string {
    return GlobalValidators.FULLNAME_REGEX.test(value.trim()) ? "" : "Full Name is invalid"
  }

  static isValidPhone(value: string): string {
    return /^\d+$/.test(value) ? "" : "Require Phone numbers"
  }
  
  static isValidIdentity(value: string): string {
    return /^\d+$/.test(value) ? "" : "Require Identity numbers"
  }
}