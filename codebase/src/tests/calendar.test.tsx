import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'

describe('Calendar view', () => {
  it('adds a task for the selected day and displays it in the daily list', async () => {
    render(<App />)

    await userEvent.click(screen.getByRole('button', { name: /calendar/i }))

    await userEvent.type(screen.getByLabelText(/title/i), 'Meditation session')
    await userEvent.type(screen.getByLabelText(/description/i), '15 minutes of mindful breathing')
    await userEvent.click(screen.getByRole('button', { name: /add task/i }))

    expect(screen.getByText('Meditation session')).toBeInTheDocument()
    expect(screen.getByText(/15 minutes of mindful breathing/i)).toBeInTheDocument()
  })
})
