import { Routes, Route } from 'react-router-dom'
import Login from './components/core/Login'
import Register from './components/core/Register'
import DoctorDashboard from './components/doctor/Dashboard';
import Doctorprofile from './components/doctor/Profile';
import AppointmentPage from './components/doctor/Appointment';
import PatientDashboard from './components/patient/Dashboard';
import InsuranceDetails from './components/patient/InsuranceDetails';
import PatientProfilePage from './components/patient/Profile';
import AppointmentSlots from './components/patient/AppointmentSlots';


const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/doctor/home" element={<DoctorDashboard />} />
      <Route path='/doctor/profile' element={<Doctorprofile />} />
      <Route path='/doctor/appointment' element={<AppointmentPage />} />
      <Route path='/patient/home' element={<PatientDashboard />} />
      <Route path='/patient/appointment' element={<AppointmentSlots />} />
      <Route path='/patient/insurance' element={<InsuranceDetails />} />
      <Route path='/patient/profile' element={< PatientProfilePage />} />


    </Routes>
  )
}
export default AppRoutes
