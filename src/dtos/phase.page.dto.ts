import { DTO_FastUserInfo } from "./create-task.page.dto";

export interface DTO_CreatePhase {
  name: string;
  description: string;
  startDate: string;
  dueDate: string;
}

export interface DTO_PhaseItem {
  id: number;
  name: string;
  description: string;
  startDate: string; 
  endDate?: string | null; 
  dueDate: string; 
  createdTime: string; 
  updatedTime: string; 
}

// DTO cho thao tác leader phase giống project
export interface DTO_AddLeaderToPhaseRequest {
  phaseId: number;
  leaderEmails: string[];
}

export class DTO_SearchFastUserInfo_Phase {
  private query!: string;
  public static withBuilder() { return new DTO_SearchFastUserInfo_Phase(); }
  public bquery(query: string): DTO_SearchFastUserInfo_Phase { this.query = query; return this; }
}

export class DTO_RemoveLeaderFromPhase {
  phaseId: number;
  leaderEmail: string;

  constructor() {
    this.phaseId = 0;
    this.leaderEmail = '';
  }

  bquery(phaseId: number, leaderEmail: string): DTO_RemoveLeaderFromPhase {
    this.phaseId = phaseId;
    this.leaderEmail = leaderEmail;
    return this;
  }
}

export class DTO_DeletePhase {
  phaseId: number;
  forceDelete: boolean;

  constructor() {
    this.phaseId = 0;
    this.forceDelete = false;
  }

  bquery(phaseId: number, forceDelete: boolean): DTO_DeletePhase {
    this.phaseId = phaseId;
    this.forceDelete = forceDelete;
    return this;
  }
}

export interface DTO_ProjectDetail {
  id: number;
  name: string;
  description: string;
  expectedStartDate: string;
  startDate: string | null; 
  endDate?: string | null; 
  dueDate: string; 
  createdTime: string; 
  updatedTime: string; 
  status: string;

  userInfoCreated: DTO_FastUserInfo;
}