import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
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
  marginTop: '200px',
  backgroundColor: '#fff',
  padding: '2rem',
  borderRadius: '8px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
});

const Plogin = () => {
  const [patientEmail, setPatientEmail] = useState('');
  const [patientPassword, setPatientPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!patientEmail || !patientPassword) {
      setError('Please enter both email and password.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5007/api/plogin', {
        email: patientEmail,
        password: patientPassword,
      });

      navigate(`/psidebar/${response.data._id}`);  // navigate to patient's user page with patient's _id
      console.log(response.data);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('An error occurred. Please try again.');
      }
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <center>
      <CssBaseline />
      <CustomContainer component="main" maxWidth="xs">
        <form onSubmit={handleSubmit}>
        <Typography component="h1" variant="h5">
            Welcome Back!
          </Typography>
          <Typography variant="subtitle1">Login with your details to continue</Typography>
          <TextField
            type="email"
            name="Patientemail"
            label="Email Address"
            variant="outlined"
            fullWidth
            margin="normal"
            value={patientEmail}
            onChange={(e) => setPatientEmail(e.target.value)}
            required
          />
          <TextField
            type="password"
            name="Patientpassword"
            label="Password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={patientPassword}
            onChange={(e) => setPatientPassword(e.target.value)}
            required
          />
          {error && (
            <Typography color="error" style={{ textAlign: 'center', marginTop: '10px' }}>
              {error}
            </Typography>
          )}
          <Button type="submit" variant="contained" color="primary" fullWidth style={{ marginTop: '10px' }}>
            Login
          </Button>
          <Typography variant="subtitle1" style={{ fontWeight: '280', marginTop: '10px' }}>
            Don't have an account? <Link to="/patient-signup">Sign Up</Link>
          </Typography>
        </form>
      </CustomContainer>
      </center>
    </ThemeProvider>
  );
};

export default Plogin;