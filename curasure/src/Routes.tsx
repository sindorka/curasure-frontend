import { Routes, Route } from 'react-router-dom' 
import Login from './core/Login' 
import Register from './core/Register'  

const AppRoutes = () => {   
  return (     
    <Routes>       
      <Route path="/login" element={<Login />} />       
      <Route path="/register" element={<Register />} />     
    </Routes>
  ) 
}  
export default AppRoutes
