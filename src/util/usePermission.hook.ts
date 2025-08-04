"use client"
import { useMemo } from 'react';
import { PermissionHelper } from './permission.helper';

export const usePermission = () => {
  const permissions = useMemo(() => ({
    // PROJECT
    canCreateProject: PermissionHelper.canCreateProject(),
    canViewProjectDetails: PermissionHelper.canViewProjectDetails(),
    canUpdateProject: PermissionHelper.canUpdateProject(),
    canViewLeaders: PermissionHelper.canViewLeaders(),
    canAddLeader: PermissionHelper.canAddLeader(),
    canRemoveLeader: PermissionHelper.canRemoveLeader(),
    canCompleteProject: PermissionHelper.canCompleteProject(),
    canViewPerformance: PermissionHelper.canViewPerformance(),
    canDeleteProject: PermissionHelper.canDeleteProject(),

    // PHASE
    canCreatePhase: PermissionHelper.canCreatePhase(),
    canViewPhaseDetails: PermissionHelper.canViewPhaseDetails(),
    canUpdatePhase: PermissionHelper.canUpdatePhase(),
    canDeletePhase: PermissionHelper.canDeletePhase(),

    // COLLECTION
    canCreateCollection: PermissionHelper.canCreateCollection(),
    canViewCollection: PermissionHelper.canViewCollection(),
    canUpdateCollection: PermissionHelper.canUpdateCollection(),
    canDeleteCollection: PermissionHelper.canDeleteCollection(),

    // TASK
    canCreateTask: PermissionHelper.canCreateTask(),
    canViewTaskDetails: PermissionHelper.canViewTaskDetails(),
    canViewTaskPerformance: PermissionHelper.canViewTaskPerformance(),
    canCompleteTask: PermissionHelper.canCompleteTask(),
    canDeleteTask: PermissionHelper.canDeleteTask(),
  }), []);

  return permissions;
}; 