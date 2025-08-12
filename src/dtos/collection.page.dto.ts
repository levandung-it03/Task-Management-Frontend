import { DTO_FastUserInfo } from "./create-task.page.dto";
export interface DTO_CreateCollection {
  name: string;
  description: string;
  startDate: string;
  dueDate: string;
} 

export interface DTO_CollectionItem {
  id: number;
  name: string;
  description: string;
  startDate: string; 
  endDate?: string | null; 
  dueDate: string; 
  createdTime: string; 
  updatedTime: string; 
  } 

export class DTO_DeleteCollection {
  collectionId: number;
  forceDelete: boolean;

  constructor() {
    this.collectionId = 0;
    this.forceDelete = false;
  }

  bquery(collectionId: number, forceDelete: boolean = false): DTO_DeleteCollection {
    this.collectionId = collectionId;
    this.forceDelete = forceDelete;
    return this;
  }
} 

export interface DTO_PhaseDetail {
  id: number;
  name: string;
  description: string;
  startDate: string; 
  endDate?: string | null; 
  dueDate: string; 
  createdTime: string; 
  updatedTime: string; 
  status: string;

  userInfoCreated: DTO_FastUserInfo;
  projectInfo: DTO_EntityDelegator;
}

export interface DTO_EntityDelegator {
  id: number;
  name: string;
}