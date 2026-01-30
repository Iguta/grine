import { useMemo } from 'react'
import { useAppData } from '../hooks/useAppData'
import { ProgressRing } from '../components/ProgressRing'
import { calculateProgress } from '../utils/progress'
import { getEndOfMonth, getEndOfWeek, getEndOfYear, getStartOfMonth, getStartOfWeek, getStartOfYear } from '../utils/date'

export const ProgressPage = () => {
  const { tasks, goals } = useAppData()
  const today = new Date()

  const summaries = useMemo(() => {
    const dayStart = new Date(today)
    dayStart.setHours(0, 0, 0, 0)
    const dayEnd = new Date(today)
    dayEnd.setHours(23, 59, 59, 999)

    return [
      calculateProgress(tasks, dayStart, dayEnd, 'Today'),
      calculateProgress(tasks, getStartOfWeek(today), getEndOfWeek(today), 'This week'),
      calculateProgress(tasks, getStartOfMonth(today), getEndOfMonth(today), 'This month'),
      calculateProgress(tasks, getStartOfYear(today), getEndOfYear(today), 'This year'),
    ]
  }, [tasks])

  const goalCompletion = useMemo(() => {
    const total = goals.length
    const completed = goals.filter((goal) => goal.completed).length
    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100)
    return { total, completed, percentage }
  }, [goals])

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <h2>Progress Tracking</h2>
          <p>Measure momentum across your daily rhythm, weekly focus, and long-term growth.</p>
        </div>
      </div>

      <div className="grid-2">
        <div className="stack">
          {summaries.map((summary) => (
            <div key={summary.label} className="card progress-card">
              <div>
                <p className="card-meta">{summary.label}</p>
                <h3>{summary.percentage}% on track</h3>
                <p className="card-body">
                  {summary.completed} of {summary.total} tasks completed
                </p>
              </div>
              <ProgressRing value={summary.percentage} />
            </div>
          ))
        </div>

        <div className="stack">
          <div className="card highlight-card">
            <h3>Goal completion</h3>
            <p className="card-body">Keep long-term intentions front and center.</p>
            <div className="highlight-grid">
              <div>
                <span className="stat">{goalCompletion.total}</span>
                <p>Total goals</p>
              </div>
              <div>
                <span className="stat">{goalCompletion.completed}</span>
                <p>Completed</p>
              </div>
              <div>
                <span className="stat">{goalCompletion.percentage}%</span>
                <p>Completion</p>
              </div>
            </div>
          </div>

          <div className="card">
            <h3>Momentum insights</h3>
            <ul className="insight-list">
              <li>Prioritize high-impact tasks early in the day.</li>
              <li>Review weekly progress every Sunday evening.</li>
              <li>Align tasks with monthly goals to stay consistent.</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}