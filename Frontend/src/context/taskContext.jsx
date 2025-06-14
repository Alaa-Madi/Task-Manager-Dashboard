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
  const API_URL = 'http://localhost:5000/api/tasks';

  // Get auth headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
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
      dispatch({ 
        type: 'SET_ERROR', 
        payload: err.response?.data?.message || 'Failed to fetch tasks' 
      });
    }
  };

  // Add task
  const addTask = async (taskData) => {
    dispatch({ type: 'SET_LOADING' });
    try {
      const res = await axios.post(API_URL, taskData, getAuthHeaders());
      dispatch({ type: 'ADD_TASK', payload: res.data });
      return res.data;
    } catch (err) {
      console.error('Error adding task:', err.message);
      dispatch({ 
        type: 'SET_ERROR', 
        payload: err.response?.data?.message || 'Failed to add task' 
      });
      throw err;
    }
  };

  // Update task
  const updateTask = async (id, updatedData) => {
    dispatch({ type: 'SET_LOADING' });
    try {
      const res = await axios.put(`${API_URL}/${id}`, updatedData, getAuthHeaders());
      dispatch({ type: 'UPDATE_TASK', payload: res.data });
      return res.data;
    } catch (err) {
      console.error('Error updating task:', err.message);
      dispatch({ 
        type: 'SET_ERROR', 
        payload: err.response?.data?.message || 'Failed to update task' 
      });
      throw err;
    }
  };

  // Update task status
  const updateTaskStatus = async (id, newStatus) => {
    return updateTask(id, { status: newStatus });
  };

  // Delete task
  const deleteTask = async (id) => {
    dispatch({ type: 'SET_LOADING' });
    try {
      await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
      dispatch({ type: 'DELETE_TASK', payload: { _id: id } });
    } catch (err) {
      console.error('Error deleting task:', err.message);
      dispatch({ 
        type: 'SET_ERROR', 
        payload: err.response?.data?.message || 'Failed to delete task' 
      });
      throw err;
    }
  };

  // Get statistics
  const getStatistics = async () => {
    try {
      const res = await axios.get(`${API_URL}/stats`, getAuthHeaders());
      return res.data;
    } catch (err) {
      console.error('Error fetching statistics:', err.message);
      throw err;
    }
  };

  return (
    <TaskContext.Provider
      value={{
        ...state,
        getTasks,
        addTask,
        updateTask,
        updateTaskStatus,
        deleteTask,
        getStatistics
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};