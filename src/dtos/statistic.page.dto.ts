import { DTO_FastUserInfo } from "./create-task.page.dto";

export interface DTO_ProjectOverview {
  id: number;
  userInfoCreated: DTO_FastUserInfo;
  name: string;
  description: string;
  startDate: string;
  endDate: string | null;
  dueDate: string;
  active: boolean;
  createdTime: string;
  updatedTime: string;
  totalApproved: number;
  totalRejected: number;
  totalDoneTaskOnTime: number;
  totalDoneTaskLate: number;
}

export interface DTO_UserStatistic {
  email: string;
  fullName: string;
  role: string;
  department: string;
  approvedRatio: number;
  totalPoint: number;
  totalDoneTaskOnTime: number;
  totalDoneTaskLate: number;
}