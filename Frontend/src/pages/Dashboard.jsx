import React, { useContext, useEffect } from 'react';
import { 
  Container, 
  Grid, 
  Typography, 
  Paper, 
  Box, 
  CircularProgress, 
  Alert, 
  Card, 
  CardContent,
  Divider,
  Chip,
  LinearProgress,
  useTheme
} from '@mui/material';
import { 
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Loop as LoopIcon,
  PriorityHigh as PriorityHighIcon,
  AccessTime as AccessTimeIcon,
  Assignment as AssignmentIcon
} from '@mui/icons-material';
import { TaskContext } from '../context/taskContext';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  const { tasks, getTasks, loading, error, statistics, useMockData } = useContext(TaskContext);
  const theme = useTheme();

  useEffect(() => {
    getTasks();
  }, []);

  const completionPercentage = statistics?.total > 0 
    ? Math.round((statistics.completed / statistics.total) * 100) 
    : 0;

  if (loading && tasks.length === 0) {
    return (
      <>
        <Navbar />
        <Container maxWidth="md" sx={{ mt: 4 }}>
          <Box display="flex" flexDirection="column" alignItems="center" my={8}>
            <CircularProgress size={60} />
            <Typography variant="h6" sx={{ mt: 2 }}>Loading tasks...</Typography>
          </Box>
        </Container>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" fontWeight="bold">Task Dashboard</Typography>
          {useMockData && (
            <Chip 
              label="Using Sample Data" 
              color="warning" 
              variant="outlined" 
              size="small"
            />
          )}
        </Box>

        {error && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={4} lg={2}>
            <Card elevation={2}>
              <CardContent sx={{ textAlign: 'center', py: 2 }}>
                <AssignmentIcon color="primary" sx={{ fontSize: 40 }} />
                <Typography variant="h5" fontWeight="bold" sx={{ mt: 1 }}>
                  {statistics?.total || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Tasks
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={2}>
            <Card elevation={2}>
              <CardContent sx={{ textAlign: 'center', py: 2 }}>
                <CheckCircleIcon sx={{ fontSize: 40, color: theme.palette.success.main }} />
                <Typography variant="h5" fontWeight="bold" sx={{ mt: 1 }}>
                  {statistics?.completed || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Completed
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={2}>
            <Card elevation={2}>
              <CardContent sx={{ textAlign: 'center', py: 2 }}>
                <LoopIcon sx={{ fontSize: 40, color: theme.palette.info.main }} />
                <Typography variant="h5" fontWeight="bold" sx={{ mt: 1 }}>
                  {statistics?.inProgress || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  In Progress
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={2}>
            <Card elevation={2}>
              <CardContent sx={{ textAlign: 'center', py: 2 }}>
                <PendingIcon sx={{ fontSize: 40, color: theme.palette.warning.main }} />
                <Typography variant="h5" fontWeight="bold" sx={{ mt: 1 }}>
                  {statistics?.pending || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Pending
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={2}>
            <Card elevation={2}>
              <CardContent sx={{ textAlign: 'center', py: 2 }}>
                <PriorityHighIcon sx={{ fontSize: 40, color: theme.palette.error.main }} />
                <Typography variant="h5" fontWeight="bold" sx={{ mt: 1 }}>
                  {statistics?.highPriority || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  High Priority
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={2}>
            <Card elevation={2}>
              <CardContent sx={{ textAlign: 'center', py: 2 }}>
                <AccessTimeIcon sx={{ fontSize: 40, color: theme.palette.secondary.main }} />
                <Typography variant="h5" fontWeight="bold" sx={{ mt: 1 }}>
                  {statistics?.dueSoon || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Due Soon
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="h6">Task Completion</Typography>
            <Typography variant="h6" fontWeight="bold">{completionPercentage}%</Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={completionPercentage} 
            sx={{ height: 10, borderRadius: 5 }}
          />
          <Box display="flex" justifyContent="space-between" mt={1}>
            <Typography variant="body2" color="text.secondary">
              {statistics?.completed || 0} of {statistics?.total || 0} tasks completed
            </Typography>
            {completionPercentage >= 80 ? (
              <Typography variant="body2" color="success.main">Great progress!</Typography>
            ) : completionPercentage >= 50 ? (
              <Typography variant="body2" color="info.main">Good progress</Typography>
            ) : (
              <Typography variant="body2" color="text.secondary">Keep going</Typography>
            )}
          </Box>
        </Paper>

        <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom>Add New Task</Typography>
          <TaskForm />
        </Paper>

        <Paper elevation={2} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>My Tasks</Typography>
          <Divider sx={{ mb: 3 }} />
          
          {tasks.length === 0 ? (
            <Box textAlign="center" py={4}>
              <Typography variant="body1" color="text.secondary">
                No tasks found. Create your first task above!
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={2}>
              {tasks.map((task) => (
                <Grid item xs={12} sm={6} key={task._id}>
                  <TaskCard task={task} />
                </Grid>
              ))}
            </Grid>
          )}
        </Paper>
      </Container>
    </>
  );
};

export default Dashboard;
