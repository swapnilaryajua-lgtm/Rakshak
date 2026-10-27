import React, { useEffect, useState } from 'react';
import Card from '../../components/Card';
import LoadingSpinner from '../../components/LoadingSpinner';
import { getAdminUsers } from '../../services/api';
import { Search } from 'lucide-react';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [planFilter, setPlanFilter] = useState('All');

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const data = await getAdminUsers();
        setUsers(data || []);
      } catch (error) {
        console.error('Failed to load admin users', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlan = planFilter === 'All' || user.plan === planFilter;
    return matchesSearch && matchesPlan;
  });

  const getPlanBadge = (plan) => {
    if (plan === 'Pro') {
      return <span style={{ backgroundColor: 'var(--accent)', color: 'white', padding: '2px 8px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: '600' }}>Pro</span>;
    } else if (plan === 'Defense') {
      return <span style={{ backgroundColor: '#1C1917', border: '1px solid var(--accent)', color: 'var(--accent)', padding: '1px 7px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: '600' }}>Defense</span>;
    }
    return <span style={{ backgroundColor: 'var(--text-muted)', color: 'white', padding: '2px 8px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: '600' }}>Free</span>;
  };

  return (
    <div style={{ 
      padding: '24px', 
      backgroundColor: 'var(--bg-admin)', 
      color: 'var(--text-admin)',
      minHeight: '100%',
    }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '24px', marginTop: 0 }}>
        User Management
      </h1>

      <Card variant="dark" style={{ padding: '0', overflow: 'hidden' }}>
        {/* Toolbar */}
        <div style={{ 
          padding: '16px 24px', 
          borderBottom: '1px solid var(--border-admin)',
          display: 'flex',
          gap: '16px',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ position: 'relative', width: '300px', maxWidth: '100%' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Search users..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px 8px 38px',
                backgroundColor: 'var(--bg-admin)',
                border: '1px solid var(--border-admin)',
                borderRadius: '6px',
                color: 'var(--text-admin)',
                fontFamily: 'inherit',
                fontSize: '0.875rem',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>
          
          <select 
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value)}
            style={{
              padding: '8px 12px',
              backgroundColor: 'var(--bg-admin)',
              border: '1px solid var(--border-admin)',
              borderRadius: '6px',
              color: 'var(--text-admin)',
              fontFamily: 'inherit',
              fontSize: '0.875rem',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="All">All Plans</option>
            <option value="Free">Free</option>
            <option value="Pro">Pro</option>
            <option value="Defense">Defense</option>
          </select>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-admin)', backgroundColor: '#353130' }}>
                <th style={{ padding: '12px 24px', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '600' }}>Name</th>
                <th style={{ padding: '12px 24px', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '600' }}>Email</th>
                <th style={{ padding: '12px 24px', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '600' }}>Plan</th>
                <th style={{ padding: '12px 24px', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '600' }}>Status</th>
                <th style={{ padding: '12px 24px', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '600' }}>Scans</th>
                <th style={{ padding: '12px 24px', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '600' }}>Joined</th>
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
                filteredUsers.map((user, idx) => (
                  <tr 
                    key={user.id} 
                    style={{ 
                      borderBottom: '1px solid var(--border-admin)',
                      backgroundColor: idx % 2 === 0 ? 'var(--bg-admin-card)' : '#322E2D',
                      transition: 'background-color 0.2s ease',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#3A3635'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = idx % 2 === 0 ? 'var(--bg-admin-card)' : '#322E2D'}
                  >
                    <td style={{ padding: '16px 24px', fontSize: '0.875rem', fontWeight: '500' }}>{user.name}</td>
                    <td style={{ padding: '16px 24px', fontSize: '0.875rem', color: 'var(--text-muted)' }}>{user.email}</td>
                    <td style={{ padding: '16px 24px' }}>{getPlanBadge(user.plan)}</td>
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: user.status === 'Active' ? '#16A34A' : 'var(--text-muted)' }}></div>
                        <span style={{ fontSize: '0.875rem', color: user.status === 'Active' ? 'var(--text-admin)' : 'var(--text-muted)' }}>{user.status}</span>
                      </div>
                    </td>
                    <td style={{ padding: '16px 24px', fontSize: '0.875rem' }}>{user.scans}</td>
                    <td style={{ padding: '16px 24px', fontSize: '0.875rem', color: 'var(--text-muted)' }}>{user.joined}</td>
                  </tr>
                ))
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
        <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border-admin)', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
          Showing 1-{filteredUsers.length} of {filteredUsers.length} users
        </div>
      </Card>
    </div>
  );
}
