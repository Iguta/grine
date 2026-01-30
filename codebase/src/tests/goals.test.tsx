import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'

describe('Goal setting', () => {
  it('creates a goal and lists it under the correct section', async () => {
    render(<App />)

    await userEvent.click(screen.getByRole('button', { name: /goals/i }))

    await userEvent.type(screen.getByLabelText(/title/i), 'Read 12 books')
    await userEvent.type(screen.getByLabelText(/description/i), 'Finish one book each month')
    await userEvent.selectOptions(screen.getByLabelText(/goal horizon/i), 'yearly')

    await userEvent.click(screen.getByRole('button', { name: /add goal/i }))

    expect(screen.getByText('Read 12 books')).toBeInTheDocument()
    expect(screen.getByText(/finish one book each month/i)).toBeInTheDocument()
  })
})
