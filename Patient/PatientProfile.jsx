import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { CardActionArea, Modal, Box, Select } from '@mui/material';
import { TextField, MenuItem} from '@mui/material';
import { Label } from '@mui/icons-material';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Loading from '../Doctor/Loading';


const PatientProfile = () => {
  const { id } = useParams();
  const [patientData, setPatientData] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [appointmentDetails, setAppointmentDetails] = useState({
    appno:'',
    patientName: '',
    age: '',
    date: '', // New input for date
    day: 'Any',
    purpose: '',
    time:'',
    msg:'',
  });
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [noDoctorsFound, setNoDoctorsFound] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch patient data
        const patientResponse = await axios.get(`http://localhost:5007/api/patients/${id}`);
        setPatientData(patientResponse.data);

        // Fetch list of doctors
        const doctorsResponse = await axios.get('http://localhost:5007/api/doctors');
        setDoctors(doctorsResponse.data);
      } catch (error) {
        console.error('Error fetching patient data or doctors:', error);
      }
    };

    fetchData();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAppointmentDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleAppointmentSubmit = () => {
    // You can handle the appointment submission logic here
    console.log('Appointment Details:', appointmentDetails);
    // Add your logic to submit the appointment details to the server or perform any other actions
    // For demonstration purposes, we'll just close the modal here
    handleCloseModal();
  };

  const handleOpenModal = (doctor) => {
    setSelectedDoctor(doctor);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleBookAppointment = async (doctorId) => {
    try {
      const selectedDoctor = doctors.find((doctor) => doctor._id === doctorId);
  
      // Include patientId in the appointment details
      const appointmentDetailsToSend = {
        patientId: id,
        doctorId,
        appno: appointmentDetails.appno,
        patientName: appointmentDetails.patientName,
        age: appointmentDetails.age,
        date: appointmentDetails.date,
        day: appointmentDetails.day,
        purpose: appointmentDetails.purpose,
        time: appointmentDetails.time,
        msg: appointmentDetails.msg,
        doctorName: selectedDoctor.name,
        doctorLocation: selectedDoctor.locat,
        patientEmail: patientData.Email, // Make sure patientData contains email
        patientContactNo: patientData.Phone, // Make sure patientData contains phone number
      };
      
  
      // Send appointment details to the server
      const response = await axios.post(`http://localhost:5007/api/appointments/${doctorId}`, appointmentDetailsToSend);
  
      // Log the response or handle it as needed
      console.log('Appointment booked successfully:', response.data);
      setAppointmentDetails({
        appno:'',
        patientName: '',
        age: '',
        date: '', //  New input for date
        day: 'any',
        purpose: '',
        time:'',
        msg:'',
      });
      
      alert("Appointment successful");
  
      handleCloseModal();
    } catch (error) {
      console.error('Error booking appointment:', error);
    }
  };

  const handleSearch = (query) => {
    const filtered = doctors.filter((doctor) =>
      doctor.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredDoctors(filtered);
    setNoDoctorsFound(filtered.length === 0);
  };
  
  

  return (
    <div>
            <TextField
        label="Search Doctor"
        variant="outlined"
        fullWidth
        margin="normal"
        onChange={(e) => handleSearch(e.target.value)}
      />
      {noDoctorsFound && <Typography variant="h6">No doctors found.</Typography>}
      {patientData ? (
        <div >
          <Box
            display="flex"
            flexWrap="wrap"
            justifyContent="space-between" 
            sx={{
              flexGrow: 1,
              p: 3,
              
            }}
          >
            {(filteredDoctors.length ? filteredDoctors : doctors).map((doctor) => (
                 <Card key={doctor._id} sx={{ display: 'flex' }}>
                                   <CardMedia
                    component="img"
                 height="140"
                 image={`data:image/jpeg;base64,${doctor.pic}`}
                 alt="Profile"
                 />
                 <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                   <CardContent sx={{ flex: '1 0 auto' }}>
                     <Typography component="div" variant="h5">
                     {doctor.name}
                     </Typography>
                     <Typography variant="subtitle1" color="text.secondary" component="div">
                     {doctor.age}
                     </Typography>
                     <Typography variant="subtitle1" color="text.secondary" component="div">
                     {doctor.spec}
                     </Typography>
                     <Typography variant="subtitle1" color="text.secondary" component="div">
                     {doctor.lang}
                     </Typography>
                     <Button onClick={() => handleOpenModal(doctor)} style={{ color: '#77d5cb' }}>
        Book Appointment
      </Button>
                   </CardContent>

                 </Box>

               </Card>

            ))}
          </Box>
        </div>
      ) : (
        <p>Loading...</p>
      )}
      {selectedDoctor && (
        <Modal
          open={openModal}
          onClose={handleCloseModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 400,
              bgcolor: 'background.paper',
              boxShadow: 24,
              p: 4,
            }}
          >
            <Typography id="modal-modal-title" variant="h6" component="h2">
              {selectedDoctor.name}
            </Typography>
            <TextField
              label="Patient Name"
              variant="outlined"
              fullWidth
              margin="normal"
              name="patientName"
              value={appointmentDetails.patientName}
              onChange={handleInputChange}
            />
            <TextField
              label="Age"
              variant="outlined"
              fullWidth
              margin="normal"
              name="age"
              value={appointmentDetails.age}
              onChange={handleInputChange}
            />
            <Typography>date</Typography>
            <TextField
              
              type="date" // Input type for date
              variant="outlined"
              fullWidth
              margin="normal"
              name="date"
              value={appointmentDetails.date}
              onChange={handleInputChange}
            />
            <FormControl fullWidth variant="outlined" margin="normal">
        <InputLabel htmlFor="time">Time</InputLabel>
            <Select
              id="time"
              name="day"
              value={appointmentDetails.day}
              onChange={handleInputChange}
              style={{ width: '100%', marginBottom: '16px' }}
            >
              <MenuItem value="morning">Any</MenuItem>
              <MenuItem value="morning">Morning</MenuItem>
              <MenuItem  value="noon">Noon</MenuItem >
              <MenuItem  value="evening">Evening</MenuItem >
            </Select>
            </FormControl>
            
            <TextField
              label="Purpose of Appointment"
              variant="outlined"
              fullWidth
              margin="normal"
              name="purpose"
              value={appointmentDetails.purpose}
              onChange={handleInputChange}
            />
            <Button onClick={() => handleBookAppointment(selectedDoctor._id)} style={{ color: '#77d5cb' }}>
              BOOK NOW
            </Button>
          </Box>
        </Modal>
      )}
    </div>
  );
};

export default PatientProfile;