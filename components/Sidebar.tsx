import React from 'react';
import { Shield, Users, Box, FileText, CheckSquare, Activity, Settings, LayoutDashboard, Fingerprint, GitMerge } from 'lucide-react';
import { Role } from '../types';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  userRole: Role;
}

const MenuItem: React.FC<{ 
  icon: React.ReactNode; 
  label: string; 
  id: string; 
  active: boolean; 
  onClick: () => void 
}> = ({ icon, label, id, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center space-x-3 px-6 py-4 transition-all duration-200 border-l-4 ${
      active 
        ? 'bg-blue-900/50 border-blue-500 text-blue-100' 
        : 'border-transparent text-slate-400 hover:bg-slate-800 hover:text-white'
    }`}
  >
    {icon}
    <span className="font-medium tracking-wide">{label}</span>
  </button>
);

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, onNavigate, userRole }) => {
  const isSysAdmin = userRole === Role.SYS_ADMIN;
  const isDeptAdmin = userRole === Role.DEPT_ADMIN || isSysAdmin;

  return (
    <div className="w-64 h-screen bg-slate-900 flex flex-col shadow-2xl z-20 sticky top-0 flex-shrink-0">
      <div className="h-20 flex items-center justify-center border-b border-slate-800 bg-slate-950">
        <div className="flex items-center space-x-2 text-white">
          <Shield className="w-8 h-8 text-blue-500" />
          <div>
            <h1 className="text-lg font-bold leading-none tracking-widest">警用证书</h1>
            <span className="text-xs text-slate-400 tracking-wider">SECURE CERT</span>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-6">
        <div className="mb-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">快捷操作</div>
        <MenuItem 
          id="borrow-return" 
          label="自助取还" 
          icon={<Fingerprint size={20} />} 
          active={currentPage === 'borrow-return'} 
          onClick={() => onNavigate('borrow-return')} 
        />

        <div className="mt-6 mb-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">核心管理</div>
        <MenuItem 
          id="dashboard" 
          label="综合态势" 
          icon={<LayoutDashboard size={20} />} 
          active={currentPage === 'dashboard'} 
          onClick={() => onNavigate('dashboard')} 
        />
        <MenuItem 
          id="certificates" 
          label="证书台账" 
          icon={<FileText size={20} />} 
          active={currentPage === 'certificates'} 
          onClick={() => onNavigate('certificates')} 
        />
        {isSysAdmin && (
          <MenuItem 
            id="cabinets" 
            label="智能柜控" 
            icon={<Box size={20} />} 
            active={currentPage === 'cabinets'} 
            onClick={() => onNavigate('cabinets')} 
          />
        )}
        
        {isDeptAdmin && (
          <>
            <div className="mt-8 mb-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">人员与审批</div>
            <MenuItem 
              id="officers" 
              label="警员与权限" 
              icon={<Users size={20} />} 
              active={currentPage === 'officers'} 
              onClick={() => onNavigate('officers')} 
            />
            <MenuItem 
              id="approvals" 
              label="审批中心" 
              icon={<CheckSquare size={20} />} 
              active={currentPage === 'approvals'} 
              onClick={() => onNavigate('approvals')} 
            />
             <MenuItem 
              id="workflow" 
              label="流程定制" 
              icon={<GitMerge size={20} />} 
              active={currentPage === 'workflow'} 
              onClick={() => onNavigate('workflow')} 
            />
          </>
        )}

        {isSysAdmin && (
          <>
            <div className="mt-8 mb-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">系统运维</div>
            <MenuItem 
              id="audit" 
              label="AI 安全审计" 
              icon={<Activity size={20} />} 
              active={currentPage === 'audit'} 
              onClick={() => onNavigate('audit')} 
            />
            <MenuItem 
              id="settings" 
              label="系统设置" 
              icon={<Settings size={20} />} 
              active={currentPage === 'settings'} 
              onClick={() => onNavigate('settings')} 
            />
          </>
        )}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center space-x-3 text-slate-400 text-sm">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span>系统在线 | 局域网模式</span>
        </div>
      </div>
    </div>
  );
};