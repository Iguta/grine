import { useState, type ReactNode } from 'react'
import { AppLayout } from './components/AppLayout'
import { AppDataProvider } from './hooks/useAppData'
import { TasksPage } from './pages/TasksPage'
import { GoalsPage } from './pages/GoalsPage'
import { CalendarPage } from './pages/CalendarPage'
import { ProgressPage } from './pages/ProgressPage'
import './App.css'

const navItems = [
  { id: 'tasks', label: 'Tasks', description: 'Plan & prioritize' },
  { id: 'goals', label: 'Goals', description: 'Set intentions' },
  { id: 'calendar', label: 'Calendar', description: 'See the rhythm' },
  { id: 'progress', label: 'Progress', description: 'Track momentum' },
]

const pageMap: Record<string, ReactNode> = {
  tasks: <TasksPage />,
  goals: <GoalsPage />,
  calendar: <CalendarPage />,
  progress: <ProgressPage />,
}

function App() {
  const [activePage, setActivePage] = useState('tasks')

  return (
    <AppDataProvider>
      <AppLayout navItems={navItems} activeId={activePage} onNavigate={setActivePage}>
        {pageMap[activePage]}
      </AppLayout>
    </AppDataProvider>
  )
}

export default App
