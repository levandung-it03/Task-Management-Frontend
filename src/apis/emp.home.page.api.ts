import { EmpHomeData } from '../dtos/emp.home.page.dto';
import axios from '../util/axios.helper';

export async function fetchEmpHomeData(): Promise<EmpHomeData> {
  // Giả lập API, sau này thay bằng endpoint thật
  return {
    stats: {
      totalProjects: 24,
      endedProjects: 10,
      runningProjects: 12,
      pendingProjects: 2,
      details: [
        {
          value: 24,
          color: '#166534',
          growth: 5,
          growthType: 'up',
          growthText: 'Increased from last month',
        },
        {
          value: 10,
          color: '#334155',
          growth: 2,
          growthType: 'up',
          growthText: 'Increased from last month',
        },
        {
          value: 12,
          color: '#0e7490',
          growth: 2,
          growthType: 'down',
          growthText: 'Down from last month',
        },
        {
          value: 2,
          color: '#a16207',
          growth: undefined,
          growthType: 'discuss',
          growthText: 'On Discuss.',
        },
      ],
    },
    groups: [
      {
        id: 'g1',
        groupAvatar: '/images/avatar1.png',
        groupName: 'Dev IT batch 48',
        role: 'OWNER',
      },
      {
        id: 'g2',
        groupAvatar: '/images/avatar2.png',
        groupName: 'Dev IT batch 45',
        role: 'MEMBER',
      },
      {
        id: 'g3',
        groupAvatar: '/images/avatar3.png',
        groupName: 'Dev IT batch 30',
        role: 'MEMBER',
      },
    ],
    projects: [
      { id: 'p1', name: 'Develop API Endpoints', dueDate: '2024-11-26' },
      { id: 'p2', name: 'Onboarding Flow', dueDate: '2024-11-30' },
      { id: 'p3', name: 'Build Dashboard', dueDate: '2024-11-30' },
      { id: 'p4', name: 'Optimize Page Load', dueDate: '2024-12-05' },
      { id: 'p5', name: 'Cross-Browser Testing', dueDate: '2024-12-06' },
    ],
  };
  // Khi có API thật:
  // const res = await axios.get('/emp/home');
  // return res.data;
} 