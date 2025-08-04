"use client"
import React from 'react';
import { PermissionHelper } from '../util/permission.helper';

interface PermissionGuardProps {
  permission: keyof ReturnType<typeof PermissionHelper.hasPermission>;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  permission,
  children,
  fallback = null
}) => {
  const hasPermission = PermissionHelper.hasPermission(permission);

  if (!hasPermission) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}; 