'use client';

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Users,
  FileText,
  Target,
  Shield,
  Plus,
  Calendar,
  DollarSign,
  TrendingUp,
  BarChart3,
  Flag,
} from 'lucide-react';
import { dataStore } from '@/lib/mock-data';
import { appEvents, DATA_CHANGED } from '@/lib/events';
import type { TaskStatus, TaskPriority } from '@/types/database';

const statusColors: Record<string, string> = {
  todo: '#9ca3af',
  in_progress: '#3b82f6',
  in_review: '#8b5cf6',
  done: '#22c55e',
  blocked: '#ef4444',
};

const statusLabels: Record<string, string> = {
  todo: 'To Do',
  in_progress: 'In Progress',
  in_review: 'In Review',
  done: 'Done',
  blocked: 'Blocked',
};

const priorityColors: Record<string, string> = {
  low: '#9ca3af',
  medium: '#3b82f6',
  high: '#f59e0b',
  critical: '#ef4444',
};

const phaseLabels: Record<string, string> = {
  initiating: 'Initiating',
  planning: 'Planning',
  executing: 'Executing',
  monitoring_controlling: 'Monitoring & Controlling',
  closing: 'Closing',
};

const phaseSteps = ['initiating', 'planning', 'executing', 'monitoring_controlling', 'closing'];

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [activeTab, setActiveTab] = useState('overview');
  const [, setRefresh] = useState(0);

  useEffect(() => {
    return appEvents.on(DATA_CHANGED, () => setRefresh(n => n + 1));
  }, []);

  const project = dataStore.getProject(id);
  const tasks = dataStore.getTasksByProject(id);
  const team = dataStore.getTeamByProject(id);
  const files = dataStore.getFilesByProject(id);
  const milestones = dataStore.getMilestonesByProject(id);
  const risks = dataStore.getRisksByProject(id);

  if (!project) {
    return (
      <div style={{ padding: '60px', textAlign: 'center' }}>
        <h2>Project not found</h2>
        <Link href="/projects" style={{ color: '#16a34a' }}>Back to projects</Link>
      </div>
    );
  }

  const currentPhaseIndex = phaseSteps.indexOf(project.phase);
  const tasksByStatus = {
    todo: tasks.filter(t => t.status === 'todo'),
    in_progress: tasks.filter(t => t.status === 'in_progress'),
    in_review: tasks.filter(t => t.status === 'in_review'),
    done: tasks.filter(t => t.status === 'done'),
    blocked: tasks.filter(t => t.status === 'blocked'),
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'tasks', label: 'Tasks', icon: CheckCircle2 },
    { id: 'milestones', label: 'Milestones', icon: Flag },
    { id: 'team', label: 'Team', icon: Users },
    { id: 'files', label: 'Files', icon: FileText },
    { id: 'risks', label: 'Risks', icon: Shield },
  ];

  return (
    <div>
      {/* Breadcrumb */}
      <Link href="/projects" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#6b7280', fontSize: '13px', textDecoration: 'none', marginBottom: '16px' }}>
        <ArrowLeft size={16} /> Back to Projects
      </Link>

      {/* Project header */}
      <div style={{ background: 'white', borderRadius: '14px', border: '1px solid #e5e7eb', padding: '28px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 700, margin: 0, color: '#111827' }}>{project.name}</h1>
            <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '6px', maxWidth: '600px' }}>{project.description}</p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <span style={{ padding: '6px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: 500, background: '#f0fdf4', color: '#16a34a' }}>
              {phaseLabels[project.phase]}
            </span>
          </div>
        </div>

        {/* PMP Phase Progress */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '12px' }}>PMP Process Group Progress</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0' }}>
            {phaseSteps.map((step, idx) => {
              const isCompleted = idx < currentPhaseIndex;
              const isCurrent = idx === currentPhaseIndex;
              return (
                <div key={step} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: isCompleted ? '#16a34a' : isCurrent ? '#22c55e' : '#e5e7eb',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: isCompleted || isCurrent ? 'white' : '#9ca3af',
                        fontSize: '13px',
                        fontWeight: 600,
                        border: isCurrent ? '3px solid #bbf7d0' : 'none',
                      }}
                    >
                      {isCompleted ? <CheckCircle2 size={16} /> : idx + 1}
                    </div>
                    <span style={{ fontSize: '11px', color: isCurrent ? '#16a34a' : '#6b7280', marginTop: '6px', textAlign: 'center', fontWeight: isCurrent ? 600 : 400 }}>
                      {phaseLabels[step]}
                    </span>
                  </div>
                  {idx < phaseSteps.length - 1 && (
                    <div style={{ height: '2px', flex: 1, background: isCompleted ? '#16a34a' : '#e5e7eb', marginBottom: '24px' }} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          <div style={{ padding: '16px', background: '#f9fafb', borderRadius: '10px' }}>
            <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Progress</div>
            <div style={{ fontSize: '22px', fontWeight: 700, color: '#111827' }}>{project.progress}%</div>
            <div style={{ height: '4px', background: '#e5e7eb', borderRadius: '2px', marginTop: '8px' }}>
              <div style={{ height: '100%', width: `${project.progress}%`, background: '#16a34a', borderRadius: '2px' }} />
            </div>
          </div>
          <div style={{ padding: '16px', background: '#f9fafb', borderRadius: '10px' }}>
            <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Budget</div>
            <div style={{ fontSize: '22px', fontWeight: 700, color: '#111827' }}>${(project.spent / 1000).toFixed(0)}K</div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>of ${(project.budget / 1000).toFixed(0)}K</div>
          </div>
          <div style={{ padding: '16px', background: '#f9fafb', borderRadius: '10px' }}>
            <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Timeline</div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#111827' }}>{project.start_date}</div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>to {project.end_date}</div>
          </div>
          <div style={{ padding: '16px', background: '#f9fafb', borderRadius: '10px' }}>
            <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Team Size</div>
            <div style={{ fontSize: '22px', fontWeight: 700, color: '#111827' }}>{team.length}</div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>members</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', background: 'white', padding: '4px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '10px 18px',
                border: 'none',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 500,
                cursor: 'pointer',
                background: activeTab === tab.id ? '#16a34a' : 'transparent',
                color: activeTab === tab.id ? 'white' : '#6b7280',
                transition: 'all 0.15s ease',
              }}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          {/* Task summary */}
          <div style={{ background: 'white', borderRadius: '14px', border: '1px solid #e5e7eb', padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 16px', color: '#111827' }}>Task Summary</h3>
            {Object.entries(tasksByStatus).map(([status, statusTasks]) => (
              <div key={status} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f3f4f6' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: statusColors[status] }} />
                  <span style={{ fontSize: '14px', color: '#374151' }}>{statusLabels[status]}</span>
                </div>
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#111827' }}>{statusTasks.length}</span>
              </div>
            ))}
          </div>

          {/* Recent activity */}
          <div style={{ background: 'white', borderRadius: '14px', border: '1px solid #e5e7eb', padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 16px', color: '#111827' }}>Project Info</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '2px' }}>Project Manager</div>
                <div style={{ fontSize: '14px', color: '#111827', fontWeight: 500 }}>{project.project_manager}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '2px' }}>Stakeholders</div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {project.stakeholders.map(s => (
                    <span key={s} style={{ padding: '2px 10px', background: '#f0fdf4', color: '#166534', borderRadius: '20px', fontSize: '12px' }}>{s}</span>
                  ))}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '2px' }}>Tags</div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {project.tags.map(t => (
                    <span key={t} style={{ padding: '2px 8px', background: '#f3f4f6', borderRadius: '4px', fontSize: '12px', color: '#6b7280' }}>{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'tasks' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, margin: 0 }}>Work Breakdown Structure (WBS)</h3>
            <button style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', background: '#16a34a', color: 'white', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>
              <Plus size={16} /> Add Task
            </button>
          </div>
          <div style={{ background: 'white', borderRadius: '14px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                  {['WBS', 'Task', 'Assignee', 'Status', 'Priority', 'Due Date', 'Hours'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#6b7280', background: '#f9fafb' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tasks.map(task => (
                  <tr key={task.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: 500, color: '#16a34a' }}>{task.wbs_code}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ fontSize: '13px', fontWeight: 500, color: '#111827' }}>{task.title}</div>
                      <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '2px' }}>{task.description.substring(0, 60)}...</div>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#16a34a', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 600 }}>
                          {task.assignee_name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span style={{ fontSize: '13px', color: '#374151' }}>{task.assignee_name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 500, background: statusColors[task.status] + '15', color: statusColors[task.status] }}>
                        {statusLabels[task.status]}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 500, background: priorityColors[task.priority] + '15', color: priorityColors[task.priority], textTransform: 'capitalize' }}>
                        {task.priority}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '13px', color: new Date(task.due_date) < new Date() && task.status !== 'done' ? '#ef4444' : '#374151' }}>{task.due_date}</td>
                    <td style={{ padding: '12px 16px', fontSize: '13px', color: '#374151' }}>{task.actual_hours}/{task.estimated_hours}h</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'milestones' && (
        <div style={{ display: 'grid', gap: '16px' }}>
          {milestones.map(milestone => (
            <div key={milestone.id} style={{ background: 'white', borderRadius: '14px', border: '1px solid #e5e7eb', padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: milestone.status === 'completed' ? '#f0fdf4' : milestone.status === 'overdue' ? '#fef2f2' : '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Flag size={22} color={milestone.status === 'completed' ? '#16a34a' : milestone.status === 'overdue' ? '#ef4444' : '#3b82f6'} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                  <h4 style={{ fontSize: '15px', fontWeight: 600, margin: 0, color: '#111827' }}>{milestone.title}</h4>
                  <span style={{ padding: '2px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 500, background: milestone.status === 'completed' ? '#f0fdf4' : '#eff6ff', color: milestone.status === 'completed' ? '#16a34a' : '#3b82f6', textTransform: 'capitalize' }}>
                    {milestone.status}
                  </span>
                </div>
                <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>{milestone.description}</p>
                <div style={{ display: 'flex', gap: '6px', marginTop: '8px', flexWrap: 'wrap' }}>
                  {milestone.deliverables.map(d => (
                    <span key={d} style={{ padding: '2px 8px', background: '#f3f4f6', borderRadius: '4px', fontSize: '11px', color: '#6b7280' }}>{d}</span>
                  ))}
                </div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: '13px', fontWeight: 500, color: '#374151' }}>{milestone.due_date}</div>
                <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '2px' }}>{phaseLabels[milestone.phase]}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'team' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {team.map(member => (
            <div key={member.id} style={{ background: 'white', borderRadius: '14px', border: '1px solid #e5e7eb', padding: '24px', textAlign: 'center' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'linear-gradient(135deg, #16a34a, #22c55e)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 600, margin: '0 auto 12px' }}>
                {member.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div style={{ fontSize: '15px', fontWeight: 600, color: '#111827' }}>{member.name}</div>
              <div style={{ fontSize: '13px', color: '#16a34a', fontWeight: 500, marginTop: '2px' }}>{member.role}</div>
              <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>{member.email}</div>
              <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '2px' }}>{member.department}</div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'files' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, margin: 0 }}>Project Documents</h3>
            <button style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', background: '#16a34a', color: 'white', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>
              <Plus size={16} /> Upload File
            </button>
          </div>
          <div style={{ display: 'grid', gap: '12px' }}>
            {files.map(file => (
              <div key={file.id} style={{ background: 'white', borderRadius: '10px', border: '1px solid #e5e7eb', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FileText size={20} color="#16a34a" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: 500, color: '#111827' }}>{file.name}</div>
                  <div style={{ fontSize: '12px', color: '#9ca3af' }}>{(file.file_size / 1024).toFixed(0)} KB - {file.category}</div>
                </div>
                <div style={{ fontSize: '12px', color: '#9ca3af' }}>{file.uploaded_by}</div>
                <button style={{ padding: '6px 14px', background: '#f0fdf4', color: '#16a34a', border: '1px solid #dcfce7', borderRadius: '6px', fontSize: '12px', fontWeight: 500, cursor: 'pointer' }}>Download</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'risks' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, margin: 0 }}>Risk Register</h3>
            <button style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', background: '#16a34a', color: 'white', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>
              <Plus size={16} /> Add Risk
            </button>
          </div>
          <div style={{ background: 'white', borderRadius: '14px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                  {['Risk', 'Probability', 'Impact', 'Status', 'Owner', 'Mitigation'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#6b7280', background: '#f9fafb' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {risks.map(risk => (
                  <tr key={risk.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ fontSize: '13px', fontWeight: 500, color: '#111827' }}>{risk.title}</div>
                      <div style={{ fontSize: '12px', color: '#9ca3af' }}>{risk.description.substring(0, 50)}...</div>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 500, background: priorityColors[risk.probability] + '15', color: priorityColors[risk.probability], textTransform: 'capitalize' }}>{risk.probability}</span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 500, background: priorityColors[risk.impact] + '15', color: priorityColors[risk.impact], textTransform: 'capitalize' }}>{risk.impact}</span>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '13px', color: '#374151', textTransform: 'capitalize' }}>{risk.status}</td>
                    <td style={{ padding: '12px 16px', fontSize: '13px', color: '#374151' }}>{risk.owner_email}</td>
                    <td style={{ padding: '12px 16px', fontSize: '12px', color: '#6b7280', maxWidth: '200px' }}>{risk.mitigation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
