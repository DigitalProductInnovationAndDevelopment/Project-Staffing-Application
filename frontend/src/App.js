import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './pages/auth/Login.js';
import SignUp from './pages/auth/SignUp';
import EditProject from './components/EditProject';
import AppLayout from './pages/AppLayout';
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
    iconGrey: {
      main: '#CCCCCC',
    },
    textGrey: {
      main: '#A0AEC0',
    },
    primBlue: {
      main: '#2684FF',
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
  typography: {
    body2: {
      fontSize: '14px',
      fontFamily: 'Helvetica, sans-serif',
      fontWeight: 'bold',
      lineHeight: '150%',
      color: '#2D3748',
    },
  },
    body1: {
      fontSize: '10px',
      fontFamily: 'Helvetica, sans-serif',
      fontWeight: '700',
      lineHeight: '150%',
      color: '#A0AEC0',
    }
})

function App() {
  const [activeItem, setActiveItem] = useState('projects'); // Initialize activeItem state

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/projects"
            element={<AppLayout activeItem={activeItem} setActiveItem={setActiveItem} />}
          />
          <Route
            path="/employees"
            element={<AppLayout activeItem={activeItem} setActiveItem={setActiveItem} />}
          />
          <Route
            path="/projects/edit"
            element={<EditProject open onClose={() => {}} project={{ name: 'Project: Mobile App Performance', company: 'Itestra Project', image: '' }} />}
          />
          <Route path="/" element={<Login />} /> {/* Default route */}
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
