import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Monitor, Download as DownloadIcon } from 'lucide-react';
import Button from '../../components/Button.jsx';
import Card from '../../components/Card.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

export default function Download() {
    const { user } = useAuth() || { user: null }; // Fallback if useAuth not fully ready
    const navigate = useNavigate();
    const isPremium = user && (user.plan === 'pro' || user.plan === 'defense');

    return (
        <div style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', backgroundColor: 'var(--bg-primary, #FAF8F5)', minHeight: 'calc(100vh - 64px)', padding: '64px 24px', color: 'var(--text-primary, #1C1917)' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                    <h1 style={{ fontSize: '40px', fontWeight: 800, marginBottom: '16px' }}>Download Rakshak for Windows</h1>
                    <p style={{ fontSize: '18px', color: 'var(--text-secondary, #57534E)' }}>Real-time monitoring and active defense, running locally on your machine.</p>
                </div>

                {!isPremium ? (
                    <Card style={{ padding: '64px 32px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'var(--bg-secondary, #F3F0EB)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                            <Lock size={32} color="var(--text-muted, #A8A29E)" />
                        </div>
                        <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '16px' }}>Premium Feature</h2>
                        <p style={{ color: 'var(--text-secondary, #57534E)', marginBottom: '32px', maxWidth: '400px' }}>The Rakshak desktop application is available exclusively to Pro and Defense subscribers.</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
                            <Button variant="primary" onClick={() => navigate('/pricing')}>View Pricing</Button>
                            <span style={{ fontSize: '14px', color: 'var(--text-secondary, #57534E)' }}>
                                Already a subscriber? <a href="#" onClick={(e) => { e.preventDefault(); navigate('/login'); }} style={{ color: 'var(--accent, #0D9488)', fontWeight: 600, textDecoration: 'none' }}>Log in</a>
                            </span>
                        </div>
                    </Card>
                ) : (
                    <div>
                        <Card style={{ padding: '32px', marginBottom: '32px', display: 'flex', flexWrap: 'wrap', gap: '32px', alignItems: 'center' }}>
                            <div style={{ flexShrink: 0, padding: '24px', backgroundColor: 'var(--accent-light, #CCFBF1)', borderRadius: '12px' }}>
                                <Monitor size={48} color="var(--accent, #0D9488)" />
                            </div>
                            <div style={{ flexGrow: 1 }}>
                                <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>Rakshak Desktop v1.2.0</h2>
                                <p style={{ color: 'var(--text-secondary, #57534E)', marginBottom: '16px' }}>Windows 10/11 (64-bit) — 45 MB</p>
                                <Button variant="primary" onClick={() => alert('Download starting...')} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                                    <DownloadIcon size={18} /> Download .exe
                                </Button>
                            </div>
                            <div style={{ width: '100%', padding: '16px', backgroundColor: 'var(--bg-secondary, #F3F0EB)', borderRadius: '8px', fontSize: '14px', color: 'var(--text-secondary, #57534E)' }}>
                                <strong>Release notes (September 5, 2026):</strong> Improved packet analysis engine, reduced CPU usage by 30%, new incident report templates.
                            </div>
                        </Card>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '32px' }}>
                            <Card style={{ flex: '1 1 300px', padding: '32px' }}>
                                <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px' }}>System Requirements</h3>
                                <ul style={{ paddingLeft: '20px', color: 'var(--text-secondary, #57534E)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <li>Windows 10/11 64-bit</li>
                                    <li>4GB RAM minimum</li>
                                    <li>.NET Runtime 6.0+</li>
                                    <li>Administrator privileges for Active Defense features</li>
                                </ul>
                            </Card>
                            <Card style={{ flex: '1 1 300px', padding: '32px' }}>
                                <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px' }}>Installation Steps</h3>
                                <ol style={{ paddingLeft: '20px', color: 'var(--text-secondary, #57534E)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <li>Download the installer package</li>
                                    <li>Run the setup wizard</li>
                                    <li>Enter your license key (found in dashboard)</li>
                                    <li>Configure monitoring targets</li>
                                    <li>Done! Protection is active</li>
                                </ol>
                            </Card>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
