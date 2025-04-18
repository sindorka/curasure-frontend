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
    const fetchSiteKey = async () => {
      try {
        const response = await fetch('http://localhost:5002/api/auth/recaptcha-key');
        const data = await response.json();
        setSiteKey(data.siteKey);
      } catch (error) {
        console.error("❌ Failed to fetch reCAPTCHA site key:", error);
        setError("Failed to load CAPTCHA. Please try again later.");
      }
    };
    fetchSiteKey();
  }, []);

  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      console.log("📩 Received postMessage:", event.data);
  
      if (event.origin !== "http://localhost:5002") {
        console.warn("⚠️ Rejected message from unexpected origin:", event.origin);
        return;
      }
  
      if (event.data?.duoLoginSuccess) {
        const user = event.data.user;
        const token = event.data.token;
  
        localStorage.setItem("authToken", token);
        localStorage.setItem("userData", JSON.stringify(user));
  
        try {
          if (user.role === "doctor") {
            console.log("👨‍⚕️ Redirecting to doctor dashboard...");
            const res = await fetch(`http://localhost:5002/api/doctors/search?name=${user.name}`);
            const doctors = await res.json();
            if (res.ok && doctors.length > 0) {
              console.log("🔁 Navigating to:", `/doctor-dashboard/${doctors[0]._id}`);
              navigate(`/doctor-dashboard/${doctors[0]._id}`);
            } else {
              throw new Error("Doctor profile not found");
            }
          } else if (user.role === "patient") {
            console.log("🧑‍⚕️ Redirecting to patient dashboard...");
            const res = await fetch(`http://localhost:5002/api/patients/search?name=${user.name}`);
            const patients = await res.json();
            if (res.ok && patients.length > 0) {
              console.log("🔁 Navigating to:", `/patient-dashboard/${patients[0]._id}`);
              navigate(`/patient-dashboard/${patients[0]._id}`);
            } else {
              throw new Error("Patient profile not found");
            }
          } else if (user.role === "insurance_provider") {
            console.log("💼 Redirecting to insurance dashboard...");
            const res = await fetch(`http://localhost:5002/api/insurance-provider/search?name=${user.name}`);
            const providers = await res.json();
            if (res.ok && providers.length > 0) {
              const provider = providers[0];
              const completeProvider = {
                ...user,
                companyName: provider.companyName,
                _id: provider._id,
              };
              localStorage.setItem("userData", JSON.stringify(completeProvider));
              console.log("🔁 Navigating to:", `/insurance-dashboard/${provider._id}`);
              navigate(`/insurance-dashboard/${provider._id}`);
            } else {
              throw new Error("Insurance provider profile not found");
            }
          } else {
            console.log("🔁 Navigating to home");
            navigate("/");
          }
  
          setSuccess(true);
        } catch (err: any) {
          console.error("❌ Post-login error:", err.message);
          setError(err.message || "Login succeeded, but profile lookup failed.");
        }
      }
    };
  
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [navigate]);
  

  const handleCaptchaChange = (token: any) => {
    setCaptchaToken(token);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    if (!email || !password || !role || !captchaToken) {
      setError("All fields are required, including CAPTCHA");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:5002/api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role, captchaToken }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Login failed");

      const popup = window.open(data.duoAuthUrl, "duoLogin", "width=500,height=700");
      if (!popup) throw new Error("Failed to open Duo popup. Please allow popups.");

    } catch (err: any) {
      setError(err.message || "Something went wrong.");
      console.error("🚨 Login error:", err);
      recaptchaRef.current?.reset();
      setCaptchaToken("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="login-header" onClick={() => navigate("/")}>CuraSure</div>
      <div className="login-container">
        <div className="login-box">
          <h2 className="login-title">Login</h2>
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">Login successful!</div>}
          <form onSubmit={handleSubmit}>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="login-input" required />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="login-input" required />
            <select value={role} onChange={(e) => setRole(e.target.value)} className="login-select" required>
              <option value="" disabled hidden>Select a role</option>
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
              <option value="insurance_provider">Insurance Provider</option>
            </select>
            {siteKey && (
              <div className="captcha-container">
                <ReCAPTCHA ref={recaptchaRef} sitekey={siteKey} onChange={handleCaptchaChange} />
              </div>
            )}
            <button type="submit" className="login-btn" disabled={loading || !captchaToken}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
          <div className="login-links">
            <a href="/forgot-password" className="forgot-password-link">Forgot Password?</a>
            <p className="newUserText">New user? <a href="/curasure/register" className="register-link">Register here</a></p>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginPage;
