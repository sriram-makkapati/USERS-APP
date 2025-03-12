import React, { useState } from 'react';
import { Container, Box } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AddUserForm from './Components/AddUserForm';
import AddRoleForm from './Components/AddRoleForm';
import EditUserRoles from './Components/EditUserRoles';
import Header from './Components/Header';
import Footer from './Components/Footer';
import HomePage from './Components/Homepage';
import UserRolesPage from './Components/UserRolesPage';
import ManageRoles from './Components/ManageRoles';  // Import ManageRoles component

const App = () => {
  const [submittedData, setSubmittedData] = useState([]);

  const addUserData = (data) => {
    setSubmittedData((prevData) => [...prevData, data]);
  };

  return (
    <Router>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <Container sx={{ flexGrow: 1, mt: 4 }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/add-user" element={<AddUserForm addUserData={addUserData} />} />
            <Route path="/add-role" element={<AddRoleForm addUserData={addUserData} />} />
            <Route path="/edit-roles" element={<EditUserRoles submittedData={submittedData} />} />
            <Route path="/user-roles" element={<UserRolesPage />} />
            <Route path="/manage-roles" element={<ManageRoles />} />  {/* Add the route for ManageRoles */}
          </Routes>
        </Container>
        <Footer />
      </Box>
    </Router>
  );
};

export default App;
