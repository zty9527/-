import React, { useState } from 'react';
import { Certificate, Officer, CertificateStatus } from '../types';
import { Search, Plus, Filter, MoreHorizontal, ShieldAlert, ShieldCheck, Download } from 'lucide-react';

interface CertificateManagerProps {
  certificates: Certificate[];
  officers: Officer[];
}

export const CertificateManager: React.FC<CertificateManagerProps> = ({ certificates, officers }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const getOwnerName = (id: string) => officers.find(o => o.id === id)?.name || '未知';
  const getOwnerBadge = (id: string) => officers.find(o => o.id === id)?.badgeNumber || '---';

  const filteredCerts = certificates.filter(c => 
    c.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) || 
    getOwnerName(c.ownerId).includes(searchTerm)
  );

  const getStatusBadge = (status: CertificateStatus) => {
    switch (status) {
      case CertificateStatus.ACTIVE:
        return <span className="px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 flex items-center w-fit gap-1"><ShieldCheck size={12}/> 正常</span>;
      case CertificateStatus.BORROWED:
        return <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 flex items-center w-fit gap-1">已借出</span>;
      case CertificateStatus.EXPIRED:
        return <span className="px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700 flex items-center w-fit gap-1">已过期</span>;
      default:
        return <span className="px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 flex items-center w-fit gap-1"><ShieldAlert size={12}/> {status}</span>;
    }
  };

  const handleExport = () => {
    // Determine CSV content
    const headers = ['证书编号', '持有人', '警号', '有效期至', '状态', '所在柜号', '借出时间'];
    const rows = filteredCerts.map(c => [
      c.serialNumber,
      getOwnerName(c.ownerId),
      getOwnerBadge(c.ownerId),
      c.validUntil,
      c.status,
      c.cabinetSlot || '不在柜',
      c.borrowTime || '-'
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `证书台账报表_${new Date().toLocaleDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-800">证书台账管理</h2>
        <div className="flex gap-2">
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 bg-white text-slate-700 border border-slate-300 px-4 py-2 rounded-lg hover:bg-slate-50 transition shadow-sm"
          >
            <Download size={18} /> 导出报表
          </button>
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-lg shadow-blue-600/20">
            <Plus size={18} /> 新增证书
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Search Bar */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex gap-2">
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="搜索证书编号、持有人姓名..." 
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 bg-white text-slate-600 border border-slate-300 px-4 py-2 rounded-lg hover:bg-slate-50 transition">
            <Filter size={18} /> 筛选
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">证书编号</th>
                <th className="px-6 py-4 font-semibold">持有人</th>
                <th className="px-6 py-4 font-semibold">警号</th>
                <th className="px-6 py-4 font-semibold">有效期至</th>
                <th className="px-6 py-4 font-semibold">所在柜号</th>
                <th className="px-6 py-4 font-semibold">状态</th>
                <th className="px-6 py-4 font-semibold text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCerts.map((cert) => (
                <tr key={cert.id} className="hover:bg-slate-50/50 transition">
                  <td className="px-6 py-4 font-medium text-slate-700">{cert.serialNumber}</td>
                  <td className="px-6 py-4 text-slate-600">{getOwnerName(cert.ownerId)}</td>
                  <td className="px-6 py-4 text-slate-500 font-mono text-xs">{getOwnerBadge(cert.ownerId)}</td>
                  <td className="px-6 py-4 text-slate-600">{cert.validUntil}</td>
                  <td className="px-6 py-4 text-slate-600">
                    {cert.cabinetSlot ? (
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded bg-slate-100 font-bold text-slate-700 border border-slate-200">
                        {cert.cabinetSlot}
                      </span>
                    ) : (
                      <span className="text-slate-400 text-sm italic">不在柜</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(cert.status)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-slate-400 hover:text-blue-600 transition p-1">
                      <MoreHorizontal size={20} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredCerts.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                    未找到相关证书记录
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};