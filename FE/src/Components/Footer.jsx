import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box sx={{ bgcolor: 'background.paper', p: 2, mt: 'auto', textAlign: 'center' }}>
      <Typography variant="body2" color="textSecondary" align="center">
        © {new Date().getFullYear()} DataBuddy. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;
