import { useMemo, useState, type FormEvent } from 'react'
import { useAppData } from '../hooks/useAppData'
import { GoalCard } from '../components/GoalCard'
import { EmptyState } from '../components/EmptyState'
import type { Goal, GoalType } from '../types'

const getTodayInputValue = () => new Date().toISOString().split('T')[0]

export const GoalsPage = () => {
  const { goals, categories, themes, addGoal, updateGoal, deleteGoal, addCategory } = useAppData()
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null)
  const [categoryInput, setCategoryInput] = useState('')
  const [formState, setFormState] = useState({
    title: '',
    description: '',
    goalType: 'monthly' as GoalType,
    theme: themes[0] ?? 'Personal',
    categoryId: 'all',
    targetDate: getTodayInputValue(),
  })

  const resetForm = () => {
    setFormState({
      title: '',
      description: '',
      goalType: 'monthly',
      theme: themes[0] ?? 'Personal',
      categoryId: 'all',
      targetDate: getTodayInputValue(),
    })
    setEditingGoal(null)
  }

  const groupedGoals = useMemo(() => {
    const initial: Record<GoalType, Goal[]> = { daily: [], monthly: [], yearly: [] }
    return goals.reduce((acc, goal) => {
      acc[goal.goalType].push(goal)
      return acc
    }, initial)
  }, [goals])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!formState.title.trim() || !formState.description.trim()) {
      return
    }

    const payload = {
      title: formState.title.trim(),
      description: formState.description.trim(),
      goalType: formState.goalType,
      theme: formState.theme,
      categoryId: formState.categoryId === 'all' ? null : formState.categoryId,
      targetDate: formState.targetDate,
      completed: editingGoal?.completed ?? false,
    }

    if (editingGoal) {
      updateGoal(editingGoal.id, payload)
    } else {
      addGoal(payload)
    }
    resetForm()
  }

  const handleEdit = (goal: Goal) => {
    setEditingGoal(goal)
    setFormState({
      title: goal.title,
      description: goal.description,
      goalType: goal.goalType,
      theme: goal.theme,
      categoryId: goal.categoryId ?? 'all',
      targetDate: goal.targetDate,
    })
  }

  const handleAddCategory = () => {
    addCategory(categoryInput)
    setCategoryInput('')
  }

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <h2>Goal Setting</h2>
          <p>Define long-term visions, break them down, and celebrate every step.</p>
        </div>
      </div>

      <div className="grid-2">
        <div className="stack">
          <form className="card form-card" onSubmit={handleSubmit}>
            <div className="card-header">
              <h3>{editingGoal ? 'Edit goal' : 'Create a goal'}</h3>
              <p className="card-meta">Plan with intention across daily, monthly, and yearly horizons.</p>
            </div>
            <label>
              Title
              <input
                value={formState.title}
                onChange={(event) => setFormState((prev) => ({ ...prev, title: event.target.value }))}
                placeholder="Write a motivating goal"
                required
              />
            </label>
            <label>
              Description
              <textarea
                value={formState.description}
                onChange={(event) => setFormState((prev) => ({ ...prev, description: event.target.value }))}
                rows={3}
                placeholder="Add a short description"
                required
              />
            </label>
            <div className="form-row">
              <label>
                Goal horizon
                <select
                  value={formState.goalType}
                  onChange={(event) => setFormState((prev) => ({ ...prev, goalType: event.target.value as GoalType }))}
                >
                  <option value="daily">Daily</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </label>
              <label>
                Target date
                <input
                  type="date"
                  value={formState.targetDate}
                  onChange={(event) => setFormState((prev) => ({ ...prev, targetDate: event.target.value }))}
                />
              </label>
            </div>
            <div className="form-row">
              <label>
                Theme
                <select
                  value={formState.theme}
                  onChange={(event) => setFormState((prev) => ({ ...prev, theme: event.target.value }))}
                >
                  {themes.map((theme) => (
                    <option key={theme} value={theme}>
                      {theme}
                    </option>
                  ))}
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
                {editingGoal ? 'Save changes' : 'Add goal'}
              </button>
              {editingGoal ? (
                <button type="button" className="ghost" onClick={resetForm}>
                  Cancel
                </button>
              ) : null}
            </div>
          </form>

          <div className="card">
            <div className="card-header">
              <h3>Categories</h3>
              <p className="card-meta">Create custom tags to keep tasks and goals aligned.</p>
            </div>
            <div className="form-row">
              <input
                value={categoryInput}
                onChange={(event) => setCategoryInput(event.target.value)}
                placeholder="Add a category"
              />
              <button type="button" className="primary" onClick={handleAddCategory}>
                Add
              </button>
            </div>
            <div className="tag-group">
              {categories.map((category) => (
                <span key={category.id} className="tag">
                  {category.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="stack">
          {(['daily', 'monthly', 'yearly'] as GoalType[]).map((type) => (
            <div key={type} className="stack">
              <div className="section-header">
                <h3>{type.charAt(0).toUpperCase() + type.slice(1)} goals</h3>
                <span className="section-count">{groupedGoals[type].length} goals</span>
              </div>
              {groupedGoals[type].length === 0 ? (
                <EmptyState title="No goals yet" description="Create a goal to start building momentum." />
              ) : (
                groupedGoals[type].map((goal) => (
                  <GoalCard
                    key={goal.id}
                    goal={goal}
                    category={categories.find((category) => category.id === goal.categoryId)}
                    onToggle={(id) => updateGoal(id, { completed: !goal.completed })}
                    onEdit={handleEdit}
                    onDelete={deleteGoal}
                  />
                ))
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}