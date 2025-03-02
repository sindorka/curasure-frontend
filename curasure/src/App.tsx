// App.tsx
import { BrowserRouter as Router, Link, Route, Routes, useNavigate } from 'react-router-dom'
import './App.css'
import AppRoutes from './Routes'

function App() {
  const navigate = useNavigate()
  const onClickHandler = () => navigate(`/login`)
  
  return (
    <Router
      basename='/curasure'
    >
      <div>
        <h1>Welcome to CuraSure - Be Sure With CuraSure</h1>
        <p>Main welcome page with some app info</p>
        <div>
          <Link to="/login" onClick={onClickHandler}>Login</Link>
          <Link to="/signup">Sign Up</Link>
        </div>

        <AppRoutes />
      </div>
    </Router>
  )
}

export default App
