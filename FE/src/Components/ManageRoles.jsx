import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Box, Typography, Paper, Alert, Table, TableHead, TableRow, TableCell, TableBody, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, Select, FormControl, InputLabel, Chip, IconButton, Snackbar } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { css } from '@emotion/react';

const styles = {
  selectMenuItem: css`
    white-space: normal;
    word-wrap: break-word;
    width: 250px; /* Fixed width for dropdown */
    display: inline-block; /* Ensure items are inline */
  `,
  select: css`
    width: 250px; /* Fixed width for dropdown */
  `,
  dialogContent: css`
    display: flex;
    flex-direction: column;
    gap: 16px;
  `,
  tableHeader: css`
    background-color: #f5f5f5;
  `,
  tableRow: css`
    &:nth-of-type(odd) {
      background-color: #f9f9f9;
    }
    &:hover {
      background-color: #e0f7fa;
    }
  `,
  card: css`
    margin-bottom: 16px;
  `,
};

const ManageRoles = () => {
  const [users, setUsers] = useState([]);
  const [rolesOptions, setRolesOptions] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null); // For popup
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    fetchUsers();
    fetchRolesOptions();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/api/users');
      console.log('Fetched Users:', response.data);
      const fetchedUsers = response.data.map((user) => ({
        USER_ID: user.USER_ID,
        USER_NAME: user.USER_NAME,
        ROLE_ID: user.ROLE_ID,
      }));
      setUsers(fetchedUsers || []);
      setError(null);
    } catch (error) {
      setError('Failed to fetch users. Please try again.');
    }
  };

  const fetchRolesOptions = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/api/roles');
      console.log('Fetched Roles Options:', response.data);
      setRolesOptions(response.data || []);
    } catch (error) {
      setError('Failed to fetch roles options');
    }
  };

  const handleUpdateUserRole = (index, field, value) => {
    const updatedUsers = users.map((user, i) =>
      i === index ? { ...user, [field]: value, ROLE_ID: parseInt(value) } : user
    );
    setUsers(updatedUsers);
  };

  const handleSaveUserRole = async (USER_ID) => {
    try {
      const user = users.find(user => user.USER_ID === USER_ID);
      const { USER_NAME, ROLE_ID } = user;

      console.log('USER_ID:', USER_ID);
      console.log('USER_NAME:', USER_NAME);
      console.log('ROLE_ID:', ROLE_ID);

      if (!USER_ID) {
        throw new Error('User ID is missing.');
      }

      if (!USER_NAME) {
        throw new Error('User Name is missing.');
      }

      if (!ROLE_ID) {
        throw new Error('Role ID is missing.');
      }

      const payload = { ROLE_ID };
      console.log('Payload:', payload);

      const response = await axios.put(`http://127.0.0.1:5000/update_role/${USER_NAME}`, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Server response:', response.data);

      const updatedUsers = users.map(user =>
        user.USER_ID === USER_ID ? { ...user, ROLE_ID: ROLE_ID } : user
      );
      setUsers(updatedUsers);

      setError(null);
      setSuccess(true);
      setSnackbarMessage('Role updated successfully');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error saving user roles:', error.response ? error.response.data : error.message);
      if (error.response && error.response.data) {
        console.error('Server response data:', error.response.data);
      }
      setError('Failed to save user roles. Please try again.');
      setSnackbarMessage('Failed to save user roles');
      setSnackbarOpen(true);
    }
  };

  const handleDeleteUser = async (username) => {
    try {
      await axios.delete(`http://127.0.0.1:5000/delete_user/${username}`);
      setUsers(users.filter(user => user.USER_NAME !== username));
      setError(null);
      setSuccess(true);
      setSnackbarMessage('User deleted successfully');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error deleting user:', error.response ? error.response.data : error.message);
      setError('Failed to delete user. Please try again.');
      setSuccess(false);
      setSnackbarMessage('Failed to delete user');
      setSnackbarOpen(true);
    }
  };

  const handleOpenPopup = (user) => {
    setSelectedUser(user);
  };

  const handleClosePopup = () => {
    setSelectedUser(null);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  return (
    <Paper elevation={3} sx={{ p: 4, mt: 4, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom align="center">Manage User Roles</Typography>
      {error && (
        <Box sx={{ mt: 2 }}>
          <Alert severity="error">{error}</Alert>
        </Box>
      )}
      {success && (
        <Box sx={{ mt: 2 }}>
          <Alert severity="success">Action completed successfully!</Alert>
        </Box>
      )}
      <Typography variant="h6" sx={{ mt: 4 }}>Existing Users</Typography>
      <Table>
        <TableHead css={styles.tableHeader}>
          <TableRow>
            <TableCell>User ID</TableCell>
            <TableCell>User Name</TableCell>
            <TableCell>Role ID</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user, index) => (
            <TableRow key={user.USER_ID} css={styles.tableRow}>
              <TableCell>{user.USER_ID}</TableCell>
              <TableCell>{user.USER_NAME}</TableCell>
              <TableCell>{user.ROLE_ID}</TableCell>
              <TableCell>
                <IconButton color="primary" onClick={() => handleOpenPopup(user)}>
                  <EditIcon />
                </IconButton>
                <IconButton color="secondary" onClick={() => handleDeleteUser(user.USER_NAME)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
      {/* Popup Dialog */}
      {selectedUser && (
        <Dialog open={true} onClose={handleClosePopup} maxWidth="md" fullWidth>
          <DialogTitle>Update User Role</DialogTitle>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="h6">User ID: {selectedUser.USER_ID}</Typography>
            <Typography variant="body1">User Name: {selectedUser.USER_NAME}</Typography>
            <FormControl fullWidth margin="normal">
              <InputLabel id="roleid-label">Role ID</InputLabel>
              <Select
                labelId="roleid-label"
                id="roleid"
                multiple
                value={selectedUser.datasetAccess || []}
                label="Role ID"
                onChange={(e) => handleUpdateUserRole(users.findIndex(user => user.USER_ID === selectedUser.USER_ID), 'datasetAccess', e.target.value)}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
                sx={{ width: '100%' }}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 48 * 4.5 + 8, // 4.5 items visible
                      width: '100%',
                    },
                  },
                }}
              >
                {rolesOptions.map((roleOption) => (
                  <MenuItem key={roleOption.ROLE_ID} value={roleOption.ROLE_ID} css={styles.selectMenuItem}>
                    <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', whiteSpace: 'normal', overflowWrap: 'anywhere' }}>
                      <Box sx={{ flex: 1, paddingRight: 1 }}>{roleOption.ROLE_ID}</Box>
                      <Box sx={{ flex: 3 }}>{roleOption.DATASET_ACCESS}</Box>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClosePopup}>Cancel</Button>
            <Button variant="contained" color="primary" onClick={() => { handleSaveUserRole(selectedUser.USER_ID); handleClosePopup(); }}>
              Save
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Paper>
  );
};

export default ManageRoles;
