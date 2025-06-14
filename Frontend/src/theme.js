import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#3F51B5' },       
    secondary: { main: '#FF4081' },     
    background: {
      default: '#F0F4FF',               
      paper: '#FFFFFF',                 
    },
    error: { main: '#E53935' },         
    warning: { main: '#FB8C00' },       
    success: { main: '#43A047' },       
    info: { main: '#1E88E5' },          
    text: {
      primary: '#212121',              
      secondary: '#555555',            
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", sans-serif',
    fontSize: 14,
  },
  shape: {
    borderRadius: 12,
  },
});

export default theme;
