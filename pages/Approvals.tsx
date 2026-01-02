import React from 'react';
import { ApprovalRequest, ApprovalStatus } from '../types';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

interface ApprovalsProps {
  requests: ApprovalRequest[];
}

export const Approvals: React.FC<ApprovalsProps> = ({ requests }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">审批流转中心</h2>
      
      <div className="grid gap-4">
        {requests.map((req) => (
          <div key={req.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-full mt-1 
                ${req.status === ApprovalStatus.PENDING ? 'bg-amber-100 text-amber-600' : 
                  req.status === ApprovalStatus.APPROVED ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                {req.status === ApprovalStatus.PENDING ? <Clock size={24} /> : 
                 req.status === ApprovalStatus.APPROVED ? <CheckCircle size={24} /> : <XCircle size={24} />}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-slate-800 text-lg">申请{req.type === 'BORROW' ? '借用' : '归还'}证书</span>
                  <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded border border-slate-200 font-mono">{req.certificateId}</span>
                </div>
                <p className="text-slate-600 mb-1">申请人ID: <span className="font-medium text-slate-900">{req.requesterId}</span></p>
                <p className="text-slate-500 text-sm">事由: {req.reason}</p>
                <p className="text-xs text-slate-400 mt-2">{req.timestamp}</p>
              </div>
            </div>

            {req.status === ApprovalStatus.PENDING && (
              <div className="flex gap-3 w-full sm:w-auto">
                <button className="flex-1 sm:flex-none px-6 py-2 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 font-medium transition">
                  驳回
                </button>
                <button className="flex-1 sm:flex-none px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-600/20 font-medium transition">
                  批准
                </button>
              </div>
            )}
             {req.status !== ApprovalStatus.PENDING && (
                <div className="px-4 py-2 bg-slate-50 rounded text-slate-400 text-sm font-medium">
                  已归档
                </div>
             )}
          </div>
        ))}
      </div>
    </div>
  );
};