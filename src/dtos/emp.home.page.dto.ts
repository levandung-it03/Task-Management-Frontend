export interface DashboardStatDetail {
  value: number;
  color: string;
  growth?: number;
  growthType?: 'up' | 'down' | 'discuss' | null;
  growthText?: string;
}

export interface DashboardStats {
  totalProjects: number;
  endedProjects: number;
  runningProjects: number;
  pendingProjects: number;
  details?: DashboardStatDetail[];
}

export interface TeamMember {
  id: string;
  name: string;
  avatarUrl: string;
  role: string;
  task: string;
  status: 'Completed' | 'In Progress' | 'Pending';
}

export interface ProjectItem {
  id: string;
  name: string;
  dueDate: string;
}

export interface Group {
  id: string;
  groupAvatar: string;
  groupName: string;
  role: 'OWNER' | 'MEMBER';
}

export interface EmpHomeData {
  stats: DashboardStats;
  groups?: Group[];
  projects: ProjectItem[];
} 