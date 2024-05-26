import React from 'react';
import { Typography, TextField, Button, Grid } from '@mui/material';
import { ReactComponent as LoginImage } from '../../assets/images/login-page.svg';


function Login() {
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
          <form noValidate autoComplete='off' className="form">
            <div className="input-container">
              <Typography htmlFor="email" className="email-label">Email</Typography>
              <TextField
                id="email"
                fullWidth
                placeholder="Your email address"
                InputProps={{
                  style: {
                    borderRadius: '15px',
                    height: '50px',
                  }
                }}
              />
            </div>
            <div className="input-container">
              <Typography htmlFor="password" className="password-label">Password</Typography>
              <TextField
                id="password"
                type="password"
                fullWidth
                placeholder="Your password"
                InputProps={{
                  style: {
                    borderRadius: '15px',
                    height: '50px',
                  }
                }}
              />
            </div>
            <Button
              variant="contained"
              color="secondary"
              className="login-button"
              fullWidth
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
