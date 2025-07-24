export const COLLECTION_STATUS = ['Pending', 'Running', 'Completed', 'Cancelled'] as const;
export type CollectionStatus = typeof COLLECTION_STATUS[number];

export interface DTO_CreateCollection {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  deadline: string;
  status: CollectionStatus;
} 

export interface DTO_CollectionItem {
    id: string;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    deadline: string;
    status: string;
    leaders?: Record<string, { username: string; fullName: string; role: string }>;
  } 