import React, { useState, useContext } from 'react';
import { 
  TextField, 
  Button, 
  MenuItem, 
  Grid, 
  Alert,
  Box
} from '@mui/material';
import { TaskContext } from '../context/taskContext';

const TaskForm = ({ onTaskAdded }) => {
  const { addTask } = useContext(TaskContext);
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    dueDate: '',
  });

  const handleChange = (e) => {
    setTaskData({
      ...taskData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSuccessMessage('');

    if (!taskData.title.trim()) {
      setFormError('Title is required');
      return;
    }

    try {
      await addTask(taskData);
      setSuccessMessage('Task added successfully!');
      // Reset form
      setTaskData({
        title: '',
        description: '',
        status: 'todo',
        priority: 'medium',
        dueDate: '',
      });
      // Notify parent component
      if (onTaskAdded) {
        onTaskAdded();
      }
    } catch (err) {
      setFormError('Failed to add task. Please try again.');
      console.error('Error adding task:', err);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Grid container spacing={2}>
        {formError && (
          <Grid item xs={12}>
            <Alert severity="error">{formError}</Alert>
          </Grid>
        )}
        {successMessage && (
          <Grid item xs={12}>
            <Alert severity="success">{successMessage}</Alert>
          </Grid>
        )}
        <Grid item xs={12}>
          <TextField
            name="title"
            label="Title"
            value={taskData.title}
            onChange={handleChange}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            name="description"
            label="Description"
            value={taskData.description}
            onChange={handleChange}
            fullWidth
            multiline
            rows={3}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            name="status"
            label="Status"
            value={taskData.status}
            onChange={handleChange}
            select
            fullWidth
          >
            <MenuItem value="todo">To Do</MenuItem>
            <MenuItem value="in-progress">In Progress</MenuItem>
            <MenuItem value="done">Done</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            name="priority"
            label="Priority"
            value={taskData.priority}
            onChange={handleChange}
            select
            fullWidth
          >
            <MenuItem value="low">Low</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="high">High</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12}>
          <TextField
            name="dueDate"
            label="Due Date"
            type="date"
            value={taskData.dueDate}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <Button 
            variant="contained" 
            color="primary" 
            type="submit" 
            fullWidth
            size="large"
          >
            Add Task
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TaskForm;