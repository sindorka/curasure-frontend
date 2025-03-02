
import { Route, Routes } from 'react-router-dom'
import Login from './core/Login'
import Signup from './core/SignUp'

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" Component= {Login} />
      <Route path="/signup" Component={Signup} />
    </Routes>
  )
}

export default AppRoutes
