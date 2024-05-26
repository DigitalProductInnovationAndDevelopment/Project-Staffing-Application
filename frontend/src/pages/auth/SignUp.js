import React, { useState } from 'react';
import { Typography, TextField, Button, Grid, IconButton, InputAdornment } from '@mui/material';
import { ReactComponent as LoginImage } from '../../assets/images/login-page.svg';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Link } from 'react-router-dom';


function SignUp() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
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
 
    const handleNameChange = (e) => {
      setName(e.target.value);
      setErrorMessage('');
    };
  
    const handleLastNameChange = (e) => {
      setLastName(e.target.value);
      setErrorMessage('');
    };

    const handleSubmit = (e) => {
      e.preventDefault();

      //prevent empty inputs
      if (email === '' || password === '' || name === '' || lastName === '') {
        setErrorMessage('Please fill your credentials');
        return;
      }

      // Mock validation
      const mockEmail = 'user@example.com';
      const mockPassword = 'password123';
      const mockName = 'Test';
      const mockLastName = 'User';

      if (email === mockEmail && password === mockPassword  && name === mockName  && lastName === mockLastName) {
        // Perform signup action (redirect, store auth token, etc.)
      } else {
      }
    };

  return (
    <div className="container">
      <Grid container>
        {/* Form Grid item */}
        <Grid item xs={12} md={6} container direction="column" alignItems="flex-start" justifyContent="center" className="form-container">
          <div className="title-container">
            <Typography variant="h4" className="login-title">GREAT STAFF</Typography>
            <Typography variant="h6" className="login-sub-title">Sign Up with your credentials</Typography> 
          </div>
          {/* Form */}
          <form noValidate autoComplete='off' className="form" onSubmit={handleSubmit}>
            <div className="input-container">
              <Typography htmlFor="name" className="input-label">First Name*</Typography>
              <TextField
                id="name"
                fullWidth
                placeholder="Your first name"
                onChange={handleNameChange}
                InputProps={{
                  style: {
                    borderRadius: '15px',
                    height: '50px',
                  }
                }}
              />
            </div>
            <div className="input-container">
              <Typography htmlFor="lastname" className="input-label">Last Name*</Typography>
              <TextField
                id="lastName"
                fullWidth
                placeholder="Your last name"
                onChange={handleLastNameChange}
                InputProps={{
                  style: {
                    borderRadius: '15px',
                    height: '50px',
                  }
                }}
              />
            </div>
            <div className="input-container">
              <Typography htmlFor="email" className="input-label">Email*</Typography>
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
              <Typography htmlFor="password" className="input-label">Password*</Typography>
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

            <Typography variant="body2" className="account-message-text">
              You already have an account? <Link to="/login" className="route-link">Login</Link>
            </Typography>

            <Button
              variant="contained"
              color="secondary"
              className="submit-button"
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
              Sign Up
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

export default SignUp;
