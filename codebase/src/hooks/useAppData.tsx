import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Category, Goal, Task } from '../types'
import { loadFromStorage, saveToStorage } from '../services/storageService'
import { createId } from '../utils/id'

interface AppState {
  tasks: Task[]
  goals: Goal[]
  categories: Category[]
  themes: string[]
}

interface AppDataContextValue extends AppState {
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  deleteTask: (id: string) => void
  addGoal: (goal: Omit<Goal, 'id' | 'createdAt'>) => void
  updateGoal: (id: string, updates: Partial<Goal>) => void
  deleteGoal: (id: string) => void
  addCategory: (name: string) => void
}

const defaultCategories: Category[] = [
  { id: 'cat_personal', name: 'Personal' },
  { id: 'cat_work', name: 'Work' },
  { id: 'cat_health', name: 'Health' },
]

const defaultThemes = ['Spiritual', 'Physical Fitness', 'Academics', 'Career', 'Relationships', 'Mindfulness']

const defaultState: AppState = {
  tasks: [],
  goals: [],
  categories: defaultCategories,
  themes: defaultThemes,
}

const AppDataContext = createContext<AppDataContextValue | null>(null)

export const AppDataProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AppState>(() => loadFromStorage(defaultState))

  const setStateAndSave = (updater: (prev: AppState) => AppState) => {
    setState((prev) => {
      const next = updater(prev)
      saveToStorage(next)
      return next
    })
  }

  const addTask = (task: Omit<Task, 'id' | 'createdAt'>) => {
    const nextTask: Task = {
      ...task,
      id: createId('task'),
      createdAt: new Date().toISOString(),
    }
    setStateAndSave((prev) => ({ ...prev, tasks: [nextTask, ...prev.tasks] }))
  }

  const updateTask = (id: string, updates: Partial<Task>) => {
    setStateAndSave((prev) => ({
      ...prev,
      tasks: prev.tasks.map((task) => (task.id === id ? { ...task, ...updates } : task)),
    }))
  }

  const deleteTask = (id: string) => {
    setStateAndSave((prev) => ({ ...prev, tasks: prev.tasks.filter((task) => task.id !== id) }))
  }

  const addGoal = (goal: Omit<Goal, 'id' | 'createdAt'>) => {
    const nextGoal: Goal = {
      ...goal,
      id: createId('goal'),
      createdAt: new Date().toISOString(),
    }
    setStateAndSave((prev) => ({ ...prev, goals: [nextGoal, ...prev.goals] }))
  }

  const updateGoal = (id: string, updates: Partial<Goal>) => {
    setStateAndSave((prev) => ({
      ...prev,
      goals: prev.goals.map((goal) => (goal.id === id ? { ...goal, ...updates } : goal)),
    }))
  }

  const deleteGoal = (id: string) => {
    setStateAndSave((prev) => ({ ...prev, goals: prev.goals.filter((goal) => goal.id !== id) }))
  }

  const addCategory = (name: string) => {
    if (!name.trim()) {
      return
    }
    setStateAndSave((prev) => {
      const exists = prev.categories.some((category) => category.name.toLowerCase() === name.trim().toLowerCase())
      if (exists) {
        return prev
      }
      const nextCategory: Category = { id: createId('cat'), name: name.trim() }
      return { ...prev, categories: [nextCategory, ...prev.categories] }
    })
  }

  const value = useMemo(
    () => ({
      ...state,
      addTask,
      updateTask,
      deleteTask,
      addGoal,
      updateGoal,
      deleteGoal,
      addCategory,
    }),
    [state],
  )

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
}

export const useAppData = () => {
  const context = useContext(AppDataContext)
  if (!context) {
    throw new Error('useAppData must be used within AppDataProvider')
  }
  return context
}
