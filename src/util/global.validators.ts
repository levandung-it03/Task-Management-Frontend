import toast from "react-hot-toast";

export default class GlobalValidators {
  static EMAIL_REGEX: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  static OTP_REGEX: RegExp = /^[A-Z0-9]+$/;
  static FULLNAME_REGEX: RegExp = /^[\p{L} ]+$/u;

  static isInvalidValidation(touched: boolean, validation: Record<string, string>): boolean {
    if (!touched) {
      toast.error("Fill all the fields before submitting!")
      return true
    }
    const msg: string | undefined = Object.values(validation).find(msg => GlobalValidators.notEmpty(msg))
    if (GlobalValidators.nonNull(msg)) {
      toast.error(msg!)
      return true
    }
    return false
  }
  
  static isNull(val: unknown): boolean {
    return val === null || val === undefined
  }

  static nonNull(val: unknown): boolean {
    return !this.isNull(val)
  }

  static isEmpty(val: unknown): boolean {
    if (GlobalValidators.isNull(val))
      return true
    if (typeof val === 'string')
      return val.length === 0
    if (Array.isArray(val))
      return val.length === 0
    if (typeof val === "object")
      return Object.keys(val!).length === 0;
    return false
  }
  
  static notEmpty(val: unknown): boolean {
    return !this.isEmpty(val)
  }
}