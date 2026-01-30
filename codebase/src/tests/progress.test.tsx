import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'

describe('Progress tracking', () => {
  it('shows progress when tasks are completed', async () => {
    render(<App />)

    await userEvent.type(screen.getByLabelText(/title/i), 'Stretch routine')
    await userEvent.type(screen.getByLabelText(/description/i), '10 minutes of mobility work')
    await userEvent.click(screen.getByRole('button', { name: /add task/i }))

    await userEvent.click(screen.getByRole('button', { name: /complete/i }))

    await userEvent.click(screen.getByRole('button', { name: /progress/i }))

    const todayCard = screen.getByText(/today/i).closest('.progress-card')
    if (!todayCard) {
      throw new Error('Unable to locate the Today progress card')
    }

    expect(within(todayCard).getByText(/100% on track/i)).toBeInTheDocument()
    expect(within(todayCard).getByText(/1 of 1 tasks completed/i)).toBeInTheDocument()
  })
})
