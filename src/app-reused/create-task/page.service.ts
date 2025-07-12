
export class CreateTaskPageValidators {
  
  static isValidDeadline(value: string): string {
    if (!value) return "Date is required";
    const inputDate = new Date(value);
    const today = new Date();
    inputDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    if (inputDate < today) return "Date must be in current or future";
    return "";
  }

  static isValidDescription(desc: string): string {
    return desc.trim().length === 0
      ? "Description can't be empty"
      : "";
  }
}