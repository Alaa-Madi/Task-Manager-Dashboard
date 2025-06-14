import React, { useContext, useEffect } from 'react';
import { TaskContext } from '../context/taskContext';
import TaskCard from './TaskCard';

const TaskList = () => {
  const { tasks, getTasks } = useContext(TaskContext);

  useEffect(() => {
    getTasks();
  }, []);

  const statuses = ['To Do', 'In Progress', 'Done'];

  return (
    <div className="task-columns">
      {statuses.map((status) => (
        <div key={status} className="task-column">
          <h2>{status}</h2>
          {tasks
            .filter((task) => task.status === status)
            .map((task) => (
              <TaskCard key={task._id} task={task} />
            ))}
        </div>
      ))}
    </div>
  );
};

export default TaskList;
