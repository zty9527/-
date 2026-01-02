import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { CertificateManager } from './pages/CertificateManager';
import { CabinetView } from './pages/CabinetView';
import { AuditLog } from './pages/AuditLog';
import { Approvals } from './pages/Approvals';
import { BorrowReturn } from './pages/BorrowReturn';
import { OfficerManager } from './pages/OfficerManager';
import { SystemSettings } from './pages/SystemSettings';
import { WorkflowConfig } from './pages/WorkflowConfig'; // Import new page
import { MOCK_CERTIFICATES, MOCK_OFFICERS, MOCK_SLOTS, MOCK_APPROVALS, MOCK_LOGS, MOCK_TRENDS } from './services/mockData';
import { Bell, User, LogOut } from 'lucide-react';
import { Role, CertificateStatus, Officer } from './types';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  
  // Simulated Auth State
  const [currentUser, setCurrentUser] = useState<Officer>(MOCK_OFFICERS.find(o => o.role === Role.SYS_ADMIN) || MOCK_OFFICERS[3]);
  
  // App State
  const [certificates, setCertificates] = useState(MOCK_CERTIFICATES);
  const [officers, setOfficers] = useState(MOCK_OFFICERS);
  const [logs, setLogs] = useState(MOCK_LOGS);
  const [slots, setSlots] = useState(MOCK_SLOTS);

  const addLog = (action: string, details: string) => {
    const newLog = {
      id: `l${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      action,
      actor: `${currentUser.name} (${currentUser.badgeNumber})`,
      details,
      level: 'INFO' as const
    };
    setLogs([newLog, ...logs]);
  };

  const handleBorrow = (certId: string, reason: string) => {
    setCertificates(prev => prev.map(c => 
      c.id === certId ? { 
          ...c, 
          status: CertificateStatus.BORROWED, 
          cabinetSlot: undefined, 
          borrowTime: new Date().toISOString() // Record borrow time
      } : c
    ));
    setSlots(prev => prev.map(s => 
      s.certificateId === certId ? { ...s, status: 'empty', certificateId: undefined } : s
    ));
    addLog('证书借用', `借出证书 ${certId}, 原因: ${reason}`);
  };

  const handleReturn = (certId: string, slotId: number) => {
    setCertificates(prev => prev.map(c => 
      c.id === certId ? { 
          ...c, 
          status: CertificateStatus.ACTIVE, 
          cabinetSlot: slotId,
          borrowTime: undefined // Clear borrow time
      } : c
    ));
    setSlots(prev => prev.map(s => 
      s.id === slotId ? { ...s, status: 'occupied', certificateId: certId } : s
    ));
    addLog('证书归还', `归还证书 ${certId} 至 ${slotId}号柜`);
  };

  const handleRoleUpdate = (id: string, newRole: Role) => {
     setOfficers(prev => prev.map(o => o.id === id ? { ...o, role: newRole } : o));
     addLog('权限变更', `修改用户 ${id} 权限为 ${newRole}`);
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard certificates={certificates} approvals={MOCK_APPROVALS} officers={officers} trends={MOCK_TRENDS} />;
      case 'certificates':
        return <CertificateManager certificates={certificates} officers={officers} />;
      case 'cabinets':
         // Only SysAdmin access
        if (currentUser.role !== Role.SYS_ADMIN) return <div className="p-8 text-center text-slate-400">无权访问此模块</div>;
        return <CabinetView slots={slots} />;
      case 'audit':
         if (currentUser.role !== Role.SYS_ADMIN) return <div className="p-8 text-center text-slate-400">无权访问此模块</div>;
        return <AuditLog logs={logs} />;
      case 'approvals':
        return <Approvals requests={MOCK_APPROVALS} />;
      case 'borrow-return':
        return <BorrowReturn certificates={certificates} slots={slots} onBorrow={handleBorrow} onReturn={handleReturn} />;
      case 'officers':
        return <OfficerManager officers={officers} onUpdateRole={handleRoleUpdate} />;
      case 'settings':
        if (currentUser.role !== Role.SYS_ADMIN) return <div className="p-8 text-center text-slate-400">无权访问此模块</div>;
        return <SystemSettings />;
      case 'workflow':
        return <WorkflowConfig />;
      default:
        return <Dashboard certificates={certificates} approvals={MOCK_APPROVALS} officers={officers} trends={MOCK_TRENDS} />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} userRole={currentUser.role} />
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm z-10">
          <div className="flex items-center text-slate-400 text-sm">
             <span className="mr-2">当前位置:</span>
             <span className="font-semibold text-slate-700 capitalize">{currentPage}</span>
          </div>

          <div className="flex items-center space-x-6">
            {/* Role Switcher for Demo */}
            <div className="flex items-center gap-2 mr-4 bg-slate-100 p-1 rounded-lg border border-slate-200">
               <span className="text-xs text-slate-500 px-2">模拟登录:</span>
               <select 
                 className="bg-white text-xs border border-slate-300 rounded px-2 py-1 outline-none"
                 value={currentUser.id}
                 onChange={(e) => {
                   const user = officers.find(o => o.id === e.target.value);
                   if (user) {
                     setCurrentUser(user);
                     setCurrentPage('dashboard'); // Reset to dashboard on switch
                   }
                 }}
               >
                 {officers.map(o => (
                   <option key={o.id} value={o.id}>{o.name} - {o.role}</option>
                 ))}
               </select>
            </div>

            <button className="relative p-2 text-slate-400 hover:text-blue-600 transition">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full border border-white"></span>
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
              <div className={`w-8 h-8 rounded-full text-white flex items-center justify-center font-bold text-xs ${
                currentUser.role === Role.SYS_ADMIN ? 'bg-purple-600' : currentUser.role === Role.DEPT_ADMIN ? 'bg-blue-600' : 'bg-slate-500'
              }`}>
                {currentUser.name[0]}
              </div>
              <div className="text-sm">
                <p className="font-semibold text-slate-700">{currentUser.name}</p>
                <p className="text-xs text-slate-400">{currentUser.role}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-8 relative">
           {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;