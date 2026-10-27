import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/Card';
import Button from '../../components/Button';
import LoadingSpinner from '../../components/LoadingSpinner';
import { getUserProfile, getSubscriptionStatus } from '../../services/api';
import { Check } from 'lucide-react';

export default function Account() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [profData, subData] = await Promise.all([
          getUserProfile(),
          getSubscriptionStatus()
        ]);
        setProfile(profData);
        setSubscription(subData);
      } catch (error) {
        console.error('Failed to load account data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '48px', display: 'flex', justifyContent: 'center' }}>
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const getPlanPillStyle = (plan) => {
    if (plan === 'Pro' || plan === 'Pro Plan') {
      return { backgroundColor: 'var(--accent)', color: 'white' };
    } else if (plan === 'Defense' || plan === 'Defense Plan') {
      return { backgroundColor: 'var(--bg-admin)', border: '1px solid var(--accent)', color: 'var(--accent)' };
    }
    return { backgroundColor: 'var(--text-muted)', color: 'white' };
  };

  const planStyle = getPlanPillStyle(subscription?.plan);

  return (
    <div style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '24px' }}>
        Account Settings
      </h1>

      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '24px' 
      }}>
        {/* Profile Section */}
        <Card style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '24px', marginTop: 0 }}>
            Profile
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                Full Name
              </label>
              <input 
                type="text" 
                defaultValue={profile?.name || ''} 
                disabled
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-default)',
                  backgroundColor: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  fontFamily: 'inherit',
                  fontSize: '0.875rem',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                Email Address
              </label>
              <input 
                type="email" 
                defaultValue={profile?.email || ''} 
                disabled
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-default)',
                  backgroundColor: 'var(--bg-secondary)',
                  color: 'var(--text-muted)',
                  fontFamily: 'inherit',
                  fontSize: '0.875rem',
                  cursor: 'not-allowed',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                Phone Number
              </label>
              <input 
                type="tel" 
                defaultValue={profile?.phone || '+91 98765 43210'} 
                disabled
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-default)',
                  backgroundColor: 'var(--bg-secondary)',
                  color: 'var(--text-muted)',
                  fontFamily: 'inherit',
                  fontSize: '0.875rem',
                  cursor: 'not-allowed',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ marginTop: '16px' }}>
              <Button variant="primary" disabled style={{ opacity: 0.6, cursor: 'not-allowed' }}>
                Save Changes
              </Button>
            </div>
          </div>
        </Card>

        {/* Subscription Section */}
        <Card style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '24px', marginTop: 0 }}>
            Subscription
          </h2>
          
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                  {subscription?.plan || 'Pro Plan'}
                </span>
                <span style={{ 
                  padding: '4px 12px', 
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  ...planStyle
                }}>
                  {subscription?.plan ? subscription.plan.toUpperCase() : 'PRO'}
                </span>
              </div>
              <span style={{ color: '#16A34A', fontWeight: '600', fontSize: '0.875rem' }}>Active</span>
            </div>
            
            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>
              {(!subscription?.plan || subscription.plan.toLowerCase().includes('free')) ? '₹0' : subscription.plan.toLowerCase().includes('defense') ? '₹4,999' : '₹999'}
              <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: '500' }}>/month</span>
            </div>
            {subscription?.plan && !subscription.plan.toLowerCase().includes('free') && (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: 0 }}>
                Next billing date: Oct 15, 2026
              </p>
            )}
          </div>

          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '12px' }}>Plan Features</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {((!subscription?.plan || subscription.plan.toLowerCase().includes('free')) 
                ? ['10 Scans per month', 'Basic Reports', 'Community Support'] 
                : subscription.plan.toLowerCase().includes('defense') 
                ? ['Unlimited Scans & WAF', 'Real-time Blocking', 'Custom Rulesets', '24/7 Dedicated Support'] 
                : ['Unlimited Scans', 'Detailed Reports', 'API Access', 'Priority Support']
              ).map((feature, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                  <Check size={16} color="var(--accent)" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Button variant="outline" style={{ width: '100%', justifyContent: 'center' }} onClick={() => navigate('/pricing')}>
              Manage Subscription
            </Button>
            <button style={{ 
              background: 'none', 
              border: 'none', 
              color: 'var(--severity-critical)', 
              fontSize: '0.875rem', 
              fontWeight: '500', 
              cursor: 'pointer',
              fontFamily: 'inherit',
              padding: '8px',
              textAlign: 'center',
              width: '100%'
            }}>
              Cancel Subscription
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
