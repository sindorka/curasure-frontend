import { Routes, Route } from 'react-router-dom' 
import Login from './core/Login' 
import Register from './core/Register'  
import Dashdoc from './doctor/Dashdoc';
import Doctorprofile from './doctor/Doctorprofile';
import AppointmentPage from './doctor/Appointment';
import Dashpatient from './patient/Dashpatient';


const AppRoutes = () => {   
  return (     
    <Routes>       
      <Route path="/login" element={<Login />} />       
      <Route path="/register" element={<Register />} />     
      <Route path="/dashdoc" element={<Dashdoc/>} />
      <Route path='/doctor/profile' element={<Doctorprofile/>}/>
      <Route path='/doctor/appointment' element={<AppointmentPage/>}/>
      <Route path='/dashpat' element={<Dashpatient />}/>

    </Routes>
  ) 
}  
export default AppRoutes
