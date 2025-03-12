import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, Box, Typography, Paper, Alert, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const EditUserRole = () => {
  const [username, setUsername] = useState('');
  const [roleId, setRoleId] = useState('');
  const [roles, setRoles] = useState([]);
  const [roleName, setRoleName] = useState('');
  const [datasetAccess, setDatasetAccess] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    // Fetch user roles
    const fetchUserRoles = async () => {
      if (username) {
        try {
          const response = await axios.get(`http://127.0.0.1:5000/api/users/${username}/roles`);
          setRoles(response.data);
          setIsFetching(true);
          setError(null);
        } catch (error) {
          setError('Failed to fetch user roles');
        }
      }
    };

    fetchUserRoles();
  }, [username]);

  const handleUpdateRole = async (event) => {
    event.preventDefault();
    try {
      await axios.put(`http://127.0.0.1:5000/api/roles/${roleId}`, {
        ROLE_NAME: roleName,
        DATASET_ACCESS: datasetAccess,
      });
      setSuccess(true);
      setRoleName('');
      setDatasetAccess('');
      setError(null);
    } catch (error) {
      setError('Failed to update role');
      setSuccess(false);
    }
  };

  const handleDeleteRole = async () => {
    try {
      await axios.delete(`http://127.0.0.1:5000/api/roles/${roleId}`);
      setRoles(roles.filter(role => role.ROLE_ID !== roleId));
      setSuccess(true);
      setError(null);
    } catch (error) {
      setError('Failed to delete role');
      setSuccess(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, mt: 4, maxWidth: 600, mx: 'auto' }}>
      <Box component="form" onSubmit={handleUpdateRole} noValidate>
        <Typography variant="h5" gutterBottom align="center">Edit User Role</Typography>
        <TextField
          margin="normal"
          required
          fullWidth
          id="username"
          label="Username"
          name="username"
          autoComplete="username"
          autoFocus
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={isFetching}
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Role ID</InputLabel>
          <Select
            value={roleId}
            onChange={(e) => setRoleId(e.target.value)}
            label="Role ID"
          >
            {roles.map((role) => (
              <MenuItem key={role.ROLE_ID} value={role.ROLE_ID}>{role.ROLE_ID}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          margin="normal"
          required
          fullWidth
          name="roleName"
          label="Role Name"
          value={roleName}
          onChange={(e) => setRoleName(e.target.value)}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="datasetAccess"
          label="Dataset Access"
          value={datasetAccess}
          onChange={(e) => setDatasetAccess(e.target.value)}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          sx={{ mt: 3, mb: 2 }}
        >
          Update Role
        </Button>
        <Button
          fullWidth
          variant="contained"
          color="secondary"
          sx={{ mt: 2, mb: 2 }}
          onClick={handleDeleteRole}
        >
          Delete Role
        </Button>
      </Box>
      {error && (
        <Box sx={{ mt: 2 }}>
          <Alert severity="error">{error}</Alert>
        </Box>
      )}
      {success && (
        <Box sx={{ mt: 2 }}>
          <Alert severity="success">Role updated successfully!</Alert>
        </Box>
      )}
    </Paper>
  );
};

export default EditUserRole;
