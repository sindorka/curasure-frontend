import { Routes, Route } from 'react-router-dom' 
import Login from './components/core/Login' 
import Register from './components/core/Register'  

const AppRoutes = () => {   
  return (     
    <Routes>       
      <Route path="/login" element={<Login />} />       
      <Route path="/register" element={<Register />} />     
    </Routes>
  ) 
}  
export default AppRoutes
