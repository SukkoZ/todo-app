import React from "react";

const TodoItem = ({ todo, deleteTodo, toggleComplete }) => {
  return (
    <div className={`todo-item ${todo.completed ? "completed" : ""}`}>
      <span onClick={() => toggleComplete(todo.id)}>{todo.text}</span>
      <button onClick={() => deleteTodo(todo.id)}>❌</button>
    </div>
  );
};

export default TodoItem;
