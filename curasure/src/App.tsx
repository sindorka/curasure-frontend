import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import AppRoutes from './Routes';

function App() {
  return (
    <Router basename='/curasure'>
      <Routes>
        <Route path="/" element={
          <div>
            <h1>Welcome to CuraSure - Be Sure With CuraSure</h1>
            <p>Main welcome page with some app info</p>
            <div>
              <a href="/curasure/login">Login</a>
              <a href="/curasure/register">Register</a>
            </div>
          </div>
         } /> 
        <Route path="/*" element={<AppRoutes />} />
      </Routes>
    </Router>
  );
}

export default App;
