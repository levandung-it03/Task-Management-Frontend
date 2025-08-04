import React from 'react';
import './home-stats.scss';
import { DTO_DashboardStats } from '@/dtos/home.page.dto';

interface StatCardProps {
  label: string;
  value: number;
  color: string;
}

function StatCard({ label, value, color }: StatCardProps) {
  const isTotal = label === 'Total Projects';

  return (
    <div className={`stat-card ${isTotal ? 'total-projects' : ''}`}>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
    </div>
  );
}

export default function HomeStats({ stats }: { stats: DTO_DashboardStats }) {
  return (
    <div className="home-stats">
      <StatCard
        label="Total Projects"
        value={stats.totalProjects ?? 0}
        color='#166534'
      />
      <StatCard
        label="Ended Projects"
        value={stats.endedProjects ?? 0}
        color='#334155'
      />
      <StatCard
        label="Running Projects"
        value={stats.runningProjects ?? 0}
        color='#0e7490'
      />
      <StatCard
        label="Pending Project"
        value={stats.pendingProjects ?? 0}
        color='#a16207'
      />
    </div>
  );
} 