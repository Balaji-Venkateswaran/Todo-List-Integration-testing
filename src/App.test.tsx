import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import App from './App'

describe('Todo app integration', () => {
  it('shows the first load', () => {
    render(<App />)

    expect(screen.getByText('Todo List')).toBeInTheDocument()
    expect(screen.getByText('0 task(s)')).toBeInTheDocument()
    expect(
      screen.getByText('No tasks yet. Add one above.')
    ).toBeInTheDocument()
  })

  it('adds a todo and updates', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.type(screen.getByLabelText('New todo'), 'Test')
    await user.click(screen.getByRole('button', { name: 'Add' }))

    expect(screen.getByText('Test')).toBeInTheDocument()
    expect(screen.getByText('1 task(s)')).toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('shows validation errors and clears them on input', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'Add' }))

    expect(
      screen.getByText('Please enter a task before adding.')
    ).toBeInTheDocument()

    await user.type(screen.getByLabelText('New todo'), 'Plan trip')
        await user.click(screen.getByRole('button', { name: 'Add' }))

    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('rejects invalid characters', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.type(screen.getByLabelText('New todo'), '$@!!')
    await user.click(screen.getByRole('button', { name: 'Add' }))

    expect(
      screen.getByText('Only letters, numbers are allowed.')
    ).toBeInTheDocument()
  })

  it('deletes a todo only after confirmation', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.type(screen.getByLabelText('New todo'), 'Write tests')
    await user.click(screen.getByRole('button', { name: 'Add' }))

    const confirmSpy = vi
      .spyOn(window, 'confirm')
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(true)

    const deleteButton = screen.getByRole('button', { name: 'Delete' })
    await user.click(deleteButton)
    expect(screen.getByText('Write tests')).toBeInTheDocument()

    await user.click(deleteButton)
    expect(screen.queryByText('Write tests')).not.toBeInTheDocument()

    confirmSpy.mockRestore()
  })
})
