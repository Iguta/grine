import { useMemo, useState, type FormEvent } from 'react'
import { useAppData } from '../hooks/useAppData'
import type { Task } from '../types'
import { formatMonthYear, formatShortDate, getCalendarDays, isSameDay, toDate } from '../utils/date'
import { EmptyState } from '../components/EmptyState'

const getDateInputValue = (date: Date) => date.toISOString().split('T')[0]

export const CalendarPage = () => {
  const { tasks, categories, addTask, updateTask, deleteTask } = useAppData()
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [formState, setFormState] = useState({
    title: '',
    description: '',
    priority: 'medium' as Task['priority'],
    categoryId: 'all',
  })

  const calendarDays = useMemo(() => getCalendarDays(currentMonth), [currentMonth])

  const tasksByDay = useMemo(() => {
    const map = new Map<string, Task[]>()
    tasks.forEach((task) => {
      const key = getDateInputValue(toDate(task.dueDate))
      map.set(key, [...(map.get(key) ?? []), task])
    })
    return map
  }, [tasks])

  const selectedKey = getDateInputValue(selectedDate)
  const tasksForSelectedDay = tasksByDay.get(selectedKey) ?? []

  const handleMonthChange = (offset: number) => {
    const next = new Date(currentMonth)
    next.setMonth(next.getMonth() + offset)
    setCurrentMonth(next)
  }

  const resetForm = () => {
    setFormState({
      title: '',
      description: '',
      priority: 'medium',
      categoryId: 'all',
    })
    setEditingTask(null)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!formState.title.trim() || !formState.description.trim()) {
      return
    }

    const payload = {
      title: formState.title.trim(),
      description: formState.description.trim(),
      dueDate: getDateInputValue(selectedDate),
      priority: formState.priority,
      categoryId: formState.categoryId === 'all' ? null : formState.categoryId,
      completed: editingTask?.completed ?? false,
    }

    if (editingTask) {
      updateTask(editingTask.id, payload)
    } else {
      addTask(payload)
    }

    resetForm()
  }

  const handleEdit = (task: Task) => {
    setEditingTask(task)
    setFormState({
      title: task.title,
      description: task.description,
      priority: task.priority,
      categoryId: task.categoryId ?? 'all',
    })
  }

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <h2>Calendar View</h2>
          <p>See your tasks laid out by date and focus on each day with clarity.</p>
        </div>
      </div>

      <div className="calendar-layout">
        <div className="card calendar-card">
          <div className="calendar-header">
            <button type="button" className="ghost" onClick={() => handleMonthChange(-1)}>
              Previous
            </button>
            <h3>{formatMonthYear(currentMonth)}</h3>
            <button type="button" className="ghost" onClick={() => handleMonthChange(1)}>
              Next
            </button>
          </div>
          <div className="calendar-grid">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <span key={day} className="calendar-day-label">
                {day}
              </span>
            ))}
            {calendarDays.map((day) => {
              const key = getDateInputValue(day)
              const dayTasks = tasksByDay.get(key) ?? []
              const isCurrentMonth = day.getMonth() === currentMonth.getMonth()
              const isSelected = isSameDay(day, selectedDate)
              return (
                <button
                  type="button"
                  key={key}
                  className={`calendar-day ${isSelected ? 'selected' : ''} ${!isCurrentMonth ? 'muted' : ''}`}
                  onClick={() => setSelectedDate(day)}
                >
                  <span className="calendar-date">{day.getDate()}</span>
                  {dayTasks.length > 0 ? (
                    <span className="calendar-count">{dayTasks.length} tasks</span>
                  ) : (
                    <span className="calendar-count muted">Open</span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        <div className="stack">
          <form className="card form-card" onSubmit={handleSubmit}>
            <div className="card-header">
              <h3>{editingTask ? 'Edit task' : 'Add task for the day'}</h3>
              <p className="card-meta">{formatShortDate(selectedDate)} · keep the day focused.</p>
            </div>
            <label>
              Title
              <input
                value={formState.title}
                onChange={(event) => setFormState((prev) => ({ ...prev, title: event.target.value }))}
                placeholder="Daily task"
                required
              />
            </label>
            <label>
              Description
              <textarea
                value={formState.description}
                onChange={(event) => setFormState((prev) => ({ ...prev, description: event.target.value }))}
                rows={3}
                placeholder="Add more detail"
                required
              />
            </label>
            <div className="form-row">
              <label>
                Priority
                <select
                  value={formState.priority}
                  onChange={(event) => setFormState((prev) => ({ ...prev, priority: event.target.value as Task['priority'] }))}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </label>
              <label>
                Category
                <select
                  value={formState.categoryId}
                  onChange={(event) => setFormState((prev) => ({ ...prev, categoryId: event.target.value }))}
                >
                  <option value="all">Uncategorized</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="form-actions">
              <button type="submit" className="primary">
                {editingTask ? 'Save task' : 'Add task'}
              </button>
              {editingTask ? (
                <button type="button" className="ghost" onClick={resetForm}>
                  Cancel
                </button>
              ) : null}
            </div>
          </form>

          <div className="stack">
            <div className="section-header">
              <h3>Tasks on {formatShortDate(selectedDate)}</h3>
              <span className="section-count">{tasksForSelectedDay.length} tasks</span>
            </div>
            {tasksForSelectedDay.length === 0 ? (
              <EmptyState title="No tasks yet" description="Use the form above to add a task for this day." />
            ) : (
              tasksForSelectedDay.map((task) => (
                <article key={task.id} className={`card task-card ${task.completed ? 'completed' : ''}`}>
                  <div className="card-header">
                    <div>
                      <h3>{task.title}</h3>
                      <p className="card-meta">{task.description}</p>
                    </div>
                    <span className={`badge badge-${task.priority}`}>{task.priority}</span>
                  </div>
                  <div className="card-footer">
                    <div className="tag-group">
                      <span className="tag">{categories.find((category) => category.id === task.categoryId)?.name ?? 'Uncategorized'}</span>
                    </div>
                    <div className="card-actions">
                      <button type="button" className="ghost" onClick={() => updateTask(task.id, { completed: !task.completed })}>
                        {task.completed ? 'Reopen' : 'Complete'}
                      </button>
                      <button type="button" className="ghost" onClick={() => handleEdit(task)}>
                        Edit
                      </button>
                      <button type="button" className="ghost danger" onClick={() => deleteTask(task.id)}>
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  )
}