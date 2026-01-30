export const toDate = (value: string | Date) => (value instanceof Date ? value : new Date(value))

export const startOfDay = (date: Date) => {
  const next = new Date(date)
  next.setHours(0, 0, 0, 0)
  return next
}

export const endOfDay = (date: Date) => {
  const next = new Date(date)
  next.setHours(23, 59, 59, 999)
  return next
}

export const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()

export const formatShortDate = (date: Date) =>
  date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })

export const formatLongDate = (date: Date) =>
  date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })

export const formatMonthYear = (date: Date) =>
  date.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })

export const isWithinRange = (value: Date, start: Date, end: Date) =>
  value.getTime() >= start.getTime() && value.getTime() <= end.getTime()

export const getStartOfWeek = (date: Date) => {
  const next = new Date(date)
  const day = next.getDay()
  const diff = next.getDate() - day
  next.setDate(diff)
  return startOfDay(next)
}

export const getEndOfWeek = (date: Date) => {
  const start = getStartOfWeek(date)
  const end = new Date(start)
  end.setDate(end.getDate() + 6)
  return endOfDay(end)
}

export const getStartOfMonth = (date: Date) => {
  const next = new Date(date.getFullYear(), date.getMonth(), 1)
  return startOfDay(next)
}

export const getEndOfMonth = (date: Date) => {
  const next = new Date(date.getFullYear(), date.getMonth() + 1, 0)
  return endOfDay(next)
}

export const getStartOfYear = (date: Date) => startOfDay(new Date(date.getFullYear(), 0, 1))

export const getEndOfYear = (date: Date) => endOfDay(new Date(date.getFullYear(), 11, 31))

export const getCalendarDays = (date: Date) => {
  const start = getStartOfMonth(date)
  const end = getEndOfMonth(date)
  const startDay = start.getDay()
  const endDay = end.getDay()
  const calendarStart = new Date(start)
  calendarStart.setDate(start.getDate() - startDay)
  const calendarEnd = new Date(end)
  calendarEnd.setDate(end.getDate() + (6 - endDay))

  const days: Date[] = []
  const cursor = new Date(calendarStart)
  while (cursor <= calendarEnd) {
    days.push(new Date(cursor))
    cursor.setDate(cursor.getDate() + 1)
  }
  return days
}
