import { Typography } from '@mui/material';
import { ReactComponent as LoginImage } from '../assets/images/login-page.svg';
import image from '../assets/images/saddog.jpg';
import { useNavigate } from 'react-router-dom';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import { Button } from '@mui/material';

function PageNotFound() {
  const navigate = useNavigate();
  const handleBackToLogin = () => {
    navigate('/login');
  };

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
      }}
    >
      {/* Left 50% - Form and Image */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '50%',
          padding: '20px',
        }}
      >
        <div style={{ marginBottom: '20px' }}>
          <Typography
            variant="h4"
            className="login-title"
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            Page Not Found{' '}
            <SentimentVeryDissatisfiedIcon style={{ marginLeft: '10px' }} />
          </Typography>

          <Button
            variant="contained"
            color="secondary"
            fullWidth
            onClick={handleBackToLogin}
            sx={{
              borderRadius: '12px',
              color: 'white',
              fontSize: '12px',
              letterSpacing: '0',
            }}
          >
            back to home
          </Button>
        </div>
        <img
          src={image}
          alt="Descriptive Alt Text"
          style={{ width: '100%', height: 'auto' }}
        />
      </div>

      {/* Right 50% - Login Image */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '50%',
          padding: '20px',
        }}
      >
        <LoginImage style={{ width: '100%', height: 'auto' }} />
      </div>
    </div>
  );
}

export default PageNotFound;
