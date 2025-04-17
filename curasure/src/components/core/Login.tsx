import { useState, useRef, useEffect } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { loginUser, fetchSiteKey, clearError, clearSuccess } from "../../redux/slices/authSlice";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");

  const recaptchaRef = useRef<ReCAPTCHA | null>(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Get state from Redux store
  const { status, error, success, siteKey } = useAppSelector((state: any) => state.auth);
  //const loading = status === 'loading';

  useEffect(() => {
    // Fetch reCAPTCHA site key using Redux
    dispatch(fetchSiteKey());
  }, [dispatch]);

  // Navigate based on role after successful login
  useEffect(() => {
    if (success && role) {
      navigate(`/${role}/home`);
    }
  }, [success, navigate]);

  const handleCaptchaChange = (token: any) => {
    setCaptchaToken(token);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear any previous errors
    dispatch(clearError());
    dispatch(clearSuccess());

    if (!email || !password || !role || !captchaToken) {
      // You can dispatch a custom action for validation errors or handle locally
      // For simplicity, we'll handle this locally
      return;
    }
    
    dispatch(loginUser({ email, password, role, captchaToken }));

  };

  // Reset captcha on login failure
  useEffect(() => {
    if (status === 'failed' && recaptchaRef.current) {
      recaptchaRef.current.reset();
      setCaptchaToken("");
    }
  }, [status]);

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
            disabled={!captchaToken}
          >
            {"Login"}
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