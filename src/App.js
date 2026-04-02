import { useEffect, useState } from "react";
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { GiNotebook } from "react-icons/gi";
import "./App.css";

const STORAGE_KEY = "todos:v1";

function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");
  const [editId, setEditId] = useState(null);

  // --- Load from localStorage once (on mount)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setTodos(parsed);
          toast.info("📦 Restored your last list", { theme: "colored" });
        }
      }
    } catch (e) {
      console.error("Failed to read todos from localStorage:", e);
    }
  }, []);

  // --- Save to localStorage whenever todos change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch (e) {
      console.error("Failed to save todos to localStorage:", e);
      toast.error("⚠️ Couldn't save to your browser storage.", { theme: "colored" });
    }
  }, [todos]);

  // Add or Edit task
  const handleAddOrEdit = () => {
    if (!text.trim()) return;

    if (editId) {
      setTodos(todos.map(todo => (todo.id === editId ? { ...todo, text } : todo)));
      toast.info("✏️ Task updated!", { icon: "✏️", theme: "colored" });
      setEditId(null);
    } else {
      setTodos([...todos, { id: Date.now(), text, completed: false }]);
      toast.success("✅ Task added!", { icon: "✅", theme: "colored" });
    }
    setText("");
  };

  // Edit task
  const handleEdit = (todo) => {
    setText(todo.text);
    setEditId(todo.id);
  };

  // Delete task
  const handleDelete = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
    toast.error("🗑️ Task deleted!", { icon: "🗑️", theme: "colored" });
  };

  // Toggle completion
  const toggleComplete = (id) => {
    setTodos(
      todos.map(todo => {
        if (todo.id === id) {
          const updatedTodo = { ...todo, completed: !todo.completed };
          if (updatedTodo.completed) {
            toast.success(`🎉 "${updatedTodo.text}" completed!`, { theme: "colored" });
          } else {
            toast.info(`🔄 "${updatedTodo.text}" marked incomplete.`, { theme: "colored" });
          }
          return updatedTodo;
        }
        return todo;
      })
    );
  };

  return (
    <div className="app">
      <div className="todo-card">
        <h1><GiNotebook /> To-Do List</h1>

        <div className="input-box">
          <input
            type="text"
            placeholder="Add a task..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddOrEdit()}
          />
          <button onClick={handleAddOrEdit}>{editId ? "Update" : "Add"}</button>
        </div>

        <ul>
          {todos.map(todo => (
            <li key={todo.id} className={todo.completed ? "done" : ""}>
              <span onClick={() => toggleComplete(todo.id)}>{todo.text}</span>

              <div className="actions">
                <button onClick={() => handleEdit(todo)} ><FaEdit /></button>
                <button onClick={() => handleDelete(todo.id)}><MdDelete /></button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        transition={Slide}
      />
    </div>
  );
}

export default App;
