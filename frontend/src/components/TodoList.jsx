import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api/todos"; // Backend API URL

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");

  // Fetch todos from backend
  useEffect(() => {
    axios.get(API_URL)
      .then(res => setTodos(res.data))
      .catch(err => console.error("Error fetching todos:", err));
  }, []);

  // Add a new todo
  const addTodo = () => {
    if (!title) return;
    axios.post(API_URL, { title })
      .then(res => setTodos([...todos, res.data]))
      .catch(err => console.error("Error adding todo:", err));
    setTitle(""); // Clear input
  };

  // Delete a todo
  const deleteTodo = (id) => {
    axios.delete(`${API_URL}/${id}`)
      .then(() => setTodos(todos.filter(todo => todo._id !== id)))
      .catch(err => console.error("Error deleting todo:", err));
  };

  // Toggle completion status
  const toggleComplete = (id, completed) => {
    axios.put(`${API_URL}/${id}`, { completed: !completed })
      .then(res => {
        setTodos(todos.map(todo => (todo._id === id ? res.data : todo)));
      })
      .catch(err => console.error("Error updating todo:", err));
  };

  // Start editing a todo
  const startEditing = (todo) => {
    setEditingId(todo._id);
    setEditingTitle(todo.title);
  };

  // Save updated todo
  const saveEdit = (id) => {
    axios.put(`${API_URL}/${id}`, { title: editingTitle })
      .then(res => {
        setTodos(todos.map(todo => (todo._id === id ? res.data : todo)));
        setEditingId(null);
      })
      .catch(err => console.error("Error updating todo:", err));
  };

  return (
    <div>
      <h2>TODO List</h2>
      <input 
        type="text" 
        value={title} 
        onChange={(e) => setTitle(e.target.value)} 
        placeholder="Enter a new task"
      />
      <button onClick={addTodo}>Add</button>
      <ul>
        {todos.map(todo => (
          <li key={todo._id} style={{ textDecoration: todo.completed ? "line-through" : "none" }}>
            {editingId === todo._id ? (
              <>
                <input 
                  type="text" 
                  value={editingTitle} 
                  onChange={(e) => setEditingTitle(e.target.value)}
                />
                <button onClick={() => saveEdit(todo._id)}>Save</button>
              </>
            ) : (
              <>
                {todo.title}
                <button onClick={() => toggleComplete(todo._id, todo.completed)}>✔</button>
                <button onClick={() => startEditing(todo)}>✏</button>
                <button onClick={() => deleteTodo(todo._id)}>❌</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
