import React, { useContext, useEffect } from 'react';
import { Container, Grid, Typography } from '@mui/material';
import { TaskContext } from '../context/taskContext';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  const { tasks, getTasks } = useContext(TaskContext);

  useEffect(() => {
    getTasks();
  }, []);

  return (
    <>
      <Navbar />
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>Dashboard</Typography>
        <TaskForm />
        <Grid container spacing={2}>
          {tasks.map((task) => (
            <Grid item xs={12} sm={6} key={task._id}>
              <TaskCard task={task} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
};

export default Dashboard;
