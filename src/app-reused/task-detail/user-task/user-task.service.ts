import GlobalValidators from "@/util/global.validators";

export class UserTaskService {

  static isValidContent(content: string) {
    if (GlobalValidators.isEmpty(content))
      return "Content cannot be empty"
    return ""
  }
}