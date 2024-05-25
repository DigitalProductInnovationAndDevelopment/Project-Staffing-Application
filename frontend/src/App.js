import React from 'react';
import './App.css';
import Login from './pages/auth/Login.js'; 
import './style.scss';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#e2e8f0',
    },
    secondary: {
      main: '#4fd1c5',
    },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& label.Mui-focused': {
            color: '#4fd1c5',
          },
          '& .MuiInput-underline:after': {
            borderBottomColor: '#4fd1c5',
          },
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#e2e8f0',
            },
            '&:hover fieldset': {
              borderColor: '#4fd1c5',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#4fd1c5',
            },
          },
        },
      },
    },
  },
})

function App() {
  return (
    <ThemeProvider theme={theme}> 
      <div className="App">
        <Login /> 
      </div>
    </ThemeProvider> 
  );
}

export default App;
