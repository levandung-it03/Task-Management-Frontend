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
}

export interface DTO_Leader {
  username: string;
  fullName: string;
  role: string;
}

export interface DTO_ProjectItem {
  id: number;
  name: string;
  description: string;
  startDate: string;        
  endDate?: string | null;  
  dueDate: string;
  status: string;
  createdTime: string;
  updatedTime: string;
}

export interface DTO_ProjectItem1 {
  id: number;
  name: string;
  description: string;
  startDate: string;        
  endDate?: string | null;  
  dueDate: string;
  status: string;
  createdTime: string;      
  updatedTime: string;
  leaders?: Record<string, DTO_Leader>;
}


export interface DTO_Group {
  id: number;
  groupAvatar: string;
  groupName: string;
  role: 'OWNER' | 'MEMBER';
}

export interface DTO_UserInfo {
  fullName: string;
  email: string;
  phone: string;
  identity: string;
  department: Record<string, string>;
}

export interface DTO_EmpHomeData {
  stats: DTO_DashboardStats;
  groups?: DTO_Group[];
  projects: DTO_ProjectItem[];
  user?: DTO_UserInfo;
}

export interface DTO_TaskOverview {
  id: number
  name: string
  taskType: string
  priority: string
  startDate: string
  endDate: string
  deadline: string
}