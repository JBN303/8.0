import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import ToggleOnOutlinedIcon from '@mui/icons-material/ToggleOnOutlined';

import AdminDashboard from './Interfac';

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);

  const toggleStatus = async (id) => {
    try {
      await axios.put(`http://localhost:5007/api/doctors/toggle/${id}`);
      // Refresh the doctor list after toggling the status
      const response = await axios.get('http://localhost:5007/api/doctors');
      setDoctors(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // Fetch data from the backend when the component mounts
    axios.get('http://localhost:5007/api/doctors')
      .then(response => setDoctors(response.data))
      .catch(error => console.error(error));
  }, []);

  return (
    <AppBar position="static" sx={{ backgroundColor: '#77d5cb' }}>
    <div>
      <AdminDashboard/>
        <Toolbar>
        
          <Typography variant="h6" component="div">
            Doctor List
          </Typography>
        </Toolbar>
      
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="doctor table" style={{marginLeft:"13%"}}>
          <TableHead>
            <TableRow>
              <TableCell style={{ fontWeight: 'bold' }}>Status</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>NMC UID</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Profile Photo</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Name</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Age</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Specialty</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Qualification</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Language</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Location</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Pincode</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Consultation Type</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Certificate</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>About</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Mobile Number</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Email</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}> Password</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}> Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {doctors.map(doctor => (
              <TableRow key={doctor._id}>
                <TableCell style={{ fontWeight: 'bold' }}>{doctor.status === 'active' ? 'Active' : 'Inactive'}</TableCell>
                <TableCell>{doctor.uid}</TableCell>
                <TableCell>{doctor.pic && <img src={`data:image/jpeg;base64,${doctor.pic}`} alt="Profile" style={{ width: '50px', height: '50px' }} />}</TableCell>
                <TableCell>{doctor.name}</TableCell>
                <TableCell>{doctor.age}</TableCell>
                <TableCell>{doctor.spec}</TableCell>
                <TableCell>{doctor.edu}</TableCell>
                <TableCell>{doctor.lang}</TableCell>
                <TableCell>
                    <a href={doctor.locat} target="_blank" rel="noopener noreferrer">
                      View Location
                    </a>
                  </TableCell>
                <TableCell>{doctor.conslt}</TableCell>
                <TableCell>{doctor.type}</TableCell>
                <TableCell> {doctor.cert && <img src={`data:image/jpeg;base64,${doctor.cert}`} alt="Certificate" style={{ width: '50px', height: '50px' }} />}</TableCell>
                
                <TableCell>{doctor.about}</TableCell>
                <TableCell>{doctor.phn}</TableCell>
                <TableCell>{doctor.email}</TableCell>
                <TableCell>{doctor.cpass}</TableCell>
                <TableCell>
                  
                <Button
                    
                    
                    startIcon={<ToggleOnOutlinedIcon />} style={{ color: '#77d5cb' }}
                    onClick={() => toggleStatus(doctor._id)}
                  >
                    
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

export default DoctorList;
