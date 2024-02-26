import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Paper from '@mui/material/Paper';
import ToggleOnOutlinedIcon from '@mui/icons-material/ToggleOnOutlined';

import AdminDashboard from './Interfac';

const theme = createTheme();

const PatientView = () => {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5007/api/patients')
      .then(response => setPatients(response.data))
      .catch(error => console.error(error));
  }, []);

  const toggleStatus = async (id) => {
    try {
      await axios.put(`http://localhost:5007/api/patients/toggle/${id}`);

      // Update the local state instead of making a new API call
      setPatients(prevPatients => {
        return prevPatients.map(patient => {
          if (patient._id === id) {
            // Toggle the status locally
            return {
              ...patient,
              status: patient.status === 'active' ? 'inactive' : 'active'
            };
          }
          return patient;
        });
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
<AppBar position="static" sx={{ backgroundColor: '#77d5cb' }}>
    <div>
      <AdminDashboard/>
        <Toolbar>
        
          <Typography variant="h6" component="div">
            Patients List
          </Typography>
        </Toolbar>
      

        <TableContainer component={Paper}>
        
        <Table sx={{ minWidth: 650 }} aria-label="doctor table" style={{marginLeft:"13%"}}>
        <TableHead>
            <TableRow>
            <TableCell style={{ fontWeight: 'bold' }}>Status</TableCell>
                <TableCell >Name</TableCell>
                <TableCell >Address</TableCell>
                <TableCell >Phone</TableCell>
                <TableCell >Email</TableCell>
                <TableCell >Age</TableCell>
                <TableCell >Gender</TableCell>
                <TableCell >Username</TableCell>
                <TableCell >Password</TableCell>
                <TableCell >Change Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {patients.map(patient => (
                <TableRow  key={patient._id}>
                  <TableCell>{patient.status === 'active' ? 'Active' : 'Inactive'}</TableCell>
                  <TableCell>{patient.Name}</TableCell>
                  <TableCell>{patient.Address}</TableCell>
                  <TableCell>{patient.Phone}</TableCell>
                  <TableCell>{patient.Email}</TableCell>
                  <TableCell>{patient.Age}</TableCell>
                  <TableCell>{patient.Gender}</TableCell>
                  <TableCell>{patient.Username}</TableCell>
                  <TableCell>{patient.Password}</TableCell>
                  <TableCell>
                  <Button
                    
                    
                    startIcon={<ToggleOnOutlinedIcon />} style={{ color: '#77d5cb' }} onClick={() => toggleStatus(patient._id)}>
                      
                    </Button>
                    </TableCell>
                </TableRow>
              ))}
             </TableBody>
        </Table>
      </TableContainer>
    </div>
    </AppBar>
  );
};

export default PatientView;