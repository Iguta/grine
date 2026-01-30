import type { Task, Category } from '../types'
import { formatLongDate } from '../utils/date'

interface TaskCardProps {
  task: Task
  category?: Category
  onToggle: (id: string) => void
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
}

const priorityLabel: Record<Task['priority'], string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
}

export const TaskCard = ({ task, category, onToggle, onEdit, onDelete }: TaskCardProps) => {
  return (
    <article className={`card task-card ${task.completed ? 'completed' : ''}`}>
      <div className="card-header">
        <div>
          <h3>{task.title}</h3>
          <p className="card-meta">Due {formatLongDate(new Date(task.dueDate))}</p>
        </div>
        <span className={`badge badge-${task.priority}`}>{priorityLabel[task.priority]}</span>
      </div>
      <p className="card-body">{task.description}</p>
      <div className="card-footer">
        <div className="tag-group">
          <span className="tag">{category?.name ?? 'Uncategorized'}</span>
        </div>
        <div className="card-actions">
          <button type="button" className="ghost" onClick={() => onToggle(task.id)}>
            {task.completed ? 'Mark active' : 'Complete'}
          </button>
          <button type="button" className="ghost" onClick={() => onEdit(task)}>
            Edit
          </button>
          <button type="button" className="ghost danger" onClick={() => onDelete(task.id)}>
            Delete
          </button>
        </div>
      </div>
    </article>
  )
}