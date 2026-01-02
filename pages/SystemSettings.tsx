import React, { useState } from 'react';
import { Save, Server, MessageSquare, Wifi, RefreshCw, CheckCircle, AlertCircle, Globe } from 'lucide-react';

export const SystemSettings: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  // SMS State
  const [smsConfig, setSmsConfig] = useState({
    enabled: true,
    provider: 'JingWuTong_SMS_Gateway_V2',
    endpoint: 'http://10.X.X.X:8080/sms/send',
    apiKey: '************************',
    signName: '【警务通】',
    testPhone: '13800138000'
  });

  // Network State
  const [netConfig, setNetConfig] = useState({
    ip: '192.168.1.100',
    mask: '255.255.255.0',
    gateway: '192.168.1.1',
    dns: '114.114.114.114',
    mac: '00:1A:2B:3C:4D:5E',
    offlineMode: true
  });

  const handleSave = (section: string) => {
    setLoading(true);
    setSaveSuccess(null);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSaveSuccess(section);
      setTimeout(() => setSaveSuccess(null), 3000);
    }, 1500);
  };

  const handleTestSMS = () => {
    alert(`正在向 ${smsConfig.testPhone} 发送测试短信...\n\n模拟发送成功：网关响应 200 OK`);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">系统设置</h2>
          <p className="text-slate-500 mt-1">配置短信网关、网络连接及系统全局参数</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        
        {/* SMS Gateway Configuration */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 text-lg">
              <MessageSquare className="text-blue-600" size={24} />
              短信网关接口配置
            </h3>
            <div className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${smsConfig.enabled ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
              <span className="text-sm text-slate-600">{smsConfig.enabled ? '服务运行中' : '服务已停用'}</span>
            </div>
          </div>
          
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
             <div className="space-y-2">
               <label className="text-sm font-semibold text-slate-700">网关服务商 / 协议</label>
               <select 
                 className="w-full p-3 rounded-lg border border-slate-300 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                 value={smsConfig.provider}
                 onChange={e => setSmsConfig({...smsConfig, provider: e.target.value})}
               >
                 <option>JingWuTong_SMS_Gateway_V2</option>
                 <option>CMPP 2.0 (中国移动直连)</option>
                 <option>SGIP 1.2 (中国联通直连)</option>
                 <option>HTTP_JSON_Generic</option>
               </select>
             </div>

             <div className="space-y-2">
               <label className="text-sm font-semibold text-slate-700">API 接口地址</label>
               <div className="flex items-center relative">
                 <Globe className="absolute left-3 text-slate-400" size={18} />
                 <input 
                   type="text" 
                   value={smsConfig.endpoint}
                   onChange={e => setSmsConfig({...smsConfig, endpoint: e.target.value})}
                   className="w-full pl-10 p-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                 />
               </div>
             </div>

             <div className="space-y-2">
               <label className="text-sm font-semibold text-slate-700">API Key / Secret</label>
               <input 
                 type="password" 
                 value={smsConfig.apiKey}
                 onChange={e => setSmsConfig({...smsConfig, apiKey: e.target.value})}
                 className="w-full p-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
               />
             </div>

             <div className="space-y-2">
               <label className="text-sm font-semibold text-slate-700">短信签名</label>
               <input 
                 type="text" 
                 value={smsConfig.signName}
                 onChange={e => setSmsConfig({...smsConfig, signName: e.target.value})}
                 className="w-full p-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
               />
             </div>
             
             <div className="col-span-1 md:col-span-2 border-t border-slate-100 pt-6 mt-2 flex items-center justify-between">
               <div className="flex items-center gap-4 w-full max-w-md">
                 <input 
                    type="text" 
                    value={smsConfig.testPhone}
                    onChange={e => setSmsConfig({...smsConfig, testPhone: e.target.value})}
                    placeholder="输入手机号进行测试"
                    className="flex-1 p-2 rounded border border-slate-300 text-sm"
                 />
                 <button 
                   onClick={handleTestSMS}
                   className="px-4 py-2 bg-slate-100 text-slate-600 rounded hover:bg-slate-200 border border-slate-300 text-sm font-medium transition"
                 >
                   发送测试短信
                 </button>
               </div>
               
               <button 
                 onClick={() => handleSave('sms')}
                 className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-600/20 font-medium transition"
               >
                 {loading && saveSuccess !== 'sms' ? <RefreshCw className="animate-spin" size={18} /> : <Save size={18} />}
                 保存配置
               </button>
             </div>
          </div>
        </div>

        {/* Network Configuration */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 text-lg">
              <Server className="text-indigo-600" size={24} />
              网络与服务器配置
            </h3>
            <div className="flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100">
              <Wifi size={14} />
              <span className="text-xs font-bold">局域网模式 (Offline)</span>
            </div>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
               <div className="space-y-2">
                 <label className="text-sm font-semibold text-slate-700">服务器 IP 地址</label>
                 <input 
                   type="text" 
                   value={netConfig.ip}
                   onChange={e => setNetConfig({...netConfig, ip: e.target.value})}
                   className="w-full p-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                 />
               </div>
               <div className="space-y-2">
                 <label className="text-sm font-semibold text-slate-700">子网掩码</label>
                 <input 
                   type="text" 
                   value={netConfig.mask}
                   onChange={e => setNetConfig({...netConfig, mask: e.target.value})}
                   className="w-full p-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                 />
               </div>
               <div className="space-y-2">
                 <label className="text-sm font-semibold text-slate-700">默认网关</label>
                 <input 
                   type="text" 
                   value={netConfig.gateway}
                   onChange={e => setNetConfig({...netConfig, gateway: e.target.value})}
                   className="w-full p-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                 />
               </div>
            </div>
            
            <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6">
               <div className="flex items-start gap-4">
                  <AlertCircle className="text-amber-500 mt-1" size={24} />
                  <div>
                    <h4 className="font-bold text-slate-800">网络模式设置</h4>
                    <p className="text-sm text-slate-500 mt-1 max-w-lg">
                      当前系统运行在<b>公安内网离线模式</b>。开启互联网连接可能导致安全合规风险，请在开启前确保已通过安全网闸配置白名单。
                    </p>
                  </div>
               </div>
               
               <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-slate-600">离线模式</span>
                  <button 
                    onClick={() => setNetConfig({...netConfig, offlineMode: !netConfig.offlineMode})}
                    className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none ${netConfig.offlineMode ? 'bg-indigo-600' : 'bg-slate-300'}`}
                  >
                    <span 
                      className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${netConfig.offlineMode ? 'translate-x-7' : 'translate-x-1'}`} 
                    />
                  </button>
               </div>
            </div>

            <div className="mt-8 flex justify-end">
               <button 
                 onClick={() => handleSave('net')}
                 className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 font-medium transition"
               >
                 {loading && saveSuccess !== 'net' ? <RefreshCw className="animate-spin" size={18} /> : <Save size={18} />}
                 应用网络设置
               </button>
            </div>
          </div>
        </div>

      </div>

      {/* Success Toast Notification (Simulated) */}
      {saveSuccess && (
        <div className="fixed bottom-10 right-10 bg-emerald-600 text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 animate-bounce">
          <CheckCircle size={24} />
          <div>
            <h4 className="font-bold">保存成功</h4>
            <p className="text-xs opacity-90">系统配置已更新并生效。</p>
          </div>
        </div>
      )}
    </div>
  );
};