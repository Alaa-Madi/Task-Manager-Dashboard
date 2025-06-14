import React, { createContext, useReducer } from 'react';
import axios from 'axios';

const initialState = {
  tasks: [],
  loading: false,
  error: null,
  statistics: {},
  useMockData: false,
};

const TaskContext = createContext();

const taskReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: true, error: null };
    case 'GET_TASKS_SUCCESS':
      return {
        ...state,
        loading: false,
        tasks: action.payload.tasks,
        statistics: action.payload.statistics,
      };
    case 'ADD_TASK_SUCCESS':
      return {
        ...state,
        tasks: [action.payload, ...state.tasks],
      };
    case 'SET_ERROR':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export const TaskProvider = ({ children }) => {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  const getTasks = async () => {
    try {
      dispatch({ type: 'SET_LOADING' });
      const res = await axios.get('/api/tasks');
      const tasks = res.data;
      const statistics = {
        total: tasks.length,
        completed: tasks.filter(t => t.status === 'done').length,
        inProgress: tasks.filter(t => t.status === 'in-progress').length,
        pending: tasks.filter(t => t.status === 'todo').length,
        highPriority: tasks.filter(t => t.priority === 'high').length,
        dueSoon: tasks.filter(t => {
          const due = new Date(t.dueDate);
          const now = new Date();
          return (due - now) / (1000 * 3600 * 24) <= 3;
        }).length,
      };
      dispatch({ type: 'GET_TASKS_SUCCESS', payload: { tasks, statistics } });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch tasks' });
    }
  };

  const addTask = async (task) => {
    try {
const res = await axios.post('http://localhost:5000/api/tasks', task);
      dispatch({ type: 'ADD_TASK_SUCCESS', payload: res.data });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to add task' });
    }
  };

  return (
    <TaskContext.Provider value={{ ...state, getTasks, addTask }}>
      {children}
    </TaskContext.Provider>
  );
};

export { TaskContext };
