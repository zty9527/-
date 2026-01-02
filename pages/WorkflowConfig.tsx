import React, { useState } from 'react';
import { WorkflowStep, Role } from '../types';
import { GitMerge, Plus, Trash2, ArrowDown, Save, AlertCircle } from 'lucide-react';
import { MOCK_WORKFLOW } from '../services/mockData';

export const WorkflowConfig: React.FC = () => {
  const [steps, setSteps] = useState<WorkflowStep[]>(MOCK_WORKFLOW);
  const [saved, setSaved] = useState(false);

  const handleAddStep = () => {
    const newStep: WorkflowStep = {
      id: Date.now(),
      name: '新审批环节',
      approverRole: Role.DEPT_ADMIN,
      isEnabled: true,
      order: steps.length + 1
    };
    setSteps([...steps, newStep]);
  };

  const handleRemoveStep = (id: number) => {
    setSteps(steps.filter(s => s.id !== id).map((s, idx) => ({...s, order: idx + 1})));
  };

  const handleUpdateStep = (id: number, field: keyof WorkflowStep, value: any) => {
    setSteps(steps.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">审批流程定制</h2>
          <p className="text-slate-500 mt-1">配置证书借用的默认审批流转路径</p>
        </div>
        <button 
          onClick={handleSave}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition shadow-lg shadow-blue-600/20"
        >
          {saved ? '已保存' : <><Save size={18} /> 保存配置</>}
        </button>
      </div>

      <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg flex items-start gap-3">
        <AlertCircle className="text-blue-600 flex-shrink-0 mt-1" size={20} />
        <div className="text-sm text-blue-800">
           任何证书借用申请（非本人证书）在提交后，将依次经过以下环节。如果某个环节的审批人驳回，流程将直接终止。
        </div>
      </div>

      <div className="relative space-y-4 pb-20">
         {/* Vertical Line */}
         {steps.length > 1 && (
           <div className="absolute left-8 top-8 bottom-8 w-1 bg-slate-200 -z-10"></div>
         )}

         {steps.map((step, index) => (
           <div key={step.id} className="relative group">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-6 z-10">
                <div className="w-16 h-16 rounded-full bg-slate-100 border-2 border-slate-200 flex items-center justify-center font-bold text-slate-500 text-xl shadow-inner">
                  {index + 1}
                </div>
                
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase">环节名称</label>
                    <input 
                      type="text" 
                      value={step.name}
                      onChange={(e) => handleUpdateStep(step.id, 'name', e.target.value)}
                      className="w-full mt-1 p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase">审批人角色</label>
                    <select 
                      value={step.approverRole}
                      onChange={(e) => handleUpdateStep(step.id, 'approverRole', e.target.value)}
                      className="w-full mt-1 p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                    >
                      <option value={Role.DEPT_ADMIN}>{Role.DEPT_ADMIN}</option>
                      <option value={Role.SYS_ADMIN}>{Role.SYS_ADMIN}</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-4 pl-6 border-l border-slate-100">
                  <div className="flex items-center gap-2">
                     <span className="text-sm text-slate-600">启用</span>
                     <button 
                        onClick={() => handleUpdateStep(step.id, 'isEnabled', !step.isEnabled)}
                        className={`w-10 h-6 rounded-full transition-colors flex items-center p-1 ${step.isEnabled ? 'bg-blue-600 justify-end' : 'bg-slate-300 justify-start'}`}
                     >
                       <span className="w-4 h-4 bg-white rounded-full shadow-sm"></span>
                     </button>
                  </div>
                  <button 
                    onClick={() => handleRemoveStep(step.id)}
                    className="text-slate-400 hover:text-rose-500 p-2 rounded hover:bg-rose-50 transition"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
              
              {/* Arrow */}
              {index < steps.length - 1 && (
                <div className="flex justify-center py-2">
                   <ArrowDown className="text-slate-300" />
                </div>
              )}
           </div>
         ))}

         <button 
            onClick={handleAddStep}
            className="w-full py-4 border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center gap-2 text-slate-500 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition"
         >
            <Plus size={20} /> 添加审批环节
         </button>
      </div>
    </div>
  );
};