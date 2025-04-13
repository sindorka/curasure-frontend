import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './Layout.css'; // your existing CSS

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setIsLoggedIn(!!token);  // ✅ true if token exists
  }, [location]); // refresh state whenever route changes

  const getActiveClass = (path: string) => (location.pathname === path ? "nav-item active" : "nav-item");

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    navigate("/login");
    window.location.reload();  // refresh to update navbar
  };

  return (
    <div className="App">
      <nav className="navbar">
        <div className="navbar-left" onClick={() => navigate("/")}>CuraSure</div>

        <div className="navbar-center">
          <ul className="navbar-menu">
            <li className={getActiveClass("/")} onClick={() => navigate("/")}>Home</li>
            <li className={getActiveClass("/about")} onClick={() => navigate("/about")}>About</li>
            <li className={getActiveClass("/roles")} onClick={() => navigate("/roles")}>Roles</li>
            <li className={getActiveClass("/contact")} onClick={() => navigate("/contact")}>Contact</li>
          </ul>
        </div>

        <div className="navbar-right">
          {isLoggedIn ? (
            <button className="login-btn" onClick={handleLogout}>Logout</button>
          ) : (
            <button className="login-btn" onClick={() => navigate("/login")}>Log In</button>
          )}
        </div>
      </nav>

      <div className="page-content">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
