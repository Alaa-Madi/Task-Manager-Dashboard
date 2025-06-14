import React, { useContext } from 'react';
import { Card, CardContent, Typography, Button, Stack } from '@mui/material';
import { TaskContext } from '../context/taskContext';

const TaskCard = ({ task }) => {
  const { deleteTask, updateTaskStatus } = useContext(TaskContext);

  return (
    <Card sx={{ mb: 2, borderLeft: `6px solid ${task.status === 'Done' ? 'green' : 'orange'}` }}>
      <CardContent>
        <Typography variant="h6">{task.title}</Typography>
        <Typography variant="body2" color="text.secondary">{task.description}</Typography>
        <Typography variant="caption" display="block">Status: {task.status}</Typography>
        <Stack direction="row" spacing={1} mt={2}>
          <Button variant="contained" size="small" onClick={() => updateTaskStatus(task._id)}>Update</Button>
          <Button variant="outlined" color="error" size="small" onClick={() => deleteTask(task._id)}>Delete</Button>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default TaskCard;

