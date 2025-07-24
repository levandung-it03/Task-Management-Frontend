export interface DTO_DashboardStatDetail {
  value: number;
  color: string;
  growth?: number;
  growthType?: 'up' | 'down' | 'discuss' | null;
  growthText?: string;
}

export interface DTO_DashboardStats {
  totalProjects: number;
  endedProjects: number;
  runningProjects: number;
  pendingProjects: number;
  details?: DTO_DashboardStatDetail[];
}

export interface DTO_ProjectItem {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  deadline: string;
  status: 'Pending' | 'Running' | 'Completed' | 'Cancelled';
  leaders?: Record<string, { username: string; fullName: string; role: string }>;
}

export interface DTO_Group {
  id: string;
  groupAvatar: string;
  groupName: string;
  role: 'OWNER' | 'MEMBER';
}

export interface DTO_UserInfo {
  fullName: string;
  email: string;
  avatar: string;
}

export interface DTO_EmpHomeData {
  stats: DTO_DashboardStats;
  groups?: DTO_Group[];
  projects: DTO_ProjectItem[];
  user?: DTO_UserInfo;
} 