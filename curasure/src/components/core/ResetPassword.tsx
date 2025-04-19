import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ResetPassword.css';
import './Login.css';

const ResetPasswordPage: React.FC = () => {
    const [newPassword, setNewPassword] = useState('');
    const [token, setToken] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const tokenParam = params.get('token');
        if (tokenParam) {
            setToken(tokenParam);
        } else {
            setError('Invalid password reset link');
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (!token) {
            setError('Reset token is missing');
            return;
        }

        try {
            const res = await axios.post('http://localhost:5002/api/auth/reset-password', {
                token,
                newPassword,
            });
            setMessage(res.data.message);

        } catch (err: any) {
            setError(err.response?.data?.message || 'Something went wrong');
        }
    };

    return (
        <>
            <div className="login-header" style={{ cursor: 'pointer' }} onClick={() => navigate("/")}>CuraSure</div>
            <div className="reset-password-container">
                <h2>Reset Password</h2>
                <p>Enter your new password</p>
                <form onSubmit={handleSubmit}>
                    <input
                        type="password"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                    <button type="submit">Reset Password</button>
                </form>
                {message && <p className="success">{message}</p>}
                {message && <a href="/curasure/login">Login</a>}
                {error && <p className="error">{error}</p>}
            </div>
        </>
    );
};

export default ResetPasswordPage;
