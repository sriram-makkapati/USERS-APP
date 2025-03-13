import React, { useState, useEffect } from 'react';
import { TextField, Button, MenuItem, Select, FormControl, InputLabel, Box, Typography, Paper, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import apis from './apis'; // Import the APIs

const AddUserForm = () => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [roleId, setRoleId] = useState('');
  const [roles, setRoles] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get(apis.userRoles);
        setRoles(response.data);
      } catch (error) {
        setError('Failed to fetch roles');
      }
    };
    fetchRoles();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!userName.endsWith('@zensar.com')) {
      setError('Please enter a valid zensar.com email');
      setSuccess(false);
      return;
    }
    setError(null);
    try {
      await axios.post(apis.addUser, { 
        USER_NAME: userName.split('@zensar.com')[0],
        PASSWORD: password,
        ROLE_ID: roleId 
      });
      setSuccess(true);
      setUserName('');
      setPassword('');
      setRoleId('');
      navigate('/add-role');
    } catch (error) {
      setError('Failed to add user. Please try again.');
      setSuccess(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, mt: 4, maxWidth: 600, mx: 'auto' }}>
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Typography variant="h5" gutterBottom align="center">Add User to DataBuddy</Typography>
        <TextField
          margin="normal"
          required
          fullWidth
          id="userName"
          label="User Name"
          name="userName"
          autoComplete="userName"
          autoFocus
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <FormControl fullWidth margin="normal">
          <InputLabel id="role-id-label">Role ID</InputLabel>
          <Select
            labelId="role-id-label"
            id="roleId"
            value={roleId}
            label="Role ID"
            onChange={(e) => setRoleId(e.target.value)}
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 48 * 4.5 + 8, // 4.5 items visible
                  width: 600 // Match dropdown width to the input width
                },
              },
            }}
          >
            {roles.map((role) => (
              <MenuItem key={role.ROLE_ID} value={role.ROLE_ID}>
                <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', whiteSpace: 'normal', overflowWrap: 'anywhere' }}>
                  <Box sx={{ flex: 1, paddingRight: 1 }}>{role.ROLE_ID}</Box>
                  <Box sx={{ flex: 3 }}>{role.DATASET_ACCESS}</Box>
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          sx={{ mt: 3, mb: 2 }}
        >
          Submit
        </Button>
      </Box>
      {error && (
        <Box sx={{ mt: 2 }}>
          <Alert severity="error">{error}</Alert>
        </Box>
      )}
      {success && (
        <Box sx={{ mt: 2 }}>
          <Alert severity="success">User added successfully!</Alert>
        </Box>
      )}
    </Paper>
  );
};

export default AddUserForm;
