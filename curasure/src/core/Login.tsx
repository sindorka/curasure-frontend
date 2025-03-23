import { useState } from "react";
import "./Login.css";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

//   const generateCaptchaToken = () => {
//     return "10000000-aaaa-bbbb-cccc-000000000001";
//   };

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);


    if (!email || !password || !role || !captcha) {
      setError("All fields are required");
      setLoading(false);
      return;
    }

    try {
        const response = await fetch('http://localhost:5002/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
            role,
            captchaToken: captcha,
          }),
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Login failed');
        }
        
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('userData', JSON.stringify(data.user));
        
        setSuccess(true);
        console.log('Login successful:', data);
        
        // window.location.href = '/dashboard';
        
      } catch (err: any) {
        setError(err.message || 'Something went wrong. Please try again.');
        console.error('Login error:', err);
      } finally {
        setLoading(false);
      }
    };

  const refreshCaptcha = () => {
    // generate a new captcha here
    setCaptcha("");
    // update the captcha image
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Login</h2>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">Login successful!</div>}
        
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="login-input"
            required
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="login-input"
            required
          />

          <select 
            value={role} 
            onChange={(e) => setRole(e.target.value)}
            className="login-select"
            required
          >
            <option value="" disabled hidden>Select a role</option>
            <option value="patient">Patient</option>
            <option value="doctor">Doctor</option>
            <option value="insurance">Insurance Provider</option>
          </select>

          <div className="captcha-container">
            <div className="captcha-img">CAPTCHA</div>
            <button 
              type="button" 
              className="refresh-captcha"
              onClick={refreshCaptcha}
            >
              Refresh Captcha
            </button>
          </div>

          <input
            type="text"
            value={captcha}
            onChange={(e) => setCaptcha(e.target.value)}
            placeholder="Enter Captcha"
            className="login-input"
            required
          />

          <button 
            type="submit" 
            className="login-btn" 
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        
        <div className="login-links">
          <a href="/forgot-password" className="forgot-password-link">Forgot Password?</a>
          <p className="newUserText">New user? <a href="/curasure/register" className="register-link">Register here</a></p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;