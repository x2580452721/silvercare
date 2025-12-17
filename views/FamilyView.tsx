import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { MOCK_VITALS_BP, MOCK_VITALS_HEART, MOCK_ALERTS } from '../types';
import HealthScoreGauge from '../components/HealthScoreGauge';
import { MapPin, Phone, MessageCircle, AlertTriangle, Battery, Signal, Activity, Bell, ChevronRight, Info, AlertCircle, Navigation, Check, X, ShieldCheck, Bot, Video, Mic, Camera, Maximize2, Minimize2, MoreVertical, Wifi, Layers } from 'lucide-react';

// Reliable pure CSS/SVG Map Background - No external images to fail
const MockMapBackground = () => (
    <div className="absolute inset-0 bg-[#f3f4f6] overflow-hidden">
      {/* Base Grid */}
      <svg className="absolute inset-0 w-full h-full" width="100%" height="100%">
        <defs>
            <pattern id="grid" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
               <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#e5e7eb" strokeWidth="1"/>
            </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
      
      {/* Vector Roads & Blocks */}
      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 400 800">
         {/* Roads */}
         <path d="M 80 0 L 80 800" stroke="white" strokeWidth="25" fill="none" />
         <path d="M 320 0 L 320 800" stroke="white" strokeWidth="25" fill="none" />
         <path d="M 0 250 L 400 250" stroke="white" strokeWidth="25" fill="none" />
         <path d="M 0 550 L 400 550" stroke="white" strokeWidth="25" fill="none" />
         
         {/* Buildings (Abstract) */}
         <rect x="100" y="50" width="80" height="150" fill="#dbeafe" rx="4" />
         <rect x="200" y="80" width="100" height="120" fill="#e0e7ff" rx="4" />
         
         {/* Current User Building */}
         <rect x="110" y="280" width="180" height="120" fill="#d1fae5" rx="4" stroke="#34d399" strokeWidth="2" />
         
         <rect x="220" y="600" width="120" height="100" fill="#f3f4f6" rx="4" />
         <rect x="20" y="600" width="150" height="150" fill="#e5e7eb" rx="4" />
      </svg>

      {/* Radar Effect at Location */}
      <div className="absolute top-[38%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-blue-500/20 bg-blue-500/5 animate-pulse-slow pointer-events-none"></div>
    </div>
);

const FamilyView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'alerts' | 'map'>('dashboard');
  const [alerts, setAlerts] = useState(MOCK_ALERTS);
  const [toast, setToast] = useState<{show: boolean, message: string}>({show: false, message: ''});
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageText, setMessageText] = useState('');
  
  // Map Video State
  const [isCamExpanded, setIsCamExpanded] = useState(false);
  const [isTalking, setIsTalking] = useState(false);

  // Toast auto-hide
  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => setToast({show: false, message: ''}), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (msg: string) => {
    setToast({ show: true, message: msg });
  };

  const handleCall = () => {
    showToast("正在连接老人身边的机器人...");
  };

  const handleMessageOpen = () => {
    setShowMessageModal(true);
  };

  const handleMessageSend = () => {
    if (messageText.trim()) {
        setShowMessageModal(false);
        showToast("已发送至机器人，等待语音播报");
        setMessageText('');
    }
  };

  const handleAlertClick = (id: string) => {
    setAlerts(current => current.map(alert => 
        alert.id === id ? { ...alert, read: true } : alert
    ));
  };

  const handleSnapshot = (e: React.MouseEvent) => {
      e.stopPropagation();
      showToast("已抓拍当前画面并保存至相册");
  };

  const toggleTalk = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!isTalking) {
          setIsTalking(true);
          showToast("正在传送语音，请说话...");
      } else {
          setIsTalking(false);
          showToast("语音传送结束");
      }
  };

  const toggleExpand = (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsCamExpanded(!isCamExpanded);
  };

  const unreadCount = alerts.filter(a => !a.read).length;

  const renderToast = () => (
    <div className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-[120] transition-all duration-300 pointer-events-none ${toast.show ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
      <div className="bg-gray-800 text-white px-6 py-3 rounded-full text-sm font-bold shadow-xl flex items-center gap-2">
        <Bot className="w-4 h-4 text-blue-400" />
        {toast.message}
      </div>
    </div>
  );

  const renderMessageModal = () => {
    if (!showMessageModal) return null;
    return (
      <div className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-4 animate-in fade-in duration-200">
         <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
             <div className="bg-gray-50 p-4 border-b border-gray-100 flex justify-between items-center">
                 <h3 className="font-bold text-gray-800">发送留言</h3>
                 <button onClick={() => setShowMessageModal(false)} className="text-gray-400 hover:text-gray-600">
                    <X className="w-5 h-5" />
                 </button>
             </div>
             <div className="p-4">
                 <textarea 
                    className="w-full h-32 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none text-sm"
                    placeholder="请输入想对老人说的话..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                 ></textarea>
                 <div className="flex justify-end gap-3 mt-4">
                     <button onClick={() => setShowMessageModal(false)} className="px-4 py-2 text-gray-500 font-medium">取消</button>
                     <button 
                        onClick={handleMessageSend}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2"
                     >
                        <Bot className="w-4 h-4" /> 让机器人播报
                     </button>
                 </div>
             </div>
         </div>
      </div>
    );
  };

  const renderDashboard = () => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      {/* Robot Status Bar */}
      <div className="bg-gray-800 text-gray-200 px-4 py-2 text-xs flex justify-between items-center mx-4 mt-2 rounded-lg">
           <div className="flex items-center gap-2">
               <Bot className="w-4 h-4 text-green-400" />
               <span className="font-mono">机器人: 在线 (自动巡航中)</span>
           </div>
           <div className="flex items-center gap-2">
               <Battery className="w-4 h-4" /> 82%
           </div>
      </div>

      <main className="p-4 space-y-4">
        {/* Status Card */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between">
                <div className="flex gap-4">
                    <img src="https://picsum.photos/seed/grandpa/100/100" className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md" alt="Avatar" />
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">张建国</h2>
                        <div 
                            className="flex items-center gap-1 text-gray-500 text-sm mt-1 cursor-pointer hover:text-blue-600 transition-colors"
                            onClick={() => setActiveTab('map')}
                        >
                            <MapPin className="w-4 h-4" />
                            <span>位置: 幸福小区 3栋 402</span>
                            <ChevronRight className="w-3 h-3" />
                        </div>
                        <p className="text-xs text-blue-600 mt-1 flex items-center gap-1">
                             <Video className="w-3 h-3" /> 机器人视觉锁定中
                        </p>
                    </div>
                </div>
                <HealthScoreGauge score={88} label="健康分" size={80} />
            </div>
            
            <div className="grid grid-cols-2 gap-3 mt-4">
                <button 
                    onClick={handleCall}
                    className="flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-lg text-sm font-medium active:bg-blue-700 transition-colors shadow-sm"
                >
                    <Phone className="w-4 h-4" /> 唤醒机器人通话
                </button>
                <button 
                    onClick={handleMessageOpen}
                    className="flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 py-2 rounded-lg text-sm font-medium active:bg-gray-50 transition-colors shadow-sm"
                >
                    <MessageCircle className="w-4 h-4" /> 发送语音留言
                </button>
            </div>
        </div>

        {/* Charts */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-blue-500" />
                    心率趋势
                </h3>
                <span className="text-xs text-gray-400 flex items-center gap-1"><Bot className="w-3 h-3"/> 来源:非接触传感器</span>
            </div>
            <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={MOCK_VITALS_HEART}>
                        <defs>
                            <linearGradient id="colorHeart" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <XAxis dataKey="time" fontSize={10} tickLine={false} axisLine={false} />
                        <YAxis domain={[60, 100]} fontSize={10} tickLine={false} axisLine={false} />
                        <Tooltip />
                        <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorHeart)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
      </main>
    </div>
  );

  const renderAlerts = () => (
    <main className="p-4 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-bold text-gray-800">老人健康告警</h2>
        <span className="text-sm text-gray-500">共 {unreadCount} 条未读</span>
      </div>

      <div className="space-y-4">
        {alerts.map((alert) => {
          let icon;
          let bgColor;
          let borderColor;
          let textColor;
          let robotAction;

          if (alert.read) {
             icon = <Check className="w-6 h-6 text-gray-400" />;
             bgColor = 'bg-gray-50';
             borderColor = 'border-gray-200';
             textColor = 'text-gray-500';
          } else {
             switch (alert.type) {
                case 'emergency':
                  icon = <AlertCircle className="w-6 h-6 text-red-600" />;
                  bgColor = 'bg-red-50';
                  borderColor = 'border-red-200';
                  textColor = 'text-red-900';
                  robotAction = '机器人已启动紧急伴随模式，正在语音安抚';
                  break;
                case 'warning':
                  icon = <AlertTriangle className="w-6 h-6 text-orange-600" />;
                  bgColor = 'bg-orange-50';
                  borderColor = 'border-orange-200';
                  textColor = 'text-orange-900';
                  robotAction = '机器人已提示老人用药';
                  break;
                case 'info':
                default:
                  icon = <Info className="w-6 h-6 text-blue-600" />;
                  bgColor = 'bg-blue-50';
                  borderColor = 'border-blue-200';
                  textColor = 'text-blue-900';
                  robotAction = '机器人已前往老人位置确认';
                  break;
             }
          }

          return (
            <div 
                key={alert.id} 
                onClick={() => handleAlertClick(alert.id)}
                className={`rounded-xl p-4 border ${borderColor} ${bgColor} shadow-sm relative overflow-hidden transition-all duration-300 ${alert.read ? 'opacity-80' : 'cursor-pointer hover:shadow-md'}`}
            >
               {!alert.read && <div className={`absolute left-0 top-0 bottom-0 w-1 ${alert.type === 'emergency' ? 'bg-red-500' : alert.type === 'warning' ? 'bg-orange-500' : 'bg-blue-500'}`}></div>}
               
               <div className="flex items-start gap-3 pl-2">
                 <div className={`p-2 rounded-full shadow-sm shrink-0 mt-1 transition-colors ${alert.read ? 'bg-gray-200' : 'bg-white'}`}>
                   {icon}
                 </div>
                 <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className={`font-bold text-lg ${textColor} flex items-center gap-2`}>
                          {alert.title}
                          {alert.read && <span className="text-xs font-normal bg-gray-200 px-2 py-0.5 rounded text-gray-500">已读</span>}
                      </h3>
                      <span className="text-xs text-gray-500 bg-white/60 px-2 py-1 rounded-md flex items-center gap-1">
                          <Bot className="w-3 h-3" />
                          机器人发现
                      </span>
                    </div>
                    <p className={`text-sm mt-1 ${alert.read ? 'text-gray-400' : 'text-gray-700'}`}>{alert.description}</p>
                    
                    {!alert.read && (
                        <div className="mt-3 bg-white/50 p-2 rounded-lg text-sm border border-black/5">
                            <div className="flex items-start gap-2 text-blue-700 mb-1">
                                <Bot className="w-4 h-4 mt-0.5 shrink-0" />
                                <span className="font-bold text-xs">现场处置：{robotAction}</span>
                            </div>
                        </div>
                    )}
                 </div>
               </div>
            </div>
          );
        })}
      </div>
    </main>
  );

  const renderMap = () => (
    <div className="w-full h-full relative bg-gray-100 overflow-hidden flex flex-col">
        {/* Safe Map Background */}
        <MockMapBackground />
        
        {/* Live Video Feed Overlay */}
        <div 
          onClick={!isCamExpanded ? toggleExpand : undefined}
          className={`transition-all duration-500 ease-in-out shadow-2xl bg-black overflow-hidden flex flex-col
          ${isCamExpanded 
            ? 'fixed inset-0 m-0 rounded-none z-[110]' // Fullscreen Mode
            : 'absolute top-24 right-4 w-40 h-28 rounded-xl border-2 border-white/50 hover:scale-105 cursor-pointer z-20' // Minimized Mode
          }`}
        >
            {/* Simulation Image */}
            <div className="relative flex-1 bg-gray-900 overflow-hidden group">
               <img src="https://picsum.photos/seed/livingroom/800/600" className="w-full h-full object-cover opacity-90" alt="Live Feed" />
               
               {/* OSD: Recording Status */}
               <div className={`absolute top-4 left-4 flex items-center gap-3 ${isCamExpanded ? 'scale-100' : 'scale-75 origin-top-left'}`}>
                   <div className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-2 animate-pulse shadow-lg">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      LIVE
                   </div>
                   <div className="bg-black/40 backdrop-blur text-white text-xs px-2 py-1 rounded font-mono border border-white/20">
                      ROBOT_CAM_01 | 1080P
                   </div>
                   {isCamExpanded && (
                       <div className="flex items-center gap-1 text-green-400 text-xs bg-black/40 px-2 py-1 rounded backdrop-blur">
                          <Wifi className="w-3 h-3" />
                          <span>Signal: Strong</span>
                       </div>
                   )}
               </div>

               {/* Fullscreen Controls Overlay */}
               {/* Always visible in fullscreen, visible on hover in minified */}
               <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30 flex flex-col justify-between p-6 transition-opacity duration-300 ${isCamExpanded ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                   {/* Top Controls */}
                   <div className="flex justify-end pt-safe">
                       <button 
                         onClick={toggleExpand}
                         className="p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all active:scale-95 border border-white/10 shadow-xl"
                       >
                           {isCamExpanded ? <Minimize2 className="w-6 h-6" /> : <Maximize2 className="w-6 h-6" />}
                       </button>
                   </div>

                   {/* Bottom Controls (Only visible in Expanded Mode for better UX) */}
                   {isCamExpanded && (
                     <div className="flex items-center justify-between animate-in slide-in-from-bottom-4 duration-500 delay-100 pb-safe">
                         <div className="flex items-center gap-6">
                             <div className="flex flex-col items-center gap-1">
                               <button 
                                  onClick={toggleTalk}
                                  className={`p-4 rounded-full backdrop-blur-md transition-all shadow-xl border border-white/10 ${isTalking ? 'bg-green-500 text-white scale-110' : 'bg-white/10 text-white hover:bg-white/20'}`}
                                >
                                   <Mic className="w-8 h-8" />
                               </button>
                               <span className="text-white/70 text-xs font-medium">按住对讲</span>
                             </div>

                             <div className="flex flex-col items-center gap-1">
                               <button 
                                  onClick={handleSnapshot}
                                  className="p-4 bg-white/10 rounded-full text-white hover:bg-white/20 backdrop-blur-md transition-all shadow-xl border border-white/10 active:scale-95"
                                >
                                   <Camera className="w-8 h-8" />
                               </button>
                               <span className="text-white/70 text-xs font-medium">抓拍</span>
                             </div>
                         </div>
                         
                         {/* PTZ D-Pad Simulation */}
                         <div className="flex flex-col items-center gap-1">
                           <div className="bg-white/10 p-2 rounded-full backdrop-blur-md border border-white/10 shadow-xl w-32 h-32 relative">
                               <div className="absolute top-2 left-1/2 -translate-x-1/2"><ChevronRight className="w-6 h-6 text-white/70 -rotate-90" /></div>
                               <div className="absolute bottom-2 left-1/2 -translate-x-1/2"><ChevronRight className="w-6 h-6 text-white/70 rotate-90" /></div>
                               <div className="absolute left-2 top-1/2 -translate-y-1/2"><ChevronRight className="w-6 h-6 text-white/70 rotate-180" /></div>
                               <div className="absolute right-2 top-1/2 -translate-y-1/2"><ChevronRight className="w-6 h-6 text-white/70" /></div>
                               <div className="absolute inset-8 bg-white/5 rounded-full flex items-center justify-center">
                                  <span className="text-[10px] text-white/50 font-bold">PTZ</span>
                               </div>
                           </div>
                         </div>
                     </div>
                   )}
               </div>
            </div>

            {/* Minimized Label */}
            {!isCamExpanded && (
                <div className="h-0 group-hover:h-auto transition-all overflow-hidden bg-black/80 px-2 py-1 absolute bottom-0 left-0 right-0 backdrop-blur">
                    <div className="flex items-center gap-1 text-[10px] text-green-400">
                        <Bot className="w-3 h-3" />
                        <span>点击放大查看</span>
                    </div>
                </div>
            )}
        </div>


        {/* Map UI Elements (Hidden when video is expanded) */}
        {!isCamExpanded && (
          <>
            <div className="z-10 absolute top-4 left-4 right-4 bg-white/90 backdrop-blur rounded-xl shadow-lg p-3 flex items-center gap-3 border border-white/50">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center border-2 border-white shadow-sm overflow-hidden">
                    <img src="https://picsum.photos/seed/grandpa/100/100" className="w-full h-full object-cover" alt="Avatar" />
                </div>
                <div>
                    <p className="font-bold text-sm text-gray-800">张建国</p>
                    <div className="flex items-center gap-1 text-xs text-green-600 font-bold">
                        <ShieldCheck className="w-3 h-3" />
                        <span>在安全围栏内</span>
                    </div>
                </div>
                <div className="ml-auto flex flex-col items-end">
                    <div className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                        <Bot className="w-3 h-3" /> 伴随中
                    </div>
                    <span className="text-[10px] text-gray-500 mt-1">精度: ±0.5m</span>
                </div>
            </div>

            {/* Marker & Safe Zone */}
            <div className="z-10 absolute top-[38%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                {/* Info Box */}
                <div className="bg-white/95 backdrop-blur p-2 rounded-lg shadow-xl mb-3 animate-bounce flex items-center gap-2 border border-blue-100">
                    <Bot className="w-4 h-4 text-blue-500" />
                    <div>
                        <p className="text-xs font-bold text-gray-800">幸福小区 3栋</p>
                        <p className="text-[10px] text-gray-500">机器人实时上传</p>
                    </div>
                </div>
                
                {/* Marker Graphic */}
                <div className="relative">
                    <div className="w-4 h-4 bg-blue-500 border-2 border-white rounded-full shadow-lg z-20 relative animate-pulse"></div>
                    <div className="absolute -right-2 -bottom-2 w-6 h-6 bg-gray-800 border-2 border-white rounded-full z-30 flex items-center justify-center shadow-lg">
                        <Bot className="w-3 h-3 text-white" />
                    </div>
                </div>
            </div>

            {/* Floating Action Button */}
            <div className="z-10 absolute bottom-24 right-4 flex flex-col gap-2">
                 <button className="bg-white p-3 rounded-full shadow-lg text-gray-700 active:bg-gray-50 hover:shadow-xl transition-all border border-gray-100">
                    <Layers className="w-6 h-6" />
                </button>
                <button className="bg-white p-3 rounded-full shadow-lg text-gray-700 active:bg-gray-50 hover:shadow-xl transition-all border border-gray-100">
                    <Navigation className="w-6 h-6" />
                </button>
            </div>
          </>
        )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col h-screen overflow-hidden">
      {renderToast()}
      {renderMessageModal()}
      
      {/* Top Header - Hidden in Fullscreen Cam */}
      {!isCamExpanded && (
        <header className="bg-white p-4 sticky top-0 z-20 shadow-sm shrink-0">
            <div className="flex justify-between items-center">
            <h1 className="text-lg font-bold text-gray-900">
                {activeTab === 'alerts' ? '健康告警中心' : activeTab === 'map' ? '实时定位追踪' : '父亲的健康看板'}
            </h1>
            <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                在线
                </div>
                <div className="flex items-center text-gray-400 gap-1">
                <Signal className="w-4 h-4" />
                <Battery className="w-4 h-4" />
                </div>
            </div>
            </div>
        </header>
      )}

      {/* Main Content Area */}
      {/* We use flex-1 and overflow-auto generally, but for map we want to handle scroll differently or not at all */}
      <div className={`flex-1 relative bg-gray-50 ${activeTab === 'map' ? 'overflow-hidden flex flex-col' : 'overflow-auto block'}`}>
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'alerts' && renderAlerts()}
        {/* Map needs to take full height of the flex container */}
        {activeTab === 'map' && renderMap()}
      </div>

      {/* Tab Bar for Family */}
      {/* Hide tab bar when video is expanded to ensure full immersion */}
      <nav className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-3 flex justify-around text-xs shadow-lg z-[90] transition-transform duration-300 ${isCamExpanded ? 'translate-y-full' : 'translate-y-0'}`}>
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'dashboard' ? 'text-blue-600' : 'text-gray-400'}`}
          >
              <Activity className="w-6 h-6" />
              <span>看板</span>
          </button>
          <button 
             onClick={() => setActiveTab('map')}
             className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'map' ? 'text-blue-600' : 'text-gray-400'}`}
          >
              <MapPin className="w-6 h-6" />
              <span>定位</span>
          </button>
           <button 
             onClick={() => setActiveTab('alerts')}
             className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'alerts' ? 'text-blue-600' : 'text-gray-400'}`}
          >
              <div className="relative">
                <Bell className="w-6 h-6" />
                {unreadCount > 0 && <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>}
              </div>
              <span>告警</span>
          </button>
      </nav>
    </div>
  );
};

export default FamilyView;