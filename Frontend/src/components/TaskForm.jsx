import React, { useState, useContext } from 'react';
import { Box, TextField, Button, Paper, Typography } from '@mui/material';
import { TaskContext } from '../context/taskContext';

const TaskForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const { createTask } = useContext(TaskContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    createTask({ title, description });
    setTitle('');
    setDescription('');
  };

  return (
    <Paper sx={{ p: 3, mb: 4 }} elevation={4}>
      <Typography variant="h6" gutterBottom>Create a Task</Typography>
      <Box component="form" onSubmit={handleSubmit} display="flex" flexDirection="column" gap={2}>
        <TextField
          label="Title"
          fullWidth
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          label="Description"
          multiline
          rows={3}
          fullWidth
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Button type="submit" variant="contained">Add Task</Button>
      </Box>
    </Paper>
  );
};

export default TaskForm;