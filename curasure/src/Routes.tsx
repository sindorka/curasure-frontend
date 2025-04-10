import { Routes, Route } from 'react-router-dom' 
import Login from './components/core/Login' 
import Register from './components/core/Register'  
import Dashdoc from './components/doctor/Dashboard';
import Doctorprofile from './components/doctor/Profile';
import AppointmentPage from './components/doctor/Appointment';
import Dashpatient from './components/patient/Dashboard';


const AppRoutes = () => {   
  return (     
    <Routes>       
      <Route path="/login" element={<Login />} />       
      <Route path="/register" element={<Register />} />     
      <Route path="/doctor/home" element={<Dashdoc/>} />
      <Route path='/doctor/profile' element={<Doctorprofile/>}/>
      <Route path='/doctor/appointment' element={<AppointmentPage/>}/>
      <Route path='/patient/home' element={<Dashpatient />}/>

    </Routes>
  ) 
}  
export default AppRoutes
