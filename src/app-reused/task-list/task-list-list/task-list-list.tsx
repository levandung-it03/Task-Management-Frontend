import React from 'react';
import { DTO_TaskListItem } from '../../../dtos/task-list.page.dto';
import './task-list-list.scss';
import { AuthHelper } from '@/util/auth.helper';

interface TaskListListProps {
  taskLists: DTO_TaskListItem[];
}

export default function TaskListList({ 
  taskLists
}: TaskListListProps) {
  // Filter out any null or undefined taskLists to prevent errors
  const validTaskLists = taskLists.filter(taskList => taskList != null);

  // Helper function to get tag color based on priority
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT':
        return '#dc2626'; // red
      case 'HIGH':
        return '#f97316'; // orange
      case 'NORMAL':
        return 'var(--blue-in-env)'; // blue
      case 'LOW':
        return '#10b981'; // green
      default:
        return '#6b7280'; // gray
    }
  };

  // Helper function to get tag color based on level
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'HARD':
        return '#dc2626'; // red
      case 'ADVANCED':
        return '#f97316'; // orange
      case 'NORMAL':
        return 'var(--blue-in-env)'; // blue
      case 'LIGHT':
        return '#10b981'; // green
      default:
        return '#6b7280'; // gray
    }
  };

  // Helper function to get task type display name
  const getTaskTypeDisplay = (taskType: string) => {
    switch (taskType) {
      case 'BACKEND':
        return 'Backend';
      case 'FRONTEND':
        return 'Frontend';
      case 'BUSINESS_ANALYSIS':
        return 'Business Analysis';
      case 'DEPLOY':
        return 'Deploy';
      case 'DESIGN':
        return 'Design';
      case 'TEST':
        return 'Test';
      case 'DOCUMENTATION':
        return 'Documentation';
      case 'MAINTENANCE':
        return 'Maintenance';
      case 'RESEARCH':
        return 'Research';
      case 'TRAINING':
        return 'Training';
      case 'AI':
        return 'AI';
      default:
        return taskType;
    }
  };

  return (
    <div className="task-list-list">
      {validTaskLists.map((taskList) => (
        <div 
          key={`task-list-${taskList.id}`} 
          className="task-list-item"
        >
          <a className="task-list-info" href={`${window.location.origin}/${AuthHelper.getRoleFromToken()}/task-detail/${taskList.id}`}>
            <svg width="28" height="28" fill="none" stroke="var(--main-green)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="4" y="4" width="20" height="20" rx="5" fill="#e6f4ea" stroke="var(--main-green)" />
              <path d="M10 12h8M10 16h8" stroke="var(--main-green)" />
            </svg>
            <div className="task-list-content">
              <span className="task-list-name">
                {taskList.name}
              </span>
            </div>
          </a>
          
          <div className="task-list-tags">
            <span 
              className="task-tag level-tag"
              style={{ backgroundColor: getLevelColor(taskList.level), color: 'white' }}
            >
              {taskList.level}
            </span>
            <span 
              className="task-tag type-tag"
              style={{ backgroundColor: 'var(--blue-in-env)', color: 'white' }}
            >
              {getTaskTypeDisplay(taskList.taskType)}
            </span>
            <span 
              className="task-tag priority-tag"
              style={{ backgroundColor: getPriorityColor(taskList.priority), color: 'white' }}
            >
              {taskList.priority}
            </span>
          </div>

          <div className="task-list-dates">
            <div className="start-date">
              <span className="date-label">Started at {taskList.startDate}</span>
            </div>
            <div className="task-list-deadline">
              Deadline: <span className="deadline-value">{taskList.deadline}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 