import React, { createContext, useReducer } from 'react';
import axios from 'axios';

// Create context
export const TaskContext = createContext();

// Initial state
const initialState = {
  tasks: [],
  loading: false,
  error: null,
};

// Reducer
const taskReducer = (state, action) => {
  switch (action.type) {
    case 'SET_TASKS':
      return { ...state, tasks: action.payload, loading: false };
    case 'ADD_TASK':
      return { ...state, tasks: [action.payload, ...state.tasks], loading: false };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task._id === action.payload._id ? action.payload : task
        ),
        loading: false,
      };
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter((task) => task._id !== action.payload._id),
        loading: false,
      };
    case 'SET_LOADING':
      return { ...state, loading: true };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

// Provider
export const TaskProvider = ({ children }) => {
  const [state, dispatch] = useReducer(taskReducer, initialState);
const API_URL = 'http://localhost:5000/api/tasks'; // Should NOT include /stats here
  // Get token from localStorage
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  // Get all tasks
  const getTasks = async () => {
    dispatch({ type: 'SET_LOADING' });
    try {
      const res = await axios.get(API_URL, getAuthHeaders());
      dispatch({ type: 'SET_TASKS', payload: res.data });
    } catch (err) {
      console.error('Error fetching tasks:', err.message);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch tasks' });
    }
  };

  // Add task
  const addTask = async (taskData) => {
    dispatch({ type: 'SET_LOADING' });
    try {
      const res = await axios.post(API_URL, taskData, getAuthHeaders());
      dispatch({ type: 'ADD_TASK', payload: res.data });
    } catch (err) {
      console.error('Error adding task:', err.message);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to add task' });
    }
  };

  // Update task
  const updateTask = async (id, updatedData) => {
    dispatch({ type: 'SET_LOADING' });
    try {
      const res = await axios.put(`${API_URL}/${id}`, updatedData, getAuthHeaders());
      dispatch({ type: 'UPDATE_TASK', payload: res.data });
    } catch (err) {
      console.error('Error updating task:', err.message);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update task' });
    }
  };

  // Delete task
  const deleteTask = async (id) => {
    dispatch({ type: 'SET_LOADING' });
    try {
      await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
      dispatch({ type: 'DELETE_TASK', payload: { _id: id } });
    } catch (err) {
      console.error('Error deleting task:', err.message);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to delete task' });
    }
  };
const getStatistics = async () => {
  try {
    const res = await axios.get(`${API_URL}/stats`, getAuthHeaders());
    return res.data;
  } catch (err) {
    console.error('Stats Error:', err.response?.data?.message || err.message);
    throw err; 
  }
};
const updateTaskStatus = async (id, newStatus) => {
  dispatch({ type: 'SET_LOADING' });
  try {
    const res = await axios.put(
      `${API_URL}/${id}`, 
      { status: newStatus },
      getAuthHeaders()
    );
    dispatch({ type: 'UPDATE_TASK', payload: res.data });
  } catch (err) {
    console.error('Error updating task status:', err.message);
    dispatch({ type: 'SET_ERROR', payload: 'Failed to update task status' });
  }
};

  return (
    <TaskContext.Provider
      value={{
        ...state,
        updateTaskStatus,
        getStatistics,
        getTasks,
        addTask,
        updateTask,
        deleteTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
