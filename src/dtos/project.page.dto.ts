export const PROJECT_STATUS = ['Pending', 'Running', 'Completed', 'Cancelled'] as const;
export type ProjectStatus = typeof PROJECT_STATUS[number];

export interface DTO_CreateProject {
  name: string;
  description?: string;
  startDate: string;
  dueDate: string;
}

export interface DTO_Leader {
  id: number
  username: string;
  fullName: string;
  role: string;
}

export interface DTO_UpdateProject {
  name: string;
  description?: string;
  startDate: string;
  dueDate: string;
}

export interface DTO_CompleteProject {
  endDate: string;
}

export interface DTO_AddLeaderToProjectRequest {
  assignedEmails: string[];
}

export class DTO_SearchFastUserInfo_Project {
  email!: string;
  fullName!: string;
  role!: string;
}

export interface DTO_ProjectRoleResponse {
  fullName: string;
  email: string;
  role: string;
  projectRole: "OWNER" | "MEMBER";
}

export interface DTO_KickedLeaderRequest {
  kickedEmail: string;
}

export class DTO_RemoveLeaderFromProject {
  projectId: number;
  leaderEmail: string;

  constructor() {
    this.projectId = 0;
    this.leaderEmail = '';
  }

  bquery(projectId: number, leaderEmail: string): DTO_RemoveLeaderFromProject {
    this.projectId = projectId;
    this.leaderEmail = leaderEmail;
    return this;
  }
}

export class DTO_DeleteProject {
  projectId: number;
  forceDelete: boolean;

  constructor() {
    this.projectId = 0;
    this.forceDelete = false;
  }

  bquery(projectId: number, forceDelete: boolean = false): DTO_DeleteProject {
    this.projectId = projectId;
    this.forceDelete = forceDelete;
    return this;
  }
} 