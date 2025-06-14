import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';
import { TaskProvider} from './context/taskContext';
import { AuthProvider } from './context/authContext';


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
   <ThemeProvider theme={theme}>
   <CssBaseline />
    <TaskProvider>
      <App />
    </TaskProvider>
   </ThemeProvider>
     </AuthProvider>
  </React.StrictMode>
);
