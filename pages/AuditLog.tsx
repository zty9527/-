import React, { useState } from 'react';
import { SystemLog } from '../types';
import { generateSecurityAudit } from '../services/geminiService';
import { Activity, Shield, Cpu, RefreshCw, FileText } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface AuditLogProps {
  logs: SystemLog[];
}

export const AuditLog: React.FC<AuditLogProps> = ({ logs }) => {
  const [report, setReport] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerateReport = async () => {
    setLoading(true);
    setReport(null);
    try {
      const result = await generateSecurityAudit(logs.slice(0, 20)); // Send recent logs
      setReport(result);
    } catch (e) {
      setReport("生成报告失败，请检查网络设置。");
    } finally {
      setLoading(false);
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'CRITICAL': return 'text-rose-600 bg-rose-50 border-rose-200';
      case 'WARNING': return 'text-amber-600 bg-amber-50 border-amber-200';
      default: return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-140px)]">
      {/* Logs Column */}
      <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <Activity size={18} className="text-blue-600" />
            系统运行日志
          </h3>
          <span className="text-xs text-slate-500 bg-slate-200 px-2 py-1 rounded">共 {logs.length} 条记录</span>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {logs.map(log => (
            <div key={log.id} className="flex gap-4 p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition">
              <div className="text-xs font-mono text-slate-400 w-32 flex-shrink-0 pt-1">{log.timestamp}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                   <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${getLevelColor(log.level)}`}>{log.level}</span>
                   <span className="font-medium text-slate-700 text-sm">{log.action}</span>
                </div>
                <p className="text-sm text-slate-600">{log.details}</p>
                <p className="text-xs text-slate-400 mt-1">操作人: {log.actor}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Analysis Column */}
      <div className="bg-slate-900 rounded-xl shadow-lg border border-slate-800 flex flex-col overflow-hidden relative">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Cpu size={120} className="text-blue-400" />
        </div>
        
        <div className="p-6 border-b border-slate-800 bg-slate-950 z-10">
          <h3 className="font-bold text-white flex items-center gap-2 text-lg">
            <Shield size={20} className="text-blue-500" />
            AI 安全审计助手
          </h3>
          <p className="text-slate-400 text-xs mt-2">
            基于 Google Gemini 模型，对系统日志进行智能分析，识别潜在的安全风险与违规操作。
          </p>
        </div>

        <div className="flex-1 p-6 overflow-y-auto z-10">
          {!report && !loading && (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-4">
              <FileText size={48} className="opacity-50" />
              <p className="text-center text-sm">暂无审计报告<br/>点击下方按钮开始分析</p>
            </div>
          )}

          {loading && (
            <div className="h-full flex flex-col items-center justify-center text-blue-400 space-y-4">
              <RefreshCw size={32} className="animate-spin" />
              <p className="text-sm animate-pulse">正在连接安全大脑进行分析...</p>
            </div>
          )}

          {report && (
            <div className="prose prose-invert prose-sm max-w-none">
              <ReactMarkdown>{report}</ReactMarkdown>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-800 bg-slate-950 z-10">
          <button 
            onClick={handleGenerateReport}
            disabled={loading}
            className={`w-full py-3 rounded-lg font-bold text-sm tracking-wide transition flex items-center justify-center gap-2
              ${loading ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-900/50'}
            `}
          >
            {loading ? '分析中...' : '生成本次审计报告'}
          </button>
        </div>
      </div>
    </div>
  );
};