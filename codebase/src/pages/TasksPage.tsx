import { useMemo, useState, type FormEvent } from 'react'
import { useAppData } from '../hooks/useAppData'
import { TaskCard } from '../components/TaskCard'
import { EmptyState } from '../components/EmptyState'
import type { Task } from '../types'

const priorityWeight: Record<Task['priority'], number> = { low: 1, medium: 2, high: 3 }

const getTodayInputValue = () => new Date().toISOString().split('T')[0]

export const TasksPage = () => {
  const { tasks, categories, addTask, updateTask, deleteTask } = useAppData()
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed'>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [formState, setFormState] = useState({
    title: '',
    description: '',
    dueDate: getTodayInputValue(),
    priority: 'medium' as Task['priority'],
    categoryId: 'all',
  })

  const resetForm = () => {
    setFormState({
      title: '',
      description: '',
      dueDate: getTodayInputValue(),
      priority: 'medium',
      categoryId: 'all',
    })
    setEditingTask(null)
  }

  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        if (statusFilter === 'active') return !task.completed
        if (statusFilter === 'completed') return task.completed
        return true
      })
      .filter((task) => (categoryFilter === 'all' ? true : task.categoryId === categoryFilter))
      .sort((a, b) => {
        const priorityDiff = priorityWeight[b.priority] - priorityWeight[a.priority]
        if (priorityDiff !== 0) return priorityDiff
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      })
  }, [tasks, statusFilter, categoryFilter])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!formState.title.trim() || !formState.description.trim()) {
      return
    }

    const payload = {
      title: formState.title.trim(),
      description: formState.description.trim(),
      dueDate: formState.dueDate,
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
      dueDate: task.dueDate,
      priority: task.priority,
      categoryId: task.categoryId ?? 'all',
    })
  }

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <h2>Task Management</h2>
          <p>Capture tasks, prioritize focus, and keep your day moving with clarity.</p>
        </div>
        <div className="filter-group">
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as typeof statusFilter)}>
            <option value="all">All tasks</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
          <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
            <option value="all">All categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid-2">
        <form className="card form-card" onSubmit={handleSubmit}>
          <div className="card-header">
            <h3>{editingTask ? 'Edit task' : 'Add a new task'}</h3>
            <p className="card-meta">Define what needs attention and when.</p>
          </div>
          <label>
            Title
            <input
              value={formState.title}
              onChange={(event) => setFormState((prev) => ({ ...prev, title: event.target.value }))}
              placeholder="Write a focused task"
              required
            />
          </label>
          <label>
            Description
            <textarea
              value={formState.description}
              onChange={(event) => setFormState((prev) => ({ ...prev, description: event.target.value }))}
              placeholder="Add a short description"
              rows={3}
              required
            />
          </label>
          <div className="form-row">
            <label>
              Due date
              <input
                type="date"
                value={formState.dueDate}
                onChange={(event) => setFormState((prev) => ({ ...prev, dueDate: event.target.value }))}
              />
            </label>
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
          </div>
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
          <div className="form-actions">
            <button type="submit" className="primary">
              {editingTask ? 'Save changes' : 'Add task'}
            </button>
            {editingTask ? (
              <button type="button" className="ghost" onClick={resetForm}>
                Cancel
              </button>
            ) : null}
          </div>
        </form>

        <div className="stack">
          {filteredTasks.length === 0 ? (
            <EmptyState title="No tasks yet" description="Add a task to begin shaping your schedule." />
          ) : (
            filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                category={categories.find((category) => category.id === task.categoryId)}
                onToggle={(id) => updateTask(id, { completed: !task.completed })}
                onEdit={handleEdit}
                onDelete={deleteTask}
              />
            ))
          )}
        </div>
      </div>
    </section>
  )
}