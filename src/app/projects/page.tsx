'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Plus,
  Search,
  LayoutGrid,
  List,
  Calendar,
  DollarSign,
  Users,
} from 'lucide-react';
import { dataStore } from '@/lib/mock-data';
import { appEvents, PROJECT_CREATED, PROJECT_UPDATED, DATA_CHANGED, OPEN_NEW_PROJECT_MODAL } from '@/lib/events';

const statusColors: Record<string, string> = {
  not_started: '#9ca3af',
  in_progress: '#3b82f6',
  on_hold: '#f59e0b',
  completed: '#22c55e',
  cancelled: '#ef4444',
};

const statusLabels: Record<string, string> = {
  not_started: 'Not Started',
  in_progress: 'In Progress',
  on_hold: 'On Hold',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

const phaseLabels: Record<string, string> = {
  initiating: 'Initiating',
  planning: 'Planning',
  executing: 'Executing',
  monitoring_controlling: 'Monitoring & Controlling',
  closing: 'Closing',
};

export default function ProjectsPage() {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [, setRefresh] = useState(0);

  useEffect(() => {
    const unsub1 = appEvents.on(PROJECT_CREATED, () => setRefresh(n => n + 1));
    const unsub2 = appEvents.on(PROJECT_UPDATED, () => setRefresh(n => n + 1));
    const unsub3 = appEvents.on(DATA_CHANGED, () => setRefresh(n => n + 1));
    return () => { unsub1(); unsub2(); unsub3(); };
  }, []);

  const projects = dataStore.getProjects().filter(p => {
    if (filterStatus !== 'all' && p.status !== filterStatus) return false;
    if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#111827', margin: 0 }}>Projects</h1>
          <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>
            {projects.length} projects in portfolio
          </p>
        </div>
        <button
          onClick={() => appEvents.emit(OPEN_NEW_PROJECT_MODAL)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 24px',
            background: 'linear-gradient(135deg, #16a34a, #22c55e)',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(22,163,74,0.3)',
          }}
        >
          <Plus size={18} />
          New Project
        </button>
      </div>

      {/* Filters */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '24px',
          flexWrap: 'wrap',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'white',
            borderRadius: '10px',
            padding: '8px 16px',
            border: '1px solid #e5e7eb',
            flex: 1,
            maxWidth: '320px',
          }}
        >
          <Search size={18} color="#9ca3af" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '14px', width: '100%' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '6px', padding: '4px', background: 'white', borderRadius: '10px', border: '1px solid #e5e7eb' }}>
          {['all', 'in_progress', 'not_started', 'completed', 'on_hold'].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              style={{
                padding: '6px 14px',
                border: 'none',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 500,
                cursor: 'pointer',
                background: filterStatus === status ? '#16a34a' : 'transparent',
                color: filterStatus === status ? 'white' : '#6b7280',
                transition: 'all 0.15s ease',
              }}
            >
              {status === 'all' ? 'All' : statusLabels[status]}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '4px', padding: '4px', background: 'white', borderRadius: '10px', border: '1px solid #e5e7eb' }}>
          <button
            onClick={() => setView('grid')}
            style={{ padding: '6px 10px', border: 'none', borderRadius: '6px', cursor: 'pointer', background: view === 'grid' ? '#f0fdf4' : 'transparent', color: view === 'grid' ? '#16a34a' : '#9ca3af' }}
          >
            <LayoutGrid size={18} />
          </button>
          <button
            onClick={() => setView('list')}
            style={{ padding: '6px 10px', border: 'none', borderRadius: '6px', cursor: 'pointer', background: view === 'list' ? '#f0fdf4' : 'transparent', color: view === 'list' ? '#16a34a' : '#9ca3af' }}
          >
            <List size={18} />
          </button>
        </div>
      </div>

      {/* Project Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: view === 'grid' ? 'repeat(auto-fill, minmax(340px, 1fr))' : '1fr',
          gap: '20px',
        }}
      >
        {projects.map(project => {
          const tasks = dataStore.getTasksByProject(project.id);
          const team = dataStore.getTeamByProject(project.id);

          return (
            <Link key={project.id} href={`/projects/${project.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div
                className="hover-lift"
                style={{
                  background: 'white',
                  borderRadius: '14px',
                  border: '1px solid #e5e7eb',
                  padding: '24px',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Phase indicator bar */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: statusColors[project.status] }} />

                {/* Project name and status */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 600, margin: 0, color: '#111827' }}>{project.name}</h3>
                    <span style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px', display: 'block' }}>
                      {phaseLabels[project.phase]}
                    </span>
                  </div>
                  <span
                    style={{
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: 500,
                      background: statusColors[project.status] + '15',
                      color: statusColors[project.status],
                    }}
                  >
                    {statusLabels[project.status]}
                  </span>
                </div>

                {/* Description */}
                <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 16px', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {project.description}
                </p>

                {/* Progress */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '12px', color: '#6b7280' }}>Progress</span>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: '#111827' }}>{project.progress}%</span>
                  </div>
                  <div style={{ height: '6px', background: '#f3f4f6', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${project.progress}%`, background: `linear-gradient(90deg, #16a34a, #22c55e)`, borderRadius: '3px' }} />
                  </div>
                </div>

                {/* Meta info */}
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#6b7280' }}>
                    <Calendar size={14} />
                    {project.start_date} - {project.end_date}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#6b7280' }}>
                    <Users size={14} />
                    {team.length} members
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#6b7280' }}>
                    <DollarSign size={14} />
                    ${(project.budget / 1000).toFixed(0)}K
                  </div>
                </div>

                {/* Tags */}
                <div style={{ display: 'flex', gap: '6px', marginTop: '12px', flexWrap: 'wrap' }}>
                  {project.tags.map(tag => (
                    <span key={tag} style={{ padding: '2px 8px', background: '#f3f4f6', borderRadius: '4px', fontSize: '11px', color: '#6b7280' }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
