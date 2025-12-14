
export function checkOverDue(dateStr: string | undefined) {
  if (dateStr === undefined)
    return null
  const date = new Date(dateStr);
  const today = new Date();
  date.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  return today < date;
}

export function prettierDate(dateStr: string | undefined): string {
  if (dateStr === undefined)
    return ""

  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  };

  return date.toLocaleDateString('en-US', options);
}

export function prettierTime(timeStr: string | undefined): string {
  if (!timeStr) return "";

  const date = new Date(timeStr);
  const time = date.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return `${time} ${prettierDate(timeStr)}`;
}
