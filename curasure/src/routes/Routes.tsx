// import { Routes, Route } from 'react-router-dom'
// import Login from '../components/core/Login'
// import Register from '../components/core/Register'
// import DoctorDashboard from '../components/doctor/Dashboard';
// import Doctorprofile from '../components/doctor/Profile';
// import AppointmentPage from '../components/doctor/Appointment';
// import PatientDashboard from '../components/patient/Dashboard';
// import InsuranceDetails from '../components/patient/InsuranceDetails';
// import PatientProfilePage from '../components/patient/Profile';
// import AppointmentSlots from '../components/patient/AppointmentSlots';
// import ProtectedRoute from './ProtectedRoutes';


// const AppRoutes = () => {
//   return (
//     <Routes>
//       <Route path="/login" element={<Login />} />
//       <Route path="/register" element={<Register />} />
//       {/* <Route path="/doctor/home" element={<DoctorDashboard />} /> */}
//       <Route
//         path="/doctor/home"
//         element={
//           <ProtectedRoute role="doctor">
//             <DoctorDashboard />
//           </ProtectedRoute>
//         }
//       />
//       <Route path='/doctor/profile' element={<Doctorprofile />} />
//       <Route path='/doctor/appointment' element={<AppointmentPage />} />
//       <Route path='/patient/home' element={<PatientDashboard />} />
//       <Route path='/patient/appointment' element={<AppointmentSlots />} />
//       <Route path='/patient/insurance' element={<InsuranceDetails />} />
//       <Route path='/patient/profile' element={< PatientProfilePage />} />
//     </Routes>
//   )
// }
// export default AppRoutes


import { Routes, Route, Navigate } from 'react-router-dom'
import Login from '../components/core/Login'
import Register from '../components/core/Register'
import DoctorDashboard from '../components/doctor/Dashboard';
import Doctorprofile from '../components/doctor/Profile';
import AppointmentPage from '../components/doctor/Appointment';
import PatientDashboard from '../components/patient/Dashboard';
import InsuranceDetails from '../components/patient/InsuranceDetails';
import PatientProfilePage from '../components/patient/Profile';
import AppointmentSlots from '../components/patient/AppointmentSlots';
import ProtectedRoute from './ProtectedRoutes';
import { useAppSelector } from '../redux/hooks';

const AppRoutes = () => {
  const { token } = useAppSelector((state) => state.auth);
  console.log('routes', token);
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={token ? <Login /> : <Navigate to="/" />} />
      <Route path="/register" element={token ? <Register /> : <Navigate to="/" />} />

      {/* Default route - redirect based on auth status */}
      <Route path="/" element={!token ? <Navigate to="/login" /> : <Navigate to="/dashboard" />} />

      <Route
        path="/doctor/home"
        element={
          <ProtectedRoute role="doctor">
            <DoctorDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor/profile"
        element={
          <ProtectedRoute role="doctor">
            <Doctorprofile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor/appointment"
        element={
          <ProtectedRoute role="doctor">
            <AppointmentPage />
          </ProtectedRoute>
        }
      />

      {/* Protected routes for patients */}
      <Route
        path="/patient/home"
        element={
          <ProtectedRoute role="patient">
            <PatientDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/patient/appointment"
        element={
          <ProtectedRoute role="patient">
            <AppointmentSlots />
          </ProtectedRoute>
        }
      />
      <Route
        path="/patient/insurance"
        element={
          <ProtectedRoute role="patient">
            <InsuranceDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/patient/profile"
        element={
          <ProtectedRoute role="patient">
            <PatientProfilePage />
          </ProtectedRoute>
        }
      />

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AppRoutes;