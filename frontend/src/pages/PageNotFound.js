import { Typography, Grid } from '@mui/material';
import { ReactComponent as LoginImage } from '../assets/images/login-page.svg';
import image from '../assets/images/saddog.jpg';
import { useNavigate } from 'react-router-dom';

function PageNotFound() {
  const navigate = useNavigate();
  const handleBackToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="container">
      <Grid container>
        {/* Form Grid item */}
        <Grid
          item
          xs={12}
          md={6}
          container
          direction="column"
          alignItems="flex-start"
          justifyContent="center"
          className="form-container"
        >
          <div className="title-container">
            <Typography variant="h4" className="login-title">
              Page Not Found :(
            </Typography>
            <Typography className="login-sub-title" onClick={handleBackToLogin}>
              <strong>Click here</strong> to go back home...
            </Typography>
          </div>
          <img
            src={image}
            alt="Descriptive Alt Text"
            style={{ width: '100%', height: 'auto' }}
          />
        </Grid>

        {/* Image Grid item */}
        <Grid
          item
          xs={12}
          md={6}
          alignItems="flex-start"
          className="image-container"
        >
          <LoginImage className="image" />
        </Grid>
      </Grid>
    </div>
  );
}

export default PageNotFound;
