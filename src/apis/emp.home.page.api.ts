import { DTO_EmpHomeData } from '../dtos/emp.home.page.dto';
import axios from '../util/axios.helper';

export async function fetchEmpHomeData(): Promise<DTO_EmpHomeData> {
  return {
    user: {
      fullName: 'Totok Michael',
      email: 'tmichael20@mail.com',
      avatar: '/images/avatar1.png',
    },
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
        id: '1',
        groupAvatar: '/images/avatar1.png',
        groupName: 'Dev IT batch 48',
        role: 'OWNER',
      },
      {
        id: '2',
        groupAvatar: '/images/avatar2.png',
        groupName: 'Dev IT batch 45',
        role: 'MEMBER',
      },
      {
        id: '3',
        groupAvatar: '/images/avatar3.png',
        groupName: 'Dev IT batch 30',
        role: 'MEMBER',
      },
    ],
    projects: [
      {
        id: '1',
        name: 'Develop API Endpoints',
        description: 'Xây dựng các endpoint RESTful cho hệ thống.',
        startDate: '2024-10-01',
        endDate: '2024-11-25',
        deadline: '2024-11-26',
        status: 'Running',
        leaders: {
          'ngocthuy.30042000.01072025@tmakes.company.vn': {
            username: 'ngocthuy.30042000.01072025@tmakes.company.vn',
            fullName: 'Ngọc Thúy',
            role: 'ROLE_LEAD',
          }
        }
      },
      {
        id: '2',
        name: 'Onboarding Flow',
        description: 'Thiết kế luồng onboarding cho người dùng mới.',
        startDate: '2024-10-10',
        endDate: '2024-11-29',
        deadline: '2024-11-30',
        status: 'Pending',
        leaders: {}
      },
      {
        id: '3',
        name: 'Build Dashboard',
        description: 'Phát triển dashboard quản lý dự án.',
        startDate: '2024-10-15',
        endDate: '2024-11-28',
        deadline: '2024-11-30',
        status: 'Completed',
        leaders: {
          'phamhoang.10022002.27062025@tmakes.company.vn': {
            username: 'phamhoang.10022002.27062025@tmakes.company.vn',
            fullName: 'Phạm Hoàng',
            role: 'ROLE_PM',
          }
        }
      },
      {
        id: '4',
        name: 'Optimize Page Load',
        description: 'Tối ưu tốc độ tải trang cho hệ thống.',
        startDate: '2024-11-01',
        endDate: '2024-12-04',
        deadline: '2024-12-05',
        status: 'Running',
        leaders: {}
      },
      {
        id: '5',
        name: 'Cross-Browser Testing',
        description: 'Kiểm thử hệ thống trên nhiều trình duyệt.',
        startDate: '2024-11-05',
        endDate: '2024-12-05',
        deadline: '2024-12-06',
        status: 'Pending',
        leaders: {}
      },
    ],
  };

}

export async function fetchPhaseData() {
  return [
    {
      id: '1',
      name: 'Requirement Analysis',
      description: 'Phân tích yêu cầu dự án.',
      startDate: '2024-10-01',
      endDate: '2024-10-10',
      deadline: '2024-10-11',
      status: 'Completed',
      leaders: {
        'phamhoang.10022002.27062025@tmakes.company.vn': {
          username: 'phamhoang.10022002.27062025@tmakes.company.vn',
          fullName: 'Phạm Hoàng',
          role: 'ROLE_PM',
        }
      }
    },
    {
      id: '2',
      name: 'System Design',
      description: 'Thiết kế hệ thống tổng thể.',
      startDate: '2024-10-12',
      endDate: '2024-10-20',
      deadline: '2024-10-21',
      status: 'Running',
      leaders: {
        'ngocthuy.30042000.01072025@tmakes.company.vn': {
          username: 'ngocthuy.30042000.01072025@tmakes.company.vn',
          fullName: 'Ngọc Thúy',
          role: 'ROLE_LEAD',
        }
      }
    },
    {
      id: '3',
      name: 'Implementation',
      description: 'Lập trình các chức năng.',
      startDate: '2024-10-22',
      endDate: '2024-11-10',
      deadline: '2024-11-11',
      status: 'Pending',
      leaders: {}
    },
    {
      id: '4',
      name: 'Testing',
      description: 'Kiểm thử hệ thống.',
      startDate: '2024-11-12',
      endDate: '2024-11-20',
      deadline: '2024-11-21',
      status: 'Pending',
      leaders: {}
    }
  ];
}

export async function fetchCollectionData() {
  return [
    {
      id: '1',
      name: 'Frontend Components',
      description: 'Tập hợp các component giao diện dùng chung.',
      startDate: '2024-10-01',
      endDate: '2024-10-15',
      deadline: '2024-10-16',
      status: 'Completed',
      leaders: {
        'phamhoang.10022002.27062025@tmakes.company.vn': {
          username: 'phamhoang.10022002.27062025@tmakes.company.vn',
          fullName: 'Phạm Hoàng',
          role: 'ROLE_PM',
        }
      }
    },
    {
      id: '2',
      name: 'API Utilities',
      description: 'Các hàm tiện ích cho việc gọi API.',
      startDate: '2024-10-17',
      endDate: '2024-10-25',
      deadline: '2024-10-26',
      status: 'Running',
      leaders: {
        'ngocthuy.30042000.01072025@tmakes.company.vn': {
          username: 'ngocthuy.30042000.01072025@tmakes.company.vn',
          fullName: 'Ngọc Thúy',
          role: 'ROLE_LEAD',
        }
      }
    },
    {
      id: '3',
      name: 'Testing Scripts',
      description: 'Các script kiểm thử tự động.',
      startDate: '2024-10-27',
      endDate: '2024-11-05',
      deadline: '2024-11-06',
      status: 'Pending',
      leaders: {}
    },
    {
      id: '4',
      name: 'Documentation',
      description: 'Tài liệu hướng dẫn sử dụng hệ thống.',
      startDate: '2024-11-07',
      endDate: '2024-11-15',
      deadline: '2024-11-16',
      status: 'Pending',
      leaders: {}
    }
  ];
} 