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

  static isValidDob(value: string): string {
    if (!value) return "Date of birth is required";

    const dob = new Date(value);
    const now = new Date();

    if (dob > now) return "Date of birth must be in the past";

    const ageDiffMs = now.getTime() - dob.getTime();
    const ageDate = new Date(ageDiffMs);
    const age = Math.abs(ageDate.getUTCFullYear() - 1970);

    if (age < 14) return "Require 14 years old as minimum";

    return "";
  }
  
  static isValidDeadline(value: string): string {
    if (!value) return "Date is required";
    if (new Date(value) < new Date()) return "Date must be in current or future";
    return "";
  }
}