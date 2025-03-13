import React, { useState } from 'react';
import { Box, Typography, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import UserRolesTable from './UserRolesTable';
import apis from './apis'; 

const UserRolesPage = () => {
  const [selectedTable, setSelectedTable] = useState('');

  const handleTableChange = (event) => {
    setSelectedTable(event.target.value);
  };

  return (
    <Box sx={{ textAlign: 'center', mt: 4 }}>
      <Typography variant="h4" gutterBottom>User Roles Management</Typography>
      <FormControl sx={{ mt: 4, minWidth: 200 }}>
        <InputLabel id="select-table-label">Select Table</InputLabel>
        <Select
          labelId="select-table-label"
          id="select-table"
          value={selectedTable}
          onChange={handleTableChange}
        >
          <MenuItem value={apis.users}>Get All Users</MenuItem>
          <MenuItem value={apis.roles}>Get All Roles</MenuItem>
        </Select>
      </FormControl>
      {selectedTable && <UserRolesTable endpoint={selectedTable} />}
    </Box>
  );
};

export default UserRolesPage;
