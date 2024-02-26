import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Typography,
  TextField,
  Button,
  Grid,
  Container,
  createTheme,
  ThemeProvider,
} from '@mui/material';
import styled from '@emotion/styled';

const theme = createTheme({
  palette: {
    primary: {
      main: '#77d5cb',
    },
  },
});

const CustomContainer = styled(Container)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginTop: '65px',
  backgroundColor: '#fff',
  borderRadius: '8px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
});

function EditProfile() {
  const { userId } = useParams();
  const [userData, setUserData] = useState({});

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:5007/api/doctors/${userId}`);
        setUserData(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5007/api/doctors/${userId}`, userData);
      alert('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile. Please try again.');
    }
  };

  return (
    <ThemeProvider theme={theme}>
    <CustomContainer maxWidth="md">
      <Typography variant="h5" align="center" gutterBottom>
        Edit Profile
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="NMC UID"
              name="uid"
              value={userData.uid || ''}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Full Name"
              name="name"
              value={userData.name || ''}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Age"
              name="age"
              value={userData.age || ''}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Specialization"
              name="spec"
              value={userData.spec || ''}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Education"
              name="edu"
              value={userData.edu || ''}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Experience"
              name="exp"
              value={userData.exp || ''}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Languages"
              name="lang"
              value={userData.lang || ''}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Location"
              name="locat"
              value={userData.locat || ''}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Consultation Fee"
              name="conslt"
              value={userData.conslt || ''}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Consultation Type"
              name="type"
              value={userData.type || ''}
              onChange={handleChange}
            />
          </Grid>


          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Phone Number"
              name="phn"
              value={userData.phn || ''}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={userData.email || ''}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="New Password"
              name="npass"
              type="password"
              value={userData.npass || ''}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Confirm Password"
              name="cpass"
              type="password"
              value={userData.cpass || ''}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="About"
              name="about"
              multiline
              rows={4}
              value={userData.about || ''}
              onChange={handleChange}
            />
          </Grid>
        </Grid>
        
        <Button type="submit"  variant="contained" style={{ marginTop: '20px' }}
              color="primary"
              fullWidth>
          Save Changes
        </Button>
        <Typography variant="h5" align="center" gutterBottom>
        
      </Typography>
        
      </form>
      </CustomContainer>
    </ThemeProvider>
  );
}

export default EditProfile;