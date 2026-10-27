import React, { useEffect, useState } from 'react';
import { getScanHistory, getScanReport } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import Card from '../../components/Card';
import SeverityBadge from '../../components/SeverityBadge';
import { AlertCircle, ShieldCheck, ChevronRight } from 'lucide-react';

export default function ScanReports() {
  const [scans, setScans] = useState([]);
  const [selectedScan, setSelectedScan] = useState(null);
  const [reportDetail, setReportDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    const fetchScans = async () => {
      setLoading(true);
      try {
        const history = await getScanHistory();
        setScans(history);
      } catch (error) {
        console.error('Failed to fetch scan history', error);
      } finally {
        setLoading(false);
      }
    };
    fetchScans();
  }, []);

  const handleSelectScan = async (scan) => {
    setSelectedScan(scan);
    setDetailLoading(true);
    try {
      const details = await getScanReport(scan.id);
      setReportDetail(details);
    } catch (error) {
      console.error('Failed to fetch scan details', error);
    } finally {
      setDetailLoading(false);
    }
  };

  const getSeverityColor = (severity) => {
    const colors = {
      critical: 'var(--severity-critical)',
      high: 'var(--severity-high)',
      medium: 'var(--severity-medium)',
      low: 'var(--severity-low)',
      info: 'var(--severity-info)'
    };
    return colors[severity] || colors.info;
  };

  return (
    <div style={{ padding: 'clamp(16px, 3vw, 24px)', display: 'flex', flexDirection: 'column', height: '100%', boxSizing: 'border-box' }}>
      <h1 style={{ fontSize: 'clamp(1.25rem, 3vw, 1.5rem)', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '20px' }}>
        Scan Reports
      </h1>
      
      <div className="flex flex-col md:flex-row gap-5 flex-1 min-h-0">
        {/* Left Panel: List */}
        <Card className="w-full md:w-80 flex-shrink-0" style={{ 
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          padding: 0
        }}>
          <div style={{ padding: '16px', borderBottom: '1px solid var(--border-default)' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--text-primary)', margin: 0 }}>History</h2>
          </div>
          <div style={{ overflowY: 'auto', flex: 1, padding: '8px' }}>
            {loading ? (
              <div style={{ padding: '32px 0', display: 'flex', justifyContent: 'center' }}>
                <LoadingSpinner size="md" />
              </div>
            ) : scans.map(scan => (
              <div 
                key={scan.id}
                onClick={() => handleSelectScan(scan)}
                style={{
                  padding: '12px 16px',
                  cursor: 'pointer',
                  borderRadius: '0px',
                  marginBottom: '4px',
                  borderLeft: selectedScan?.id === scan.id ? '3px solid var(--accent)' : '3px solid transparent',
                  backgroundColor: selectedScan?.id === scan.id ? 'var(--accent-light)' : 'transparent',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ 
                  fontWeight: '500', 
                  color: selectedScan?.id === scan.id ? 'var(--accent-hover)' : 'var(--text-primary)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  fontSize: '0.875rem'
                }}>
                  {scan.url}
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '4px', marginBottom: '8px' }}>
                  {new Date(scan.date).toLocaleString()}
                </div>
                <div style={{ display: 'flex', gap: '4px' }}>
                  {Object.entries(scan.summary || {}).map(([sev, count]) => count > 0 && (
                    <SeverityBadge key={sev} severity={sev} count={count} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Right Panel: Details */}
        <Card style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0 }}>
          {!selectedScan ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
              <ShieldCheck size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
              <p>Select a scan report to view details</p>
            </div>
          ) : detailLoading ? (
             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
               <LoadingSpinner size="lg" />
             </div>
          ) : reportDetail ? (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ padding: '24px', borderBottom: '1px solid var(--border-default)' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '8px', marginTop: 0 }}>
                  {reportDetail.url}
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: '0 0 16px 0' }}>
                  Scanned on {new Date(reportDetail.date).toLocaleString()}
                </p>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                    {reportDetail.totalVulnerabilities} <span style={{ fontSize: '1rem', fontWeight: '500', color: 'var(--text-secondary)' }}>Issues Found</span>
                  </div>
                </div>

                {/* Severity Bar */}
                <div style={{ display: 'flex', height: '8px', borderRadius: '4px', overflow: 'hidden', width: '100%' }}>
                  {Object.entries(reportDetail.summary || {}).map(([sev, count]) => {
                    if (count === 0) return null;
                    const percentage = (count / reportDetail.totalVulnerabilities) * 100;
                    return (
                      <div 
                        key={sev} 
                        style={{ 
                          width: `${percentage}%`, 
                          backgroundColor: getSeverityColor(sev) 
                        }} 
                        title={`${sev}: ${count}`}
                      />
                    );
                  })}
                </div>
              </div>

              <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--text-primary)', margin: '0 0 16px 0' }}>
                  Vulnerability Details
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {reportDetail.vulnerabilities?.map((vuln, idx) => (
                    <Card key={idx} style={{ 
                      borderLeft: `4px solid ${getSeverityColor(vuln.severity)}`,
                      padding: '16px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <AlertCircle size={18} color={getSeverityColor(vuln.severity)} />
                        <h4 style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '1rem', margin: 0 }}>
                          {vuln.title}
                        </h4>
                        <SeverityBadge severity={vuln.severity} />
                      </div>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '12px', marginTop: 0 }}>
                        {vuln.description}
                      </p>
                      <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '12px', borderRadius: '6px' }}>
                        <h5 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '700', margin: '0 0 4px 0' }}>Remediation</h5>
                        <p style={{ color: 'var(--text-primary)', fontSize: '0.875rem', margin: 0 }}>{vuln.remediation}</p>
                      </div>
                    </Card>
                  ))}
                  {reportDetail.vulnerabilities?.length === 0 && (
                    <p style={{ color: 'var(--text-secondary)' }}>No vulnerabilities found in this scan. Great job!</p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
              <p>Failed to load scan details</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
