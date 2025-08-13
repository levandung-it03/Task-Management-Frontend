import Cookies from "js-cookie"

export class GeneralTools {
  static capitalize(str: string): string {
    return str[0].toUpperCase() + str.slice(1).toLowerCase()
  }

  static convertEnum(enumValue: string): string {
    return enumValue.split("_").map((str: string) => GeneralTools.capitalize(str)).join(" ");
  }

  static fieldToLabel(str: string): string {
    const result = str.replace(/([A-Z])/g, " $1").trim();
    return result.charAt(0).toUpperCase() + result.slice(1);
  }

  static formatedDateToDateInput(str: string): string {
    console.log(str)
    const [day, month, year] = str.split("/").map(Number)
    return `${year}-${month}-${day}`;
  }

  static getHistInsideCookies(cookieName: string) {
    const existsCookies: string | undefined = Cookies.get(cookieName)
    let existsHistories: string[]
    if (existsCookies === undefined) existsHistories = []
    else existsHistories = JSON.parse(existsCookies)
    return existsHistories
  }

  static addHistIntoCookies(cookieName: string, hist: string) {
    const existsHistories = GeneralTools.getHistInsideCookies(cookieName)
    if (existsHistories.length > 5)
      existsHistories.pop()
    if (existsHistories.includes(hist))
      return
    existsHistories.unshift(hist)
    Cookies.set(cookieName, JSON.stringify(existsHistories))
  }

  static removeHistInsideCookies(cookieName: string, hist: string) {
    const existsCookies: string | undefined = Cookies.get(cookieName)
    let existsHistories: string[]
    if (existsCookies === undefined) return
    else existsHistories = JSON.parse(existsCookies)

    const newHistories = existsHistories.filter(h => h !== hist)
    if (newHistories.length === 0) Cookies.remove(cookieName)
    else Cookies.set(cookieName, JSON.stringify(newHistories))
  }
  
  static reloadAfterDelay() {
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  }

  static floatNumberFormat(num: number) {
    return Number(num).toFixed(1);
  }
}