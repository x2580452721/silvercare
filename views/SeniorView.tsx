import React, { useState, useEffect } from 'react';
import { Phone, HeartPulse, Pill, AlertCircle, User, Calendar, CloudSun, Stethoscope, ChevronRight, X, CheckCircle, MapPin, Activity, Check, PhoneOutgoing, Sun, Moon, Cloud, ThumbsUp } from 'lucide-react';
import { MOCK_MEDS, MOCK_SERVICES } from '../types';
import HealthScoreGauge from '../components/HealthScoreGauge';

const SeniorView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'health' | 'service'>('home');
  const [sosStatus, setSosStatus] = useState<'idle' | 'counting' | 'sent'>('idle');
  const [countdown, setCountdown] = useState(5);
  
  // Call State
  const [callStatus, setCallStatus] = useState<'idle' | 'confirming' | 'calling'>('idle');
  const [targetContact, setTargetContact] = useState<string>('');

  // Local state
  const [meds, setMeds] = useState(MOCK_MEDS);
  const [services, setServices] = useState(MOCK_SERVICES.map(s => ({ ...s, isLoading: false, isBooked: s.status === 'booked' })));
  const [toast, setToast] = useState<{show: boolean, message: string}>({show: false, message: ''});
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    let timer: number;
    if (sosStatus === 'counting') {
      if (countdown > 0) {
        timer = window.setTimeout(() => setCountdown(c => c - 1), 1000);
      } else {
        setSosStatus('sent');
      }
    }
    return () => clearTimeout(timer);
  }, [sosStatus, countdown]);

  // Simulate calling duration
  useEffect(() => {
    if (callStatus === 'calling') {
      const timer = setTimeout(() => {
        setCallStatus('idle');
        showToastMessage(`与 ${targetContact} 通话结束`);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [callStatus, targetContact]);

  // Toast auto-hide
  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => setToast({show: false, message: ''}), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Check if all meds are taken to trigger celebration
  useEffect(() => {
    if (meds.length > 0 && meds.every(m => m.taken) && !showCelebration) {
        // Prevent re-triggering if already shown once in this session context logic 
        // (Simplified for prototype: triggers when last one clicked)
        // We use a small timeout to let the toggle animation finish first
        const timer = setTimeout(() => setShowCelebration(true), 500);
        return () => clearTimeout(timer);
    }
  }, [meds]);

  const showToastMessage = (msg: string) => {
    setToast({ show: true, message: msg });
  };

  const getGreetingData = () => {
    const hour = new Date().getHours();
    if (hour < 11) return { text: '早上好', sub: '一日之计在于晨', icon: <Sun className="w-8 h-8" /> };
    if (hour < 13) return { text: '中午好', sub: '记得按时吃饭', icon: <Sun className="w-8 h-8" /> };
    if (hour < 18) return { text: '下午好', sub: '喝杯茶休息一下', icon: <CloudSun className="w-8 h-8" /> };
    return { text: '晚上好', sub: '早点休息身体好', icon: <Moon className="w-8 h-8" /> };
  };

  const greeting = getGreetingData();

  const handleSOSClick = () => {
    setCountdown(5);
    setSosStatus('counting');
  };

  const cancelSOS = () => {
    setSosStatus('idle');
    setCountdown(5);
  };

  const toggleMedication = (id: string) => {
    setMeds(currentMeds => {
      const target = currentMeds.find(m => m.id === id);
      if (target && !target.taken) {
        showToastMessage(`棒极了！您已服用 ${target.name}`);
      }
      return currentMeds.map(med => 
        med.id === id ? { ...med, taken: !med.taken } : med
      );
    });
  };

  const initiateCall = (name: string) => {
    setTargetContact(name);
    setCallStatus('confirming');
  };

  const confirmCall = () => {
    setCallStatus('calling');
  };

  const cancelCall = () => {
    setCallStatus('idle');
    setTargetContact('');
  };

  const handleServiceClick = (id: string) => {
    setServices(current => current.map(s => {
      if (s.id === id) {
        if (s.isBooked) return s; // Already booked
        return { ...s, isLoading: true };
      }
      return s;
    }));

    // Simulate API call
    setTimeout(() => {
      setServices(current => current.map(s => {
        if (s.id === id) {
           showToastMessage(`"${s.title}" 预约成功！`);
           return { ...s, isLoading: false, isBooked: true };
        }
        return s;
      }));
    }, 1500);
  };

  const renderToast = () => (
    <div className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[70] transition-all duration-300 pointer-events-none ${toast.show ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
      <div className="bg-black/80 text-white px-8 py-4 rounded-full text-xl font-bold backdrop-blur-md shadow-2xl flex items-center gap-3">
        <CheckCircle className="w-8 h-8 text-green-400" />
        {toast.message}
      </div>
    </div>
  );

  const renderCelebration = () => {
     if (!showCelebration) return null;
     return (
        <div className="fixed inset-0 z-[80] bg-black/60 flex items-center justify-center animate-in fade-in duration-300">
            <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center animate-in zoom-in duration-500 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500"></div>
                <div className="w-32 h-32 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6 text-yellow-600 animate-bounce">
                    <ThumbsUp className="w-16 h-16" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">真棒！</h2>
                <p className="text-xl text-gray-600 mb-8">今日药物已全部服用完毕。</p>
                <button 
                    onClick={() => setShowCelebration(false)}
                    className="w-full bg-senior-primary text-white py-4 rounded-xl text-xl font-bold"
                >
                    好的
                </button>
            </div>
        </div>
     );
  };

  const renderCallOverlay = () => {
    if (callStatus === 'idle') return null;

    return (
      <div className="fixed inset-0 z-[60] bg-gray-900/90 flex flex-col items-center justify-center p-6 animate-in fade-in duration-200">
        {callStatus === 'confirming' && (
          <div className="bg-white rounded-3xl p-8 w-full max-w-sm text-center animate-in zoom-in duration-300">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">确认呼叫</h3>
            <p className="text-xl text-gray-600 mb-8">即将拨打给 <span className="font-bold text-senior-primary">{targetContact}</span></p>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={cancelCall} className="bg-gray-200 text-gray-800 py-4 rounded-2xl text-xl font-bold">取消</button>
              <button onClick={confirmCall} className="bg-green-600 text-white py-4 rounded-2xl text-xl font-bold">拨打</button>
            </div>
          </div>
        )}

        {callStatus === 'calling' && (
          <div className="text-center flex flex-col items-center">
            <div className="w-32 h-32 bg-gray-700 rounded-full mb-6 overflow-hidden border-4 border-white/20 animate-pulse">
               <img src={`https://picsum.photos/seed/${targetContact}/200/200`} alt={targetContact} className="w-full h-full object-cover opacity-80" />
            </div>
            <h2 className="text-4xl font-bold text-white mb-2">{targetContact}</h2>
            <p className="text-xl text-gray-400 mb-12">正在呼叫中...</p>
            <button 
              onClick={cancelCall}
              className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-red-500/50"
            >
              <PhoneOutgoing className="w-8 h-8 rotate-135" />
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderSOSOverlay = () => {
    if (sosStatus === 'idle') return null;

    return (
      <div className="fixed inset-0 z-[60] bg-gray-900/95 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300">
        {sosStatus === 'counting' && (
          <>
            <div className="w-48 h-48 rounded-full border-8 border-red-500 flex items-center justify-center mb-8 relative">
               <span className="text-8xl font-bold text-white tabular-nums">{countdown}</span>
               <div className="absolute inset-0 rounded-full border-t-8 border-white animate-spin" style={{ animationDuration: '1s' }}></div>
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">正在呼叫紧急联系人...</h2>
            <p className="text-xl text-gray-300 mb-12">即将发送您的位置与健康信息</p>
            
            <button 
              onClick={cancelSOS}
              className="w-full max-w-sm bg-gray-600 hover:bg-gray-500 text-white rounded-full py-6 text-2xl font-bold flex items-center justify-center gap-3"
            >
              <X className="w-8 h-8" /> 取消呼叫
            </button>
          </>
        )}

        {sosStatus === 'sent' && (
          <div className="bg-white rounded-3xl p-8 w-full max-w-sm flex flex-col items-center animate-in zoom-in duration-300">
             <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-600">
                <CheckCircle className="w-16 h-16" />
             </div>
             <h2 className="text-3xl font-bold text-gray-900 mb-2">求助已发送</h2>
             <p className="text-lg text-gray-600 mb-6">已通知：大儿子、李医生</p>
             
             <div className="bg-gray-50 p-4 rounded-xl w-full mb-8 flex items-start gap-3 text-left">
                <MapPin className="w-6 h-6 text-senior-primary shrink-0" />
                <div>
                   <span className="block font-bold text-gray-800">位置已共享</span>
                   <span className="text-gray-500">幸福小区 3栋 402室</span>
                </div>
             </div>

             <button 
              onClick={cancelSOS}
              className="w-full bg-senior-primary text-white rounded-2xl py-4 text-xl font-bold"
            >
              我知道了，我已安全
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderHeader = (title: string, subtitle?: string) => (
    <header className="bg-senior-primary text-white p-6 shadow-md rounded-b-[2rem] mb-6 transition-all duration-500">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold mb-2">{title}</h1>
          {subtitle && <p className="text-xl opacity-90">{subtitle}</p>}
        </div>
        <div className="text-right">
          <div className="flex items-center justify-end gap-2 text-xl font-medium">
            {greeting.icon}
            <span>22°C</span>
          </div>
          <p className="text-lg opacity-90 mt-1">10月24日 星期四</p>
        </div>
      </div>
    </header>
  );

  const renderSOSButton = () => (
    <div className="mx-6 mb-8">
      <button 
        onClick={handleSOSClick}
        className="w-full bg-emergency active:bg-rose-700 text-white rounded-3xl p-6 shadow-lg shadow-rose-200 flex items-center justify-center gap-4 transition-transform transform active:scale-95 group"
      >
        <div className="bg-white/20 p-4 rounded-full animate-pulse group-hover:scale-110 transition-transform">
          <AlertCircle className="w-12 h-12" />
        </div>
        <div className="text-left">
          <span className="block text-4xl font-bold tracking-wider">紧急呼叫</span>
          <span className="block text-lg opacity-90 mt-1">SOS Emergency</span>
        </div>
      </button>
    </div>
  );

  const renderHome = () => (
    <div className="pb-24 animate-in slide-in-from-right duration-300">
      {renderHeader(`${greeting.text}，张大爷`, greeting.sub)}
      {renderSOSButton()}

      {/* Medication Reminder */}
      <section className="mx-6 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Pill className="w-8 h-8 text-senior-primary" />
          <h2 className="text-2xl font-bold text-gray-800">今日用药</h2>
        </div>
        <div className="space-y-4">
          {meds.map(med => (
            <button 
                key={med.id} 
                onClick={() => toggleMedication(med.id)}
                className={`w-full text-left bg-white p-5 rounded-2xl shadow-sm border-l-8 flex justify-between items-center transition-all active:scale-95 ${med.taken ? 'border-gray-300 opacity-60 bg-gray-50' : 'border-senior-primary'}`}
            >
              <div>
                <p className={`text-2xl font-bold ${med.taken ? 'text-gray-500 line-through' : 'text-gray-800'}`}>{med.name}</p>
                <p className="text-lg text-gray-500 mt-1">{med.time} - {med.dosage}</p>
              </div>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${med.taken ? 'bg-green-100 text-green-600' : 'bg-senior-primary/10'}`}>
                {med.taken ? (
                  <Check className="w-8 h-8" />
                ) : (
                  <div className="w-6 h-6 rounded-full border-4 border-senior-primary"></div>
                )}
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Quick Stats */}
      <section className="mx-6 mb-8" onClick={() => setActiveTab('health')}>
         <div className="flex items-center gap-2 mb-4">
          <HeartPulse className="w-8 h-8 text-senior-primary" />
          <h2 className="text-2xl font-bold text-gray-800">健康速览</h2>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-2xl shadow-sm active:bg-gray-50 transition-colors">
            <p className="text-lg text-gray-500 mb-1">心率 (次/分)</p>
            <p className="text-4xl font-bold text-gray-800">72</p>
            <p className="text-sm text-green-600 mt-2 font-medium">正常范围</p>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-sm active:bg-gray-50 transition-colors">
            <p className="text-lg text-gray-500 mb-1">血压 (mmHg)</p>
            <p className="text-4xl font-bold text-gray-800">120/80</p>
            <p className="text-sm text-green-600 mt-2 font-medium">今日已测</p>
          </div>
        </div>
      </section>

      {/* Quick Contacts */}
      <section className="mx-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">联系家人</h2>
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {['大儿子', '小女儿', '李医生'].map((name, i) => (
            <button 
                key={i} 
                onClick={() => initiateCall(name)}
                className="flex flex-col items-center min-w-[5rem] active:opacity-70 transition-opacity"
            >
              <div className="w-20 h-20 bg-gray-200 rounded-full mb-2 flex items-center justify-center text-3xl overflow-hidden shadow-sm border-2 border-white">
                 <img src={`https://picsum.photos/seed/${name}/200/200`} alt={name} className="w-full h-full object-cover" />
              </div>
              <span className="text-lg font-medium text-gray-700">{name}</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );

  const renderHealth = () => (
    <div className="pb-24 animate-in slide-in-from-right duration-300">
      {renderHeader("我的健康数据", "每日监测，安享晚年")}
      
      <div className="flex justify-center mb-8">
        <div className="bg-white p-6 rounded-3xl shadow-sm flex flex-col items-center">
            <HealthScoreGauge score={88} label="今日健康分" size={200} />
            <p className="text-xl text-green-600 font-bold mt-2">身体状况良好</p>
        </div>
      </div>

      <section className="mx-6 space-y-4">
        <div className="bg-white p-6 rounded-2xl shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                    <div className="bg-red-100 p-3 rounded-full text-red-600">
                        <HeartPulse className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-gray-500 text-lg">心率</p>
                        <p className="text-3xl font-bold">72 <span className="text-lg font-normal text-gray-400">次/分</span></p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-lg text-gray-400">刚刚</p>
                </div>
            </div>
            <div className="w-full bg-gray-100 h-4 rounded-full overflow-hidden">
                <div className="bg-red-500 h-full w-[60%]"></div>
            </div>
            <p className="mt-2 text-gray-500 text-lg">范围: 60-100 (正常)</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                    <div className="bg-purple-100 p-3 rounded-full text-purple-600">
                        <Activity className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-gray-500 text-lg">血压</p>
                        <p className="text-3xl font-bold">120/80</p>
                    </div>
                </div>
                 <div className="text-right">
                    <p className="text-lg text-gray-400">08:00</p>
                </div>
            </div>
            <div className="w-full bg-gray-100 h-4 rounded-full overflow-hidden relative">
                 {/* Simplified visual range */}
                <div className="absolute left-[30%] right-[30%] h-full bg-green-200"></div>
                <div className="absolute left-[45%] w-2 h-full bg-purple-600"></div>
            </div>
            <p className="mt-2 text-gray-500 text-lg">收缩压正常，舒张压正常</p>
        </div>
      </section>
    </div>
  );

  const renderService = () => (
     <div className="pb-24 animate-in slide-in-from-right duration-300">
      {renderHeader("康养服务", "社区为您提供的关怀")}
      <div className="px-6 space-y-6">
        {services.map((item, idx) => {
           let icon;
           let color;
           if (item.category === 'medical') { icon = <Stethoscope className="w-8 h-8 text-blue-500" />; color = "bg-blue-50"; }
           else if (item.category === 'cleaning') { icon = <User className="w-8 h-8 text-orange-500" />; color = "bg-orange-50"; }
           else { icon = <Calendar className="w-8 h-8 text-green-500" />; color = "bg-green-50"; }

           return (
            <button 
              key={idx} 
              disabled={item.isBooked || (item as any).isLoading}
              onClick={() => handleServiceClick(item.id)}
              className={`w-full text-left bg-white p-6 rounded-2xl shadow-sm flex items-center gap-4 transition-all ${item.isBooked ? 'opacity-60 bg-gray-50' : 'active:bg-gray-50'}`}
            >
              <div className={`p-4 rounded-xl ${color}`}>
                {icon}
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-800">{item.title}</h3>
                <p className="text-lg text-gray-500">
                   {item.isBooked ? '已预约' : (item as any).isLoading ? '正在预约...' : '点击预约'}
                </p>
              </div>
              <div className="w-8 h-8 flex items-center justify-center">
                 {(item as any).isLoading ? (
                     <div className="w-6 h-6 border-2 border-gray-300 border-t-senior-primary rounded-full animate-spin"></div>
                 ) : item.isBooked ? (
                     <Check className="w-8 h-8 text-green-500" />
                 ) : (
                     <ChevronRight className="w-8 h-8 text-gray-300" />
                 )}
              </div>
            </button>
          );
        })}
      </div>
     </div>
  );

  return (
    <div className="min-h-screen bg-senior-bg font-sans">
      {renderToast()}
      {renderCelebration()}
      {renderCallOverlay()}
      {renderSOSOverlay()}
      
      {/* Content Area */}
      {activeTab === 'home' && renderHome()}
      {activeTab === 'health' && renderHealth()}
      {activeTab === 'service' && renderService()}

      {/* Bottom Navigation - Sticky & Large */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe pt-2 px-2 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] flex justify-around items-center h-24 z-50">
        {[
          { id: 'home', label: '首页', icon: <User className="w-8 h-8" /> },
          { id: 'health', label: '健康', icon: <HeartPulse className="w-8 h-8" /> },
          { id: 'service', label: '服务', icon: <Phone className="w-8 h-8" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${
              activeTab === tab.id ? 'text-senior-primary' : 'text-gray-400'
            }`}
          >
            {tab.icon}
            <span className={`text-lg font-bold transition-all ${activeTab === tab.id ? 'scale-110' : 'scale-100'}`}>{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default SeniorView;