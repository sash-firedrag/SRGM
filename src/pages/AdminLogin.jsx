import { API_BASE_URL } from '../config';
import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import axios from 'axios';

const AdminLogin = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [error, setError] = useState('');
    const [email, setEmail] = useState('sashwathprakash725@gmail.com');
    const [password, setPassword] = useState('sashwath2005p');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            // Send the Google token to our backend for verification and custom JWT issuing
            const response = await axios.post(`${API_BASE_URL}/api/auth/google`, {
                token: credentialResponse.credential
            });

            // Login successful, save the new custom token and redirect
            login(response.data.token);
            navigate('/admin/dashboard');
        } catch (err) {
            console.error('Google Login failed', err);
            setError('Failed to authenticate with Google. Ensure you are an authorized admin.');
        }
    };

    const handleManualLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
                email,
                password
            });

            login(response.data.token);
            navigate('/admin/dashboard');
        } catch (err) {
            console.error('Manual Login failed', err);
            setError(err.response?.data?.message || 'Invalid email or password.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="reveal active" style={{ padding: '8rem 0 4rem', minHeight: '70vh', backgroundColor: 'var(--bg-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ boxShadow: 'var(--shadow-lg)', maxWidth: '450px', width: '100%', margin: '0 20px', borderRadius: '15px', overflow: 'hidden', backgroundColor: '#fff' }}>
                <div style={{ backgroundColor: 'var(--primary-color)', padding: '2rem', textAlign: 'center', color: '#fff' }}>
                    <h2 style={{ fontFamily: 'var(--font-heading)', margin: 0 }}>Admin Portal</h2>
                    <p style={{ opacity: 0.9, fontSize: '0.95rem', marginTop: '0.5rem' }}>Secure access for authorized personnel only</p>
                </div>

                <div style={{ padding: '2.5rem 2rem', textAlign: 'center' }}>
                    {error && (
                        <div className="alert error" style={{ padding: '1rem', marginBottom: '1.5rem', borderRadius: '8px', backgroundColor: '#f8d7da', color: '#721c24', border: '1px solid #f5c6cb', fontSize: '0.9rem' }}>
                            {error}
                        </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={() => setError('Google Authentication Failed')}
                            useOneTap={false}
                            theme="outline"
                            size="large"
                            shape="rectangular"
                            text="continue_with"
                        />
                    </div>

                    <div style={{ position: 'relative', margin: '2rem 0', textAlign: 'center' }}>
                        <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, borderTop: '1px solid #eaeaea', zIndex: 1 }}></div>
                        <span style={{ backgroundColor: '#fff', padding: '0 15px', color: '#999', position: 'relative', zIndex: 2, fontSize: '0.9rem', fontWeight: '500' }}>
                            OR
                        </span>
                    </div>

                    <form onSubmit={handleManualLogin} className="modern-form" style={{ textAlign: 'left' }}>
                        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                            <label htmlFor="email" style={{ fontWeight: '600', color: 'var(--text-color)' }}>Email Address</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="sashwathprakash725@gmail.com"
                                style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd', width: '100%' }}
                            />
                        </div>
                        <div className="form-group" style={{ marginBottom: '2rem' }}>
                            <label htmlFor="password" style={{ fontWeight: '600', color: 'var(--text-color)' }}>Password</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="Enter your password"
                                style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd', width: '100%' }}
                            />
                        </div>
                        <button
                            type="submit"
                            className="btn primary-btn"
                            disabled={isSubmitting}
                            style={{
                                width: '100%',
                                padding: '0.8rem',
                                borderRadius: '8px',
                                border: 'none',
                                fontWeight: '600',
                                fontSize: '1rem',
                                opacity: isSubmitting ? 0.7 : 1
                            }}
                        >
                            {isSubmitting ? 'Signing In...' : 'Sign In'}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default AdminLogin;
