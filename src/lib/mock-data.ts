import type { Project, Task, TeamMember, ProjectFile, Milestone, Risk, CalendarEvent } from '@/types/database';

export const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Website Redesign',
    description: 'Complete overhaul of the corporate website with modern design and improved UX. Includes migration to new CMS and performance optimization.',
    status: 'in_progress',
    phase: 'executing',
    start_date: '2026-01-15',
    end_date: '2026-06-30',
    budget: 150000,
    spent: 67500,
    progress: 45,
    project_manager: 'sarah@company.com',
    stakeholders: ['cto@company.com', 'marketing@company.com'],
    tags: ['web', 'design', 'high-priority'],
    created_at: '2026-01-10T00:00:00Z',
    updated_at: '2026-04-15T00:00:00Z',
  },
  {
    id: '2',
    name: 'Mobile App Launch',
    description: 'Development and launch of the company mobile application for iOS and Android platforms with core features.',
    status: 'in_progress',
    phase: 'planning',
    start_date: '2026-03-01',
    end_date: '2026-09-30',
    budget: 280000,
    spent: 42000,
    progress: 15,
    project_manager: 'john@company.com',
    stakeholders: ['ceo@company.com', 'product@company.com'],
    tags: ['mobile', 'ios', 'android'],
    created_at: '2026-02-20T00:00:00Z',
    updated_at: '2026-04-10T00:00:00Z',
  },
  {
    id: '3',
    name: 'ERP System Migration',
    description: 'Migration from legacy ERP to cloud-based solution with data migration, training, and process optimization.',
    status: 'not_started',
    phase: 'initiating',
    start_date: '2026-05-01',
    end_date: '2026-12-31',
    budget: 500000,
    spent: 0,
    progress: 0,
    project_manager: 'sarah@company.com',
    stakeholders: ['cfo@company.com', 'operations@company.com'],
    tags: ['erp', 'migration', 'enterprise'],
    created_at: '2026-04-01T00:00:00Z',
    updated_at: '2026-04-01T00:00:00Z',
  },
  {
    id: '4',
    name: 'Security Audit & Compliance',
    description: 'Comprehensive security audit and compliance certification for SOC 2 Type II and ISO 27001.',
    status: 'in_progress',
    phase: 'monitoring_controlling',
    start_date: '2026-02-01',
    end_date: '2026-05-31',
    budget: 95000,
    spent: 76000,
    progress: 80,
    project_manager: 'mike@company.com',
    stakeholders: ['ciso@company.com', 'legal@company.com'],
    tags: ['security', 'compliance', 'audit'],
    created_at: '2026-01-25T00:00:00Z',
    updated_at: '2026-04-14T00:00:00Z',
  },
  {
    id: '5',
    name: 'Data Analytics Platform',
    description: 'Build a centralized data analytics platform with real-time dashboards and automated reporting.',
    status: 'completed',
    phase: 'closing',
    start_date: '2025-10-01',
    end_date: '2026-03-31',
    budget: 200000,
    spent: 189000,
    progress: 100,
    project_manager: 'john@company.com',
    stakeholders: ['cto@company.com', 'analytics@company.com'],
    tags: ['data', 'analytics', 'dashboard'],
    created_at: '2025-09-15T00:00:00Z',
    updated_at: '2026-03-31T00:00:00Z',
  },
];

export const mockTasks: Task[] = [
  {
    id: 't1',
    project_id: '1',
    title: 'Design System Creation',
    description: 'Create a comprehensive design system with components, colors, and typography',
    status: 'done',
    priority: 'high',
    assignee_email: 'anna@company.com',
    assignee_name: 'Anna Chen',
    start_date: '2026-01-20',
    due_date: '2026-02-15',
    completed_date: '2026-02-12',
    estimated_hours: 80,
    actual_hours: 72,
    wbs_code: '1.1',
    dependencies: [],
    tags: ['design'],
    created_at: '2026-01-15T00:00:00Z',
    updated_at: '2026-02-12T00:00:00Z',
  },
  {
    id: 't2',
    project_id: '1',
    title: 'Frontend Development - Homepage',
    description: 'Implement the new homepage design with responsive layout',
    status: 'in_progress',
    priority: 'high',
    assignee_email: 'dev@company.com',
    assignee_name: 'David Park',
    start_date: '2026-02-16',
    due_date: '2026-03-30',
    completed_date: null,
    estimated_hours: 120,
    actual_hours: 85,
    wbs_code: '1.2.1',
    dependencies: ['t1'],
    tags: ['frontend', 'development'],
    created_at: '2026-01-15T00:00:00Z',
    updated_at: '2026-04-10T00:00:00Z',
  },
  {
    id: 't3',
    project_id: '1',
    title: 'CMS Integration',
    description: 'Integrate the new CMS with the frontend and migrate content',
    status: 'in_progress',
    priority: 'medium',
    assignee_email: 'backend@company.com',
    assignee_name: 'Lisa Wang',
    start_date: '2026-03-01',
    due_date: '2026-04-15',
    completed_date: null,
    estimated_hours: 100,
    actual_hours: 45,
    wbs_code: '1.2.2',
    dependencies: ['t1'],
    tags: ['backend', 'cms'],
    created_at: '2026-01-15T00:00:00Z',
    updated_at: '2026-04-08T00:00:00Z',
  },
  {
    id: 't4',
    project_id: '1',
    title: 'Performance Optimization',
    description: 'Optimize page load times and Core Web Vitals',
    status: 'todo',
    priority: 'medium',
    assignee_email: 'dev@company.com',
    assignee_name: 'David Park',
    start_date: '2026-04-16',
    due_date: '2026-05-15',
    completed_date: null,
    estimated_hours: 60,
    actual_hours: 0,
    wbs_code: '1.3',
    dependencies: ['t2', 't3'],
    tags: ['performance'],
    created_at: '2026-01-15T00:00:00Z',
    updated_at: '2026-01-15T00:00:00Z',
  },
  {
    id: 't5',
    project_id: '1',
    title: 'UAT & Bug Fixes',
    description: 'User acceptance testing and fixing reported issues',
    status: 'todo',
    priority: 'high',
    assignee_email: 'qa@company.com',
    assignee_name: 'Tom Brown',
    start_date: '2026-05-16',
    due_date: '2026-06-15',
    completed_date: null,
    estimated_hours: 80,
    actual_hours: 0,
    wbs_code: '1.4',
    dependencies: ['t4'],
    tags: ['testing', 'qa'],
    created_at: '2026-01-15T00:00:00Z',
    updated_at: '2026-01-15T00:00:00Z',
  },
  {
    id: 't6',
    project_id: '2',
    title: 'Requirements Gathering',
    description: 'Collect and document all mobile app requirements from stakeholders',
    status: 'done',
    priority: 'critical',
    assignee_email: 'john@company.com',
    assignee_name: 'John Smith',
    start_date: '2026-03-01',
    due_date: '2026-03-15',
    completed_date: '2026-03-14',
    estimated_hours: 40,
    actual_hours: 35,
    wbs_code: '2.1',
    dependencies: [],
    tags: ['planning'],
    created_at: '2026-03-01T00:00:00Z',
    updated_at: '2026-03-14T00:00:00Z',
  },
  {
    id: 't7',
    project_id: '2',
    title: 'UI/UX Wireframes',
    description: 'Create wireframes and prototypes for all app screens',
    status: 'in_progress',
    priority: 'high',
    assignee_email: 'anna@company.com',
    assignee_name: 'Anna Chen',
    start_date: '2026-03-16',
    due_date: '2026-04-30',
    completed_date: null,
    estimated_hours: 60,
    actual_hours: 30,
    wbs_code: '2.2',
    dependencies: ['t6'],
    tags: ['design', 'ux'],
    created_at: '2026-03-01T00:00:00Z',
    updated_at: '2026-04-10T00:00:00Z',
  },
  {
    id: 't8',
    project_id: '4',
    title: 'Vulnerability Assessment',
    description: 'Run comprehensive vulnerability scans across all systems',
    status: 'done',
    priority: 'critical',
    assignee_email: 'mike@company.com',
    assignee_name: 'Mike Johnson',
    start_date: '2026-02-01',
    due_date: '2026-02-28',
    completed_date: '2026-02-25',
    estimated_hours: 80,
    actual_hours: 90,
    wbs_code: '4.1',
    dependencies: [],
    tags: ['security'],
    created_at: '2026-02-01T00:00:00Z',
    updated_at: '2026-02-25T00:00:00Z',
  },
];

export const mockTeamMembers: TeamMember[] = [
  { id: 'tm1', project_id: '1', name: 'Sarah Wilson', email: 'sarah@company.com', role: 'Project Manager', avatar_url: null, department: 'PMO', is_active: true, created_at: '2026-01-10T00:00:00Z' },
  { id: 'tm2', project_id: '1', name: 'Anna Chen', email: 'anna@company.com', role: 'UI/UX Designer', avatar_url: null, department: 'Design', is_active: true, created_at: '2026-01-10T00:00:00Z' },
  { id: 'tm3', project_id: '1', name: 'David Park', email: 'dev@company.com', role: 'Senior Developer', avatar_url: null, department: 'Engineering', is_active: true, created_at: '2026-01-10T00:00:00Z' },
  { id: 'tm4', project_id: '1', name: 'Lisa Wang', email: 'backend@company.com', role: 'Backend Developer', avatar_url: null, department: 'Engineering', is_active: true, created_at: '2026-01-10T00:00:00Z' },
  { id: 'tm5', project_id: '1', name: 'Tom Brown', email: 'qa@company.com', role: 'QA Engineer', avatar_url: null, department: 'Quality', is_active: true, created_at: '2026-01-10T00:00:00Z' },
  { id: 'tm6', project_id: '2', name: 'John Smith', email: 'john@company.com', role: 'Project Manager', avatar_url: null, department: 'PMO', is_active: true, created_at: '2026-03-01T00:00:00Z' },
  { id: 'tm7', project_id: '2', name: 'Anna Chen', email: 'anna@company.com', role: 'UI/UX Designer', avatar_url: null, department: 'Design', is_active: true, created_at: '2026-03-01T00:00:00Z' },
  { id: 'tm8', project_id: '4', name: 'Mike Johnson', email: 'mike@company.com', role: 'Security Lead', avatar_url: null, department: 'Security', is_active: true, created_at: '2026-02-01T00:00:00Z' },
];

export const mockFiles: ProjectFile[] = [
  { id: 'f1', project_id: '1', name: 'Project Charter.docx', file_type: 'docx', file_size: 245000, file_url: '#', uploaded_by: 'sarah@company.com', category: 'Planning', created_at: '2026-01-15T00:00:00Z' },
  { id: 'f2', project_id: '1', name: 'Budget Spreadsheet.xlsx', file_type: 'xlsx', file_size: 180000, file_url: '#', uploaded_by: 'sarah@company.com', category: 'Finance', created_at: '2026-01-20T00:00:00Z' },
  { id: 'f3', project_id: '1', name: 'Design Mockups.pptx', file_type: 'pptx', file_size: 5200000, file_url: '#', uploaded_by: 'anna@company.com', category: 'Design', created_at: '2026-02-05T00:00:00Z' },
  { id: 'f4', project_id: '1', name: 'Technical Spec.md', file_type: 'md', file_size: 32000, file_url: '#', uploaded_by: 'dev@company.com', category: 'Technical', created_at: '2026-02-10T00:00:00Z' },
  { id: 'f5', project_id: '1', name: 'Site Architecture.png', file_type: 'png', file_size: 890000, file_url: '#', uploaded_by: 'anna@company.com', category: 'Design', created_at: '2026-02-08T00:00:00Z' },
  { id: 'f6', project_id: '2', name: 'App Requirements.docx', file_type: 'docx', file_size: 156000, file_url: '#', uploaded_by: 'john@company.com', category: 'Planning', created_at: '2026-03-05T00:00:00Z' },
  { id: 'f7', project_id: '4', name: 'Security Audit Report.pdf', file_type: 'pdf', file_size: 420000, file_url: '#', uploaded_by: 'mike@company.com', category: 'Reports', created_at: '2026-03-15T00:00:00Z' },
];

export const mockMilestones: Milestone[] = [
  { id: 'm1', project_id: '1', title: 'Design Phase Complete', description: 'All design deliverables approved by stakeholders', due_date: '2026-02-28', status: 'completed', deliverables: ['Design System', 'Wireframes', 'Style Guide'], phase: 'planning', created_at: '2026-01-15T00:00:00Z' },
  { id: 'm2', project_id: '1', title: 'Development Sprint 1 Complete', description: 'Homepage and core pages implemented', due_date: '2026-04-15', status: 'pending', deliverables: ['Homepage', 'About Page', 'Contact Page'], phase: 'executing', created_at: '2026-01-15T00:00:00Z' },
  { id: 'm3', project_id: '1', title: 'UAT Sign-off', description: 'User acceptance testing completed with sign-off', due_date: '2026-06-15', status: 'pending', deliverables: ['UAT Report', 'Bug Fix Report'], phase: 'monitoring_controlling', created_at: '2026-01-15T00:00:00Z' },
  { id: 'm4', project_id: '1', title: 'Go-Live', description: 'Website launch to production', due_date: '2026-06-30', status: 'pending', deliverables: ['Production Deployment', 'Monitoring Setup'], phase: 'closing', created_at: '2026-01-15T00:00:00Z' },
  { id: 'm5', project_id: '2', title: 'Requirements Approved', description: 'All requirements documented and approved', due_date: '2026-03-31', status: 'completed', deliverables: ['Requirements Doc', 'User Stories'], phase: 'planning', created_at: '2026-03-01T00:00:00Z' },
  { id: 'm6', project_id: '4', title: 'SOC 2 Certification', description: 'Achieve SOC 2 Type II certification', due_date: '2026-05-31', status: 'pending', deliverables: ['Audit Report', 'Certification'], phase: 'closing', created_at: '2026-02-01T00:00:00Z' },
];

export const mockRisks: Risk[] = [
  { id: 'r1', project_id: '1', title: 'Scope Creep', description: 'Additional features requested by marketing team may delay timeline', probability: 'high', impact: 'medium', mitigation: 'Strict change control process with weekly scope review', owner_email: 'sarah@company.com', status: 'identified', created_at: '2026-01-20T00:00:00Z' },
  { id: 'r2', project_id: '1', title: 'Resource Availability', description: 'Key developer may be pulled for other projects', probability: 'medium', impact: 'high', mitigation: 'Cross-training and documentation of critical systems', owner_email: 'sarah@company.com', status: 'mitigated', created_at: '2026-01-20T00:00:00Z' },
  { id: 'r3', project_id: '2', title: 'App Store Rejection', description: 'App may be rejected due to compliance issues', probability: 'low', impact: 'critical', mitigation: 'Early review of App Store guidelines and pre-submission checklist', owner_email: 'john@company.com', status: 'identified', created_at: '2026-03-05T00:00:00Z' },
  { id: 'r4', project_id: '4', title: 'Audit Findings', description: 'Critical vulnerabilities found during audit may require immediate remediation', probability: 'medium', impact: 'critical', mitigation: 'Remediation team on standby with pre-approved budget', owner_email: 'mike@company.com', status: 'occurred', created_at: '2026-02-10T00:00:00Z' },
];

export const mockCalendarEvents: CalendarEvent[] = [
  { id: 'e1', project_id: '1', title: 'Weekly Standup - Website Redesign', description: 'Weekly team standup for project status updates', start: '2026-04-16T09:00:00Z', end: '2026-04-16T09:30:00Z', type: 'meeting', attendees: ['sarah@company.com', 'anna@company.com', 'dev@company.com'], location: 'Meeting Room A', google_event_id: null, created_at: '2026-01-15T00:00:00Z' },
  { id: 'e2', project_id: '1', title: 'Sprint Review', description: 'Review of Sprint 3 deliverables', start: '2026-04-18T14:00:00Z', end: '2026-04-18T15:30:00Z', type: 'review', attendees: ['sarah@company.com', 'anna@company.com', 'dev@company.com', 'backend@company.com'], location: 'Conference Room B', google_event_id: null, created_at: '2026-04-01T00:00:00Z' },
  { id: 'e3', project_id: '1', title: 'Development Sprint 1 Deadline', description: 'Milestone: Complete homepage and core pages', start: '2026-04-15T00:00:00Z', end: '2026-04-15T23:59:00Z', type: 'milestone', attendees: [], location: null, google_event_id: null, created_at: '2026-01-15T00:00:00Z' },
  { id: 'e4', project_id: '2', title: 'Mobile App Design Review', description: 'Review wireframes with stakeholders', start: '2026-04-20T10:00:00Z', end: '2026-04-20T11:00:00Z', type: 'review', attendees: ['john@company.com', 'anna@company.com', 'ceo@company.com'], location: 'Board Room', google_event_id: null, created_at: '2026-04-05T00:00:00Z' },
  { id: 'e5', project_id: '4', title: 'Security Audit Deadline', description: 'Final audit report submission', start: '2026-04-25T00:00:00Z', end: '2026-04-25T23:59:00Z', type: 'deadline', attendees: ['mike@company.com'], location: null, google_event_id: null, created_at: '2026-02-01T00:00:00Z' },
  { id: 'e6', project_id: null, title: 'PMO Monthly Meeting', description: 'Monthly project management office review', start: '2026-04-22T15:00:00Z', end: '2026-04-22T16:30:00Z', type: 'meeting', attendees: ['sarah@company.com', 'john@company.com', 'mike@company.com'], location: 'Executive Room', google_event_id: null, created_at: '2026-04-01T00:00:00Z' },
];

// localStorage keys
const STORAGE_KEYS = {
  projects: 'pmp_projects',
  tasks: 'pmp_tasks',
  teamMembers: 'pmp_team_members',
  files: 'pmp_files',
  milestones: 'pmp_milestones',
  risks: 'pmp_risks',
  calendarEvents: 'pmp_calendar_events',
} as const;

function loadFromStorage<T>(key: string, fallback: T[]): T[] {
  if (typeof window === 'undefined') return fallback;
  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch { /* ignore parse errors */ }
  return fallback;
}

function saveToStorage<T>(key: string, data: T[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch { /* ignore quota errors */ }
}

// Lazy import to avoid circular dependency at module level
let _appEvents: typeof import('./events').appEvents | null = null;
let _DATA_CHANGED: string | null = null;
let _PROJECT_UPDATED: string | null = null;

function getEvents() {
  if (!_appEvents) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const mod = require('./events');
    _appEvents = mod.appEvents;
    _DATA_CHANGED = mod.DATA_CHANGED;
    _PROJECT_UPDATED = mod.PROJECT_UPDATED;
  }
  return { appEvents: _appEvents!, DATA_CHANGED: _DATA_CHANGED!, PROJECT_UPDATED: _PROJECT_UPDATED! };
}

// Data store with CRUD operations and localStorage persistence
class DataStore {
  projects: Project[];
  tasks: Task[];
  teamMembers: TeamMember[];
  files: ProjectFile[];
  milestones: Milestone[];
  risks: Risk[];
  calendarEvents: CalendarEvent[];

  constructor() {
    this.projects = loadFromStorage<Project>(STORAGE_KEYS.projects, mockProjects);
    this.tasks = loadFromStorage<Task>(STORAGE_KEYS.tasks, mockTasks);
    this.teamMembers = loadFromStorage<TeamMember>(STORAGE_KEYS.teamMembers, mockTeamMembers);
    this.files = loadFromStorage<ProjectFile>(STORAGE_KEYS.files, mockFiles);
    this.milestones = loadFromStorage<Milestone>(STORAGE_KEYS.milestones, mockMilestones);
    this.risks = loadFromStorage<Risk>(STORAGE_KEYS.risks, mockRisks);
    this.calendarEvents = loadFromStorage<CalendarEvent>(STORAGE_KEYS.calendarEvents, mockCalendarEvents);
  }

  private persistProjects() { saveToStorage(STORAGE_KEYS.projects, this.projects); }
  private persistTasks() { saveToStorage(STORAGE_KEYS.tasks, this.tasks); }
  private persistTeam() { saveToStorage(STORAGE_KEYS.teamMembers, this.teamMembers); }
  private persistFiles() { saveToStorage(STORAGE_KEYS.files, this.files); }
  private persistMilestones() { saveToStorage(STORAGE_KEYS.milestones, this.milestones); }
  private persistRisks() { saveToStorage(STORAGE_KEYS.risks, this.risks); }
  private persistEvents() { saveToStorage(STORAGE_KEYS.calendarEvents, this.calendarEvents); }

  private emitDataChanged() {
    try {
      const { appEvents, DATA_CHANGED } = getEvents();
      appEvents.emit(DATA_CHANGED);
    } catch { /* events not ready yet */ }
  }

  private emitProjectUpdated() {
    try {
      const { appEvents, PROJECT_UPDATED } = getEvents();
      appEvents.emit(PROJECT_UPDATED);
    } catch { /* events not ready yet */ }
  }

  // Projects
  getProjects() { return this.projects; }
  getProject(id: string) { return this.projects.find(p => p.id === id); }
  addProject(project: Project) {
    project.created_at = new Date().toISOString();
    project.updated_at = new Date().toISOString();
    this.projects.push(project);
    this.persistProjects();
    this.emitDataChanged();
  }
  updateProject(id: string, data: Partial<Project>) {
    const idx = this.projects.findIndex(p => p.id === id);
    if (idx !== -1) {
      this.projects[idx] = { ...this.projects[idx], ...data, updated_at: new Date().toISOString() };
      this.persistProjects();
      this.emitProjectUpdated();
      this.emitDataChanged();
    }
  }

  // Tasks
  getTasksByProject(projectId: string) { return this.tasks.filter(t => t.project_id === projectId); }
  getAllTasks() { return this.tasks; }
  addTask(task: Task) {
    this.tasks.push(task);
    this.persistTasks();
    this.emitDataChanged();
  }
  updateTask(id: string, data: Partial<Task>) {
    const idx = this.tasks.findIndex(t => t.id === id);
    if (idx !== -1) {
      this.tasks[idx] = { ...this.tasks[idx], ...data, updated_at: new Date().toISOString() };
      this.persistTasks();
      this.emitDataChanged();
    }
  }

  // Team
  getTeamByProject(projectId: string) { return this.teamMembers.filter(t => t.project_id === projectId); }
  getAllTeamMembers() { return this.teamMembers; }
  addTeamMember(member: TeamMember) {
    this.teamMembers.push(member);
    this.persistTeam();
    this.emitDataChanged();
  }
  removeTeamMember(id: string) {
    this.teamMembers = this.teamMembers.filter(t => t.id !== id);
    this.persistTeam();
    this.emitDataChanged();
  }

  // Files
  getFilesByProject(projectId: string) { return this.files.filter(f => f.project_id === projectId); }
  getAllFiles() { return this.files; }
  addFile(file: ProjectFile) {
    this.files.push(file);
    this.persistFiles();
    this.emitDataChanged();
  }
  removeFile(id: string) {
    this.files = this.files.filter(f => f.id !== id);
    this.persistFiles();
    this.emitDataChanged();
  }

  // Milestones
  getMilestonesByProject(projectId: string) { return this.milestones.filter(m => m.project_id === projectId); }
  addMilestone(milestone: Milestone) {
    this.milestones.push(milestone);
    this.persistMilestones();
    this.emitDataChanged();
  }

  // Risks
  getRisksByProject(projectId: string) { return this.risks.filter(r => r.project_id === projectId); }
  addRisk(risk: Risk) {
    this.risks.push(risk);
    this.persistRisks();
    this.emitDataChanged();
  }

  // Calendar
  getCalendarEvents() { return this.calendarEvents; }
  getEventsByProject(projectId: string) { return this.calendarEvents.filter(e => e.project_id === projectId); }
  addEvent(event: CalendarEvent) {
    this.calendarEvents.push(event);
    this.persistEvents();
    this.emitDataChanged();
  }
}

export const dataStore = new DataStore();
