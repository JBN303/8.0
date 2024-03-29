import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import EventNoteIcon from '@mui/icons-material/EventNote';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LogoutIcon from '@mui/icons-material/Logout';
import CheckCircleOutlineTwoToneIcon from '@mui/icons-material/CheckCircleOutlineTwoTone';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';
import Loading from "./Loading"; 
import DeleteIcon from '@mui/icons-material/Delete';


const drawerWidth = 240;

const DoctorPage = () => {
  const [doctorDetails, setDoctorDetails] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const { userId } = useParams();
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login', { replace: true });
  };

useEffect(() => {
  const fetchData = async () => {
    try {
      const [doctorResponse, appointmentsResponse] = await Promise.all([
        axios.get(`http://localhost:5007/api/doctors/${userId}`),
        axios.get(`http://localhost:5007/api/appointments/${userId}`)
      ]);

      // Simulate a minimum loading time of 1 minute
      setTimeout(() => {
        setDoctorDetails(doctorResponse.data);
        setAppointments(appointmentsResponse.data);
        setIsLoading(false); // Set loading to false after fetching data
      }, 5000); // 60000 milliseconds = 1 minute
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  fetchData();
}, [userId]);

  const handleAppointmentStatusChange = async (appointmentId, newStatus) => {
    try {
      await axios.put(`http://localhost:5007/api/appointments/status/${appointmentId}`, { status: newStatus });
      // Update the appointments state after successful update
      const updatedAppointments = appointments.map(appointment => {
        if (appointment._id === appointmentId) {
          return { ...appointment, status: newStatus };
        }
        return appointment;
      });
      setAppointments(updatedAppointments);
    } catch (error) {
      console.error('Error updating appointment status:', error);
    }
  };

  const handleEditAppointment = (appointment) => {
    setEditData(appointment);
    setEditMode(true);
  };

  const handleDeleteAppointment = async (appointmentId) => {
    try {
      await axios.delete(`http://localhost:5007/api/appointments/${appointmentId}`);
      // Remove the deleted appointment from the appointments state
      setAppointments(appointments.filter(appointment => appointment._id !== appointmentId));
    } catch (error) {
      console.error('Error deleting appointment:', error);
    }
  };

  const handleSaveEdit = async () => {
    try {
      // Make an API call to update the appointment with editData
      await axios.put(`http://localhost:5007/api/appointments/${editData._id}`, editData);
      // Reset edit mode after successful update
      setEditMode(false);
    } catch (error) {
      console.error('Error saving appointment:', error);
    }
  };
  

  if (!doctorDetails) {
    return <Loading />;
  }

  return (
    <Box sx={{ display: 'flex', backgroundColor: 'white' , minHeight: 1000}}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ backgroundColor: '#77d5cb', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6" noWrap component="div">
            Docere
          </Typography>
          <Button component={Link} to={`/edit/${userId}`} color="inherit">
            Edit Profile
          </Button>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            <Typography>
              {doctorDetails.pic && (
                <img
                  src={`data:image/jpeg;base64,${doctorDetails.pic}`}
                  alt="Profile"
                  style={{ width: drawerWidth, height: '200px' }}
                />
              )}
            </Typography>
            <Typography sx={{ fontSize: 25 }}>{doctorDetails.name}</Typography>
            <Typography>{doctorDetails.spec}</Typography>
          </List>
          <Divider />
          <List>
            {['Appointments⋗'].map((text, index) => (
              <ListItem key={text} disablePadding>
                <ListItemButton>
                  <ListItemIcon> <EventNoteIcon/></ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>

          <Divider />
          <List>
            <ListItem button onClick={handleLogout}>
              <ListItemButton>
                <ListItemIcon>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Typography paragraph>
          <Typography variant="h6" gutterBottom component="div"></Typography>

          {appointments.map((appointment) => (
            <Accordion key={appointment._id}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel-${appointment._id}-content`}
                id={`panel-${appointment._id}-header`}
              >
                
                <Typography sx={{ width: '33%', flexShrink: 0 }}>
                   {appointment.patientName}
                </Typography>
                <Typography sx={{ color: 'text.secondary' }}>{appointment.status}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Card>
                  <CardContent>
                  {!editMode && (
                  <>
                    <Typography variant="body2" color="text.secondary">
                      Appointment no: {appointment.appno}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Age: {appointment.age}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                    appointment date: {appointment.date}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                    preferred time: {appointment.day}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                    appointment time: {appointment.time}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Contact No: {appointment.patientContactNo}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Email: {appointment.patientEmail}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Purpose: {appointment.purpose}
                    </Typography>
                    <Button onClick={() => handleEditAppointment(appointment)} style={{ color: '#77d5cb' }}>
                      add
                    </Button>
                    <Button onClick={() => handleAppointmentStatusChange(appointment._id, 'successful')} style={{ color: '#77d5cb' }}>
                      Confirm
                    </Button>
                    <Button onClick={() => handleDeleteAppointment(appointment._id)}>
                      <DeleteIcon />
                    </Button>

                  </>
                )}
                {editMode && appointment._id === editData._id && (
                  <>
                  <p>appointment no.</p>
                    <input
                      type="number"
                      value={editData.appno}
                      onChange={(e) => setEditData({ ...editData, appno: e.target.value })}
                    />
                    <br/>
                    <p>appointment date & time</p>
                    <input
                      type="date"
                      value={editData.date}
                      onChange={(e) => setEditData({ ...editData, date: e.target.value })}
                    />
                    <input
                      type="time"
                      value={editData.time}
                      onChange={(e) => setEditData({ ...editData, time: e.target.value })}
                    />
                    <br/>
                    <p>message</p>
                     <textarea
                      type="textarea"
                      value={editData.msg}
                      onChange={(e) => setEditData({ ...editData, msg: e.target.value })}
                    />
                    <br/>
                    <Button onClick={handleSaveEdit} style={{ color: '#77d5cb' }}>Save</Button>
                    <Button onClick={() => setEditMode(false)} style={{ color: '#77d5cb' }}>Cancel</Button>
                  </>
                )}
                  </CardContent>
                </Card>
              </AccordionDetails>
            </Accordion>
          ))}
        </Typography>
      </Box>
    </Box>
  );
};

export default DoctorPage;
