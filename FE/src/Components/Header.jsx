import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          DataBuddy
        </Typography>
        <Box>
          <Button color="inherit" onClick={() => navigate('/')}>Home</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
