import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, Paper, Table, TableHead, TableRow, TableCell, TableBody, Alert } from '@mui/material';
import { css } from '@emotion/react';
import apis from './apis'; 

const styles = {
  paperContainer: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 16px;
    margin-top: 16px;
    max-width: 800px;
    margin-left: auto;
    margin-right: auto;
  `,
  table: css`
    width: 100%;
    table-layout: fixed;
  `,
  tableCell: css`
    white-space: normal;
    word-wrap: break-word;
    text-align: left;
    max-width: 150px;
    line-height: 1.5; /* Adjust line-height for better readability */
    overflow: hidden; /* Hide overflow */
    text-overflow: ellipsis; /* Add ellipsis for overflow */
    display: -webkit-box;
    -webkit-line-clamp: 2; /* Limit to 2 lines */
    -webkit-box-orient: vertical;
  `,
  tableHeaderCell: css`
    text-align: left;
    font-weight: bold;
  `,
  dropdown: css`
    width: 150px; /* Match the width of the Role ID column */
  `,
};

const UserRolesTable = ({ endpoint }) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(endpoint);
        setData(response.data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setError('Failed to fetch data. Please try again.');
      }
    };

    if (endpoint) {
      fetchData();
    }
  }, [endpoint]);

  return (
    <Paper css={styles.paperContainer}>
      <Box>
        <Typography variant="h5" gutterBottom align="center">
          {endpoint === apis.users ? 'Users' : 'Roles'}
        </Typography>
        {error && (
          <Box sx={{ mt: 2 }}>
            <Alert severity="error">{error}</Alert>
          </Box>
        )}
        <Table css={styles.table}>
          <TableHead>
            <TableRow>
              {endpoint === apis.users ? (
                <>
                  <TableCell css={styles.tableHeaderCell}>User ID</TableCell>
                  <TableCell css={styles.tableHeaderCell}>Username</TableCell>
                  <TableCell css={styles.tableHeaderCell}>Role ID</TableCell>
                </>
              ) : (
                <>
                  <TableCell css={styles.tableHeaderCell}>Role ID</TableCell>
                  <TableCell css={styles.tableHeaderCell}>Role Name</TableCell>
                  <TableCell css={styles.tableHeaderCell}>Dataset Access</TableCell>
                </>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item, index) => (
              <TableRow key={index}>
                {endpoint === apis.users ? (
                  <>
                    <TableCell css={styles.tableCell}>{item.USER_ID}</TableCell>
                    <TableCell css={styles.tableCell}>{item.USER_NAME}</TableCell>
                    <TableCell css={styles.tableCell}>{item.ROLE_ID}</TableCell>
                  </>
                ) : (
                  <>
                    <TableCell css={styles.tableCell}>{item.ROLE_ID}</TableCell>
                    <TableCell css={styles.tableCell}>{item.ROLE_NAME}</TableCell>
                    <TableCell css={styles.tableCell}>{item.DATASET_ACCESS}</TableCell>
                  </>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Paper>
  );
};

export default UserRolesTable;
