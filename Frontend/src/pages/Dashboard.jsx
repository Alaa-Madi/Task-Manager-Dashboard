import React, { useState, useEffect, useContext } from 'react';
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
  useTheme,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem
} from '@mui/material';
import { 
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Loop as LoopIcon,
  PriorityHigh as PriorityHighIcon,
  AccessTime as AccessTimeIcon,
  Assignment as AssignmentIcon,
  Refresh as RefreshIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import { TaskContext } from '../context/taskContext';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  const { tasks, getTasks, loading, error, getStatistics, updateTask } = useContext(TaskContext);
  const theme = useTheme();
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    inProgress: 0,
    highPriority: 0,
    dueSoon: 0
  });
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [statsError, setStatsError] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    dueDate: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getTasks();
        await refreshStats();
      } catch (err) {
        setStatsError('Failed to load dashboard data');
        console.error('Dashboard data error:', err);
      }
    };
    fetchData();
  }, []);

  const refreshStats = async () => {
    setIsLoadingStats(true);
    setStatsError(null);
    try {
      const statsData = await getStatistics();
      setStats(statsData);
    } catch (err) {
      setStatsError(err.response?.data?.message || 'Failed to load statistics');
    } finally {
      setIsLoadingStats(false);
    }
  };

  const handleEditClick = (task) => {
    setCurrentTask(task);
    setEditFormData({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''
    });
    setEditDialogOpen(true);
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateTask(currentTask._id, editFormData);
      setEditDialogOpen(false);
      await refreshStats();
      await getTasks();
    } catch (err) {
      console.error('Error updating task:', err);
    }
  };

  const completionPercentage = stats.total > 0 
    ? Math.round((stats.completed / stats.total) * 100) 
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
      <Container maxWidth="xl" sx={{ mt: 4, mb: 8 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" fontWeight="bold">Task Dashboard</Typography>
          <Button 
            variant="outlined" 
            onClick={refreshStats}
            disabled={isLoadingStats}
            startIcon={isLoadingStats ? <CircularProgress size={20} /> : <RefreshIcon />}
          >
            Refresh Stats
          </Button>
        </Box>

        {(error || statsError) && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error || statsError}
          </Alert>
        )}

        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4, display: 'flex', justifyContent: 'space-around' }}>
          {[
            { 
              icon: <AssignmentIcon color="primary" sx={{ fontSize: 40 }} />,
              value: stats.total,
              label: 'Total Tasks'
            },
            { 
              icon: <CheckCircleIcon sx={{ fontSize: 40, color: theme.palette.success.main }} />,
              value: stats.completed,
              label: 'Completed'
            },
            { 
              icon: <LoopIcon sx={{ fontSize: 40, color: theme.palette.info.main }} />,
              value: stats.inProgress,
              label: 'In Progress'
            },
            { 
              icon: <PendingIcon sx={{ fontSize: 40, color: theme.palette.warning.main }} />,
              value: stats.pending,
              label: 'Pending'
            },
            { 
              icon: <PriorityHighIcon sx={{ fontSize: 40, color: theme.palette.error.main }} />,
              value: stats.highPriority,
              label: 'High Priority'
            },
            { 
              icon: <AccessTimeIcon sx={{ fontSize: 40, color: theme.palette.secondary.main }} />,
              value: stats.dueSoon,
              label: 'Due Soon'
            },
          ].map((stat, index) => (
            <Grid item xs={12} sm={6} md={4} lg={2} key={index}>
              <Card elevation={2}>
                <CardContent sx={{ textAlign: 'center', py: 2 }}>
                  {stat.icon}
                  <Typography variant="h5" fontWeight="bold" sx={{ mt: 1 }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stat.label}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Completion Progress */}
        <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="h6">Task Completion</Typography>
            <Typography variant="h6" fontWeight="bold">{completionPercentage}%</Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={completionPercentage} 
            sx={{ 
              height: 10, 
              borderRadius: 5,
              backgroundColor: theme.palette.grey[300],
              '& .MuiLinearProgress-bar': {
                backgroundColor: completionPercentage >= 80 
                  ? theme.palette.success.main 
                  : completionPercentage >= 50 
                    ? theme.palette.info.main 
                    : theme.palette.warning.main
              }
            }}
          />
          <Box display="flex" justifyContent="space-between" mt={1}>
            <Typography variant="body2" color="text.secondary">
              {stats.completed} of {stats.total} tasks completed
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

        {/* Task Form */}
        <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
          <Typography sx={{display:'flex',justifyContent:'start'}} variant="h4" gutterBottom>Add New Task</Typography>
          <TaskForm onTaskAdded={refreshStats} />
        </Paper>

        {/* Task List */}
        <Paper elevation={2} sx={{ p: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" gutterBottom>My Tasks</Typography>
            <Typography variant="subtitle2" color="text.secondary">
              Showing {tasks.length} task{tasks.length !== 1 ? 's' : ''}
            </Typography>
          </Box>
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
                <Grid item xs={12} sm={6} md={4} key={task._id}>
                  <TaskCard 
                    task={task} 
                    onTaskUpdated={refreshStats}
                    onTaskDeleted={refreshStats}
                    onEditClick={handleEditClick}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </Paper>

        {/* Edit Task Dialog */}
        <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>
            <Box display="flex" alignItems="center">
              <EditIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">Edit Task</Typography>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Box component="form" onSubmit={handleEditSubmit} sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    name="title"
                    label="Title"
                    value={editFormData.title}
                    onChange={handleEditFormChange}
                    fullWidth
                    required
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="description"
                    label="Description"
                    value={editFormData.description}
                    onChange={handleEditFormChange}
                    fullWidth
                    multiline
                    rows={4}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="status"
                    label="Status"
                    value={editFormData.status}
                    onChange={handleEditFormChange}
                    select
                    fullWidth
                    margin="normal"
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
                    value={editFormData.priority}
                    onChange={handleEditFormChange}
                    select
                    fullWidth
                    margin="normal"
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
                    value={editFormData.dueDate}
                    onChange={handleEditFormChange}
                    fullWidth
                    margin="normal"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
              </Grid>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleEditSubmit}
              variant="contained" 
              color="primary"
              startIcon={<EditIcon />}
            >
              Update Task
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
};

export default Dashboard;