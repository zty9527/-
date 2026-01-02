import React from 'react';
import { CabinetSlot } from '../types';
import { Lock, Unlock, AlertOctagon } from 'lucide-react';

interface CabinetViewProps {
  slots: CabinetSlot[];
}

export const CabinetView: React.FC<CabinetViewProps> = ({ slots }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">智能柜控管理</h2>
          <p className="text-slate-500 mt-1">主柜状态: 在线 | 温度: 24°C | 湿度: 45%</p>
        </div>
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-emerald-500"></div>
            <span>在位</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-slate-200 border border-slate-300"></div>
            <span>空闲</span>
          </div>
           <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-rose-500"></div>
            <span>异常/占用</span>
          </div>
        </div>
      </div>

      <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl border-4 border-slate-700 relative overflow-hidden">
        {/* Decorative elements for "Tech" feel */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500 opacity-50"></div>
        
        <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-4">
          {slots.map((slot) => {
            const isOccupied = slot.status === 'occupied';
            const isError = slot.status === 'error';

            return (
              <div 
                key={slot.id} 
                className={`
                  relative aspect-square rounded-lg flex flex-col items-center justify-center border-2 transition-all cursor-pointer group
                  ${isOccupied 
                    ? 'bg-emerald-900/30 border-emerald-500/50 hover:bg-emerald-900/50 hover:shadow-[0_0_15px_rgba(16,185,129,0.3)]' 
                    : isError 
                      ? 'bg-rose-900/30 border-rose-500/50 hover:bg-rose-900/50' 
                      : 'bg-slate-700/50 border-slate-600 hover:border-blue-400 hover:bg-slate-700'}
                `}
              >
                <span className={`absolute top-2 left-2 text-xs font-mono ${isOccupied ? 'text-emerald-400' : 'text-slate-400'}`}>
                  {String(slot.id).padStart(2, '0')}
                </span>

                <div className={`
                  p-3 rounded-full mb-1 transition-transform group-hover:scale-110
                  ${isOccupied ? 'bg-emerald-500 text-emerald-950 shadow-lg shadow-emerald-500/50' : isError ? 'bg-rose-500 text-white' : 'bg-slate-600 text-slate-400'}
                `}>
                  {isOccupied ? <Lock size={20} /> : isError ? <AlertOctagon size={20} /> : <Unlock size={20} />}
                </div>

                <span className="text-xs text-slate-300 font-medium mt-1">
                  {isOccupied ? '在位' : isError ? '异常' : '空闲'}
                </span>
                
                {isOccupied && slot.certificateId && (
                  <div className="absolute bottom-2 text-[10px] text-emerald-300/80">
                     ID: {slot.certificateId}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-8 flex justify-center">
            <button className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-full shadow-lg shadow-blue-600/30 font-bold tracking-wide transition transform active:scale-95">
                一键盘库
            </button>
        </div>
      </div>
    </div>
  );
};