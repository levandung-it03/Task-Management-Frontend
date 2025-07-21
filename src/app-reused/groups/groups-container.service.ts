import GlobalValidators from "@/util/global.validators";

export class GroupsPageService {

  static isValidGroupName(name: string): string {
    if (GlobalValidators.isEmpty(name))
      return "Group name is required"
    return ""
  }

  static isValidGroupDesc(desc: string): string {
    if (GlobalValidators.isEmpty(desc))
      return "Group description is required"
    return ""
  }

  static prettierTime(time: string): string {
    const extracted = time.replaceAll("Z", "").replaceAll("T", " ").split(" ")
    const dates: string[] = extracted[0].replaceAll("/", "-").split("-")
    const times: string[] = extracted[1].replaceAll(":", "-").split("-")

    return new Date(
      Number(dates[0]),
      Number(dates[1]) - 1,
      Number(dates[2]),
      Number(times[0]),
      Number(times[1]),
      Number(times[2])
    ).toLocaleString()
  }

  static prettierDateByTime(time: string): string {
    const extracted = time.replaceAll("Z", "").replaceAll("T", " ").split(" ")
    const dates: string[] = extracted[0].replaceAll("/", "-").split("-")

    return new Date(
      Number(dates[0]),
      Number(dates[1]) - 1,
      Number(dates[2])
    ).toDateString()
  }

  static getLastName(fullName: string) {
    const extracted = fullName.split(" ")
    return extracted[extracted.length - 1]
  }
}