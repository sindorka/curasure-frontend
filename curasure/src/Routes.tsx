import { Routes, Route } from "react-router-dom"
import Login from "./components/core/Login"
import Register from "./components/core/Register"
import DoctorDashboard from "./components/core/DoctorDashboard";
import Doctorprofile from "./components/doctor/Profile";
import AppointmentPage from "./components/doctor/Appointment";
import PatientDashboard from "./components/core/PatientDashboard";
import InsuranceDetails from "./components/patient/InsuranceDetails";
import PatientProfilePage from "./components/patient/Profile";
import AppointmentSlots from "./components/patient/AppointmentSlots";
import ProtectedRoute from "./components/core/ProtectedRoutes";
import InsuranceProviderDashboard from "./components/core/InsuranceProviderDashboard";
import ForgotPasswordPage from "./components/core/ForgotPassword";
import ResetPasswordPage from "./components/core/ResetPassword";


const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/doctor-dashboard/:id" element={
        <ProtectedRoute>
          <DoctorDashboard />
        </ProtectedRoute>
      } />
      <Route path="/patient-dashboard/:id" element={
        <ProtectedRoute>
          <PatientDashboard />
        </ProtectedRoute>
      } />

      <Route path='/doctor/profile' element={<Doctorprofile />} />
      <Route path='/doctor/appointment' element={<AppointmentPage />} />
      <Route path='/patient/appointment' element={<AppointmentSlots />} />
      <Route path='/patient/insurance' element={<InsuranceDetails />} />
      <Route path='/patient/profile' element={< PatientProfilePage />} />

      <Route path="/insurance-dashboard/:id" element={
        <ProtectedRoute>
          <InsuranceProviderDashboard />
        </ProtectedRoute>
      } />
    </Routes>
  )
}
export default AppRoutes
