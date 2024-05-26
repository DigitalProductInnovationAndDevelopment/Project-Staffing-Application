import React, { useState } from 'react';
import { Typography, TextField, Button, Grid, IconButton, InputAdornment } from '@mui/material';
import { ReactComponent as LoginImage } from '../../assets/images/login-page.svg';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Link } from 'react-router-dom';


function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
  
    const handleClickShowPassword = () => {
      setShowPassword(!showPassword);
    };
  
    const handleEmailChange = (e) => {
      setEmail(e.target.value);
      setErrorMessage('');
    };
  
    const handlePasswordChange = (e) => {
      setPassword(e.target.value);
      setErrorMessage('');
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      // Mock validation
      const mockEmail = 'user@example.com';
      const mockPassword = 'password123';
  
      if (email === mockEmail && password === mockPassword) {
        setErrorMessage('');
        // Perform login action (redirect, store auth token, etc.)
      } else {
        setErrorMessage('Email or password is invalid');
      }
    };

  return (
    <div className="container">
      <Grid container>
        {/* Form Grid item */}
        <Grid item xs={12} md={6} container direction="column" alignItems="flex-start" justifyContent="center" className="form-container">
          <div className="title-container">
            <Typography variant="h4" className="login-title">GREAT STAFF</Typography>
            <Typography className="login-sub-title">Login with your email and password</Typography> 
          </div>
          {/* Form */}
          <form noValidate autoComplete='off' className="form" onSubmit={handleSubmit}>
            <div className="email-input-container">
              <Typography htmlFor="email" className="email-label">Email</Typography>
              <TextField
                id="email"
                fullWidth
                placeholder="Your email address"
                onChange={handleEmailChange}
                InputProps={{
                  style: {
                    borderRadius: '15px',
                    height: '50px',
                  }
                }}
              />
            </div>
            <div className="password-input-container">
              <Typography htmlFor="password" className="password-label">Password</Typography>
              <TextField
                id="password"
                type={showPassword ? 'text' : 'password'}
                fullWidth
                placeholder="Your password"
                onChange={handlePasswordChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleClickShowPassword}
                        edge="end"
                        color='iconGrey'
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                  style: {
                    borderRadius: '15px',
                    height: '50px',
                  }
                }}
              />
            </div>
            
            {errorMessage && (
              <Typography color="error" className="error-message">
                {errorMessage}
              </Typography>
            )}

            <Typography variant="body2" className="signup-text">
              Don't you have an account? <Link to="/signup" className="signup-link">Sign Up</Link>
            </Typography>

            <Button
              variant="contained"
              color="secondary"
              className="login-button"
              fullWidth
              type="submit"
              sx={{ 
                borderRadius: '12px',
                color: 'white',
                height: '45px',
                fontFamily: 'Halvetica, sans-serif',
                fontWeight: 'Bold',
                fontSize: '10px',
                lineHeight: '150%',
                letterSpacing: '0'
              }}
            >
              Login
            </Button>
          </form>
        </Grid>

        {/* Image Grid item */}
        <Grid item xs={12} md={6} alignItems="flex-start" className="image-container">
          <LoginImage className="image" />
        </Grid>
      </Grid>
    </div>
  );
}

export default Login;
