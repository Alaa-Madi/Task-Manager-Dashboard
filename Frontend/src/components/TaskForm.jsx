import React, { useState, useContext } from 'react';
import { Box, TextField, Button, MenuItem, Grid } from '@mui/material';
import { TaskContext } from '../context/taskContext';

const TaskForm = () => {
  const { addTask } = useContext(TaskContext);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'todo',
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title) return;

    await addTask(formData);
    setFormData({ title: '', description: '', status: 'todo' });
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            name="title"
            label="Title"
            value={formData.title}
            onChange={handleChange}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            name="status"
            label="Status"
            select
            value={formData.status}
            onChange={handleChange}
            fullWidth
          >
            <MenuItem value="todo">To Do</MenuItem>
            <MenuItem value="in-progress">In Progress</MenuItem>
            <MenuItem value="done">Done</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12}>
          <TextField
            name="description"
            label="Description"
            value={formData.description}
            onChange={handleChange}
            fullWidth
            multiline
            rows={3}
          />
        </Grid>
        <Grid item xs={12}>
          <Button type="submit" variant="contained">
            Add Task
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TaskForm;
