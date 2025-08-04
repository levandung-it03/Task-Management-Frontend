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
    active?: boolean;
    leaders?: Record<string, { username: string; fullName: string; role: string }>;
  } 

export class DTO_DeleteCollection {
  collectionId: string;
  forceDelete: boolean;

  constructor() {
    this.collectionId = '';
    this.forceDelete = false;
  }

  bquery(collectionId: string, forceDelete: boolean = false): DTO_DeleteCollection {
    this.collectionId = collectionId;
    this.forceDelete = forceDelete;
    return this;
  }
} 