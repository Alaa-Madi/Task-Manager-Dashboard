// src/context/taskContext.jsx
import { createContext, useContext, useReducer } from "react";

export const TaskContext = createContext();

const initialState = {
  tasks: [],
};

function taskReducer(state, action) {
  switch (action.type) {
    case "SET_TASKS":
      return { ...state, tasks: action.payload };
    case "ADD_TASK":
      return { ...state, tasks: [action.payload, ...state.tasks] };
    case "DELETE_TASK":
      return {
        ...state,
        tasks: state.tasks.filter((task) => task._id !== action.payload._id),
      };
    default:
      return state;
  }
}

export function TaskProvider({ children }) {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  return (
    <TaskContext.Provider value={{ ...state, dispatch }}>
      {children}
    </TaskContext.Provider>
  );
}
