import React, { useState } from 'react';
import axios from 'axios';
import './ForgotPassword.css';
import './Login.css';
import { useNavigate } from 'react-router-dom';

const ForgotPasswordPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        setError('');
        try {
            const res = await axios.post('http://localhost:5002/api/auth/forgot-password', { email });

            setMessage(res.data.message);
        } catch (err: any) {
            console.log('response', err);
            setError(err.response?.data?.message || 'Something went wrong');
        }
    };

    return (
        <>
            <div className="login-header" style={{ cursor: 'pointer' }} onClick={() => navigate("/")}>CuraSure</div>
            <div className="forgot-password-container">
                <h2>Forgot Password?</h2>
                <p>To reset password, enter your email</p>
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <button type="submit">Send Reset Link</button>
                </form>
                {message && <p className="success">{message}</p>}
                {error && <p className="error">{error}</p>}
            </div>
        </>
    );
};

export default ForgotPasswordPage;
