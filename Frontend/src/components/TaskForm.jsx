import React, { useState, useContext } from 'react';
import { TextField, Button, MenuItem, Grid } from '@mui/material';
import { TaskContext } from '../context/taskContext';

const TaskForm = () => {
const { addTask } = useContext(TaskContext);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('pending');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const taskData = {
      title,
      description,
      status,
      priority,
      dueDate,
    };

    await addTask(taskData);

    // Clear the form
    setTitle('');
    setDescription('');
    setStatus('pending');
    setPriority('medium');
    setDueDate('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            required
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            required
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            select
            fullWidth
          >
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="in-progress">In Progress</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
          </TextField>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
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
            label="Due Date"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <Button variant="contained" color="primary" type="submit" fullWidth>
            Add Task
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default TaskForm;
