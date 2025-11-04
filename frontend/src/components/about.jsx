import React from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';

const AboutPage = () => {
  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          About Us
        </Typography>
        <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
          <Typography variant="body1" paragraph>
            Welcome to our application! We are dedicated to helping you manage your tasks efficiently
            and effectively. Our platform provides a simple and intuitive interface for managing your
            daily todos while ensuring your data is secure.
          </Typography>
          <Typography variant="body1" paragraph>
            Features:
          </Typography>
          <ul>
            <Typography component="li">User Authentication</Typography>
            <Typography component="li">Todo Management</Typography>
            <Typography component="li">Secure Data Storage</Typography>
            <Typography component="li">Real-time Updates</Typography>
          </ul>
        </Paper>
      </Box>
    </Container>
  );
};

export default AboutPage;
