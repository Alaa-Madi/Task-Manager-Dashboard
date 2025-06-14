const taskReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_TASKS_SUCCESS':
      return {
        ...state,
        tasks: action.payload,
        loading: false,
        error: null,
      };
    case 'ADD_TASK':
      return {
        ...state,
        tasks: [action.payload, ...state.tasks],
        error: null,
      };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task._id === action.payload._id ? action.payload : task
        ),
        error: null,
      };
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter((task) => task._id !== action.payload),
        error: null,
      };
    case 'SET_EDITING_TASK':
      return {
        ...state,
        editingTask: action.payload,
      };
    case 'CLEAR_EDITING_TASK':
      return {
        ...state,
        editingTask: null,
      };
    case 'TASK_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    default:
      return state;
  }
};

export default taskReducer;
