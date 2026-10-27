import React, { useEffect, useState } from 'react';
import Card from '../../components/Card';
import LoadingSpinner from '../../components/LoadingSpinner';
import { getAdminUsers, blockUser, unblockUser } from '../../services/api';
import { Search, ShieldAlert, ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [planFilter, setPlanFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [actionLoading, setActionLoading] = useState(null);
  const [actionMessage, setActionMessage] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getAdminUsers();
      setUsers(data?.items || (Array.isArray(data) ? data : []));
    } catch (error) {
      console.error('Failed to load admin users', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleBlock = async (targetUser) => {
    const isCurrentlyBlocked = targetUser.is_blocked || targetUser.status === 'Blocked';
    const actionName = isCurrentlyBlocked ? 'unblock' : 'block';
    
    const confirmed = window.confirm(
      `Are you sure you want to ${actionName.toUpperCase()} user ${targetUser.email}?${
        !isCurrentlyBlocked ? ' They will be immediately blocked from signing in.' : ''
      }`
    );
    if (!confirmed) return;

    setActionLoading(targetUser.id);
    setActionMessage(null);
    try {
      if (isCurrentlyBlocked) {
        await unblockUser(targetUser.id);
      } else {
        await blockUser(targetUser.id);
      }
      
      setUsers(prev => prev.map(u => {
        if (u.id === targetUser.id) {
          const updatedBlocked = !isCurrentlyBlocked;
          return {
            ...u,
            is_blocked: updatedBlocked,
            status: updatedBlocked ? 'Blocked' : 'Active'
          };
        }
        return u;
      }));

      setActionMessage({
        type: 'success',
        text: `User ${targetUser.email} was successfully ${isCurrentlyBlocked ? 'unblocked' : 'blocked'}.`
      });
    } catch (err) {
      console.error(`Failed to ${actionName} user:`, err);
      setActionMessage({
        type: 'error',
        text: err.message || `Failed to ${actionName} user.`
      });
    } finally {
      setActionLoading(null);
      setTimeout(() => setActionMessage(null), 5000);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlan = planFilter === 'All' || user.plan?.toLowerCase() === planFilter.toLowerCase();
    const isUserBlocked = user.is_blocked || user.status === 'Blocked';
    const matchesStatus = statusFilter === 'All' || 
                          (statusFilter === 'Active' && !isUserBlocked) || 
                          (statusFilter === 'Blocked' && isUserBlocked);
    return matchesSearch && matchesPlan && matchesStatus;
  });

  const getPlanBadge = (plan) => {
    const p = (plan || 'Free').toLowerCase();
    if (p === 'pro') {
      return <span style={{ backgroundColor: 'var(--accent, #0D9488)', color: 'white', padding: '2px 8px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: '600' }}>Pro</span>;
    } else if (p === 'defense') {
      return <span style={{ backgroundColor: '#1C1917', border: '1px solid var(--accent, #0D9488)', color: 'var(--accent, #0D9488)', padding: '1px 7px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: '600' }}>Defense</span>;
    }
    return <span style={{ backgroundColor: '#78716C', color: 'white', padding: '2px 8px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: '600' }}>Free</span>;
  };

  return (
    <div style={{ 
      padding: '24px', 
      backgroundColor: 'var(--bg-admin)', 
      color: 'var(--text-admin)',
      minHeight: '100%',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '600', margin: 0 }}>
            User Management & Security Control
          </h1>
          <p style={{ margin: '4px 0 0 0', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Monitor user scan usage, account status, and enforce account blocks
          </p>
        </div>
      </div>

      {actionMessage && (
        <div style={{
          marginBottom: '20px',
          padding: '12px 16px',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          backgroundColor: actionMessage.type === 'error' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(34, 197, 94, 0.15)',
          border: `1px solid ${actionMessage.type === 'error' ? '#EF4444' : '#22C55E'}`,
          color: actionMessage.type === 'error' ? '#FCA5A5' : '#86EFAC',
          fontSize: '0.875rem'
        }}>
          {actionMessage.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
          <span>{actionMessage.text}</span>
        </div>
      )}

      <Card variant="dark" style={{ padding: '0', overflow: 'hidden' }}>
        {/* Toolbar */}
        <div style={{ 
          padding: '16px', 
          borderBottom: '1px solid var(--border-admin)',
          display: 'flex',
          gap: '12px',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ position: 'relative', flex: '1 1 240px', minWidth: '200px', maxWidth: '100%' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px 10px 38px',
                backgroundColor: 'var(--bg-admin)',
                border: '1px solid var(--border-admin)',
                borderRadius: '6px',
                color: 'var(--text-admin)',
                fontFamily: 'inherit',
                fontSize: '15px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>
          
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', flex: '0 1 auto' }}>
            <select 
              value={planFilter}
              onChange={(e) => setPlanFilter(e.target.value)}
              style={{
                padding: '10px 12px',
                backgroundColor: 'var(--bg-admin)',
                border: '1px solid var(--border-admin)',
                borderRadius: '6px',
                color: 'var(--text-admin)',
                fontFamily: 'inherit',
                fontSize: '14px',
                outline: 'none',
                cursor: 'pointer',
                minHeight: '40px'
              }}
            >
              <option value="All">All Plans</option>
              <option value="Free">Free</option>
              <option value="Pro">Pro</option>
              <option value="Defense">Defense</option>
            </select>

            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                padding: '10px 12px',
                backgroundColor: 'var(--bg-admin)',
                border: '1px solid var(--border-admin)',
                borderRadius: '6px',
                color: 'var(--text-admin)',
                fontFamily: 'inherit',
                fontSize: '14px',
                outline: 'none',
                cursor: 'pointer',
                minHeight: '40px'
              }}
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active Users</option>
              <option value="Blocked">Blocked Users</option>
            </select>
          </div>
        </div>

        {/* Table wrapper */}
        <div className="touch-scroll" style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <table style={{ width: '100%', minWidth: '680px', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-admin)', backgroundColor: '#353130' }}>
                <th style={{ padding: '12px 24px', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '600' }}>User</th>
                <th style={{ padding: '12px 24px', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '600' }}>Plan</th>
                <th style={{ padding: '12px 24px', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '600' }}>Status</th>
                <th style={{ padding: '12px 24px', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '600' }}>Scans Completed</th>
                <th style={{ padding: '12px 24px', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '600' }}>Joined</th>
                <th style={{ padding: '12px 24px', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '600', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ padding: '48px', textAlign: 'center' }}>
                    <LoadingSpinner size="md" />
                  </td>
                </tr>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user, idx) => {
                  const isBlocked = user.is_blocked || user.status === 'Blocked';
                  const isPrimaryAdmin = user.email?.toLowerCase() === 'hidoiarya@gmail.com';
                  const isActionBusy = actionLoading === user.id;

                  return (
                    <tr 
                      key={user.id} 
                      style={{ 
                        borderBottom: '1px solid var(--border-admin)',
                        backgroundColor: idx % 2 === 0 ? 'var(--bg-admin-card)' : '#322E2D',
                        transition: 'background-color 0.2s ease',
                      }}
                    >
                      <td style={{ padding: '16px 24px' }}>
                        <div style={{ fontWeight: '600', fontSize: '0.875rem', color: 'var(--text-admin)' }}>
                          {user.name || 'User'}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          {user.email}
                        </div>
                      </td>
                      <td style={{ padding: '16px 24px' }}>{getPlanBadge(user.plan)}</td>
                      <td style={{ padding: '16px 24px' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '3px 8px', borderRadius: '4px', backgroundColor: isBlocked ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)' }}>
                          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: isBlocked ? '#EF4444' : '#16A34A' }}></div>
                          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: isBlocked ? '#F87171' : '#4ADE80' }}>
                            {isBlocked ? 'Blocked' : 'Active'}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ 
                            fontSize: '0.9rem', 
                            fontWeight: '700',
                            backgroundColor: 'rgba(13, 148, 136, 0.15)',
                            color: 'var(--accent, #0D9488)',
                            padding: '3px 10px',
                            borderRadius: '6px',
                            border: '1px solid rgba(13, 148, 136, 0.3)'
                          }}>
                            {user.scans ?? 0} {user.scans === 1 ? 'scan' : 'scans'}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: '16px 24px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        {user.joinedAt || user.joined || '—'}
                      </td>
                      <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                        {isPrimaryAdmin ? (
                          <span style={{ 
                            padding: '4px 10px', 
                            backgroundColor: 'rgba(13, 148, 136, 0.15)', 
                            color: 'var(--accent, #0D9488)', 
                            borderRadius: '4px', 
                            fontSize: '0.75rem', 
                            fontWeight: 'bold',
                            border: '1px solid var(--accent, #0D9488)'
                          }}>
                            Admin (Master)
                          </span>
                        ) : (
                          <button
                            onClick={() => handleToggleBlock(user)}
                            disabled={isActionBusy}
                            style={{
                              padding: '6px 14px',
                              borderRadius: '6px',
                              fontSize: '0.8rem',
                              fontWeight: '600',
                              cursor: isActionBusy ? 'not-allowed' : 'pointer',
                              border: isBlocked ? '1px solid #16A34A' : '1px solid #EF4444',
                              backgroundColor: isBlocked ? 'rgba(22, 163, 74, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                              color: isBlocked ? '#4ADE80' : '#F87171',
                              transition: 'all 0.2s ease',
                              opacity: isActionBusy ? 0.6 : 1,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px'
                            }}
                            onMouseEnter={(e) => {
                              if (!isActionBusy) {
                                e.currentTarget.style.backgroundColor = isBlocked ? '#16A34A' : '#DC2626';
                                e.currentTarget.style.color = '#FFFFFF';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!isActionBusy) {
                                e.currentTarget.style.backgroundColor = isBlocked ? 'rgba(22, 163, 74, 0.15)' : 'rgba(239, 68, 68, 0.15)';
                                e.currentTarget.style.color = isBlocked ? '#4ADE80' : '#F87171';
                              }
                            }}
                          >
                            {isBlocked ? (
                              <>
                                <ShieldCheck size={14} />
                                {isActionBusy ? 'Unblocking...' : 'Unblock User'}
                              </>
                            ) : (
                              <>
                                <ShieldAlert size={14} />
                                {isActionBusy ? 'Blocking...' : 'Block User'}
                              </>
                            )}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No users found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Footer */}
        <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border-admin)', color: 'var(--text-muted)', fontSize: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Showing {filteredUsers.length} of {users.length} registered users</span>
          <span style={{ color: 'var(--text-muted)' }}>Admin control active</span>
        </div>
      </Card>
    </div>
  );
}
