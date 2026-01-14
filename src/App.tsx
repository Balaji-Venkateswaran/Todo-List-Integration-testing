import { useState, type FormEvent } from 'react'
import './App.css'

type Todo = {
  id: number
  text: string
}

function App() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [text, setText] = useState('')
  const [error, setError] = useState('')

  const addTodo = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmed = text.trim()
    if (!trimmed) {
      setError('Please enter a task before adding.')
      return
    }
    if (!/^[A-Za-z0-9 ]+$/.test(trimmed)) {
      setError('Only letters, numbers are allowed.')
      return
    }
    setError('')
    const newTodo: Todo = { id: Date.now(), text: trimmed }
    setTodos((prev) => [newTodo, ...prev])
    setText('')
  }

  const deleteTodo = (todo: Todo) => {
    const ok = window.confirm(`Delete "${todo.text}"?`)
    if (!ok) {
      return
    }
    setTodos((prev) => prev.filter((item) => item.id !== todo.id))
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Todo List</h1>
      </header>

      <form className="todo-form" onSubmit={addTodo}>
        <input
          type="text"
          placeholder="Add a new task..."
          value={text}
          onChange={(event) => {
            setText(event.target.value)
            if (error) {
              setError('')
            }
          }}
          aria-label="New todo"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? 'todo-error' : undefined}
        />
        <button type="submit">Add</button>
      </form>
      {error ? (
        <div className="todo-error" id="todo-error" role="alert">
          {error}
        </div>
      ) : null}

      <div className="todo-summary">
        <span>{todos.length} task(s)</span>
      </div>

      <ul className="todo-list">
        {todos.length === 0 ? (
          <li className="todo-empty">No tasks yet. Add one above.</li>
        ) : (
          todos.map((todo) => (
            <li key={todo.id} className="todo-item">
              <span className="todo-text">{todo.text}</span>
              <button
                type="button"
                className="todo-delete"
                onClick={() => deleteTodo(todo)}
              >
                Delete
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  )
}

export default App
