"use client"
import { AuthHelper } from "./auth.helper";

export interface Permission {
  PM: boolean;
  LD: boolean;
  EMP: boolean;
}

export interface PermissionConfig {
  // PROJECT
  createProject: Permission;
  viewProjectDetails: Permission;
  updateProject: Permission;
  viewLeaders: Permission;
  addLeader: Permission;
  removeLeader: Permission;
  completeProject: Permission;
  viewPerformance: Permission;
  deleteProject: Permission;

  // PHASE
  createPhase: Permission;
  viewPhaseDetails: Permission;
  updatePhase: Permission;
  deletePhase: Permission;

  // COLLECTION
  createCollection: Permission;
  viewCollection: Permission;
  updateCollection: Permission;
  deleteCollection: Permission;

  // TASK
  createTask: Permission;
  viewTaskDetails: Permission;
  viewTaskPerformance: Permission;
  completeTask: Permission;
  deleteTask: Permission;
}

export class PermissionHelper {
  private static readonly PERMISSIONS: PermissionConfig = {
    // PROJECT
    createProject: { PM: true, LD: false, EMP: false },
    viewProjectDetails: { PM: true, LD: true, EMP: true },
    updateProject: { PM: true, LD: false, EMP: false },
    viewLeaders: { PM: true, LD: false, EMP: false },
    addLeader: { PM: true, LD: false, EMP: false },
    removeLeader: { PM: true, LD: false, EMP: false },
    completeProject: { PM: true, LD: false, EMP: false },
    viewPerformance: { PM: true, LD: true, EMP: false },
    deleteProject: { PM: true, LD: false, EMP: false },

    // PHASE
    createPhase: { PM: true, LD: false, EMP: false },
    viewPhaseDetails: { PM: true, LD: true, EMP: true },
    updatePhase: { PM: true, LD: false, EMP: false },
    deletePhase: { PM: true, LD: false, EMP: false },

    // COLLECTION
    createCollection: { PM: true, LD: false, EMP: false },
    viewCollection: { PM: true, LD: true, EMP: true },
    updateCollection: { PM: true, LD: false, EMP: false },
    deleteCollection: { PM: true, LD: false, EMP: false },

    // TASK
    createTask: { PM: true, LD: true, EMP: false },
    viewTaskDetails: { PM: true, LD: true, EMP: false },
    viewTaskPerformance: { PM: true, LD: true, EMP: true },
    completeTask: { PM: true, LD: true, EMP: true },
    deleteTask: { PM: true, LD: true, EMP: false },
  };

  static hasPermission(permission: keyof PermissionConfig): boolean {
    const userRole = this.getUserRole();
    const permissionConfig = this.PERMISSIONS[permission];
    
    if (!permissionConfig) {
      console.warn(`Permission ${permission} not found`);
      return false;
    }

    return permissionConfig[userRole as keyof Permission] || false;
  }

  static getUserRole(): string {
    const role = AuthHelper.getRoleFromToken().toUpperCase();
    
    if (role.includes('PM')) return 'PM';
    if (role.includes('LEAD')) return 'LD';
    if (role.includes('EMP')) return 'EMP';
    
    return 'PM'; // Default fallback
  }

  static canCreateProject(): boolean {
    return this.hasPermission('createProject');
  }

  static canViewProjectDetails(): boolean {
    return this.hasPermission('viewProjectDetails');
  }

  static canUpdateProject(): boolean {
    return this.hasPermission('updateProject');
  }

  static canViewLeaders(): boolean {
    return this.hasPermission('viewLeaders');
  }

  static canAddLeader(): boolean {
    return this.hasPermission('addLeader');
  }

  static canRemoveLeader(): boolean {
    return this.hasPermission('removeLeader');
  }

  static canCompleteProject(): boolean {
    return this.hasPermission('completeProject');
  }

  static canViewPerformance(): boolean {
    return this.hasPermission('viewPerformance');
  }

  static canDeleteProject(): boolean {
    return this.hasPermission('deleteProject');
  }

  static canCreatePhase(): boolean {
    return this.hasPermission('createPhase');
  }

  static canViewPhaseDetails(): boolean {
    return this.hasPermission('viewPhaseDetails');
  }

  static canUpdatePhase(): boolean {
    return this.hasPermission('updatePhase');
  }

  static canDeletePhase(): boolean {
    return this.hasPermission('deletePhase');
  }

  static canCreateCollection(): boolean {
    return this.hasPermission('createCollection');
  }

  static canViewCollection(): boolean {
    return this.hasPermission('viewCollection');
  }

  static canUpdateCollection(): boolean {
    return this.hasPermission('updateCollection');
  }

  static canDeleteCollection(): boolean {
    return this.hasPermission('deleteCollection');
  }

  static canCreateTask(): boolean {
    return this.hasPermission('createTask');
  }

  static canViewTaskDetails(): boolean {
    return this.hasPermission('viewTaskDetails');
  }

  static canViewTaskPerformance(): boolean {
    return this.hasPermission('viewTaskPerformance');
  }

  static canCompleteTask(): boolean {
    return this.hasPermission('completeTask');
  }

  static canDeleteTask(): boolean {
    return this.hasPermission('deleteTask');
  }
} 