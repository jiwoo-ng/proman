'use client';

import { useState } from 'react';
import {
  ExternalLink,
  Check,
  Settings,
  RefreshCw,
  Mail,
  FileText,
  Table,
  Calendar,
  BookOpen,
  Cloud,
  Link2,
  Zap,
} from 'lucide-react';

interface Integration {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: typeof Mail;
  color: string;
  bg: string;
  connected: boolean;
  features: string[];
}

const integrations: Integration[] = [
  {
    id: 'gmail',
    name: 'Gmail',
    description: 'Connect Gmail to send notifications, share project updates, and manage communications directly from the app.',
    category: 'Google Workspace',
    icon: Mail,
    color: '#ea4335',
    bg: '#fef2f2',
    connected: true,
    features: ['Email notifications', 'Project updates', 'Team communication'],
  },
  {
    id: 'gdocs',
    name: 'Google Docs',
    description: 'Create, edit, and link Google Docs to your projects. Collaborate on documents with your team in real-time.',
    category: 'Google Workspace',
    icon: FileText,
    color: '#4285f4',
    bg: '#eff6ff',
    connected: true,
    features: ['Document linking', 'Real-time collaboration', 'Auto-sync'],
  },
  {
    id: 'gsheets',
    name: 'Google Sheets',
    description: 'Import data from Google Sheets, export reports, and keep spreadsheets synced with project data.',
    category: 'Google Workspace',
    icon: Table,
    color: '#34a853',
    bg: '#f0fdf4',
    connected: false,
    features: ['Data import/export', 'Report generation', 'Budget tracking'],
  },
  {
    id: 'gcalendar',
    name: 'Google Calendar',
    description: 'Sync project milestones, meetings, and deadlines with Google Calendar for seamless scheduling.',
    category: 'Google Workspace',
    icon: Calendar,
    color: '#fbbc05',
    bg: '#fffbeb',
    connected: true,
    features: ['Event sync', 'Meeting scheduling', 'Deadline reminders'],
  },
  {
    id: 'notion',
    name: 'Notion',
    description: 'Connect Notion to link knowledge bases, wikis, and documentation to your projects.',
    category: 'Productivity',
    icon: BookOpen,
    color: '#000000',
    bg: '#f3f4f6',
    connected: false,
    features: ['Knowledge base linking', 'Wiki integration', 'Notes sync'],
  },
  {
    id: 'onedrive',
    name: 'OneDrive',
    description: 'Access and manage OneDrive files directly within your projects. Share documents with team members.',
    category: 'Cloud Storage',
    icon: Cloud,
    color: '#0078d4',
    bg: '#eff6ff',
    connected: false,
    features: ['File access', 'Document sharing', 'Auto-backup'],
  },
];

export default function IntegrationsPage() {
  const [filter, setFilter] = useState('all');

  const categories = ['all', ...Array.from(new Set(integrations.map(i => i.category)))];
  const filtered = filter === 'all' ? integrations : integrations.filter(i => i.category === filter);
  const connectedCount = integrations.filter(i => i.connected).length;

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#111827', margin: 0 }}>Integrations</h1>
        <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>
          {connectedCount} of {integrations.length} integrations connected
        </p>
      </div>

      {/* Connection status overview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '28px' }}>
        <div style={{ background: 'white', borderRadius: '14px', border: '1px solid #e5e7eb', padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Link2 size={22} color="#16a34a" />
          </div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#111827' }}>{connectedCount}</div>
            <div style={{ fontSize: '13px', color: '#6b7280' }}>Connected</div>
          </div>
        </div>
        <div style={{ background: 'white', borderRadius: '14px', border: '1px solid #e5e7eb', padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={22} color="#3b82f6" />
          </div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#111827' }}>{integrations.length - connectedCount}</div>
            <div style={{ fontSize: '13px', color: '#6b7280' }}>Available</div>
          </div>
        </div>
        <div style={{ background: 'white', borderRadius: '14px', border: '1px solid #e5e7eb', padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#faf5ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <RefreshCw size={22} color="#7c3aed" />
          </div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#111827' }}>Auto</div>
            <div style={{ fontSize: '13px', color: '#6b7280' }}>Sync Active</div>
          </div>
        </div>
      </div>

      {/* Category filters */}
      <div style={{ display: 'flex', gap: '6px', padding: '4px', background: 'white', borderRadius: '10px', border: '1px solid #e5e7eb', marginBottom: '24px', width: 'fit-content' }}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            style={{
              padding: '6px 16px',
              border: 'none',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
              background: filter === cat ? '#16a34a' : 'transparent',
              color: filter === cat ? 'white' : '#6b7280',
              textTransform: 'capitalize',
            }}
          >
            {cat === 'all' ? 'All' : cat}
          </button>
        ))}
      </div>

      {/* Integration cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '20px' }}>
        {filtered.map(integration => {
          const Icon = integration.icon;
          return (
            <div
              key={integration.id}
              className="hover-lift"
              style={{
                background: 'white',
                borderRadius: '14px',
                border: '1px solid #e5e7eb',
                padding: '24px',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {integration.connected && (
                <div style={{ position: 'absolute', top: '16px', right: '16px', display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 10px', background: '#f0fdf4', borderRadius: '20px', fontSize: '11px', fontWeight: 600, color: '#16a34a' }}>
                  <Check size={12} /> Connected
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: integration.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={24} color={integration.color} />
                </div>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 600, margin: 0, color: '#111827' }}>{integration.name}</h3>
                  <span style={{ fontSize: '12px', color: '#9ca3af' }}>{integration.category}</span>
                </div>
              </div>

              <p style={{ fontSize: '13px', color: '#6b7280', lineHeight: 1.5, margin: '0 0 16px' }}>
                {integration.description}
              </p>

              {/* Features */}
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '20px' }}>
                {integration.features.map(f => (
                  <span key={f} style={{ padding: '3px 10px', background: '#f3f4f6', borderRadius: '20px', fontSize: '11px', color: '#6b7280' }}>{f}</span>
                ))}
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: '10px' }}>
                {integration.connected ? (
                  <>
                    <button style={{ flex: 1, padding: '8px', border: '1px solid #e5e7eb', borderRadius: '8px', background: 'white', fontSize: '13px', fontWeight: 500, cursor: 'pointer', color: '#374151', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                      <Settings size={14} /> Settings
                    </button>
                    <button style={{ flex: 1, padding: '8px', border: '1px solid #fecaca', borderRadius: '8px', background: '#fef2f2', fontSize: '13px', fontWeight: 500, cursor: 'pointer', color: '#dc2626' }}>
                      Disconnect
                    </button>
                  </>
                ) : (
                  <button style={{ width: '100%', padding: '10px', border: 'none', borderRadius: '8px', background: '#16a34a', color: 'white', fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                    <ExternalLink size={14} /> Connect
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
