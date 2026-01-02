// Enums for strict typing
export enum CertificateStatus {
  ACTIVE = '正常',
  BORROWED = '已借出',
  EXPIRED = '已过期',
  REVOKED = '已吊销',
  LOST = '挂失'
}

export enum Rank {
  CONSTABLE = '警员',
  SERGEANT = '警司',
  INSPECTOR = '警督',
  SUPERINTENDENT = '警监'
}

export enum Role {
  USER = '普通警员',
  DEPT_ADMIN = '部门管理员',
  SYS_ADMIN = '系统管理员'
}

export enum ApprovalStatus {
  PENDING = '待审批',
  APPROVED = '已通过',
  REJECTED = '已驳回'
}

// Entities
export interface Officer {
  id: string;
  name: string;
  badgeNumber: string;
  department: string;
  rank: Rank;
  phone: string;
  role: Role;
}

export interface Certificate {
  id: string;
  serialNumber: string; // USB Key Serial
  ownerId: string; // Links to Officer
  validUntil: string;
  status: CertificateStatus;
  cabinetSlot?: number; // Physical location ID if in cabinet
  borrowTime?: string; // Timestamp when borrowed
}

export interface CabinetSlot {
  id: number;
  status: 'empty' | 'occupied' | 'error';
  certificateId?: string;
}

export interface ApprovalRequest {
  id: string;
  requesterId: string;
  certificateId: string;
  type: 'BORROW' | 'RETURN' | 'RENEWAL';
  reason: string;
  timestamp: string;
  status: ApprovalStatus;
}

export interface SystemLog {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  details: string;
  level: 'INFO' | 'WARNING' | 'CRITICAL';
}

export interface TrendData {
  date: string;
  borrow: number;
  return: number;
}

export interface WorkflowStep {
  id: number;
  name: string;
  approverRole: Role;
  isEnabled: boolean;
  order: number;
}