export type Priority = 'low' | 'medium' | 'high'

export type GoalType = 'daily' | 'monthly' | 'yearly'

export interface Category {
  id: string
  name: string
}

export interface Task {
  id: string
  title: string
  description: string
  dueDate: string
  priority: Priority
  categoryId: string | null
  completed: boolean
  createdAt: string
}

export interface Goal {
  id: string
  title: string
  description: string
  goalType: GoalType
  theme: string
  categoryId: string | null
  targetDate: string
  completed: boolean
  createdAt: string
}

export interface ProgressSummary {
  label: string
  total: number
  completed: number
  percentage: number
}
