import React, { useState } from 'react';
import { Officer, Role, Rank } from '../types';
import { Shield, Edit2, Save, X, Search, UserPlus } from 'lucide-react';

interface OfficerManagerProps {
  officers: Officer[];
  onUpdateRole: (id: string, newRole: Role) => void;
}

export const OfficerManager: React.FC<OfficerManagerProps> = ({ officers, onUpdateRole }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempRole, setTempRole] = useState<Role | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOfficers = officers.filter(o => 
    o.name.includes(searchTerm) || o.badgeNumber.includes(searchTerm) || o.department.includes(searchTerm)
  );

  const startEdit = (officer: Officer) => {
    setEditingId(officer.id);
    setTempRole(officer.role);
  };

  const saveEdit = (id: string) => {
    if (tempRole) {
      onUpdateRole(id, tempRole);
    }
    setEditingId(null);
    setTempRole(null);
  };

  const getRoleBadge = (role: Role) => {
    switch (role) {
      case Role.SYS_ADMIN:
        return <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-bold border border-purple-200">系统管理员</span>;
      case Role.DEPT_ADMIN:
        return <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold border border-blue-200">部门管理员</span>;
      default:
        return <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-medium border border-slate-200">普通警员</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">警员与权限管理</h2>
          <p className="text-slate-500 mt-1">管理系统用户角色、权限分配及基础信息</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-lg shadow-blue-600/20">
          <UserPlus size={18} /> 新增人员
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex gap-4">
           <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="搜索姓名、警号或部门..." 
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">姓名 / 警号</th>
                <th className="px-6 py-4 font-semibold">部门</th>
                <th className="px-6 py-4 font-semibold">职级</th>
                <th className="px-6 py-4 font-semibold">联系电话</th>
                <th className="px-6 py-4 font-semibold">系统角色 (权限)</th>
                <th className="px-6 py-4 font-semibold text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOfficers.map((officer) => (
                <tr key={officer.id} className="hover:bg-slate-50/50 transition">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-700">{officer.name}</div>
                    <div className="text-xs text-slate-400 font-mono">{officer.badgeNumber}</div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{officer.department}</td>
                  <td className="px-6 py-4 text-slate-600 text-sm">{officer.rank}</td>
                  <td className="px-6 py-4 text-slate-500 text-sm">{officer.phone}</td>
                  <td className="px-6 py-4">
                    {editingId === officer.id ? (
                      <select 
                        className="px-2 py-1 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        value={tempRole || officer.role}
                        onChange={(e) => setTempRole(e.target.value as Role)}
                      >
                        <option value={Role.USER}>{Role.USER}</option>
                        <option value={Role.DEPT_ADMIN}>{Role.DEPT_ADMIN}</option>
                        <option value={Role.SYS_ADMIN}>{Role.SYS_ADMIN}</option>
                      </select>
                    ) : (
                      getRoleBadge(officer.role)
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {editingId === officer.id ? (
                      <div className="flex justify-end gap-2">
                         <button onClick={() => saveEdit(officer.id)} className="text-emerald-600 hover:bg-emerald-50 p-1 rounded"><Save size={18} /></button>
                         <button onClick={() => setEditingId(null)} className="text-rose-500 hover:bg-rose-50 p-1 rounded"><X size={18} /></button>
                      </div>
                    ) : (
                      <button onClick={() => startEdit(officer)} className="text-slate-400 hover:text-blue-600 transition p-1">
                        <Edit2 size={18} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg flex items-start gap-3">
        <Shield className="text-blue-600 flex-shrink-0 mt-1" size={20} />
        <div className="text-sm text-blue-800">
          <p className="font-bold mb-1">权限说明:</p>
          <ul className="list-disc list-inside space-y-1 opacity-80">
            <li><strong>普通警员:</strong> 仅可查看本人证书，使用自助借还功能。</li>
            <li><strong>部门管理员:</strong> 可查看本部门人员及证书，审批本部门借用申请。</li>
            <li><strong>系统管理员:</strong> 拥有全系统最高权限，包括日志审计、设备管理及全局配置。</li>
          </ul>
        </div>
      </div>
    </div>
  );
};