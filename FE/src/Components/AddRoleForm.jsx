import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, Paper, Alert, MenuItem, Select, FormControl, InputLabel, Chip } from '@mui/material';
import axios from 'axios';

const AddRoleForm = () => {
  const [roleName, setRoleName] = useState('');
  const [datasetAccess, setDatasetAccess] = useState([]);
  const [datasets, setDatasets] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchDatasets = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/distinctDatasets');
        setDatasets(response.data);
      } catch (error) {
        console.error('Failed to fetch datasets:', error);
        setError('Failed to fetch datasets');
      }
    };
    fetchDatasets();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!roleName || datasetAccess.length === 0) {
      setError('All fields are required');
      setSuccess(false);
      return;
    }
    setError(null);
    setSuccess(true);
    try {
      await axios.post('http://127.0.0.1:5000/api/role', { 
        ROLE_NAME: roleName,
        DATASET_ACCESS: datasetAccess 
      });
    } catch (error) {
      console.error('Failed to add role:', error);
      setError('Failed to add role. Please try again.');
      setSuccess(false);
    }
    setRoleName('');
    setDatasetAccess([]);
  };

  return (
    <Paper elevation={3} sx={{ p: 4, mt: 4, maxWidth: 600, mx: 'auto' }}>
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Typography variant="h5" gutterBottom align="center">Add Role to DataBuddy</Typography>
        <TextField
          margin="normal"
          required
          fullWidth
          id="roleName"
          label="Role Name"
          name="roleName"
          autoComplete="roleName"
          autoFocus
          value={roleName}
          onChange={(e) => setRoleName(e.target.value)}
        />
        <FormControl fullWidth margin="normal">
          <InputLabel id="datasetAccess-label">Dataset Access</InputLabel>
          <Select
            labelId="datasetAccess-label"
            id="datasetAccess"
            multiple
            value={datasetAccess}
            label="Dataset Access"
            onChange={(e) => setDatasetAccess(e.target.value)}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} />
                ))}
              </Box>
            )}
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 48 * 4.5 + 8, // 4.5 items visible
                  width: 600,
                  whiteSpace: 'normal',
                  overflowWrap: 'anywhere',
                },
              },
            }}
          >
            {datasets.map((dataset, index) => (
              <MenuItem key={index} value={dataset.DOMAIN_DETAILS}>
                <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                  <Box sx={{ flex: 1, paddingRight: 1, width: '100px' }}>{dataset.DOMAIN_DETAILS}</Box>
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
          <Alert severity="success">Role added successfully!</Alert>
        </Box>
      )}
    </Paper>
  );
};

export default AddRoleForm;
