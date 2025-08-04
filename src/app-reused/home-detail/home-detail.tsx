'use client';

import './home-detail.scss';
import React, { useEffect, useState } from 'react';
import HomeStats from './home-stats/home-stats';
import { HomeAPIs } from '@/apis/home.page.api';
import { DTO_DashboardStats, DTO_Group } from '@/dtos/home.page.dto';
import { ApiResponse } from '@/apis/general.api';
import { LayoutDashboard } from 'lucide-react';
import Calendar from './calendar/calendar';
import { AuthHelper } from '@/util/auth.helper';
import UndoneTasks from './home-tasks/home-tasks';

export default function HomeDetail() {
  const [stats, setStats] = useState<DTO_DashboardStats>();
  const [groups, setGroups] = useState<DTO_Group[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsResponse, groupsResponse] = await Promise.all([
          HomeAPIs.getHomeStats(),
          HomeAPIs.getUserGroups(),
        ]);

        const statsData = (statsResponse as ApiResponse<DTO_DashboardStats>).body;
        const groupsData = (groupsResponse as ApiResponse<DTO_Group[]>).body;

        if (statsData) setStats(statsData);
        if (groupsData) setGroups(groupsData);
      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="loading-row">Loading...</div>;

  return (
    <div className="home-detail">
      <div className="main-content">
        <div className="dashboard-header">
          <div className="form-caption">
            <LayoutDashboard className="caption-icon" />
            <span className="caption-content">Dashboard</span>
            <i className="desc-content">Welcome back!</i>
          </div>
          <div className="dashboard-actions">
            <a
              style={{
                background: '#166534',
                color: '#fff',
                border: 'none',
                borderRadius: 999,
                padding: '12px 32px',
                fontWeight: 600,
                fontSize: 16,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                boxShadow: '0 2px 8px #0001',
                cursor: 'pointer'
              }}
              href={`/${AuthHelper.getRoleFromToken()}/projects`}
            >
              <span style={{ fontSize: 22, fontWeight: 700, marginRight: 4, color: '#fff' }}>+</span> Project
            </a>
          </div>
        </div>

        {/* Dashboard Stats */}
        <div className="stats-container">
          {stats && <HomeStats stats={stats} />}
        </div>

        <div className="content-grid">
          <UndoneTasks />
          <Calendar />
        </div>
      </div>

    </div>
  );
}