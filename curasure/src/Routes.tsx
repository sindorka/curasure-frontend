
import { Route, Routes } from 'react-router-dom'
import Login from './core/Login'
import Register from './core/Register'

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" Component= {Login} />
      <Route path="/register" Component={Register} />
    </Routes>
  )
}

export default AppRoutes
