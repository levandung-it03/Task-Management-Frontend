export const CREATE_PHASE_STATUS = ['Pending', 'Running', 'Completed', 'Cancelled'] as const;
export type CreatePhaseStatus = typeof CREATE_PHASE_STATUS[number];

export interface DTO_CreatePhase {
  name: string;
  description: string;
  startDate: string;
  deadline: string;
  status: CreatePhaseStatus;
}

export interface DTO_PhaseItem {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  deadline: string;
  status: CreatePhaseStatus;
  leaders?: Record<string, { username: string; fullName: string; role: string }>;
  active?: boolean;
}

// DTO cho thao tác leader phase giống project
export interface DTO_AddLeaderToPhaseRequest {
  phaseId: string;
  leaderEmails: string[];
}

export class DTO_SearchFastUserInfo_Phase {
  private query!: string;
  public static withBuilder() { return new DTO_SearchFastUserInfo_Phase(); }
  public bquery(query: string): DTO_SearchFastUserInfo_Phase { this.query = query; return this; }
}

export class DTO_RemoveLeaderFromPhase {
  phaseId: string;
  leaderEmail: string;

  constructor() {
    this.phaseId = '';
    this.leaderEmail = '';
  }

  bquery(phaseId: string, leaderEmail: string): DTO_RemoveLeaderFromPhase {
    this.phaseId = phaseId;
    this.leaderEmail = leaderEmail;
    return this;
  }
}

export class DTO_DeletePhase {
  phaseId: string;
  forceDelete: boolean;

  constructor() {
    this.phaseId = '';
    this.forceDelete = false;
  }

  bquery(phaseId: string, forceDelete: boolean): DTO_DeletePhase {
    this.phaseId = phaseId;
    this.forceDelete = forceDelete;
    return this;
  }
} 