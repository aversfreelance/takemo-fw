const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export type CalendarDay = {
  date: Date
  key: string
  weekday: string
  label: string
  weekend: boolean
}

export function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

export function formatKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

export function getVisibleDays(offset: number, count = 10): CalendarDay[] {
  const today = startOfDay(new Date())
  return Array.from({ length: count }, (_, index) => {
    const date = new Date(today)
    date.setDate(today.getDate() + 1 + offset + index)
    const weekdayIndex = date.getDay()
    return {
      date,
      key: formatKey(date),
      weekday: DAY_NAMES[weekdayIndex],
      label: `${MONTHS[date.getMonth()]} ${String(date.getDate()).padStart(2, '0')}`,
      weekend: weekdayIndex === 0 || weekdayIndex === 6,
    }
  })
}

export function slotStatus(day: CalendarDay, hour: string) {
  if (day.weekend) return 'closed' as const
  if (hour === '09:00–10:00') return 'meeting' as const
  if (hour === '12:00–13:00') return 'lunch' as const
  return 'open' as const
}
