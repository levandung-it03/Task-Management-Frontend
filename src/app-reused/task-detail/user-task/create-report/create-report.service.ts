import GlobalValidators from "@/util/global.validators";

export default class CreateReportService {

  static isValidName(name: string) {
    if (GlobalValidators.isEmpty(name.trim()))
      return "Title cannot be empty"
    return ""
  }
  
  static isValidReport(report: string) {
    if (GlobalValidators.isEmpty(report))
      return "Report cannot be empty"
    return ""
  }
}