export interface Database {
  public: {
    Tables: {
      projects: {
        Row: Project;
        Insert: Omit<Project, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Project, 'id'>>;
      };
      tasks: {
        Row: Task;
        Insert: Omit<Task, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Task, 'id'>>;
      };
      team_members: {
        Row: TeamMember;
        Insert: Omit<TeamMember, 'id' | 'created_at'>;
        Update: Partial<Omit<TeamMember, 'id'>>;
      };
      files: {
        Row: ProjectFile;
        Insert: Omit<ProjectFile, 'id' | 'created_at'>;
        Update: Partial<Omit<ProjectFile, 'id'>>;
      };
      milestones: {
        Row: Milestone;
        Insert: Omit<Milestone, 'id' | 'created_at'>;
        Update: Partial<Omit<Milestone, 'id'>>;
      };
      risks: {
        Row: Risk;
        Insert: Omit<Risk, 'id' | 'created_at'>;
        Update: Partial<Omit<Risk, 'id'>>;
      };
      calendar_events: {
        Row: CalendarEvent;
        Insert: Omit<CalendarEvent, 'id' | 'created_at'>;
        Update: Partial<Omit<CalendarEvent, 'id'>>;
      };
    };
  };
}

// PMP Process Groups: Initiating, Planning, Executing, Monitoring & Controlling, Closing
export type PMPPhase = 'initiating' | 'planning' | 'executing' | 'monitoring_controlling' | 'closing';
export type ProjectStatus = 'not_started' | 'in_progress' | 'on_hold' | 'completed' | 'cancelled';
export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';
export type TaskStatus = 'todo' | 'in_progress' | 'in_review' | 'done' | 'blocked';
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  phase: PMPPhase;
  start_date: string;
  end_date: string;
  budget: number;
  spent: number;
  progress: number;
  project_manager: string;
  stakeholders: string[];
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  project_id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee_email: string;
  assignee_name: string;
  start_date: string;
  due_date: string;
  completed_date: string | null;
  estimated_hours: number;
  actual_hours: number;
  wbs_code: string; // Work Breakdown Structure
  dependencies: string[]; // task IDs
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  id: string;
  project_id: string;
  name: string;
  email: string;
  role: string;
  avatar_url: string | null;
  department: string;
  is_active: boolean;
  created_at: string;
}

export interface ProjectFile {
  id: string;
  project_id: string;
  name: string;
  file_type: string;
  file_size: number;
  file_url: string;
  uploaded_by: string;
  category: string;
  created_at: string;
}

export interface Milestone {
  id: string;
  project_id: string;
  title: string;
  description: string;
  due_date: string;
  status: 'pending' | 'completed' | 'overdue';
  deliverables: string[];
  phase: PMPPhase;
  created_at: string;
}

export interface Risk {
  id: string;
  project_id: string;
  title: string;
  description: string;
  probability: RiskLevel;
  impact: RiskLevel;
  mitigation: string;
  owner_email: string;
  status: 'identified' | 'mitigated' | 'occurred' | 'closed';
  created_at: string;
}

export interface CalendarEvent {
  id: string;
  project_id: string | null;
  title: string;
  description: string;
  start: string;
  end: string;
  type: 'meeting' | 'milestone' | 'deadline' | 'review' | 'other';
  attendees: string[];
  location: string | null;
  google_event_id: string | null;
  created_at: string;
}
