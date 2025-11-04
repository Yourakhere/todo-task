import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Welcome to Our App
        </Typography>
        <Typography variant="h6" component="p" gutterBottom>
          This is your homepage. From here you can:
        </Typography>
        <Typography variant="body1" paragraph sx={{ mt: 2 }}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris.
        </Typography>
        
      </Box>
    </Container>
  );
};

export default HomePage;
