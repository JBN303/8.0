import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Typography, Box, Modal, Card, CardContent } from '@mui/material';
import CardMedia from '@mui/material/CardMedia';
import { CardActionArea, Select } from '@mui/material';
import { TextField, MenuItem} from '@mui/material';
import { useParams } from 'react-router-dom';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

const Nearby = () => {
  const { id } = useParams();
  const [patientData, setPatientData] = useState(null);
  const [pincode, setPincode] = useState('');
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

  const handleSearch = () => {
    const filtered = doctors.filter((doctor) => doctor.conslt === pincode);
    setFilteredDoctors(filtered);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAppointmentDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
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

      const response = await axios.post(`http://localhost:5007/api/appointments/${doctorId}`, appointmentDetailsToSend);

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

  return (
    <div>
      <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <TextField
          label="Search by Pincode"
          variant="outlined"
          value={pincode}
          onChange={(e) => setPincode(e.target.value)}
        />
        <Button variant="contained" onClick={handleSearch} style={{ marginLeft: '10px' }}>
          Search
        </Button>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <Typography variant="h5">Nearby Doctors</Typography>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px', flexWrap: 'wrap' }}>
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

export default Nearby;
