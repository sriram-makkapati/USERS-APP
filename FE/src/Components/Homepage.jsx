import React from 'react';
import { Box, Typography, Button, Grid, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ textAlign: 'center', mt: 4 }}>
      <Typography variant="h4" gutterBottom>Welcome to DataBuddy</Typography>
      <Typography variant="body1" gutterBottom>Manage your users and roles efficiently.</Typography>
      <Grid container spacing={2} justifyContent="center" sx={{ mt: 4 }}>
        <Grid item>
          <Paper elevation={3} sx={{ p: 2, width: 300, height: 150 }}>
            <Typography variant="h5" gutterBottom>Add User</Typography>
            <Typography variant="body2" gutterBottom>Add new users to the DataBuddy platform.</Typography>
            <Button variant="contained" color="primary" onClick={() => navigate('/add-user')}>
              Add User
            </Button>
          </Paper>
        </Grid>
        <Grid item>
          <Paper elevation={3} sx={{ p: 2, width: 300, height: 150 }}>
            <Typography variant="h5" gutterBottom>Add Role</Typography>
            <Typography variant="body2" gutterBottom>Create new roles and assign dataset access.</Typography>
            <Button variant="contained" color="primary" onClick={() => navigate('/add-role')}>
              Add Role
            </Button>
          </Paper>
        </Grid>
        <Grid item>
          <Paper elevation={3} sx={{ p: 2, width: 300, height: 150 }}>
            <Typography variant="h5" gutterBottom>Manage Roles</Typography>
            <Typography variant="body2" gutterBottom>Edit or delete user roles.</Typography>
            <Button variant="contained" color="primary" onClick={() => navigate('/edit-roles')}>
              Edit Roles
            </Button>
          </Paper>
        </Grid>
        <Grid item>
          <Paper elevation={3} sx={{ p: 2, width: 300, height: 150 }}>
            <Typography variant="h5" gutterBottom>Tables</Typography>
            <Typography variant="body2" gutterBottom>View user and role tables.</Typography>
            <Button variant="contained" color="primary" onClick={() => navigate('/user-roles')}>
              View Tables
            </Button>
          </Paper>
        </Grid>
        <Grid item>
          <Paper elevation={3} sx={{ p: 2, width: 300, height: 150 }}>
            <Typography variant="h5" gutterBottom>Manage User Roles</Typography>
            <Typography variant="body2" gutterBottom>View, update, or delete user roles.</Typography>
            <Button variant="contained" color="primary" onClick={() => navigate('/manage-roles')}>
              Manage Roles
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default HomePage;
