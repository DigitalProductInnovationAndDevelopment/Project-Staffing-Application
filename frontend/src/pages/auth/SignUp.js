import React from 'react';
import { Grid } from '@mui/material';
import { ReactComponent as LoginImage } from '../../assets/images/login-page.svg';


function Login() {

  return (
    <div className="container">

        {/* Image Grid item */}
        <Grid item xs={12} md={6} alignItems="flex-start" className="image-container">
          <LoginImage className="image" />
        </Grid>
    </div>
  );
}

export default Login;
