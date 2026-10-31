import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Shield, ShieldAlert, ShieldCheck, AlertTriangle, AlertCircle, 
  Search, RefreshCw, ExternalLink, Download, Radar, 
  Clock, ArrowRight, CheckCircle2, ChevronRight, Filter,
  FileText, Terminal, Layers
} from 'lucide-react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import LoadingSpinner from '../../components/LoadingSpinner';
import SeverityBadge from '../../components/SeverityBadge';
import { getScanHistory, getScanReport } from '../../services/api';

export default function History() {
  const navigate = useNavigate();
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedScanId, setSelectedScanId] = useState(null);
  const [scanDetail, setScanDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  
  // Search and Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [exportNotice, setExportNotice] = useState(null);

  const fetchHistory = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else setLoading(true);

    try {
      const data = await getScanHistory();
      const list = Array.isArray(data) ? data : (data?.items || []);
      setScans(list);
      
      // Auto-select first scan if none selected
      if (list.length > 0 && !selectedScanId) {
        handleSelectScan(list[0]);
      } else if (list.length === 0) {
        setSelectedScanId(null);
        setScanDetail(null);
      }
    } catch (err) {
      console.error('Failed to load scan history:', err);
    } finally {
      setLoading(false);
      if (isManual) {
        setTimeout(() => setRefreshing(false), 500);
      }
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleSelectScan = async (scan) => {
    setSelectedScanId(scan.id);
    setDetailLoading(true);
    try {
      const detail = await getScanReport(scan.id);
      setScanDetail(detail || scan);
    } catch (err) {
      console.error('Failed to load scan detail:', err);
      // Fallback to local scan object
      setScanDetail(scan);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleExportJSON = (report) => {
    if (!report) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(report, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    const domain = report.url ? report.url.replace(/[^a-zA-Z0-9]/g, '_') : 'scan';
    downloadAnchor.setAttribute("download", `rakshak_audit_${domain}_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setExportNotice("Audit report downloaded successfully.");
    setTimeout(() => setExportNotice(null), 3500);
  };

  // Severity Color Mapping
  const getSeverityColor = (sev) => {
    const s = (sev || '').toLowerCase();
    if (s === 'critical') return '#DC2626';
    if (s === 'high') return '#EA580C';
    if (s === 'medium') return '#D97706';
    if (s === 'low') return '#2563EB';
    return '#64748B';
  };

  // Filtered scans
  const filteredScans = scans.filter(scan => {
    const matchesSearch = (scan.url || '').toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;

    if (severityFilter === 'ALL') return true;
    const summary = scan.summary || {};
    if (severityFilter === 'CRITICAL') return (summary.critical || 0) > 0;
    if (severityFilter === 'HIGH') return (summary.high || 0) > 0;
    if (severityFilter === 'MEDIUM') return (summary.medium || 0) > 0;
    if (severityFilter === 'CLEAN') {
      const total = (summary.critical || 0) + (summary.high || 0) + (summary.medium || 0) + (summary.low || 0);
      return total === 0;
    }
    return true;
  });

  // Calculate Metrics
  const totalScans = scans.length;
  let totalCritical = 0;
  let totalHigh = 0;
  let cleanScans = 0;

  scans.forEach(s => {
    const sum = s.summary || {};
    const crit = sum.critical || 0;
    const high = sum.high || 0;
    const med = sum.medium || 0;
    const low = sum.low || 0;
    totalCritical += crit;
    totalHigh += high;
    if (crit === 0 && high === 0 && med === 0 && low === 0) {
      cleanScans += 1;
    }
  });

  return (
    <div style={{
      maxWidth: '1280px',
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
        .scan-history-item {
          transition: all 0.2s ease;
          cursor: pointer;
          border: 1px solid var(--border-default, #E5E4E2);
          border-radius: 12px;
          background: #FFFFFF;
        }
        .scan-history-item:hover {
          border-color: var(--accent, #0D9488);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }
        .scan-history-item.active {
          border-color: var(--accent, #0D9488);
          background: rgba(13, 148, 136, 0.03);
          box-shadow: 0 0 0 2px rgba(13, 148, 136, 0.2);
        }
        .remediation-box {
          background: #F0FDF4;
          border: 1px solid #BBF7D0;
          border-radius: 8px;
          padding: 14px 16px;
          margin-top: 12px;
        }
      `}</style>

      {/* Header Banner */}
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
              fontSize: 'clamp(1.5rem, 3vw, 2rem)',
              fontWeight: 800,
              letterSpacing: '-0.5px',
              margin: 0,
              color: 'var(--text-primary, #1A1A1A)'
            }}>
              Scan History & Audit Logs
            </h1>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '3px 10px',
              borderRadius: '9999px',
              backgroundColor: 'rgba(13, 148, 136, 0.1)',
              color: 'var(--accent, #0D9488)',
              fontSize: '12px',
              fontWeight: 700
            }}>
              {totalScans} {totalScans === 1 ? 'Scan' : 'Scans'} Recorded
            </span>
          </div>
          <p style={{ margin: 0, color: 'var(--text-secondary, #4A4A4A)', fontSize: '0.95rem' }}>
            Audit records, threat detection summaries, and actionable remediation logs for all scanned applications
          </p>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => fetchHistory(true)}
            disabled={refreshing}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 16px',
              borderRadius: '10px',
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--border-default, #E5E4E2)',
              color: 'var(--text-primary, #1A1A1A)',
              fontSize: '14px',
              fontWeight: 600,
              cursor: refreshing ? 'not-allowed' : 'pointer'
            }}
          >
            <RefreshCw size={16} style={{ animation: refreshing ? 'spin 1s linear infinite' : 'none', color: 'var(--accent, #0D9488)' }} />
            <span>Refresh</span>
          </button>

          <Link to="/scan" style={{ textDecoration: 'none' }}>
            <Button variant="primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', minHeight: '42px', padding: '0 20px' }}>
              <Radar size={16} />
              <span>+ New Scan</span>
            </Button>
          </Link>
        </div>
      </div>

      {exportNotice && (
        <div style={{
          marginBottom: '20px',
          padding: '12px 18px',
          borderRadius: '10px',
          backgroundColor: '#ECFDF5',
          border: '1px solid #A7F3D0',
          color: '#065F46',
          fontSize: '14px',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <CheckCircle2 size={18} color="#059669" />
          <span>{exportNotice}</span>
        </div>
      )}

      {/* Bento Metric Tiles */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))',
        gap: '16px',
        marginBottom: '28px'
      }}>
        <Card style={{ padding: '20px', borderRadius: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>TOTAL SCANS</span>
            <Radar size={20} color="var(--accent)" />
          </div>
          <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--text-primary)' }}>{totalScans}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>Autonomous audits run</div>
        </Card>

        <Card style={{ padding: '20px', borderRadius: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#DC2626' }}>CRITICAL ISSUES</span>
            <ShieldAlert size={20} color="#DC2626" />
          </div>
          <div style={{ fontSize: '32px', fontWeight: 800, color: '#DC2626' }}>{totalCritical}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>Requires immediate patch</div>
        </Card>

        <Card style={{ padding: '20px', borderRadius: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#EA580C' }}>HIGH-RISK THREATS</span>
            <AlertTriangle size={20} color="#EA580C" />
          </div>
          <div style={{ fontSize: '32px', fontWeight: 800, color: '#EA580C' }}>{totalHigh}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>Security posture exposure</div>
        </Card>

        <Card style={{ padding: '20px', borderRadius: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#059669' }}>CLEAN TARGETS</span>
            <ShieldCheck size={20} color="#059669" />
          </div>
          <div style={{ fontSize: '32px', fontWeight: 800, color: '#059669' }}>{cleanScans}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>Zero high vulnerabilities</div>
        </Card>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div style={{ padding: '64px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
          <LoadingSpinner size="lg" />
          <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Loading scan history...</span>
        </div>
      ) : scans.length === 0 ? (
        /* Empty State */
        <Card style={{
          padding: '64px 24px',
          textAlign: 'center',
          borderRadius: '16px',
          border: '1px dashed var(--border-default, #E5E4E2)',
          backgroundColor: '#FFFFFF'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: 'rgba(13, 148, 136, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            color: 'var(--accent, #0D9488)'
          }}>
            <Radar size={32} />
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: 700, margin: '0 0 8px 0' }}>No Scans in Your History Yet</h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '480px', margin: '0 auto 24px', fontSize: '15px', lineHeight: 1.6 }}>
            Run your first vulnerability scan on any website to detect security flaws, missing headers, and potential exploits.
          </p>
          <Link to="/scan" style={{ textDecoration: 'none' }}>
            <Button variant="primary" style={{ padding: '0 28px', minHeight: '46px' }}>
              Launch Your First Scan Now
            </Button>
          </Link>
        </Card>
      ) : (
        /* Two-Column Asymmetric View: Scan List & Interactive Detail Pane */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))', gap: '24px', alignItems: 'start' }}>
          
          {/* Left Panel: Search & Scan List */}
          <div>
            {/* Toolbar */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative', flex: '1 1 200px' }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="Filter targets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px 8px 36px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-default, #E5E4E2)',
                    fontSize: '13px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                style={{
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-default, #E5E4E2)',
                  fontSize: '13px',
                  backgroundColor: '#FFFFFF',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="ALL">All Severities</option>
                <option value="CRITICAL">Critical Only</option>
                <option value="HIGH">High Severity</option>
                <option value="MEDIUM">Medium Severity</option>
                <option value="CLEAN">Clean (No Findings)</option>
              </select>
            </div>

            {/* List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {filteredScans.length === 0 ? (
                <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '14px' }}>
                  No scans match your filter criteria.
                </div>
              ) : (
                filteredScans.map(scan => {
                  const isSelected = selectedScanId === scan.id;
                  const sum = scan.summary || {};
                  const totalIssues = (sum.critical || 0) + (sum.high || 0) + (sum.medium || 0) + (sum.low || 0);

                  return (
                    <div
                      key={scan.id}
                      onClick={() => handleSelectScan(scan)}
                      className={`scan-history-item ${isSelected ? 'active' : ''}`}
                      style={{ padding: '16px' }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text-primary)', wordBreak: 'break-all' }}>
                          {scan.url}
                        </div>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '11px',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: '9999px',
                          backgroundColor: scan.status === 'completed' ? '#DCFCE7' : '#FEF3C7',
                          color: scan.status === 'completed' ? '#15803D' : '#B45309'
                        }}>
                          {scan.status === 'completed' ? 'COMPLETED' : 'IN PROGRESS'}
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '10px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={13} />
                          {scan.date ? new Date(scan.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Unknown date'}
                        </span>
                        <span>•</span>
                        <span>{scan.duration || '8s'}</span>
                      </div>

                      {/* Severity Badges */}
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
                        {totalIssues === 0 ? (
                          <span style={{ fontSize: '11px', fontWeight: 600, color: '#059669', backgroundColor: '#ECFDF5', padding: '2px 8px', borderRadius: '4px' }}>
                            ✓ Clean (0 Vulnerabilities)
                          </span>
                        ) : (
                          <>
                            {sum.critical > 0 && <SeverityBadge severity="critical" count={sum.critical} />}
                            {sum.high > 0 && <SeverityBadge severity="high" count={sum.high} />}
                            {sum.medium > 0 && <SeverityBadge severity="medium" count={sum.medium} />}
                            {sum.low > 0 && <SeverityBadge severity="low" count={sum.low} />}
                          </>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Panel: Detailed Audit Report */}
          <div style={{ position: 'sticky', top: '24px' }}>
            <Card style={{ padding: '24px', borderRadius: '16px', overflow: 'hidden' }}>
              {!selectedScanId ? (
                <div style={{ padding: '48px 24px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  <ShieldCheck size={40} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
                  <p style={{ margin: 0 }}>Select a scan from the left panel to inspect detailed telemetry</p>
                </div>
              ) : detailLoading ? (
                <div style={{ padding: '48px', display: 'flex', justifyContent: 'center' }}>
                  <LoadingSpinner size="md" />
                </div>
              ) : scanDetail ? (
                <div>
                  {/* Target Title & Controls */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <h2 style={{ fontSize: '18px', fontWeight: 800, margin: 0, wordBreak: 'break-all' }}>
                          {scanDetail.url}
                        </h2>
                        <a href={scanDetail.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-muted)' }}>
                          <ExternalLink size={15} />
                        </a>
                      </div>
                      <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>
                        Scanned on {scanDetail.date ? new Date(scanDetail.date).toLocaleString() : 'Recently'}
                      </p>
                    </div>

                    <button
                      onClick={() => handleExportJSON(scanDetail)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        backgroundColor: '#F8FAFC',
                        border: '1px solid var(--border-default, #E5E4E2)',
                        color: 'var(--text-primary)',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      <Download size={13} />
                      <span>Export JSON</span>
                    </button>
                  </div>

                  {/* Summary Bar */}
                  <div style={{
                    padding: '16px',
                    borderRadius: '10px',
                    backgroundColor: 'var(--bg-secondary, #F5F4F0)',
                    marginBottom: '20px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 700 }}>VULNERABILITY SEVERITY INDEX</span>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)' }}>
                        {scanDetail.vulnerabilities?.length || 0} Issues Detected
                      </span>
                    </div>

                    {/* Colored Progress Bar */}
                    <div style={{ display: 'flex', height: '8px', borderRadius: '4px', overflow: 'hidden', width: '100%', backgroundColor: '#E2E8F0' }}>
                      {Object.entries(scanDetail.summary || {}).map(([sev, count]) => {
                        if (!count || count === 0 || sev === 'total') return null;
                        const total = scanDetail.summary?.total || scanDetail.vulnerabilities?.length || 1;
                        const pct = Math.max(5, (count / total) * 100);
                        return (
                          <div
                            key={sev}
                            style={{
                              width: `${pct}%`,
                              backgroundColor: getSeverityColor(sev)
                            }}
                            title={`${sev.toUpperCase()}: ${count}`}
                          />
                        );
                      })}
                    </div>
                  </div>

                  {/* Vulnerability List */}
                  <div style={{ maxHeight: '550px', overflowY: 'auto', paddingRight: '4px' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                      Audit Findings ({scanDetail.vulnerabilities?.length || 0})
                    </h3>

                    {(!scanDetail.vulnerabilities || scanDetail.vulnerabilities.length === 0) ? (
                      <div style={{ padding: '24px', textAlign: 'center', backgroundColor: '#F0FDF4', borderRadius: '8px', border: '1px solid #BBF7D0' }}>
                        <CheckCircle2 size={32} color="#16A34A" style={{ margin: '0 auto 8px' }} />
                        <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', color: '#15803D' }}>Zero High-Risk Vulnerabilities</h4>
                        <p style={{ margin: 0, fontSize: '13px', color: '#166534' }}>All standard OWASP header & transport controls are configured properly.</p>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        {scanDetail.vulnerabilities.map((vuln, idx) => (
                          <div
                            key={vuln.id || idx}
                            style={{
                              border: '1px solid var(--border-default, #E5E4E2)',
                              borderLeft: `4px solid ${getSeverityColor(vuln.severity)}`,
                              borderRadius: '8px',
                              padding: '14px',
                              backgroundColor: '#FFFFFF'
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', flexWrap: 'wrap', gap: '8px' }}>
                              <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                                {vuln.name || vuln.title || 'Security Finding'}
                              </h4>
                              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                                <SeverityBadge severity={vuln.severity} />
                                {(vuln.cweId || vuln.cwe) && (
                                  <span style={{ fontSize: '11px', fontFamily: 'monospace', backgroundColor: '#F1F5F9', padding: '2px 6px', borderRadius: '4px', color: '#475569' }}>
                                    {vuln.cweId || vuln.cwe}
                                  </span>
                                )}
                              </div>
                            </div>

                            <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                              {vuln.description}
                            </p>

                            {vuln.location && (
                              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                                <span style={{ fontWeight: 600 }}>Location: </span>
                                <code style={{ backgroundColor: '#F1F5F9', padding: '2px 6px', borderRadius: '4px', wordBreak: 'break-all' }}>
                                  {vuln.location}
                                </code>
                              </div>
                            )}

                            {vuln.remediation && (
                              <div className="remediation-box">
                                <div style={{ fontSize: '12px', fontWeight: 700, color: '#15803D', marginBottom: '4px' }}>
                                  Remediation Guidance
                                </div>
                                <div style={{ fontSize: '12px', color: '#166534', lineHeight: 1.4 }}>
                                  {vuln.remediation}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : null}
            </Card>
          </div>

        </div>
      )}
    </div>
  );
}
