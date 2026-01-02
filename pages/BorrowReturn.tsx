import React, { useState, useEffect } from 'react';
import { Certificate, CabinetSlot, CertificateStatus, SystemLog } from '../types';
import { QrCode, Search, CheckCircle, ArrowRight, CornerDownLeft, Box, Key, Loader, ScanFace, Fingerprint, Cpu } from 'lucide-react';

interface BorrowReturnProps {
  certificates: Certificate[];
  slots: CabinetSlot[];
  onBorrow: (certId: string, reason: string) => void;
  onReturn: (certId: string, slotId: number) => void;
}

export const BorrowReturn: React.FC<BorrowReturnProps> = ({ certificates, slots, onBorrow, onReturn }) => {
  const [mode, setMode] = useState<'SELECT' | 'BORROW' | 'RETURN'>('SELECT');
  const [step, setStep] = useState<number>(1);
  const [authMethod, setAuthMethod] = useState<'FACE' | 'FINGER' | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [scannedCert, setScannedCert] = useState<Certificate | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('处理中...');
  const [successMsg, setSuccessMsg] = useState('');
  const [targetSlot, setTargetSlot] = useState<number | null>(null);

  // Reset flow when mode changes
  useEffect(() => {
    setStep(1);
    setInputValue('');
    setScannedCert(null);
    setSuccessMsg('');
    setTargetSlot(null);
    setAuthMethod(null);
  }, [mode]);

  const simulateBiometricAuth = (method: 'FACE' | 'FINGER') => {
    setAuthMethod(method);
    setLoading(true);
    setLoadingText(method === 'FACE' ? "正在进行人脸识别..." : "请按压指纹...");
    
    setTimeout(() => {
      setLoading(false);
      setStep(2); // Go to Select/Scan Cert step
    }, 2000);
  };

  const handleReturnScanSimulation = () => {
    setLoading(true);
    setLoadingText("正在读取证书芯片信息...");
    // Simulate reading chip
    setTimeout(() => {
      setLoading(false);
      // Find a borrowed cert to return
      const borrowed = certificates.find(c => c.status === CertificateStatus.BORROWED);
      if (borrowed) {
        setScannedCert(borrowed);
        setStep(3); // Go to confirm
      } else {
        alert("未检测到有效证书芯片 (模拟: 无借出状态证书)");
      }
    }, 2000);
  };

  const handleBorrowSelection = () => {
      // For Borrow, we simulate searching or scanning the QR code of the cabinet slot OR picking from a list
      // Here we just pick a random available cert for simulation
      const available = certificates.find(c => c.status === CertificateStatus.ACTIVE);
      if (available) {
          setScannedCert(available);
          setStep(3);
      } else {
          alert("无可用证书");
      }
  };

  const handleConfirm = () => {
    if (!scannedCert) return;
    setLoading(true);
    setLoadingText("正在与智能柜通信...");

    setTimeout(() => {
      if (mode === 'BORROW') {
        onBorrow(scannedCert.id, "自助终端借用");
        setTargetSlot(scannedCert.cabinetSlot || 1);
        setSuccessMsg(`身份验证通过。请从 ${scannedCert.cabinetSlot} 号柜门取走证书`);
      } else {
        // Find empty slot
        const emptySlot = slots.find(s => s.status === 'empty');
        const slotId = emptySlot ? emptySlot.id : 99;
        onReturn(scannedCert.id, slotId);
        setTargetSlot(slotId);
        setSuccessMsg(`请将证书放入 ${slotId} 号柜门。系统已识别并生成归还审计记录。`);
      }
      setLoading(false);
      setStep(4);
    }, 1500);
  };

  if (mode === 'SELECT') {
    return (
      <div className="h-full flex flex-col items-center justify-center space-y-10 animate-fade-in">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">智能证书管理终端</h1>
          <p className="text-slate-500 text-lg">请选择您需要办理的业务</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl px-4">
          <button 
            onClick={() => setMode('BORROW')}
            className="group relative overflow-hidden bg-white p-10 rounded-3xl shadow-xl border-2 border-slate-100 hover:border-blue-500 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 flex flex-col items-center"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-150 group-hover:bg-blue-100"></div>
            <Key size={64} className="text-blue-600 mb-6 z-10" />
            <h2 className="text-3xl font-bold text-slate-800 z-10">证书取用</h2>
            <p className="text-slate-500 mt-2 z-10">Certificate Pickup</p>
          </button>

          <button 
            onClick={() => setMode('RETURN')}
            className="group relative overflow-hidden bg-white p-10 rounded-3xl shadow-xl border-2 border-slate-100 hover:border-emerald-500 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 flex flex-col items-center"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-150 group-hover:bg-emerald-100"></div>
            <Box size={64} className="text-emerald-600 mb-6 z-10" />
            <h2 className="text-3xl font-bold text-slate-800 z-10">证书归还</h2>
            <p className="text-slate-500 mt-2 z-10">Certificate Return</p>
          </button>
        </div>
        
        <div className="text-slate-400 text-sm mt-10 flex items-center gap-2">
           <Cpu size={16} /> 硬件连接正常 | 芯片读写器就绪 | 生物识别模块就绪
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col max-w-5xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={() => setMode('SELECT')}
          className="flex items-center text-slate-500 hover:text-slate-800 transition"
        >
          <CornerDownLeft className="mr-2" /> 返回主菜单
        </button>
        <h2 className="text-2xl font-bold text-slate-800">
          {mode === 'BORROW' ? '证书取用流程' : '证书归还流程'}
        </h2>
        <div className="text-slate-400 font-mono">STEP 0{step} / 04</div>
      </div>

      {/* Main Content Card */}
      <div className="flex-1 bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Side: Visual / Instructions */}
        <div className={`p-10 md:w-1/2 flex flex-col justify-center items-center text-center text-white
          ${mode === 'BORROW' ? 'bg-gradient-to-br from-blue-600 to-indigo-800' : 'bg-gradient-to-br from-emerald-600 to-teal-800'}
        `}>
          {loading ? (
            <div className="flex flex-col items-center">
              <Loader size={64} className="animate-spin mb-4 opacity-80" />
              <p className="text-xl font-medium tracking-wide mt-4">{loadingText}</p>
            </div>
          ) : step === 1 ? (
            <>
              <ScanFace size={120} className="mb-8 opacity-90 animate-pulse" />
              <h3 className="text-2xl font-bold mb-2">身份验证</h3>
              <p className="opacity-80 max-w-xs">为了确保安全，请先进行身份识别</p>
            </>
          ) : step === 2 ? (
            <>
              {mode === 'BORROW' ? (
                  <Search size={100} className="mb-6 opacity-90" />
              ) : (
                  <Cpu size={100} className="mb-6 opacity-90" />
              )}
              <h3 className="text-2xl font-bold mb-2">{mode === 'BORROW' ? '选择证书' : '读取证书'}</h3>
              <p className="opacity-80">
                  {mode === 'BORROW' ? '请输入编号或选择您申请的证书' : '请将证书插入读卡区进行识别'}
              </p>
            </>
          ) : step === 3 ? (
            <>
               <CheckCircle size={100} className="mb-6 opacity-90" />
               <h3 className="text-2xl font-bold mb-2">信息确认</h3>
               <p className="opacity-80">请核对右侧证书信息是否正确</p>
            </>
          ) : (
            <>
              <Box size={100} className="mb-6 opacity-90 animate-bounce" />
              <h3 className="text-3xl font-bold mb-2">操作成功</h3>
              <p className="opacity-80 text-lg">{mode === 'BORROW' ? 'Borrowing Complete' : 'Return Complete'}</p>
            </>
          )}
        </div>

        {/* Right Side: Interactions */}
        <div className="p-10 md:w-1/2 flex flex-col justify-center bg-slate-50">
          
          {/* STEP 1: Biometric Auth */}
          {step === 1 && (
            <div className="space-y-6">
               <button 
                onClick={() => simulateBiometricAuth('FACE')}
                className="w-full py-6 bg-white border-2 border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-3 text-slate-700 font-bold hover:border-blue-500 hover:text-blue-600 transition-all shadow-sm hover:shadow-md"
              >
                <ScanFace size={48} className="text-blue-500"/>
                <span>人脸识别登录</span>
              </button>
              
               <button 
                onClick={() => simulateBiometricAuth('FINGER')}
                className="w-full py-6 bg-white border-2 border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-3 text-slate-700 font-bold hover:border-emerald-500 hover:text-emerald-600 transition-all shadow-sm hover:shadow-md"
              >
                <Fingerprint size={48} className="text-emerald-500"/>
                <span>指纹验证登录</span>
              </button>
            </div>
          )}

          {/* STEP 2: Selection / Reading */}
          {step === 2 && (
            <div className="space-y-6">
               {mode === 'RETURN' ? (
                   <div className="text-center">
                        <div className="bg-slate-200 w-full h-32 rounded-xl flex items-center justify-center mb-6 border-2 border-dashed border-slate-300">
                             <span className="text-slate-500 font-medium">请插入证书 USB Key...</span>
                        </div>
                        <button 
                            onClick={handleReturnScanSimulation}
                            className="w-full py-4 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-700 transition"
                        >
                            模拟读取芯片信息
                        </button>
                   </div>
               ) : (
                   <div className="space-y-4">
                       <input 
                          type="text" 
                          placeholder="输入证书编号..." 
                          className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                       />
                       <button 
                         onClick={handleBorrowSelection}
                         className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition"
                       >
                         查询并选择
                       </button>
                   </div>
               )}
            </div>
          )}

          {/* STEP 3: Confirmation */}
          {step === 3 && scannedCert && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex justify-between mb-4 border-b border-slate-100 pb-2">
                  <span className="text-slate-500 text-sm">证书编号</span>
                  <span className="font-mono font-bold text-slate-800">{scannedCert.serialNumber}</span>
                </div>
                <div className="flex justify-between mb-4 border-b border-slate-100 pb-2">
                  <span className="text-slate-500 text-sm">持有人</span>
                  <span className="font-bold text-slate-800">
                    {/* In a real app we would look up the name */}
                    {scannedCert.ownerId === 'o1' ? '张伟' : '未知用户'} 
                  </span>
                </div>
                 <div className="flex justify-between mb-4 border-b border-slate-100 pb-2">
                  <span className="text-slate-500 text-sm">状态</span>
                  <span className="font-bold text-blue-600">{mode === 'RETURN' ? '等待归还' : '可借用'}</span>
                </div>
              </div>

              <button 
                onClick={handleConfirm}
                className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold text-lg hover:bg-slate-800 transition shadow-lg flex items-center justify-center gap-2"
              >
                确认{mode === 'BORROW' ? '借用' : '归还'} <ArrowRight size={20} />
              </button>
            </div>
          )}

          {/* STEP 4: Success & Cabinet */}
          {step === 4 && (
             <div className="text-center space-y-6">
               <div className="bg-emerald-50 text-emerald-800 p-6 rounded-2xl border border-emerald-100">
                 <h4 className="font-bold text-xl mb-2">{successMsg}</h4>
                 <p className="text-sm opacity-80">
                    操作时间: {new Date().toLocaleString()} <br/>
                    操作人: 模拟用户 (通过{authMethod === 'FACE' ? '人脸' : '指纹'}验证)
                 </p>
               </div>
               
               {/* Visual Cabinet Door Opening Simulation */}
               <div className="flex justify-center my-4">
                 <div className="w-24 h-24 bg-slate-200 rounded-lg flex items-center justify-center relative border-4 border-slate-300">
                    <div className="absolute inset-0 bg-slate-800 origin-left transition-transform duration-1000 transform -rotate-y-110 shadow-xl flex items-center justify-center text-white font-mono text-2xl">
                       {targetSlot}
                    </div>
                 </div>
               </div>

               <button 
                  onClick={() => { setMode('SELECT'); setStep(1); }}
                  className="px-8 py-3 bg-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-300 transition"
               >
                 返回首页
               </button>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};