import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Button from '../../components/Button.jsx';
import Card from '../../components/Card.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

export default function Register() {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            await register(name, email, password, true); // aadhaar_verified = true (placeholder)
            navigate('/dashboard');
        } catch (err) {
            console.error('Registration failed', err);
            setError(err.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', backgroundColor: 'var(--bg-primary, #FAF8F5)', minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(16px, 4vw, 32px)' }}>
            <style>
                {`
                .input-field { width: 100%; height: 48px; border-radius: 8px; border: 1px solid var(--border-default, #E7E5E4); padding: 0 16px; font-size: 16px; outline: none; transition: border-color 0.2s; margin-bottom: 16px; box-sizing: border-box; }
                .input-field:focus { border-color: var(--accent, #0D9488); box-shadow: 0 0 0 2px var(--accent-light, #CCFBF1); }
                .label { display: block; font-size: 14px; font-weight: 600; margin-bottom: 8px; color: var(--text-primary, #1C1917); }
                `}
            </style>
            <Card style={{ width: '100%', maxWidth: '440px', padding: 'clamp(24px, 5vw, 40px)' }}>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '8px' }}>Create an Account</h1>
                    <p style={{ color: 'var(--text-secondary, #57534E)' }}>Sign up for Rakshak to protect your assets</p>
                </div>

                <form onSubmit={handleSubmit}>
                    {error && <div style={{ color: 'red', marginBottom: '16px', fontSize: '14px', textAlign: 'center' }}>{error}</div>}
                    <div>
                        <label className="label">Full Name</label>
                        <input 
                            type="text" 
                            className="input-field" 
                            placeholder="John Doe" 
                            required 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
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
                        {loading ? 'Creating...' : 'Sign Up'}
                    </Button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: 'var(--text-secondary, #57534E)' }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--accent, #0D9488)', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
                </div>
            </Card>
        </div>
    );
}
