'use client';

import {
  FolderKanban,
  CheckCircle2,
  Clock,
  AlertTriangle,

  Users,
  DollarSign,
  Target,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import Link from 'next/link';
import { dataStore } from '@/lib/mock-data';

const statusColors: Record<string, string> = {
  not_started: '#9ca3af',
  in_progress: '#3b82f6',
  on_hold: '#f59e0b',
  completed: '#22c55e',
  cancelled: '#ef4444',
};

const phaseLabels: Record<string, string> = {
  initiating: 'Initiating',
  planning: 'Planning',
  executing: 'Executing',
  monitoring_controlling: 'Monitoring & Controlling',
  closing: 'Closing',
};

const statusLabels: Record<string, string> = {
  not_started: 'Not Started',
  in_progress: 'In Progress',
  on_hold: 'On Hold',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export default function Dashboard() {
  const projects = dataStore.getProjects();
  const tasks = dataStore.getAllTasks();
  const teamMembers = dataStore.getAllTeamMembers();

  const activeProjects = projects.filter(p => p.status === 'in_progress').length;
  const completedTasks = tasks.filter(t => t.status === 'done').length;
  const totalBudget = projects.reduce((s, p) => s + p.budget, 0);
  const totalSpent = projects.reduce((s, p) => s + p.spent, 0);
  const overdueTasks = tasks.filter(t => t.status !== 'done' && new Date(t.due_date) < new Date()).length;

  const kpis = [
    {
      title: 'Active Projects',
      value: activeProjects,
      subtitle: `${projects.length} total`,
      icon: FolderKanban,
      color: '#16a34a',
      bg: '#f0fdf4',
      trend: '+2 this month',
      trendUp: true,
    },
    {
      title: 'Tasks Completed',
      value: `${completedTasks}/${tasks.length}`,
      subtitle: `${Math.round((completedTasks / tasks.length) * 100)}% completion`,
      icon: CheckCircle2,
      color: '#3b82f6',
      bg: '#eff6ff',
      trend: '+5 this week',
      trendUp: true,
    },
    {
      title: 'Budget Utilization',
      value: `${Math.round((totalSpent / totalBudget) * 100)}%`,
      subtitle: `$${(totalSpent / 1000).toFixed(0)}K / $${(totalBudget / 1000).toFixed(0)}K`,
      icon: DollarSign,
      color: '#f59e0b',
      bg: '#fffbeb',
      trend: 'On track',
      trendUp: true,
    },
    {
      title: 'Overdue Tasks',
      value: overdueTasks,
      subtitle: 'Require attention',
      icon: AlertTriangle,
      color: '#ef4444',
      bg: '#fef2f2',
      trend: overdueTasks > 0 ? 'Action needed' : 'All on track',
      trendUp: overdueTasks === 0,
    },
  ];

  const recentTasks = tasks
    .filter(t => t.status !== 'done')
    .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())
    .slice(0, 5);

  return (
    <div>
      {/* Page title */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#111827', margin: 0 }}>
          Dashboard
        </h1>
        <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>
          Project portfolio overview - PMP Standard
        </p>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '28px' }}>
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.title}
              className="hover-lift"
              style={{
                background: 'white',
                borderRadius: '14px',
                padding: '24px',
                border: '1px solid #e5e7eb',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div style={{ position: 'absolute', top: 0, right: 0, width: '100px', height: '100px', background: kpi.bg, borderRadius: '0 0 0 100px', opacity: 0.5 }} />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    background: kpi.bg,
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon size={22} color={kpi.color} />
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '12px',
                    color: kpi.trendUp ? '#16a34a' : '#ef4444',
                    fontWeight: 500,
                  }}
                >
                  {kpi.trendUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  {kpi.trend}
                </div>
              </div>
              <div style={{ fontSize: '30px', fontWeight: 700, color: '#111827', lineHeight: 1 }}>
                {kpi.value}
              </div>
              <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '6px' }}>
                {kpi.subtitle}
              </div>
            </div>
          );
        })}
      </div>

      {/* Main content grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* Project list */}
        <div
          style={{
            background: 'white',
            borderRadius: '14px',
            border: '1px solid #e5e7eb',
            overflow: 'hidden',
          }}
        >
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h2 style={{ fontSize: '17px', fontWeight: 600, margin: 0, color: '#111827' }}>Projects</h2>
              <p style={{ fontSize: '13px', color: '#6b7280', margin: '2px 0 0' }}>Active project portfolio</p>
            </div>
            <Link href="/projects" style={{ fontSize: '13px', color: '#16a34a', fontWeight: 500, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
              View all <ArrowUpRight size={14} />
            </Link>
          </div>
          <div>
            {projects.slice(0, 4).map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div
                  style={{
                    padding: '16px 24px',
                    borderBottom: '1px solid #f3f4f6',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    cursor: 'pointer',
                    transition: 'background 0.15s ease',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#f9fafb'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                      <span style={{ fontWeight: 600, fontSize: '14px', color: '#111827' }}>{project.name}</span>
                      <span
                        style={{
                          padding: '2px 10px',
                          borderRadius: '20px',
                          fontSize: '11px',
                          fontWeight: 500,
                          background: statusColors[project.status] + '18',
                          color: statusColors[project.status],
                        }}
                      >
                        {statusLabels[project.status]}
                      </span>
                      <span
                        style={{
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          background: '#f3f4f6',
                          color: '#6b7280',
                        }}
                      >
                        {phaseLabels[project.phase]}
                      </span>
                    </div>
                    <div style={{ fontSize: '13px', color: '#6b7280' }}>
                      PM: {project.project_manager}
                    </div>
                  </div>
                  <div style={{ width: '140px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontSize: '12px', color: '#6b7280' }}>Progress</span>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: '#111827' }}>{project.progress}%</span>
                    </div>
                    <div style={{ height: '6px', background: '#f3f4f6', borderRadius: '3px', overflow: 'hidden' }}>
                      <div
                        style={{
                          height: '100%',
                          width: `${project.progress}%`,
                          background: project.progress === 100 ? '#22c55e' : project.progress > 50 ? '#16a34a' : '#3b82f6',
                          borderRadius: '3px',
                          transition: 'width 0.5s ease',
                        }}
                      />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Upcoming tasks */}
          <div style={{ background: 'white', borderRadius: '14px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #f3f4f6' }}>
              <h2 style={{ fontSize: '17px', fontWeight: 600, margin: 0, color: '#111827' }}>
                <Clock size={18} style={{ verticalAlign: 'middle', marginRight: '8px', color: '#16a34a' }} />
                Upcoming Tasks
              </h2>
            </div>
            <div>
              {recentTasks.map((task) => {
                const isOverdue = new Date(task.due_date) < new Date() && task.status !== 'done';
                return (
                  <div key={task.id} style={{ padding: '14px 24px', borderBottom: '1px solid #f3f4f6' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          background: task.priority === 'critical' ? '#ef4444' : task.priority === 'high' ? '#f59e0b' : '#3b82f6',
                          flexShrink: 0,
                        }}
                      />
                      <span style={{ fontSize: '13px', fontWeight: 500, color: '#111827' }}>{task.title}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingLeft: '16px' }}>
                      <span style={{ fontSize: '12px', color: '#9ca3af' }}>{task.assignee_name}</span>
                      <span style={{ fontSize: '12px', color: isOverdue ? '#ef4444' : '#6b7280', fontWeight: isOverdue ? 600 : 400 }}>
                        {isOverdue ? 'Overdue' : task.due_date}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Team overview */}
          <div style={{ background: 'white', borderRadius: '14px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2 style={{ fontSize: '17px', fontWeight: 600, margin: 0, color: '#111827' }}>
                <Users size={18} style={{ verticalAlign: 'middle', marginRight: '8px', color: '#16a34a' }} />
                Team
              </h2>
              <Link href="/team" style={{ fontSize: '13px', color: '#16a34a', fontWeight: 500, textDecoration: 'none' }}>View all</Link>
            </div>
            <div style={{ padding: '16px 24px' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {Array.from(new Set(teamMembers.map(m => m.email))).slice(0, 6).map((email) => {
                  const member = teamMembers.find(m => m.email === email)!;
                  return (
                    <div key={email} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', background: '#f0fdf4', borderRadius: '20px', fontSize: '13px', color: '#166534', fontWeight: 500 }}>
                      <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#16a34a', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 600 }}>
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      {member.name}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* PMP Process Groups */}
          <div style={{ background: 'white', borderRadius: '14px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #f3f4f6' }}>
              <h2 style={{ fontSize: '17px', fontWeight: 600, margin: 0, color: '#111827' }}>
                <Target size={18} style={{ verticalAlign: 'middle', marginRight: '8px', color: '#16a34a' }} />
                PMP Process Groups
              </h2>
            </div>
            <div style={{ padding: '16px 24px' }}>
              {Object.entries(phaseLabels).map(([key, label]) => {
                const count = projects.filter(p => p.phase === key).length;
                return (
                  <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f3f4f6' }}>
                    <span style={{ fontSize: '13px', color: '#374151' }}>{label}</span>
                    <span style={{ padding: '2px 12px', background: count > 0 ? '#f0fdf4' : '#f9fafb', color: count > 0 ? '#16a34a' : '#9ca3af', borderRadius: '12px', fontSize: '13px', fontWeight: 600 }}>
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
