import React, { useEffect, useState } from 'react';
import { Users, CreditCard, Radar, IndianRupee, ShieldAlert, UserCheck } from 'lucide-react';
import StatCard from '../../components/StatCard';
import Card from '../../components/Card';
import LoadingSpinner from '../../components/LoadingSpinner';
import { getAdminDashboardStats } from '../../services/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const data = await getAdminDashboardStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to load admin stats', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '48px', display: 'flex', justifyContent: 'center', backgroundColor: 'var(--bg-admin)', height: '100%' }}>
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const freeCount = stats?.subscriptions?.free ?? 0;
  const proCount = stats?.subscriptions?.pro ?? 0;
  const defenseCount = stats?.subscriptions?.defense ?? 0;
  const totalSubscribers = Math.max(1, freeCount + proCount + defenseCount);

  return (
    <div style={{ 
      padding: '24px', 
      backgroundColor: 'var(--bg-admin)', 
      color: 'var(--text-admin)',
      minHeight: '100%',
      animation: 'fadeIn 0.3s ease-out'
    }}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '600', margin: 0 }}>
            Admin Overview & Analytics
          </h1>
          <p style={{ margin: '4px 0 0 0', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            System-wide security scan metrics and user management control
          </p>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '20px',
        marginBottom: '32px'
      }}>
        <StatCard 
          variant="dark"
          title="Total Scans (All Time)" 
          value={(stats?.totalScans ?? 0).toLocaleString()} 
          icon={<Radar size={24} style={{ color: 'var(--accent)' }} />} 
        />
        <StatCard 
          variant="dark"
          title="Total Users" 
          value={(stats?.totalUsers ?? 0).toLocaleString()} 
          icon={<Users size={24} />} 
        />
        <StatCard 
          variant="dark"
          title="Active Users" 
          value={(stats?.activeUsers ?? 0).toLocaleString()} 
          icon={<UserCheck size={24} style={{ color: '#16A34A' }} />} 
        />
        <StatCard 
          variant="dark"
          title="Blocked Users" 
          value={(stats?.blockedUsers ?? 0).toLocaleString()} 
          icon={<ShieldAlert size={24} style={{ color: '#EF4444' }} />} 
        />
        <StatCard 
          variant="dark"
          title="Estimated MRR" 
          value={`₹${(stats?.revenue?.mrr ?? 0).toLocaleString('en-IN')}`} 
          icon={<IndianRupee size={24} />} 
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
        {/* Subscription Breakdown */}
        <Card variant="dark" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '24px', marginTop: 0 }}>Subscription Breakdown</h2>
          
          <div style={{ display: 'flex', height: '24px', borderRadius: '4px', overflow: 'hidden', marginBottom: '16px' }}>
            <div style={{ width: `${(freeCount/totalSubscribers)*100}%`, backgroundColor: 'var(--text-muted)' }} title={`Free: ${freeCount}`} />
            <div style={{ width: `${(proCount/totalSubscribers)*100}%`, backgroundColor: 'var(--accent)' }} title={`Pro: ${proCount}`} />
            <div style={{ width: `${(defenseCount/totalSubscribers)*100}%`, backgroundColor: 'var(--text-primary)' }} title={`Defense: ${defenseCount}`} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '2px', backgroundColor: 'var(--text-muted)' }}></div>
              <span style={{ color: 'var(--text-admin)' }}>Free ({freeCount})</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '2px', backgroundColor: 'var(--accent)' }}></div>
              <span style={{ color: 'var(--text-admin)' }}>Pro ({proCount})</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '2px', backgroundColor: 'var(--text-primary)' }}></div>
              <span style={{ color: 'var(--text-admin)' }}>Defense ({defenseCount})</span>
            </div>
          </div>
        </Card>

        {/* System Health */}
        <Card variant="dark" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '24px', marginTop: 0 }}>System Health</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '4px' }}>API Uptime</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#16A34A' }}></div>
                <span style={{ fontSize: '1.125rem', fontWeight: '500' }}>99.97%</span>
              </div>
            </div>
            
            <div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '4px' }}>Avg Response</div>
              <div style={{ fontSize: '1.125rem', fontWeight: '500' }}>142ms</div>
            </div>
            
            <div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '4px' }}>ZAP Daemon</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#16A34A' }}></div>
                <span style={{ fontSize: '1.125rem', fontWeight: '500' }}>Healthy</span>
              </div>
            </div>
            
            <div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '4px' }}>DB Pool</div>
              <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--bg-admin)', borderRadius: '3px', overflow: 'hidden', marginTop: '6px' }}>
                <div style={{ width: '46%', height: '100%', backgroundColor: 'var(--accent)' }}></div>
              </div>
              <div style={{ fontSize: '0.75rem', marginTop: '4px', textAlign: 'right' }}>23/50</div>
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '4px' }}>Last Incident</div>
              <div style={{ fontSize: '1rem' }}>14 days ago</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
