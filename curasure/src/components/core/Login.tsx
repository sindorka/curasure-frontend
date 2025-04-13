import { useState, useRef, useEffect } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import "./Login.css";
import { useNavigate } from "react-router-dom";


function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [siteKey, setSiteKey] = useState("");
  const recaptchaRef = useRef<ReCAPTCHA | null>(null);
  const navigate = useNavigate();


  useEffect(() => {
    // Fetch the site key when component mounts
    const fetchSiteKey = async () => {
      try {
        const response = await fetch('http://localhost:5002/api/auth/recaptcha-key');
        const data = await response.json();
        setSiteKey(data.siteKey);
      } catch (error) {
        console.error("Failed to fetch reCAPTCHA site key:", error);
        setError("Failed to load CAPTCHA. Please try again later.");
      }
    };

    fetchSiteKey();
  }, []);

  const handleCaptchaChange = (token: any) => {
    setCaptchaToken(token);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
  
    if (!email || !password || !role || !captchaToken) {
      setError("All fields are required, including CAPTCHA verification");
      setLoading(false);
      return;
    }
  
    try {
      const response = await fetch("http://localhost:5002/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          role,
          captchaToken,
        }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }
  
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("userData", JSON.stringify(data.user));
  
      const userId = data.user.id;   // This is USER id
      const userRole = data.user.role;
  
      if (userRole === "doctor") {
        // 🛠️ NEW: Fetch doctor by name (since you have name)
        const doctorSearchResponse = await fetch(`http://localhost:5002/api/doctors/search?name=${data.user.name}`);
        const doctors = await doctorSearchResponse.json();
  
        if (doctorSearchResponse.ok && doctors.length > 0) {
          const doctorId = doctors[0]._id;  // ✅ Correct doctor id
          navigate(`/doctor-dashboard/${doctorId}`);
        } else {
          throw new Error("Doctor profile not found. Please complete your profile.");
        }
      } else if (userRole === "patient") {
        navigate(`/patient-dashboard/${userId}`);
      } else if (userRole === "insurance_provider") {
        navigate(`/insurance-dashboard/${userId}`);
      } else {
        setError("Unknown user role. Cannot redirect.");
      }
  
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
      console.error("Login error:", err);
      if (recaptchaRef.current) {
        recaptchaRef.current.reset();
      }
      setCaptchaToken("");
    } finally {
      setLoading(false);
    }
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
              <option value="insurance_provider">Insurance Provider</option>
            </select>

            {siteKey && (
                <div className="captcha-container">
                  <ReCAPTCHA
                      ref={recaptchaRef}
                      sitekey={siteKey}
                      onChange={handleCaptchaChange}
                  />
                </div>
            )}

            <button
                type="submit"
                className="login-btn"
                disabled={loading || !captchaToken}
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