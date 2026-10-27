import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Button from '../../components/Button.jsx';
import Card from '../../components/Card.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuth() || { login: async () => {} };
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            const userData = await login(email, password);
            if (userData?.role === 'admin' && userData?.email?.toLowerCase() === 'hidoiarya@gmail.com') {
                navigate('/admin');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            console.error('Login failed', err);
            setError(err.message || 'Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', backgroundColor: 'var(--bg-primary, #FAF8F5)', minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
            <style>
                {`
                .input-field { width: 100%; height: 48px; border-radius: 8px; border: 1px solid var(--border-default, #E7E5E4); padding: 0 16px; font-size: 16px; outline: none; transition: border-color 0.2s; margin-bottom: 16px; box-sizing: border-box; }
                .input-field:focus { border-color: var(--accent, #0D9488); box-shadow: 0 0 0 2px var(--accent-light, #CCFBF1); }
                .label { display: block; font-size: 14px; font-weight: 600; margin-bottom: 8px; color: var(--text-primary, #1C1917); }
                `}
            </style>
            <Card style={{ width: '100%', maxWidth: '440px', padding: '40px' }}>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '8px' }}>Welcome Back</h1>
                    <p style={{ color: 'var(--text-secondary, #57534E)' }}>Sign in to your Rakshak account</p>
                </div>

                <form onSubmit={handleSubmit}>
                    {error && <div style={{ color: 'red', marginBottom: '16px', fontSize: '14px', textAlign: 'center' }}>{error}</div>}
                    <div>
                        <label className="label">Email Address</label>
                        <input 
                            type="email" 
                            className="input-field" 
                            placeholder="name@company.com" 
                            required 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="label">Password</label>
                        <input 
                            type="password" 
                            className="input-field" 
                            placeholder="••••••••" 
                            required 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <Button variant="primary" type="submit" style={{ width: '100%', marginTop: '8px' }} disabled={loading}>
                        {loading ? 'Signing In...' : 'Sign In'}
                    </Button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: 'var(--text-secondary, #57534E)' }}>
                    Don't have an account? <Link to="/register" style={{ color: 'var(--accent, #0D9488)', fontWeight: 600, textDecoration: 'none' }}>Sign up</Link>
                </div>
            </Card>
        </div>
    );
}
