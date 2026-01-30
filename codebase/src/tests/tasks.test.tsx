import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'

describe('Task management', () => {
  it('adds a new task and shows it in the list', async () => {
    render(<App />)

    await userEvent.type(screen.getByLabelText(/title/i), 'Prepare weekly plan')
    await userEvent.type(screen.getByLabelText(/description/i), 'Outline key priorities and blockers')

    await userEvent.click(screen.getByRole('button', { name: /add task/i }))

    expect(screen.getByText('Prepare weekly plan')).toBeInTheDocument()
    expect(screen.getByText(/outline key priorities/i)).toBeInTheDocument()
  })
})
