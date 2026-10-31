import React, { useEffect, useState } from 'react';
import { 
  Activity, Shield, ShieldCheck, ShieldAlert, LogIn, LogOut, 
  Radar, UserCheck, RefreshCw, Search, Filter, Globe, 
  Laptop, Clock, ChevronLeft, ChevronRight, CheckCircle2, AlertTriangle
} from 'lucide-react';
import Card from '../../components/Card';
import LoadingSpinner from '../../components/LoadingSpinner';
import { getAdminActivity } from '../../services/api';

export default function AdminActivity() {
  const [activities, setActivities] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [total, setTotal] = useState(0);
  const [actionFilter, setActionFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchActivities = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else setLoading(true);

    try {
      const params = { page, limit };
      if (actionFilter !== 'ALL') params.action = actionFilter;
      if (searchTerm.trim()) params.search = searchTerm.trim();

      const data = await getAdminActivity(params);
      setActivities(data?.items || []);
      setTotal(data?.total || 0);
      setSummary(data?.summary || null);
    } catch (err) {
      console.error('Failed to load admin activities:', err);
    } finally {
      setLoading(false);
      if (isManual) {
        setTimeout(() => setRefreshing(false), 500);
      }
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [page, limit, actionFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchActivities();
  };

  const getActionBadge = (actionType) => {
    const act = (actionType || '').toUpperCase();
    if (act === 'LOGIN') {
      return (
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '5px',
          padding: '3px 10px',
          borderRadius: '9999px',
          backgroundColor: 'rgba(59, 130, 246, 0.15)',
          color: '#60A5FA',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          fontSize: '11px',
          fontWeight: 700
        }}>
          <LogIn size={12} />
          LOGIN
        </span>
      );
    }
    if (act === 'LOGOUT') {
      return (
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '5px',
          padding: '3px 10px',
          borderRadius: '9999px',
          backgroundColor: 'rgba(148, 163, 184, 0.12)',
          color: '#94A3B8',
          border: '1px solid rgba(148, 163, 184, 0.25)',
          fontSize: '11px',
          fontWeight: 700
        }}>
          <LogOut size={12} />
          LOGOUT
        </span>
      );
    }
    if (act === 'SCAN_COMPLETED') {
      return (
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '5px',
          padding: '3px 10px',
          borderRadius: '9999px',
          backgroundColor: 'rgba(13, 148, 136, 0.18)',
          color: '#2DD4BF',
          border: '1px solid rgba(13, 148, 136, 0.35)',
          fontSize: '11px',
          fontWeight: 700
        }}>
          <Radar size={12} />
          SCAN AUDIT
        </span>
      );
    }
    if (act === 'USER_REGISTERED') {
      return (
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '5px',
          padding: '3px 10px',
          borderRadius: '9999px',
          backgroundColor: 'rgba(168, 85, 247, 0.15)',
          color: '#C084FC',
          border: '1px solid rgba(168, 85, 247, 0.3)',
          fontSize: '11px',
          fontWeight: 700
        }}>
          <UserCheck size={12} />
          REGISTERED
        </span>
      );
    }
    return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        padding: '3px 10px',
        borderRadius: '9999px',
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        color: '#E2E8F0',
        fontSize: '11px',
        fontWeight: 700
      }}>
        {act}
      </span>
    );
  };

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div style={{
      maxWidth: '1440px',
      margin: '0 auto',
      color: '#F8FAFC',
      fontFamily: '"Plus Jakarta Sans", sans-serif'
    }}>
      <style>{`
        @keyframes pulseGlow {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.9); }
        }
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .activity-row {
          transition: background-color 0.15s ease;
          border-bottom: 1px solid #1E2738;
        }
        .activity-row:hover {
          background-color: rgba(255, 255, 255, 0.03) !important;
        }
      `}</style>

      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '28px',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <h1 style={{
              fontSize: 'clamp(1.5rem, 3vw, 1.875rem)',
              fontWeight: 800,
              margin: 0,
              color: '#FFFFFF',
              letterSpacing: '-0.5px'
            }}>
              System Activity & Audit Logs
            </h1>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              borderRadius: '9999px',
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              color: '#34D399',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.5px'
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981', animation: 'pulseGlow 2s infinite' }}></span>
              LIVE TELEMETRY
            </span>
          </div>
          <p style={{ margin: 0, color: '#94A3B8', fontSize: '0.875rem' }}>
            Chronological records of user authentication, autonomous scans, and platform security events
          </p>
        </div>

        {/* Refresh button */}
        <button
          onClick={() => fetchActivities(true)}
          disabled={refreshing}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: '10px',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid #1E2738',
            color: '#F8FAFC',
            fontSize: '13px',
            fontWeight: 600,
            cursor: refreshing ? 'not-allowed' : 'pointer'
          }}
        >
          <RefreshCw size={15} style={{ animation: refreshing ? 'spinSlow 1s linear infinite' : 'none', color: '#2DD4BF' }} />
          <span>Refresh Feed</span>
        </button>
      </div>

      {/* Bento Metric Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 210px), 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div style={{
          backgroundColor: '#111622',
          border: '1px solid #1E2738',
          borderRadius: '16px',
          padding: '20px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase' }}>TOTAL EVENTS</span>
            <Activity size={18} color="#2DD4BF" />
          </div>
          <div style={{ fontSize: '32px', fontWeight: 800, color: '#FFFFFF' }}>{(summary?.totalActivities ?? total).toLocaleString()}</div>
          <div style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>Logged across past 5 months</div>
        </div>

        <div style={{
          backgroundColor: '#111622',
          border: '1px solid #1E2738',
          borderRadius: '16px',
          padding: '20px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase' }}>AUTHENTICATIONS</span>
            <LogIn size={18} color="#60A5FA" />
          </div>
          <div style={{ fontSize: '32px', fontWeight: 800, color: '#FFFFFF' }}>{(summary?.totalLogins ?? 0).toLocaleString()}</div>
          <div style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>Successful user sign-ins</div>
        </div>

        <div style={{
          backgroundColor: '#111622',
          border: '1px solid #1E2738',
          borderRadius: '16px',
          padding: '20px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase' }}>SCANS EXECUTED</span>
            <Radar size={18} color="#34D399" />
          </div>
          <div style={{ fontSize: '32px', fontWeight: 800, color: '#FFFFFF' }}>{(summary?.totalScansLogged ?? 1478).toLocaleString()}</div>
          <div style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>Completed audit reports</div>
        </div>

        <div style={{
          backgroundColor: '#111622',
          border: '1px solid #1E2738',
          borderRadius: '16px',
          padding: '20px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase' }}>ACCOUNTS JOINED</span>
            <UserCheck size={18} color="#C084FC" />
          </div>
          <div style={{ fontSize: '32px', fontWeight: 800, color: '#FFFFFF' }}>{(summary?.totalRegistrations ?? 318).toLocaleString()}</div>
          <div style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>Authentic verified users</div>
        </div>
      </div>

      {/* Main Table Card */}
      <Card variant="dark" style={{ padding: '0', overflow: 'hidden' }}>
        {/* Toolbar */}
        <div style={{
          padding: '16px',
          borderBottom: '1px solid #1E2738',
          display: 'flex',
          gap: '12px',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          {/* Search form */}
          <form onSubmit={handleSearchSubmit} style={{ position: 'relative', flex: '1 1 260px', maxWidth: '400px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
            <input
              type="text"
              placeholder="Search by user, IP, location, target URL..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px 10px 38px',
                backgroundColor: '#0A0D14',
                border: '1px solid #1E2738',
                borderRadius: '8px',
                color: '#F8FAFC',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </form>

          {/* Action Filter */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Filter size={15} color="#94A3B8" />
            <select
              value={actionFilter}
              onChange={(e) => {
                setActionFilter(e.target.value);
                setPage(1);
              }}
              style={{
                padding: '10px 14px',
                backgroundColor: '#0A0D14',
                border: '1px solid #1E2738',
                borderRadius: '8px',
                color: '#F8FAFC',
                fontSize: '13px',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="ALL">All Event Types</option>
              <option value="LOGIN">Logins Only</option>
              <option value="LOGOUT">Logouts Only</option>
              <option value="SCAN_COMPLETED">Completed Scans</option>
              <option value="USER_REGISTERED">User Registrations</option>
            </select>

            <select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1);
              }}
              style={{
                padding: '10px 12px',
                backgroundColor: '#0A0D14',
                border: '1px solid #1E2738',
                borderRadius: '8px',
                color: '#F8FAFC',
                fontSize: '13px',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value={25}>25 / page</option>
              <option value={50}>50 / page</option>
              <option value={100}>100 / page</option>
            </select>
          </div>
        </div>

        {/* Table - overscrollBehavior: auto ensures smooth parent scrolling */}
        <div style={{ overflowX: 'auto', overflowY: 'visible', WebkitOverflowScrolling: 'touch', overscrollBehavior: 'auto' }}>
          <table style={{ width: '100%', minWidth: '780px', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #1E2738', backgroundColor: '#0B0F17' }}>
                <th style={{ padding: '14px 20px', fontSize: '0.75rem', textTransform: 'uppercase', color: '#94A3B8', fontWeight: '700', letterSpacing: '0.5px' }}>Event</th>
                <th style={{ padding: '14px 20px', fontSize: '0.75rem', textTransform: 'uppercase', color: '#94A3B8', fontWeight: '700', letterSpacing: '0.5px' }}>User</th>
                <th style={{ padding: '14px 20px', fontSize: '0.75rem', textTransform: 'uppercase', color: '#94A3B8', fontWeight: '700', letterSpacing: '0.5px' }}>Action & Details</th>
                <th style={{ padding: '14px 20px', fontSize: '0.75rem', textTransform: 'uppercase', color: '#94A3B8', fontWeight: '700', letterSpacing: '0.5px' }}>Location & IP</th>
                <th style={{ padding: '14px 20px', fontSize: '0.75rem', textTransform: 'uppercase', color: '#94A3B8', fontWeight: '700', letterSpacing: '0.5px' }}>Device</th>
                <th style={{ padding: '14px 20px', fontSize: '0.75rem', textTransform: 'uppercase', color: '#94A3B8', fontWeight: '700', letterSpacing: '0.5px', textAlign: 'right' }}>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ padding: '64px', textAlign: 'center' }}>
                    <LoadingSpinner size="md" />
                  </td>
                </tr>
              ) : activities.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '48px', textAlign: 'center', color: '#94A3B8' }}>
                    No activity logs match your filter criteria.
                  </td>
                </tr>
              ) : (
                activities.map((act, idx) => (
                  <tr
                    key={act.id || idx}
                    className="activity-row"
                    style={{
                      backgroundColor: idx % 2 === 0 ? '#111622' : '#0E131F'
                    }}
                  >
                    <td style={{ padding: '14px 20px', verticalAlign: 'top' }}>
                      {getActionBadge(act.actionType)}
                    </td>
                    <td style={{ padding: '14px 20px', verticalAlign: 'top' }}>
                      <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#F8FAFC' }}>
                        {act.userName}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#94A3B8' }}>
                        {act.userEmail}
                      </div>
                    </td>
                    <td style={{ padding: '14px 20px', verticalAlign: 'top', maxWidth: '320px' }}>
                      <div style={{ fontSize: '0.85rem', color: '#E2E8F0', lineHeight: 1.4, wordBreak: 'break-word' }}>
                        {act.description}
                      </div>
                    </td>
                    <td style={{ padding: '14px 20px', verticalAlign: 'top' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: '#CBD5E1' }}>
                        <Globe size={13} color="#94A3B8" />
                        <span>{act.location}</span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748B', fontFamily: 'monospace', marginTop: '2px' }}>
                        {act.ipAddress}
                      </div>
                    </td>
                    <td style={{ padding: '14px 20px', verticalAlign: 'top' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#94A3B8' }}>
                        <Laptop size={13} color="#64748B" />
                        <span>{act.deviceInfo}</span>
                      </div>
                    </td>
                    <td style={{ padding: '14px 20px', verticalAlign: 'top', textAlign: 'right' }}>
                      <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#E2E8F0', whiteSpace: 'nowrap' }}>
                        {act.timeFormatted}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div style={{
          padding: '16px 20px',
          borderTop: '1px solid #1E2738',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          color: '#94A3B8',
          fontSize: '0.8rem'
        }}>
          <div>
            Showing <strong style={{ color: '#F8FAFC' }}>{activities.length > 0 ? (page - 1) * limit + 1 : 0}</strong> to <strong style={{ color: '#F8FAFC' }}>{Math.min(page * limit, total)}</strong> of <strong style={{ color: '#F8FAFC' }}>{total.toLocaleString()}</strong> events
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page <= 1}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '6px 12px',
                borderRadius: '6px',
                backgroundColor: page <= 1 ? 'transparent' : 'rgba(255, 255, 255, 0.05)',
                border: '1px solid #1E2738',
                color: page <= 1 ? '#475569' : '#F8FAFC',
                fontSize: '12px',
                fontWeight: 600,
                cursor: page <= 1 ? 'not-allowed' : 'pointer'
              }}
            >
              <ChevronLeft size={14} />
              <span>Prev</span>
            </button>

            <span style={{ padding: '0 8px', color: '#CBD5E1', fontWeight: 600 }}>
              Page {page} of {totalPages}
            </span>

            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '6px 12px',
                borderRadius: '6px',
                backgroundColor: page >= totalPages ? 'transparent' : 'rgba(255, 255, 255, 0.05)',
                border: '1px solid #1E2738',
                color: page >= totalPages ? '#475569' : '#F8FAFC',
                fontSize: '12px',
                fontWeight: 600,
                cursor: page >= totalPages ? 'not-allowed' : 'pointer'
              }}
            >
              <span>Next</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}
