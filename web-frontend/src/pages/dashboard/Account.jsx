import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Card from '../../components/Card';
import Button from '../../components/Button';
import LoadingSpinner from '../../components/LoadingSpinner';
import { getUserProfile, getSubscriptionStatus, updateUserProfile } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { 
  User as UserIcon, Shield, ShieldCheck, Lock, Key, 
  Crown, CheckCircle2, AlertCircle, Save, LogOut, Download, 
  Sparkles, ExternalLink, Activity, ArrowRight, Laptop
} from 'lucide-react';

export default function Account() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  // Profile Edit State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState(null);

  // Password Change State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [profData, subData] = await Promise.all([
        getUserProfile(),
        getSubscriptionStatus()
      ]);
      setProfile(profData);
      setName(profData?.name || '');
      setPhone(profData?.phone || '+91 98765 43210');
      setSubscription(subData);
    } catch (error) {
      console.error('Failed to load account data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMessage(null);
    try {
      const updated = await updateUserProfile({ name, phone });
      setProfile(prev => ({ ...prev, ...updated }));
      setProfileMessage({ type: 'success', text: 'Profile information updated successfully!' });
    } catch (err) {
      setProfileMessage({ type: 'error', text: err.message || 'Failed to update profile.' });
    } finally {
      setSavingProfile(false);
      setTimeout(() => setProfileMessage(null), 4000);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'New passwords do not match.' });
      return;
    }
    if (newPassword.length < 6) {
      setPasswordMessage({ type: 'error', text: 'Password must be at least 6 characters.' });
      return;
    }

    setSavingPassword(true);
    setPasswordMessage(null);
    try {
      await updateUserProfile({
        current_password: currentPassword,
        new_password: newPassword
      });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordMessage({ type: 'success', text: 'Password updated successfully!' });
    } catch (err) {
      setPasswordMessage({ type: 'error', text: err.message || 'Failed to update password.' });
    } finally {
      setSavingPassword(false);
      setTimeout(() => setPasswordMessage(null), 4000);
    }
  };

  const handleExportData = () => {
    const data = {
      profile,
      subscription,
      exportDate: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rakshak-account-${profile?.id || 'user'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div style={{ padding: '64px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '16px' }}>
        <LoadingSpinner size="lg" />
        <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Loading your security profile...</span>
      </div>
    );
  }

  const currentTier = (profile?.plan || subscription?.plan || 'Free').toLowerCase();
  const scansUsed = profile?.scansThisMonth ?? 0;
  const scansLimit = profile?.scansLimit ?? 10;
  const quotaPct = Math.min(100, Math.round((scansUsed / scansLimit) * 100));

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: 'clamp(16px, 3vw, 32px)',
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      color: 'var(--text-primary, #1A1A1A)',
      minHeight: '80vh'
    }}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .account-card {
          border-radius: 16px;
          border: 1px solid var(--border-default, #E5E4E2);
          background: #FFFFFF;
          padding: 24px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
          transition: border-color 0.2s ease;
        }
        .form-input {
          width: 100%;
          padding: 10px 14px;
          border-radius: 8px;
          border: 1px solid var(--border-default, #E5E4E2);
          font-size: 14px;
          background: #FFFFFF;
          color: var(--text-primary, #1A1A1A);
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          box-sizing: border-box;
        }
        .form-input:focus {
          border-color: var(--accent, #0D9488);
          box-shadow: 0 0 0 3px rgba(13, 148, 136, 0.15);
        }
        .form-input:disabled {
          background: var(--bg-secondary, #F5F4F0);
          color: var(--text-muted, #8A8A8A);
          cursor: not-allowed;
        }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{
          fontSize: 'clamp(1.5rem, 3vw, 2rem)',
          fontWeight: 800,
          margin: '0 0 6px 0',
          letterSpacing: '-0.5px'
        }}>
          Account & Security Hub
        </h1>
        <p style={{ margin: 0, color: 'var(--text-secondary, #4A4A4A)', fontSize: '0.95rem' }}>
          Manage your verified identity, credentials, active defense tier, and vulnerability audit permissions
        </p>
      </div>

      {/* Bento Grid Layout (Asymmetric 4 : 8 Ratio) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap: '24px' }}>
        
        {/* ════════════════════════════════════════════════════════════
            COLUMN 1: IDENTITY & SUBSCRIPTION CARDS
            ════════════════════════════════════════════════════════════ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Identity & Aadhaar Card */}
          <div className="account-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'var(--accent, #0D9488)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                fontWeight: 800,
                boxShadow: '0 4px 12px rgba(13, 148, 136, 0.3)'
              }}>
                {(profile?.name || profile?.email || 'U')[0].toUpperCase()}
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <h3 style={{ margin: '0 0 2px 0', fontSize: '18px', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {profile?.name || 'Rakshak User'}
                </h3>
                <p style={{ margin: '0 0 6px 0', fontSize: '13px', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {profile?.email}
                </p>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '2px 8px',
                  borderRadius: '9999px',
                  backgroundColor: profile?.role === 'admin' ? 'rgba(13, 148, 136, 0.15)' : 'rgba(0, 0, 0, 0.05)',
                  color: profile?.role === 'admin' ? 'var(--accent, #0D9488)' : 'var(--text-secondary)',
                  fontSize: '11px',
                  fontWeight: 700,
                  textTransform: 'uppercase'
                }}>
                  {profile?.role === 'admin' ? 'Master Admin' : 'Verified Member'}
                </span>
              </div>
            </div>

            {/* Aadhaar Security Badge */}
            <div style={{
              padding: '14px 16px',
              borderRadius: '12px',
              backgroundColor: '#F0FDF4',
              border: '1px solid #BBF7D0',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '16px'
            }}>
              <ShieldCheck size={24} color="#16A34A" />
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#15803D' }}>UIDAI Aadhaar Verified</div>
                <div style={{ fontSize: '12px', color: '#166534' }}>Identity authenticated with Indian digital trust standards</div>
              </div>
            </div>

            <div style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
              <span>Member Since</span>
              <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>
                {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'Active'}
              </span>
            </div>
          </div>

          {/* Subscription & Quota Card */}
          <div className="account-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Crown size={18} color="var(--accent, #0D9488)" />
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700 }}>Active Protection Tier</h3>
              </div>
              <span style={{
                padding: '3px 10px',
                borderRadius: '9999px',
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                backgroundColor: currentTier === 'defense' ? '#EEF2FF' : (currentTier === 'pro' ? '#F0FDFA' : '#F1F5F9'),
                color: currentTier === 'defense' ? '#4F46E5' : (currentTier === 'pro' ? '#0D9488' : '#475569'),
                border: `1px solid ${currentTier === 'defense' ? '#C7D2FE' : (currentTier === 'pro' ? '#99F6E4' : '#CBD5E1')}`
              }}>
                {currentTier.toUpperCase()} PLAN
              </span>
            </div>

            <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>
              {currentTier === 'defense' ? '₹4,999' : (currentTier === 'pro' ? '₹999' : '₹0')}
              <span style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 500 }}> / month</span>
            </div>
            <p style={{ margin: '0 0 16px 0', fontSize: '12px', color: 'var(--text-muted)' }}>
              {currentTier === 'free' ? 'Standard autonomous vulnerability scanner' : 'Automated real-time cybersecurity defense'}
            </p>

            {/* Quota Meter */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>
                <span>Monthly Scan Allowance</span>
                <span>{scansUsed} / {currentTier === 'defense' ? '∞' : scansLimit} Scans</span>
              </div>
              <div style={{ height: '8px', borderRadius: '4px', backgroundColor: '#E2E8F0', overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: currentTier === 'defense' ? '15%' : `${quotaPct}%`,
                  backgroundColor: quotaPct > 80 ? '#DC2626' : 'var(--accent, #0D9488)',
                  transition: 'width 0.3s ease'
                }} />
              </div>
            </div>

            {/* Feature Checklist */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
              {(subscription?.features || ['10 Scans per Month', 'Automated OWASP Audit', 'Remediation Guidelines']).map((feat, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                  <CheckCircle2 size={15} color="var(--accent, #0D9488)" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            <Link to="/pricing" style={{ textDecoration: 'none' }}>
              <Button variant="outline" style={{ width: '100%', justifyContent: 'center', minHeight: '40px' }}>
                Upgrade / Change Tier
              </Button>
            </Link>
          </div>

          {/* Data Export & Logout */}
          <div className="account-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button
              onClick={handleExportData}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '10px 16px',
                borderRadius: '8px',
                backgroundColor: '#F8FAFC',
                border: '1px solid var(--border-default, #E5E4E2)',
                color: 'var(--text-primary)',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <Download size={15} />
              <span>Export Account Data (JSON)</span>
            </button>

            <button
              onClick={logout}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '10px 16px',
                borderRadius: '8px',
                backgroundColor: 'rgba(239, 68, 68, 0.08)',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                color: '#DC2626',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <LogOut size={15} />
              <span>Log Out of Account</span>
            </button>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════
            COLUMN 2: PROFILE & SECURITY FORMS
            ════════════════════════════════════════════════════════════ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Edit Profile Form */}
          <div className="account-card">
            <h3 style={{ margin: '0 0 6px 0', fontSize: '18px', fontWeight: 700 }}>
              Personal Profile
            </h3>
            <p style={{ margin: '0 0 20px 0', fontSize: '13px', color: 'var(--text-secondary)' }}>
              Update your primary identification details and contact information
            </p>

            {profileMessage && (
              <div style={{
                marginBottom: '16px',
                padding: '12px 16px',
                borderRadius: '8px',
                backgroundColor: profileMessage.type === 'error' ? '#FEF2F2' : '#F0FDF4',
                border: `1px solid ${profileMessage.type === 'error' ? '#FCA5A5' : '#BBF7D0'}`,
                color: profileMessage.type === 'error' ? '#B91C1C' : '#15803D',
                fontSize: '13px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                {profileMessage.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
                <span>{profileMessage.text}</span>
              </div>
            )}

            <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Email Address (Primary Identity)
                </label>
                <input
                  type="email"
                  className="form-input"
                  value={profile?.email || ''}
                  disabled
                />
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                  Email address is linked to your UIDAI authentication and cannot be changed directly.
                </span>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Contact Phone Number
                </label>
                <input
                  type="tel"
                  className="form-input"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                />
              </div>

              <div style={{ marginTop: '8px' }}>
                <Button variant="primary" type="submit" disabled={savingProfile} style={{ minHeight: '42px', padding: '0 24px' }}>
                  {savingProfile ? 'Saving...' : 'Save Profile Changes'}
                </Button>
              </div>
            </form>
          </div>

          {/* Change Password & Security Form */}
          <div className="account-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <Lock size={18} color="var(--accent, #0D9488)" />
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>
                Security & Authentication
              </h3>
            </div>
            <p style={{ margin: '0 0 20px 0', fontSize: '13px', color: 'var(--text-secondary)' }}>
              Protect your portal access with strong credentials and password rotation
            </p>

            {passwordMessage && (
              <div style={{
                marginBottom: '16px',
                padding: '12px 16px',
                borderRadius: '8px',
                backgroundColor: passwordMessage.type === 'error' ? '#FEF2F2' : '#F0FDF4',
                border: `1px solid ${passwordMessage.type === 'error' ? '#FCA5A5' : '#BBF7D0'}`,
                color: passwordMessage.type === 'error' ? '#B91C1C' : '#15803D',
                fontSize: '13px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                {passwordMessage.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
                <span>{passwordMessage.text}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Current Password
                </label>
                <input
                  type="password"
                  className="form-input"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    New Password
                  </label>
                  <input
                    type="password"
                    className="form-input"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    className="form-input"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password"
                    required
                  />
                </div>
              </div>

              <div style={{ marginTop: '8px' }}>
                <Button variant="secondary" type="submit" disabled={savingPassword} style={{ minHeight: '42px', padding: '0 24px' }}>
                  {savingPassword ? 'Updating...' : 'Update Password'}
                </Button>
              </div>
            </form>

            <hr style={{ border: 'none', borderTop: '1px solid var(--border-default, #E5E4E2)', margin: '24px 0' }} />

            {/* Active Session Info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '8px',
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Laptop size={18} color="var(--text-secondary)" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Current Web Session Active
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Signed in via HTTPS Secure Session • Active now
                </div>
              </div>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981' }} />
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
