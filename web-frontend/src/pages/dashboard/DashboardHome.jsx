import React, { useEffect, useState } from 'react';
import { Radar, AlertTriangle, Crown, Calendar, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import StatCard from '../../components/StatCard';
import SeverityBadge from '../../components/SeverityBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { getScanHistory } from '../../services/api';

export default function DashboardHome() {
  const { user } = useAuth();
  const [recentScans, setRecentScans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const history = await getScanHistory();
        setRecentScans(history.slice(0, 3));
      } catch (error) {
        console.error('Failed to load scan history:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div style={{ padding: '24px', animation: 'fadeIn 0.3s ease-out' }}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ 
          fontSize: '1.5rem', 
          fontWeight: '600', 
          color: 'var(--text-primary)'
        }}>
          System Overview
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', fontWeight: 500, color: 'var(--accent)' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent)', animation: 'pulse 2s infinite' }}></div>
          Active Monitoring
        </div>
      </div>
      <style>{`
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(4, 120, 87, 0.4); }
          70% { box-shadow: 0 0 0 6px rgba(4, 120, 87, 0); }
          100% { box-shadow: 0 0 0 0 rgba(4, 120, 87, 0); }
        }
      `}</style>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '24px',
        marginBottom: '32px'
      }}>
        <StatCard 
          title="Scans This Month" 
          value="12" 
          icon={<Radar size={24} />} 
          trend={{ value: '+3', direction: 'up' }} 
        />
        <StatCard 
          title="Vulnerabilities Found" 
          value="47" 
          icon={<AlertTriangle size={24} />} 
          trend={{ value: '-8', direction: 'down' }} 
        />
        <StatCard 
          title="Current Plan" 
          value="Pro" 
          icon={<Crown size={24} />} 
        />
        <StatCard 
          title="Next Billing" 
          value="Oct 15" 
          icon={<Calendar size={24} />} 
        />
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '24px'
      }}>
        <Card style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '16px', color: 'var(--text-primary)' }}>Quick Scan</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '16px', fontSize: '0.875rem' }}>
            Run a quick scan on a new target URL.
          </p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <input 
              type="text" 
              placeholder="https://example.com" 
              style={{
                flex: 1,
                padding: '10px 16px',
                borderRadius: '0px',
                border: '1px solid var(--border-default)',
                fontFamily: 'inherit',
                fontSize: '0.875rem',
                outline: 'none'
              }}
            />
            <Button variant="primary">Scan Now</Button>
          </div>
        </Card>

        <Card style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--text-primary)' }}>Recent Scans</h2>
            <Button variant="outline" style={{ padding: '6px 12px', fontSize: '0.75rem' }}>View All</Button>
          </div>
          
          {loading ? (
            <div style={{ padding: '32px 0', display: 'flex', justifyContent: 'center' }}>
              <LoadingSpinner size="md" />
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {recentScans.length > 0 ? recentScans.map((scan) => (
                <div key={scan.id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px',
                  borderRadius: '0px',
                  border: '1px solid var(--border-default)',
                  backgroundColor: 'var(--bg-secondary)'
                }}>
                  <div>
                    <div style={{ fontWeight: '500', color: 'var(--text-primary)', fontSize: '0.875rem' }}>{scan.url}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '4px' }}>{new Date(scan.date).toLocaleDateString()}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      {Object.entries(scan.summary || {}).map(([sev, count]) => count > 0 && (
                        <SeverityBadge key={sev} severity={sev} count={count} />
                      ))}
                    </div>
                    <ChevronRight size={16} color="var(--text-muted)" />
                  </div>
                </div>
              )) : (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textAlign: 'center', padding: '16px 0' }}>No recent scans found.</p>
              )}
            </div>
          )}
        </Card>
      </div>
      

    </div>
  );
}

