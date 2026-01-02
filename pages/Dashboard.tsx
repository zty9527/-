import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Certificate, ApprovalRequest, Officer, CertificateStatus, TrendData } from '../types';
import { FileText, Users, AlertTriangle, Clock, TrendingUp, Radar, Send } from 'lucide-react';

interface DashboardProps {
  certificates: Certificate[];
  approvals: ApprovalRequest[];
  officers: Officer[];
  trends: TrendData[];
}

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; color: string; subText?: string }> = ({ title, value, icon, color, subText }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center space-x-4">
    <div className={`p-4 rounded-lg ${color} text-white shadow-md`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-slate-500 font-medium">{title}</p>
      <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
      {subText && <p className="text-xs text-slate-400 mt-1">{subText}</p>}
    </div>
  </div>
);

export const Dashboard: React.FC<DashboardProps> = ({ certificates, approvals, officers, trends }) => {
  const [checking, setChecking] = useState(false);
  const [alertMsg, setAlertMsg] = useState<string | null>(null);

  // Metrics
  const totalCerts = certificates.length;
  const pendingApprovals = approvals.filter(a => a.status === '待审批').length;
  const expiredCerts = certificates.filter(c => c.status === CertificateStatus.EXPIRED).length;
  const borrowedCerts = certificates.filter(c => c.status === CertificateStatus.BORROWED).length;

  // Chart Data: Department Distribution
  const deptMap = new Map<string, number>();
  officers.forEach(o => {
      const count = certificates.filter(c => c.ownerId === o.id).length;
      deptMap.set(o.department, (deptMap.get(o.department) || 0) + count);
  });
  const deptData = Array.from(deptMap).map(([name, value]) => ({ name, value }));

  const PIE_COLORS = ['#0f172a', '#1e40af', '#3b82f6', '#60a5fa', '#94a3b8'];

  // 模拟8小时逾期检测
  const handleOverdueCheck = () => {
    setChecking(true);
    setAlertMsg(null);
    setTimeout(() => {
      // 模拟查找
      const overdueItems = certificates.filter(c => {
         if (c.status !== CertificateStatus.BORROWED || !c.borrowTime) return false;
         const borrowDate = new Date(c.borrowTime);
         const now = new Date();
         const diffHours = (now.getTime() - borrowDate.getTime()) / (1000 * 60 * 60);
         return diffHours > 8; // 8小时阈值
      });

      setChecking(false);
      if (overdueItems.length > 0) {
        setAlertMsg(`检测到 ${overdueItems.length} 个证书未在8小时内归还。系统已自动通过短信网关向持有人和管理员发送预警。`);
      } else {
        setAlertMsg("系统巡检完成：暂无逾期未还证书。");
      }
    }, 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-end border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <TrendingUp className="text-blue-600"/> 综合态势感知
          </h2>
          <p className="text-slate-500 mt-1">全局数字证书运行状态与安全监控</p>
        </div>
        <div className="flex items-center gap-4">
             <button 
               onClick={handleOverdueCheck}
               disabled={checking}
               className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition
                 ${checking ? 'bg-slate-100 text-slate-400' : 'bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200'}
               `}
             >
               {checking ? <Radar className="animate-spin" size={16} /> : <Radar size={16} />}
               {checking ? '全网巡检中...' : '立即执行逾期巡检'}
             </button>
             <div className="text-sm text-slate-400 bg-slate-100 px-3 py-1 rounded-full">数据更新: 实时</div>
        </div>
      </div>

      {/* Alert Banner */}
      {alertMsg && (
        <div className={`p-4 rounded-lg flex items-center gap-3 border ${alertMsg.includes("暂无") ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-amber-50 border-amber-200 text-amber-700'}`}>
           {alertMsg.includes("暂无") ? <Clock size={20}/> : <Send size={20}/>}
           <span className="font-medium">{alertMsg}</span>
        </div>
      )}

      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="证书总数" 
          value={totalCerts} 
          icon={<FileText size={24} />} 
          color="bg-slate-800"
          subText="在册数字证书总量" 
        />
        <StatCard 
          title="待审批申请" 
          value={pendingApprovals} 
          icon={<Clock size={24} />} 
          color="bg-amber-500"
          subText="需及时处理"
        />
        <StatCard 
          title="已过期证书" 
          value={expiredCerts} 
          icon={<AlertTriangle size={24} />} 
          color="bg-rose-600"
          subText="建议尽快回收或销毁"
        />
         <StatCard 
          title="当前借出" 
          value={borrowedCerts} 
          icon={<Users size={24} />} 
          color="bg-blue-600"
          subText="在外使用中"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-96">
        {/* Line Chart: Trends */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col">
          <h3 className="text-lg font-bold text-slate-800 mb-6 border-l-4 border-blue-600 pl-3">近期证书取用/归还趋势</h3>
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trends} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="date" tick={{fill: '#64748b'}} axisLine={false} tickLine={false} />
                <YAxis tick={{fill: '#64748b'}} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Line type="monotone" dataKey="borrow" name="取用" stroke="#3b82f6" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
                <Line type="monotone" dataKey="return" name="归还" stroke="#10b981" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart: Departments */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col">
          <h3 className="text-lg font-bold text-slate-800 mb-6 border-l-4 border-indigo-600 pl-3">各部门证书持有占比</h3>
          <div className="flex-1 w-full min-h-0 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={deptData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {deptData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Text */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
              <span className="text-3xl font-bold text-slate-800">{totalCerts}</span>
              <p className="text-xs text-slate-400">Total</p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-2 text-xs text-slate-600">
             {deptData.map((entry, index) => (
               <div key={index} className="flex items-center">
                 <div className="w-2 h-2 rounded-full mr-1" style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}></div>
                 {entry.name}
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};