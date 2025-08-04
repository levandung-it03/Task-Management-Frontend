export const PROJECT_STATUS = ['Pending', 'Running', 'Completed', 'Cancelled'] as const;
export type ProjectStatus = typeof PROJECT_STATUS[number];

export interface DTO_CreateProject {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  deadline: string;
  status: ProjectStatus;
}

export interface DTO_AddLeaderToProjectRequest {
  projectId: number;
  leaderEmails: string[];
}

export class DTO_SearchFastUserInfo_Project {
  private query!: string;
  public static withBuilder() { return new DTO_SearchFastUserInfo_Project(); }
  public bquery(query: string): DTO_SearchFastUserInfo_Project { this.query = query; return this; }
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
    this.projectId = 0;
    this.forceDelete = forceDelete;
    return this;
  }
} 