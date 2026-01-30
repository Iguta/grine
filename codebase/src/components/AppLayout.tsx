import type { ReactNode } from 'react'

interface NavItem {
  id: string
  label: string
  description: string
}

interface AppLayoutProps {
  navItems: NavItem[]
  activeId: string
  onNavigate: (id: string) => void
  children: ReactNode
}

export const AppLayout = ({ navItems, activeId, onNavigate, children }: AppLayoutProps) => {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <p className="app-eyebrow">Grine</p>
          <h1>Focus your energy with calm productivity.</h1>
          <p className="app-subtitle">Plan goals, manage tasks, and track progress with a mindful rhythm.</p>
        </div>
        <div className="app-header-actions">
          <div className="app-streak">
            <span className="app-streak-label">Daily focus</span>
            <strong>Small steps, every day</strong>
          </div>
        </div>
      </header>

      <nav className="app-nav">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`nav-pill ${activeId === item.id ? 'active' : ''}`}
            onClick={() => onNavigate(item.id)}
            type="button"
          >
            <span>{item.label}</span>
            <span className="nav-pill-desc">{item.description}</span>
          </button>
        ))}
      </nav>

      <main className="app-main">{children}</main>
    </div>
  )
}