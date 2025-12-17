import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { MOCK_VITALS_BP, MOCK_VITALS_HEART, MOCK_ALERTS } from '../types';
import HealthScoreGauge from '../components/HealthScoreGauge';
import { MapPin, Phone, MessageCircle, AlertTriangle, Battery, Signal, Activity, Bell, ChevronRight, Info, AlertCircle, Navigation, Check, X, Send, ShieldCheck } from 'lucide-react';

const FamilyView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'alerts' | 'map'>('dashboard');
  const [alerts, setAlerts] = useState(MOCK_ALERTS);
  const [toast, setToast] = useState<{show: boolean, message: string}>({show: false, message: ''});
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageText, setMessageText] = useState('');

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
    showToast("正在拨打老人电话...");
  };

  const handleMessageOpen = () => {
    setShowMessageModal(true);
  };

  const handleMessageSend = () => {
    if (messageText.trim()) {
        setShowMessageModal(false);
        showToast("留言已发送成功");
        setMessageText('');
    }
  };

  const handleAlertClick = (id: string) => {
    setAlerts(current => current.map(alert => 
        alert.id === id ? { ...alert, read: true } : alert
    ));
  };

  const unreadCount = alerts.filter(a => !a.read).length;

  const renderToast = () => (
    <div className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-[70] transition-all duration-300 pointer-events-none ${toast.show ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
      <div className="bg-gray-800 text-white px-6 py-3 rounded-full text-sm font-bold shadow-xl flex items-center gap-2">
        <Check className="w-4 h-4 text-green-400" />
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
                        <Send className="w-4 h-4" /> 发送
                     </button>
                 </div>
             </div>
         </div>
      </div>
    );
  };

  const renderDashboard = () => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
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
                            <span>当前位置：幸福小区 3栋 402</span>
                            <ChevronRight className="w-3 h-3" />
                        </div>
                        <p className="text-xs text-gray-400 mt-1">更新于 2分钟前</p>
                    </div>
                </div>
                <HealthScoreGauge score={88} label="健康分" size={80} />
            </div>
            
            <div className="grid grid-cols-2 gap-3 mt-4">
                <button 
                    onClick={handleCall}
                    className="flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-lg text-sm font-medium active:bg-blue-700 transition-colors shadow-sm"
                >
                    <Phone className="w-4 h-4" /> 拨打电话
                </button>
                <button 
                    onClick={handleMessageOpen}
                    className="flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 py-2 rounded-lg text-sm font-medium active:bg-gray-50 transition-colors shadow-sm"
                >
                    <MessageCircle className="w-4 h-4" /> 发送留言
                </button>
            </div>
        </div>

        {/* Alerts Preview */}
        {unreadCount > 0 && (
            <div 
              onClick={() => setActiveTab('alerts')}
              className="bg-orange-50 rounded-xl p-4 border border-orange-100 flex items-center justify-between cursor-pointer active:bg-orange-100 transition-colors animate-pulse-slow"
            >
                 <div className="flex items-start gap-3">
                   <div className="bg-orange-100 p-2 rounded-full text-orange-600">
                       <AlertTriangle className="w-5 h-5" />
                   </div>
                   <div>
                       <h3 className="text-sm font-bold text-orange-800">未读告警 ({unreadCount})</h3>
                       <p className="text-xs text-orange-700 mt-1">点击查看详情，请及时处理。</p>
                   </div>
                 </div>
                 <ChevronRight className="w-5 h-5 text-orange-300" />
            </div>
        )}

        {/* Charts */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-blue-500" />
                    心率趋势
                </h3>
                <span className="text-xs text-gray-400">近6小时</span>
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
            <div className="flex justify-between mt-2 text-sm">
                <div className="text-center">
                    <p className="text-gray-400 text-xs">平均</p>
                    <p className="font-bold text-gray-800">74 bpm</p>
                </div>
                <div className="text-center">
                    <p className="text-gray-400 text-xs">最高</p>
                    <p className="font-bold text-gray-800">82 bpm</p>
                </div>
                <div className="text-center">
                    <p className="text-gray-400 text-xs">最低</p>
                    <p className="font-bold text-gray-800">70 bpm</p>
                </div>
            </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex justify-between items-center mb-4">
                 <h3 className="font-bold text-gray-800 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-purple-500" />
                    血压周报
                </h3>
                <span className="text-xs text-gray-400">近7天</span>
            </div>
             <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={MOCK_VITALS_BP}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <XAxis dataKey="time" fontSize={10} tickLine={false} axisLine={false} />
                        <YAxis domain={[60, 140]} fontSize={10} tickLine={false} axisLine={false} />
                        <Tooltip />
                        <Line type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={2} dot={{r:3}} name="收缩压" />
                        <Line type="monotone" dataKey="value2" stroke="#a78bfa" strokeWidth={2} dot={{r:3}} strokeDasharray="5 5" name="舒张压" />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
      </main>
    </div>
  );

  const renderAlerts = () => (
    <main className="p-4 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
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
                  break;
                case 'warning':
                  icon = <AlertTriangle className="w-6 h-6 text-orange-600" />;
                  bgColor = 'bg-orange-50';
                  borderColor = 'border-orange-200';
                  textColor = 'text-orange-900';
                  break;
                case 'info':
                default:
                  icon = <Info className="w-6 h-6 text-blue-600" />;
                  bgColor = 'bg-blue-50';
                  borderColor = 'border-blue-200';
                  textColor = 'text-blue-900';
                  break;
             }
          }

          return (
            <div 
                key={alert.id} 
                onClick={() => handleAlertClick(alert.id)}
                className={`rounded-xl p-4 border ${borderColor} ${bgColor} shadow-sm relative overflow-hidden transition-all duration-300 ${alert.read ? 'opacity-80' : 'cursor-pointer hover:shadow-md'}`}
            >
               {/* Vertical Status Strip */}
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
                      <span className="text-xs text-gray-500 bg-white/60 px-2 py-1 rounded-md">{alert.time}</span>
                    </div>
                    <p className={`text-sm mt-1 ${alert.read ? 'text-gray-400' : 'text-gray-700'}`}>{alert.description}</p>
                    
                    {!alert.read && (
                        <div className="mt-3 bg-white/50 p-2 rounded-lg text-sm border border-black/5">
                        <span className="font-bold text-gray-700">建议处理：</span>
                        <span className="text-gray-600">{alert.suggestion}</span>
                        </div>
                    )}
                    
                    {!alert.read && (
                        <div className="mt-3 text-sm font-medium text-blue-600 flex items-center gap-1">
                             点击标记为已读 <Check className="w-3 h-3" />
                        </div>
                    )}
                 </div>
               </div>
            </div>
          );
        })}
      </div>
      
      <p className="text-center text-gray-400 text-xs mt-6">仅展示最近 30 天的告警记录</p>
    </main>
  );

  const renderMap = () => (
    <div className="h-full flex flex-col relative bg-gray-100 animate-in fade-in zoom-in-95 duration-500">
        <div className="absolute inset-0 bg-gray-200 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/Neighborhood_Map.png')] bg-cover grayscale opacity-60"></div>
        
        {/* Map UI Elements */}
        <div className="z-10 absolute top-4 left-4 right-4 bg-white rounded-lg shadow-md p-3 flex items-center gap-3">
             <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                 <img src="https://picsum.photos/seed/grandpa/100/100" className="w-full h-full rounded-full object-cover" alt="Avatar" />
             </div>
             <div>
                 <p className="font-bold text-sm">张建国</p>
                 <div className="flex items-center gap-1 text-xs text-green-600 font-bold">
                    <ShieldCheck className="w-3 h-3" />
                    <span>在安全围栏内</span>
                 </div>
             </div>
             <div className="ml-auto bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">
                 实时
             </div>
        </div>

        {/* Marker & Safe Zone */}
        <div className="z-10 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
             {/* Safe Zone Circle */}
             <div className="absolute w-64 h-64 border-2 border-green-500 bg-green-500/10 rounded-full -z-10 animate-pulse-slow pointer-events-none"></div>
             
             <div className="bg-white p-2 rounded-lg shadow-lg mb-2 animate-bounce">
                 <p className="text-xs font-bold">幸福小区 3栋 402</p>
                 <p className="text-[10px] text-gray-500">10:42 更新</p>
             </div>
             <div className="w-8 h-8 bg-blue-500 border-4 border-white rounded-full shadow-lg"></div>
             <div className="w-2 h-2 bg-black/20 rounded-full mt-1 blur-[1px]"></div>
        </div>

        {/* Floating Action Button */}
        <div className="z-10 absolute bottom-24 right-4 flex flex-col gap-2">
            <button className="bg-white p-3 rounded-full shadow-lg text-gray-700 active:bg-gray-50">
                <Navigation className="w-6 h-6" />
            </button>
        </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20 flex flex-col">
      {renderToast()}
      {renderMessageModal()}
      
      {/* Top Header */}
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

      <div className="flex-1 overflow-auto">
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'alerts' && renderAlerts()}
        {activeTab === 'map' && renderMap()}
      </div>

      {/* Tab Bar for Family */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-3 flex justify-around text-xs shadow-lg z-50">
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