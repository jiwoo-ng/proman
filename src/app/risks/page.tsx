'use client';

import { useState } from 'react';
import { Shield, Plus, AlertTriangle, Search } from 'lucide-react';
import { dataStore } from '@/lib/mock-data';

const levelColors: Record<string, { bg: string; text: string }> = {
  low: { bg: '#f0fdf4', text: '#16a34a' },
  medium: { bg: '#fffbeb', text: '#d97706' },
  high: { bg: '#fff7ed', text: '#ea580c' },
  critical: { bg: '#fef2f2', text: '#dc2626' },
};

const statusColors: Record<string, { bg: string; text: string }> = {
  identified: { bg: '#eff6ff', text: '#2563eb' },
  mitigated: { bg: '#f0fdf4', text: '#16a34a' },
  occurred: { bg: '#fef2f2', text: '#dc2626' },
  closed: { bg: '#f3f4f6', text: '#6b7280' },
};

export default function RisksPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const projects = dataStore.getProjects();
  const allRisks = projects.flatMap(p => {
    const risks = dataStore.getRisksByProject(p.id);
    return risks.map(r => ({ ...r, projectName: p.name }));
  });

  const filtered = allRisks.filter(r => {
    if (searchQuery && !r.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const riskMatrix = {
    critical: allRisks.filter(r => r.impact === 'critical' || r.probability === 'critical').length,
    high: allRisks.filter(r => r.impact === 'high' || r.probability === 'high').length,
    medium: allRisks.filter(r => r.impact === 'medium' && r.probability === 'medium').length,
    low: allRisks.filter(r => r.impact === 'low' && r.probability === 'low').length,
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#111827', margin: 0 }}>Risk Register</h1>
          <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>{allRisks.length} risks identified across all projects</p>
        </div>
        <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 24px', background: 'linear-gradient(135deg, #16a34a, #22c55e)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
          <Plus size={18} /> Add Risk
        </button>
      </div>

      {/* Risk summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {(['critical', 'high', 'medium', 'low'] as const).map(level => (
          <div key={level} style={{ background: 'white', borderRadius: '14px', border: '1px solid #e5e7eb', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: levelColors[level].bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AlertTriangle size={20} color={levelColors[level].text} />
            </div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: 700, color: '#111827' }}>{riskMatrix[level]}</div>
              <div style={{ fontSize: '13px', color: '#6b7280', textTransform: 'capitalize' }}>{level} Risk</div>
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'white', borderRadius: '10px', padding: '10px 16px', border: '1px solid #e5e7eb', maxWidth: '400px', marginBottom: '24px' }}>
        <Search size={18} color="#9ca3af" />
        <input type="text" placeholder="Search risks..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '14px', width: '100%' }} />
      </div>

      {/* Risk table */}
      <div style={{ background: 'white', borderRadius: '14px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
              {['Risk', 'Project', 'Probability', 'Impact', 'Status', 'Owner', 'Mitigation'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#6b7280', background: '#f9fafb' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(risk => (
              <tr key={risk.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ fontSize: '14px', fontWeight: 500, color: '#111827' }}>{risk.title}</div>
                  <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '2px' }}>{risk.description.substring(0, 60)}...</div>
                </td>
                <td style={{ padding: '14px 16px', fontSize: '13px', color: '#374151' }}>{risk.projectName}</td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 500, background: levelColors[risk.probability].bg, color: levelColors[risk.probability].text, textTransform: 'capitalize' }}>{risk.probability}</span>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 500, background: levelColors[risk.impact].bg, color: levelColors[risk.impact].text, textTransform: 'capitalize' }}>{risk.impact}</span>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 500, background: statusColors[risk.status].bg, color: statusColors[risk.status].text, textTransform: 'capitalize' }}>{risk.status}</span>
                </td>
                <td style={{ padding: '14px 16px', fontSize: '13px', color: '#374151' }}>{risk.owner_email}</td>
                <td style={{ padding: '14px 16px', fontSize: '12px', color: '#6b7280', maxWidth: '200px' }}>{risk.mitigation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
