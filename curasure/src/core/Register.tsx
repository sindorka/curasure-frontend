import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css"

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [theme, setTheme] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e: any) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5002/api/auth/register", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          role,
          theme,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      setMessage(data.message || "Registration successful!");

      if (data.token) {
        localStorage.setItem('authToken', data.token);
      }

      setTimeout(() => navigate("/login"), 2000);
    } catch (err: any) {
      console.error("Registration error:", err);
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="card">
        <h2 className="title">Create An Account</h2>
        {error && <p className="error-message">{error}</p>}
        {message && <p className="success-message">{message}</p>}
        <form onSubmit={handleRegister} className="register-form">
          <div className="input-group">
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="" disabled selected hidden>Select a role</option>
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
              <option value="insurance_provider">Insurance Provider</option>
            </select>
          </div>

          <div className="input-group">
            <select value={theme} onChange={(e) => setTheme(e.target.value)}>
              <option value="" disabled selected hidden>Select a theme</option>
              <option value="default">Default</option>
              <option value="dark">Dark</option>
              <option value="light">Light</option>
            </select>
          </div>

          <button className="button" type="submit">{loading ? "Loading..." : "Create Account"}</button>
          <p className="signinText">
            Already Have An Account? <a href="/curasure/login" className="signinLink">Login</a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;
