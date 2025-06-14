import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: { main: '#433D8B' },
    secondary: { main: '#C8ACD6' },
    background: { default: '#17153B', paper: '#2E236C' },
    info: { main: '#67' },
  },
  typography: { fontFamily: '"Roboto", sans-serif' }
});

export default theme;
