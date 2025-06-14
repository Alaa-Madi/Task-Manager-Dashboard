// src/context/TaskState.js
import React, { useReducer } from 'react';
import taskReducer from './taskReducer';
import axios from 'axios';
import { TaskContext } from "../context/taskContext"; 

const TaskState = ({ children }) => {
  const initialState = {
    tasks: [],
    editingTask: null,
    loading: true,
    error: null,
  };

  const [state, dispatch] = useReducer(taskReducer, initialState);

  // Fetch all tasks from backend
  const fetchTasks = async () => {
    try {
      const res = await axios.get('/api/tasks');
      dispatch({ type: 'FETCH_TASKS_SUCCESS', payload: res.data });
    } catch (error) {
      dispatch({ type: 'TASK_ERROR', payload: error.response?.data?.message || error.message });
    }
  };

  // Add new task
  const addTask = async (task) => {
    try {
      const res = await axios.post('/api/tasks', task);
      dispatch({ type: 'ADD_TASK', payload: res.data });
    } catch (error) {
      dispatch({ type: 'TASK_ERROR', payload: error.response?.data?.message || error.message });
    }
  };

  // Update task
  const updateTask = async (task) => {
    try {
      const res = await axios.put(`/api/tasks/${task._id}`, task);
      dispatch({ type: 'UPDATE_TASK', payload: res.data });
    } catch (error) {
      dispatch({ type: 'TASK_ERROR', payload: error.response?.data?.message || error.message });
    }
  };

  // Delete task
  const deleteTask = async (id) => {
    try {
      await axios.delete(`/api/tasks/${id}`);
      dispatch({ type: 'DELETE_TASK', payload: id });
    } catch (error) {
      dispatch({ type: 'TASK_ERROR', payload: error.response?.data?.message || error.message });
    }
  };

  // Set editing task
  const setEditingTask = (task) => {
    dispatch({ type: 'SET_EDITING_TASK', payload: task });
  };

  // Clear editing task
  const clearEditingTask = () => {
    dispatch({ type: 'CLEAR_EDITING_TASK' });
  };

  return (
    <TaskContext.Provider
      value={{
        tasks: state.tasks,
        loading: state.loading,
        error: state.error,
        editingTask: state.editingTask,
        fetchTasks,
        addTask,
        updateTask,
        deleteTask,
        setEditingTask,
        clearEditingTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export default TaskState;
