import type { Goal, Category } from '../types'
import { formatLongDate } from '../utils/date'

interface GoalCardProps {
  goal: Goal
  category?: Category
  onToggle: (id: string) => void
  onEdit: (goal: Goal) => void
  onDelete: (id: string) => void
}

export const GoalCard = ({ goal, category, onToggle, onEdit, onDelete }: GoalCardProps) => {
  return (
    <article className={`card goal-card ${goal.completed ? 'completed' : ''}`}>
      <div className="card-header">
        <div>
          <h3>{goal.title}</h3>
          <p className="card-meta">Target {formatLongDate(new Date(goal.targetDate))}</p>
        </div>
        <span className="badge badge-soft">{goal.theme}</span>
      </div>
      <p className="card-body">{goal.description}</p>
      <div className="card-footer">
        <div className="tag-group">
          <span className="tag">{goal.goalType.toUpperCase()}</span>
          <span className="tag">{category?.name ?? 'Uncategorized'}</span>
        </div>
        <div className="card-actions">
          <button type="button" className="ghost" onClick={() => onToggle(goal.id)}>
            {goal.completed ? 'Reopen' : 'Complete'}
          </button>
          <button type="button" className="ghost" onClick={() => onEdit(goal)}>
            Edit
          </button>
          <button type="button" className="ghost danger" onClick={() => onDelete(goal.id)}>
            Delete
          </button>
        </div>
      </div>
    </article>
  )
}