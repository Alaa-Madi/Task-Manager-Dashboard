import React, { useContext } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Stack,
  IconButton,
  Chip ,
  Box
} from '@mui/material';
import { 
  Delete as DeleteIcon,
  Edit as EditIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Loop as LoopIcon
} from '@mui/icons-material';
import { TaskContext } from '../context/taskContext';

const TaskCard = ({ task, onEditClick }) => {
  const { deleteTask, updateTaskStatus } = useContext(TaskContext);

  const getStatusIcon = () => {
    switch(task.status) {
      case 'done':
        return <CheckCircleIcon color="success" fontSize="small" />;
      case 'in-progress':
        return <LoopIcon color="info" fontSize="small" />;
      default:
        return <PendingIcon color="warning" fontSize="small" />;
    }
  };

  const getPriorityColor = () => {
    switch(task.priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      default:
        return 'success';
    }
  };

  return (
    <Card sx={{ 
      mb: 2, 
      borderLeft: `6px solid ${
        task.status === 'done' ? '#4caf50' : 
        task.status === 'in-progress' ? '#2196f3' : '#ff9800'
      }`
    }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Typography variant="h6" gutterBottom>
            {task.title}
          </Typography>
          <IconButton 
            size="small" 
            onClick={() => onEditClick(task)}
            aria-label="edit"
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </Box>
        
        <Typography variant="body2" color="text.secondary" paragraph>
          {task.description}
        </Typography>
        
        <Box display="flex" gap={1} mb={2} flexWrap="wrap">
          <Chip
            icon={getStatusIcon()}
            label={
              task.status === 'todo' ? 'To Do' :
              task.status === 'in-progress' ? 'In Progress' : 'Done'
            }
            size="small"
          />
          <Chip
            label={`Priority: ${task.priority}`}
            color={getPriorityColor()}
            size="small"
          />
          {task.dueDate && (
            <Chip
              label={`Due: ${new Date(task.dueDate).toLocaleDateString()}`}
              size="small"
            />
          )}
        </Box>

        <Stack direction="row" spacing={1}>
          <Button
            variant="contained"
            size="small"
            startIcon={<EditIcon />}
            onClick={() => onEditClick(task)}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            color="error"
            size="small"
            startIcon={<DeleteIcon />}
            onClick={() => deleteTask(task._id)}
          >
            Delete
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default TaskCard;