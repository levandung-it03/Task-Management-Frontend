export const CREATE_PHASE_STATUS = ['Pending', 'Running', 'Completed', 'Cancelled'] as const;
export type CreatePhaseStatus = typeof CREATE_PHASE_STATUS[number];

export interface DTO_CreatePhase {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
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
} 