import type { Task, ProgressSummary } from '../types'
import { isWithinRange, toDate } from './date'

export const calculateProgress = (tasks: Task[], start: Date, end: Date, label: string): ProgressSummary => {
  const filtered = tasks.filter((task) => {
    const due = toDate(task.dueDate)
    return isWithinRange(due, start, end)
  })

  const total = filtered.length
  const completed = filtered.filter((task) => task.completed).length
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100)

  return { label, total, completed, percentage }
}
