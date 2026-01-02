import { Certificate, CertificateStatus, Officer, Rank, CabinetSlot, ApprovalRequest, ApprovalStatus, SystemLog, Role, TrendData, WorkflowStep } from '../types';

export const MOCK_OFFICERS: Officer[] = [
  { id: 'o1', name: '张伟', badgeNumber: '001234', department: '刑侦支队', rank: Rank.INSPECTOR, phone: '13800138000', role: Role.DEPT_ADMIN },
  { id: 'o2', name: '李强', badgeNumber: '001235', department: '网安大队', rank: Rank.SERGEANT, phone: '13900139000', role: Role.USER },
  { id: 'o3', name: '王芳', badgeNumber: '001236', department: '治安大队', rank: Rank.CONSTABLE, phone: '13700137000', role: Role.USER },
  { id: 'o4', name: '赵敏', badgeNumber: '001237', department: '指挥中心', rank: Rank.SUPERINTENDENT, phone: '13600136000', role: Role.SYS_ADMIN },
];

export const MOCK_CERTIFICATES: Certificate[] = [
  { id: 'c1', serialNumber: 'UK-2024-001', ownerId: 'o1', validUntil: '2025-12-31', status: CertificateStatus.ACTIVE, cabinetSlot: 1 },
  // Borrowed 9 hours ago (simulate overdue)
  { id: 'c2', serialNumber: 'UK-2024-002', ownerId: 'o2', validUntil: '2025-10-15', status: CertificateStatus.BORROWED, cabinetSlot: undefined, borrowTime: new Date(Date.now() - 9 * 60 * 60 * 1000).toLocaleString() },
  { id: 'c3', serialNumber: 'UK-2023-099', ownerId: 'o3', validUntil: '2024-01-01', status: CertificateStatus.EXPIRED, cabinetSlot: 3 },
  { id: 'c4', serialNumber: 'UK-2024-055', ownerId: 'o4', validUntil: '2026-05-20', status: CertificateStatus.ACTIVE, cabinetSlot: 4 },
  { id: 'c5', serialNumber: 'UK-2024-056', ownerId: 'o1', validUntil: '2025-11-20', status: CertificateStatus.ACTIVE, cabinetSlot: 5 },
];

export const MOCK_SLOTS: CabinetSlot[] = Array.from({ length: 24 }, (_, i) => ({
  id: i + 1,
  status: [0, 2, 3, 4].includes(i) ? 'occupied' : 'empty', 
  certificateId: i === 0 ? 'c1' : i === 2 ? 'c3' : i === 3 ? 'c4' : i === 4 ? 'c5' : undefined
}));

export const MOCK_APPROVALS: ApprovalRequest[] = [
  { id: 'req1', requesterId: 'o2', certificateId: 'c2', type: 'BORROW', reason: '跨省专案侦查需要', timestamp: '2024-05-20 09:30', status: ApprovalStatus.APPROVED },
  { id: 'req2', requesterId: 'o1', certificateId: 'c1', type: 'BORROW', reason: '临时取证', timestamp: '2024-05-21 14:15', status: ApprovalStatus.PENDING },
];

export const MOCK_LOGS: SystemLog[] = [
  { id: 'l1', timestamp: '2024-05-21 14:15:22', action: '提交申请', actor: '张伟 (001234)', details: '申请借用证书 UK-2024-001', level: 'INFO' },
  { id: 'l2', timestamp: '2024-05-20 10:00:05', action: '柜门开启', actor: '李强 (001235)', details: '取走证书 UK-2024-002', level: 'INFO' },
  { id: 'l3', timestamp: '2024-05-19 23:45:11', action: '异常告警', actor: '系统', details: '3号柜门未正常关闭', level: 'WARNING' },
  { id: 'l4', timestamp: '2024-05-18 09:12:00', action: '证书入库', actor: '管理员', details: '新增证书 UK-2024-055', level: 'INFO' },
  { id: 'l5', timestamp: '2024-05-18 09:10:00', action: '登录失败', actor: '未知 IP', details: '尝试访问管理后台失败 (5次)', level: 'CRITICAL' },
];

export const MOCK_TRENDS: TrendData[] = [
  { date: '5/15', borrow: 4, return: 3 },
  { date: '5/16', borrow: 7, return: 5 },
  { date: '5/17', borrow: 5, return: 8 },
  { date: '5/18', borrow: 12, return: 10 },
  { date: '5/19', borrow: 8, return: 6 },
  { date: '5/20', borrow: 15, return: 12 },
  { date: '5/21', borrow: 9, return: 7 },
];

export const MOCK_WORKFLOW: WorkflowStep[] = [
  { id: 1, name: '部门管理员审批', approverRole: Role.DEPT_ADMIN, isEnabled: true, order: 1 },
  { id: 2, name: '系统管理员复核', approverRole: Role.SYS_ADMIN, isEnabled: false, order: 2 },
];