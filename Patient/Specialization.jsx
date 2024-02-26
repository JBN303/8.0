import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { CardActionArea, Modal, Box } from '@mui/material';
import { TextField } from '@mui/material';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import TabPanel from '@mui/material/Tabs';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import {MenuItem} from '@mui/material';
import { Select } from '@mui/material';

export default function SpecializationTabs() {
  const { id } = useParams();
  const [patientData, setPatientData] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
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
  const [value, setValue] = React.useState(0);

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

  useEffect(() => {
    // Update the filtered doctors when the value (tab) changes
    const filterDoctorsBySpecialization = () => {
      const selectedSpecialization = getSpecializationLabel(value);

      // Filter doctors based on the selected specialization
      const filtered = doctors.filter((doctor) => doctor.spec === selectedSpecialization);
      setFilteredDoctors(filtered);
    };

    filterDoctorsBySpecialization();
  }, [value, doctors]);

  const getSpecializationLabel = (index) => {
    switch (index) {
      case 0:
        return 'General Medicine';
      case 1:
        return 'Pediatrics';
      case 2:
        return 'diabetology & endocrinology';
      case 3:
        return 'Pulmonology';
      case 4:
        return 'Family Medicine';
      case 5:
        return 'General Physician';
      case 6:
        return 'Nutrition & Dietetics';
      // Add more cases for other specializations if needed
      default:
        return '';
    }
  };

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

      // You can customize the appointment details based on your requirements
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

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div>
      
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab label="General Medicine" />
          <Tab label="Pediatrics" />
          <Tab label="Diabetology & Endocrinology" />
          <Tab label="Pulmonology" />
          <Tab label="Family Medicine" />
          <Tab label="General Physician" />
          <Tab label="Nutrition & Dietetics" />
          {/* Add more tabs for other specializations */}
        </Tabs>
        

      {filteredDoctors.length > 0 ? (
        <div>
          <Box
            display="flex"
            flexWrap="wrap"
            sx={{
              flexGrow: 1,
              p: 3,
              backgroundColor: 'white',
            }}
          >
            {filteredDoctors.map((doctor) => (
              <Card key={doctor._id} sx={{ maxWidth: 345, margin: 2 }}>
                <CardActionArea>
                  <CardMedia
                    component="img"
                    height="140"
                    image={`data:image/jpeg;base64,${doctor.pic}`}
                    alt="Profile"
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {doctor.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Age: {doctor.age}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Specialty: {doctor.spec}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Language: {doctor.lang}
                    </Typography>
                    <Button onClick={() => handleOpenModal(doctor)} style={{ color: '#77d5cb' }}>
                      Book Appointment
                    </Button>
                  </CardContent>
                </CardActionArea>
              </Card>
            ))}
          </Box>
        </div>
      ) : (
        <p>No doctors available for the selected specialization.</p>
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
}
