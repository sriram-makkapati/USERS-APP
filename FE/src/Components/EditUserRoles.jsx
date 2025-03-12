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

const EditUserRoles = () => {
  const [roles, setRoles] = useState([]);
  const [roleOptions, setRoleOptions] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null); // For popup
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/user_roles');
      console.log('Fetched Roles:', response.data);
      const fetchedRoles = response.data.map((role) => ({
        roleId: role.ROLE_ID,
        roleName: role.ROLE_NAME,
        datasetAccess: Array.isArray(role.DATASET_ACCESS) ? role.DATASET_ACCESS : [], // Ensure dataset access field is always an array
      }));
      setRoles(fetchedRoles || []);
      fetchRoleOptions();
      setError(null);
    } catch (error) {
      setError('Failed to fetch roles. Please try again.');
    }
  };

  const fetchRoleOptions = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/api/roles');
      console.log('Fetched Role Options:', response.data);
      setRoleOptions(response.data || []);
    } catch (error) {
      setError('Failed to fetch role options. Please try again.');
    }
  };

  const handleUpdateDatasetAccess = (index, value) => {
    const updatedRoles = roles.map((role, i) =>
      i === index ? { ...role, datasetAccess: Array.isArray(value) ? value : [] } : role
    );
    setRoles(updatedRoles);
    setSelectedRole({ ...updatedRoles[index] }); // Ensure selectedRole is updated correctly
  };

  const handleSaveRole = async () => {
    try {
      if (!selectedRole) {
        throw new Error('No role selected.');
      }

      const { roleId, roleName, datasetAccess } = selectedRole;

      if (!roleId || !roleName || !datasetAccess) {
        throw new Error('All fields are required.');
      }

      const payload = { ROLE_NAME: roleName, DATASET_ACCESS: datasetAccess };
      console.log('Payload:', payload);

      await axios.put(`http://127.0.0.1:5000/api/roles/${roleId}`, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const updatedRoles = roles.map((role) =>
        role.roleId === roleId ? { ...role, datasetAccess: datasetAccess } : role
      );
      setRoles(updatedRoles);

      setError(null);
      setSuccess(true);
      setSnackbarMessage('Role updated successfully');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error saving role:', error.response ? error.response.data : error.message);
      if (error.response && error.response.data) {
        console.error('Server response data:', error.response.data);
      }
      setError('Failed to save role. Please try again.');
      setSnackbarMessage('Failed to save role');
      setSnackbarOpen(true);
    }
  };

  const handleDeleteRole = async (roleId) => {
    try {
      await axios.delete(`http://127.0.0.1:5000/api/roles/${roleId}`);
      setRoles(roles.filter(role => role.roleId !== roleId));
      setError(null);
      setSuccess(true);
      setSnackbarMessage('Role deleted successfully');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error deleting role:', error.response ? error.response.data : error.message);
      setError('Failed to delete role. Please try again.');
      setSuccess(false);
      setSnackbarMessage('Failed to delete role');
      setSnackbarOpen(true);
    }
  };

  const handleOpenPopup = (role) => {
    setSelectedRole(role);
  };

  const handleClosePopup = () => {
    setSelectedRole(null);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  return (
    <Paper elevation={3} sx={{ p: 4, mt: 4, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom align="center">Edit Roles</Typography>
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
      <Table>
        <TableHead css={styles.tableHeader}>
          <TableRow>
            <TableCell>Role ID</TableCell>
            <TableCell>Role Name</TableCell>
            <TableCell>Dataset Access</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {roles.map((role, index) => (
            <TableRow key={role.roleId} css={styles.tableRow}>
              <TableCell>{role.roleId}</TableCell>
              <TableCell>{role.roleName}</TableCell>
              <TableCell>
                {role.datasetAccess.map((access) => (
                  <Chip key={access} label={access} />
                ))}
              </TableCell>
              <TableCell>
                <IconButton color="primary" onClick={() => handleOpenPopup(role)}>
                  <EditIcon />
                </IconButton>
                <IconButton color="secondary" onClick={() => handleDeleteRole(role.roleId)}>
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
      {selectedRole && (
        <Dialog open={true} onClose={handleClosePopup} maxWidth="md" fullWidth>
          <DialogTitle>Update Role</DialogTitle>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="h6">Role ID: {selectedRole.roleId}</Typography>
            <FormControl fullWidth margin="normal">
              <InputLabel id="role-name-label">Role Name</InputLabel>
              <Select
                labelId="role-name-label"
                id="roleName"
                value={selectedRole.roleName || ''}
                label="Role Name"
                onChange={(e) => setSelectedRole({ ...selectedRole, roleName: e.target.value })}
              >
                {roleOptions.map((roleOption) => (
                  <MenuItem key={roleOption.ROLE_ID} value={roleOption.ROLE_NAME}>
                    {roleOption.ROLE_NAME}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel id="dataset-access-label">Dataset Access</InputLabel>
              <Select
                labelId="dataset-access-label"
                id="datasetAccess"
                multiple
                value={selectedRole.datasetAccess || []}
                label="Dataset Access"
                onChange={(e) => handleUpdateDatasetAccess(roles.findIndex(role => role.roleId === selectedRole.roleId), e.target.value)}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {Array.isArray(selected) && selected.map((value) => (
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
                {roleOptions.map((roleOption) => (
                  <MenuItem key={roleOption.ROLE_ID} value={roleOption.DATASET_ACCESS}>
                    {roleOption.DATASET_ACCESS}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClosePopup}>Cancel</Button>
            <Button variant="contained" color="primary" onClick={() => { handleSaveRole(); handleClosePopup(); }}>
              Save
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Paper>
  );
};

export default EditUserRoles;
