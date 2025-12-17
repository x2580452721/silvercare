import React, { useState, useEffect } from 'react';
import { Users, FileText, ClipboardList, Clock, Search, Bell, ChevronRight, Phone, Check, Mic, MicOff, Video, VideoOff, PhoneOff, Maximize2, Bot, Wifi, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Download, Activity, ChevronLeft, Calendar, Stethoscope, AlertCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MOCK_VITALS_BP } from '../types';

const DoctorView: React.FC = () => {
  const [selectedPatientIndex, setSelectedPatientIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [toast, setToast] = useState<{show: boolean, message: string}>({show: false, message: ''});
  
  // Mobile View State
  const [showMobileDetail, setShowMobileDetail] = useState(false);

  // Form State
  const [visitNote, setVisitNote] = useState('');
  
  // Video Call State
  const [isVideoCallActive, setIsVideoCallActive] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);

  // Toast auto-hide
  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => setToast({show: false, message: ''}), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Call Timer
  useEffect(() => {
    let interval: number;
    if (isVideoCallActive) {
      interval = window.setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(interval);
  }, [isVideoCallActive]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const showToast = (msg: string) => {
    setToast({ show: true, message: msg });
  };

  const allPatients = [
     { name: '张建国', age: 76, gender: '男', issue: '血压异常', time: '10:30', urgent: true, conditions: '慢性病史：高血压 II 级, 糖尿病', avatar: 'https://picsum.photos/seed/grandpa/400/400', robotStatus: 'online', heartRate: 78, spo2: 96 },
     { name: '王淑芬', age: 82, gender: '女', issue: '常规回访', time: '14:00', urgent: false, conditions: '慢性病史：冠心病，关节炎', avatar: 'https://picsum.photos/seed/grandma/400/400', robotStatus: 'charging', heartRate: 72, spo2: 98 },
     { name: '刘志强', age: 69, gender: '男', issue: '用药咨询', time: '15:15', urgent: false, conditions: '慢性病史：高脂血症', avatar: 'https://picsum.photos/seed/man1/400/400', robotStatus: 'online', heartRate: 80, spo2: 97 },
     { name: '陈大爷', age: 72, gender: '男', issue: '血糖监测', time: '16:00', urgent: false, conditions: '慢性病史：2型糖尿病', avatar: 'https://picsum.photos/seed/man2/400/400', robotStatus: 'offline', heartRate: 0, spo2: 0 },
     { name: '李奶奶', age: 78, gender: '女', issue: '体检报告解读', time: '16:30', urgent: false, conditions: '慢性病史：无', avatar: 'https://picsum.photos/seed/woman1/400/400', robotStatus: 'online', heartRate: 75, spo2: 99 },
  ];

  const filteredPatients = allPatients.filter(p => p.name.includes(searchTerm));
  const currentPatient = filteredPatients[selectedPatientIndex] || filteredPatients[0];

  const handlePatientClick = (index: number) => {
      setSelectedPatientIndex(index);
      setShowMobileDetail(true);
      setVisitNote(''); // Reset note on switch
  };

  const handleVideoCall = () => {
      if(currentPatient) {
        setIsVideoCallActive(true);
      }
  };

  const endVideoCall = () => {
      setIsVideoCallActive(false);
      showToast("诊疗通话已结束，记录已同步至机器人");
  };

  const handleSaveRecord = () => {
      showToast("随访记录已保存，医嘱已下发至患者机器人");
      setVisitNote('');
  };

  const handleImportRobotData = () => {
      showToast("正在从机器人端同步今日监测摘要...");
      setTimeout(() => {
          setVisitNote(`[机器人自动生成汇报 - ${new Date().toLocaleDateString()}]
--------------------------------
1. 生命体征: 
   - 晨间血压: 120/80 mmHg (稳定)
   - 平均心率: 72 bpm
   - 睡眠时长: 7.5 小时

2. 用药合规性:
   - 08:00 降压药 [已服用 - 视觉确认]
   - 12:00 维生素 [已服用]

3. 行为分析:
   - 上午户外活动 45分钟
   - 步态平稳，无跌倒风险
--------------------------------`);
      }, 800);
  };

  const renderToast = () => (
    <div className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-[120] transition-all duration-300 pointer-events-none ${toast.show ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
      <div className="bg-gray-800 text-white px-6 py-3 rounded-full text-sm font-bold shadow-xl flex items-center gap-2">
        <Check className="w-4 h-4 text-green-400" />
        {toast.message}
      </div>
    </div>
  );

  const renderVideoOverlay = () => {
    if (!isVideoCallActive || !currentPatient) return null;

    return (
      <div className="fixed inset-0 z-[100] bg-black flex flex-col animate-in fade-in duration-300">
        {/* Main Video Area (Patient) */}
        <div className="relative flex-1 bg-gray-900 overflow-hidden group">
             <img 
               src={currentPatient.avatar} 
               className="w-full h-full object-cover opacity-80" 
               alt="Patient" 
             />
             
             {/* AR HUD Overlay */}
             <div className="absolute inset-0 pointer-events-none">
                 {/* Top Status */}
                 <div className="absolute top-8 left-8 flex items-center gap-4">
                     <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-lg text-white flex items-center gap-3 border border-white/10">
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                        <span className="font-mono text-lg font-bold text-red-400">{formatDuration(callDuration)}</span>
                        <div className="h-4 w-px bg-white/20"></div>
                        <Bot className="w-4 h-4 text-blue-400" /> 
                        <span className="text-sm font-medium">{currentPatient.name}的家庭机器人</span>
                     </div>
                 </div>

                 {/* AR Vital Signs Floating Card */}
                 <div className="absolute top-8 right-8 w-64 bg-black/40 backdrop-blur-md rounded-xl p-4 border border-blue-500/30 text-white">
                     <h4 className="text-xs font-bold text-blue-400 uppercase mb-3 flex items-center gap-2">
                         <Activity className="w-3 h-3" /> 实时体征监测 (AR)
                     </h4>
                     <div className="space-y-3">
                         <div className="flex justify-between items-end">
                             <span className="text-sm text-gray-300">心率</span>
                             <span className="text-2xl font-mono font-bold">{currentPatient.heartRate} <span className="text-xs font-normal text-gray-400">bpm</span></span>
                         </div>
                         <div className="w-full bg-gray-700 h-1 rounded-full overflow-hidden">
                             <div className="bg-green-500 h-full w-[70%] animate-pulse"></div>
                         </div>
                         <div className="flex justify-between items-end pt-2">
                             <span className="text-sm text-gray-300">血氧</span>
                             <span className="text-2xl font-mono font-bold">{currentPatient.spo2}%</span>
                         </div>
                     </div>
                 </div>
                 
                 {/* Center Crosshair (Subtle) */}
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 opacity-20">
                     <div className="absolute top-0 left-0 w-4 h-1 bg-white"></div>
                     <div className="absolute top-0 left-0 w-1 h-4 bg-white"></div>
                     <div className="absolute top-0 right-0 w-4 h-1 bg-white"></div>
                     <div className="absolute top-0 right-0 w-1 h-4 bg-white"></div>
                     <div className="absolute bottom-0 left-0 w-4 h-1 bg-white"></div>
                     <div className="absolute bottom-0 left-0 w-1 h-4 bg-white"></div>
                     <div className="absolute bottom-0 right-0 w-4 h-1 bg-white"></div>
                     <div className="absolute bottom-0 right-0 w-1 h-4 bg-white"></div>
                 </div>
             </div>

             {/* PTZ Controls (Bottom Left) */}
             <div className="absolute bottom-32 left-8 pointer-events-auto">
                 <div className="bg-black/40 backdrop-blur-md p-4 rounded-full border border-white/10 relative w-32 h-32 shadow-xl">
                     <div className="absolute inset-0 flex items-center justify-center">
                         <div className="w-12 h-12 bg-white/10 rounded-full"></div>
                     </div>
                     <button className="absolute top-1 left-1/2 -translate-x-1/2 p-2 hover:bg-blue-500/20 rounded-full transition-colors text-white"><ArrowUp className="w-6 h-6"/></button>
                     <button className="absolute bottom-1 left-1/2 -translate-x-1/2 p-2 hover:bg-blue-500/20 rounded-full transition-colors text-white"><ArrowDown className="w-6 h-6"/></button>
                     <button className="absolute left-1 top-1/2 -translate-y-1/2 p-2 hover:bg-blue-500/20 rounded-full transition-colors text-white"><ArrowLeft className="w-6 h-6"/></button>
                     <button className="absolute right-1 top-1/2 -translate-y-1/2 p-2 hover:bg-blue-500/20 rounded-full transition-colors text-white"><ArrowRight className="w-6 h-6"/></button>
                 </div>
                 <p className="text-center text-xs text-white/50 mt-2 font-mono">ROBOT PTZ</p>
             </div>

             {/* Doctor Self-View PiP */}
             <div className="absolute bottom-32 right-8 w-36 h-48 bg-gray-800 rounded-xl overflow-hidden border-2 border-white/20 shadow-2xl z-10">
                {!isCameraOff ? (
                    <div className="w-full h-full bg-blue-900 flex items-center justify-center relative">
                        <Users className="text-white/20 w-12 h-12" />
                        <div className="absolute bottom-2 left-2 text-[10px] text-white bg-black/50 px-1 rounded">医生视角</div>
                    </div>
                ) : (
                    <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                        <VideoOff className="text-white/50 w-8 h-8" />
                    </div>
                )}
             </div>
        </div>

        {/* Controls Bar */}
        <div className="h-24 bg-gray-900 flex items-center justify-center gap-8 pb-6 border-t border-white/10">
             <button 
                onClick={() => setIsMuted(!isMuted)}
                className={`p-4 rounded-full transition-all duration-200 ${isMuted ? 'bg-white text-gray-900' : 'bg-gray-800 text-white hover:bg-gray-700 border border-white/10'}`}
             >
                {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
             </button>
             
             <button 
                onClick={endVideoCall}
                className="p-5 bg-red-600 rounded-full text-white shadow-lg shadow-red-600/30 hover:bg-red-700 hover:scale-105 active:scale-95 transition-all mx-4 ring-4 ring-red-900/20"
             >
                <PhoneOff className="w-8 h-8" />
             </button>

             <button 
                onClick={() => setIsCameraOff(!isCameraOff)}
                className={`p-4 rounded-full transition-all duration-200 ${isCameraOff ? 'bg-white text-gray-900' : 'bg-gray-800 text-white hover:bg-gray-700 border border-white/10'}`}
             >
                {isCameraOff ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
             </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col h-screen overflow-hidden">
       {renderToast()}
       {renderVideoOverlay()}

       {/* Doctor Header */}
       <header className="bg-white border-b border-gray-200 px-4 py-3 flex justify-between items-center shrink-0 z-30">
         <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center text-white font-bold shrink-0 shadow-sm">
                <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-gray-900">智慧康养工作台</h1>
              <p className="text-[10px] text-gray-500">李医生 | 社区健康中心</p>
            </div>
         </div>
         
         <div className="flex-1 max-w-sm mx-4 hidden sm:block">
             <div className="relative group">
                 <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                 <input 
                    type="text" 
                    placeholder="搜索患者姓名/ID..." 
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setSelectedPatientIndex(0);
                    }}
                    className="w-full bg-gray-100 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white transition-all"
                 />
             </div>
         </div>

         <div className="flex gap-4 text-gray-500 shrink-0">
            <button className="relative hover:bg-gray-100 p-2 rounded-full transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
         </div>
       </header>

       <div className="flex flex-1 overflow-hidden">
            {/* Left Sidebar: Patient List */}
            <aside className={`w-full md:w-80 lg:w-96 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 absolute md:relative z-20 h-full ${showMobileDetail ? '-translate-x-full md:translate-x-0' : 'translate-x-0'}`}>
                {/* Mobile Search Bar */}
                <div className="p-4 border-b border-gray-100 md:hidden">
                    <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="搜索患者..." 
                            className="w-full bg-gray-100 rounded-lg pl-9 pr-4 py-2 text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex border-b border-gray-100 text-sm font-medium text-gray-500">
                    <button className="flex-1 py-3 text-blue-600 border-b-2 border-blue-600 bg-blue-50/50">全部患者</button>
                    <button className="flex-1 py-3 hover:text-gray-700 hover:bg-gray-50">重点关注</button>
                </div>

                {/* Patient List Items */}
                <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
                   {filteredPatients.length === 0 ? (
                       <div className="p-8 text-center text-gray-400 text-sm flex flex-col items-center">
                           <Users className="w-10 h-10 mb-2 opacity-20" />
                           未找到相关患者
                       </div>
                   ) : (
                       filteredPatients.map((p, i) => (
                         <div 
                            key={i} 
                            onClick={() => handlePatientClick(i)}
                            className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors group ${selectedPatientIndex === i ? 'bg-blue-50/60 border-l-4 border-blue-600' : 'border-l-4 border-transparent'}`}
                         >
                            <div className="flex justify-between items-start mb-1">
                                <div className="flex items-center gap-2">
                                     <span className={`font-bold text-base ${selectedPatientIndex === i ? 'text-blue-900' : 'text-gray-800'}`}>{p.name}</span>
                                     <span className="px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded text-xs">{p.gender} {p.age}</span>
                                </div>
                                <span className="text-xs text-gray-400">{p.time}</span>
                            </div>
                            
                            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                                {p.urgent && <AlertCircle className="w-3 h-3 text-red-500" />}
                                <span className={`truncate ${p.urgent ? 'text-red-600 font-medium' : ''}`}>{p.issue}</span>
                            </div>

                            <div className="flex items-center justify-between mt-2">
                                <div className={`text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 w-fit ${p.robotStatus === 'online' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                                    <Bot className="w-3 h-3" />
                                    {p.robotStatus === 'online' ? '在线' : '离线'}
                                </div>
                                <ChevronRight className={`w-4 h-4 text-gray-300 group-hover:text-blue-400 transition-colors ${selectedPatientIndex === i ? 'text-blue-500' : ''}`} />
                            </div>
                         </div>
                       ))
                   )}
                </div>
            </aside>

            {/* Right Main Content: Patient Detail */}
            <main className={`flex-1 bg-gray-50 flex flex-col h-full w-full absolute md:relative z-10 transition-transform duration-300 ${showMobileDetail ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}`}>
                
                {/* Mobile Header with Back Button */}
                <div className="md:hidden bg-white border-b border-gray-200 p-3 flex items-center gap-2 sticky top-0 z-20">
                    <button onClick={() => setShowMobileDetail(false)} className="p-1 hover:bg-gray-100 rounded-full">
                        <ChevronLeft className="w-6 h-6 text-gray-600" />
                    </button>
                    <span className="font-bold text-gray-800">患者详情</span>
                </div>

                {currentPatient ? (
                    <div className="flex-1 overflow-y-auto p-4 md:p-8">
                        {/* Patient Header Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6 flex flex-col md:flex-row justify-between md:items-center gap-4">
                            <div className="flex items-start gap-4">
                                <div className="relative">
                                    <img src={currentPatient.avatar} className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md" alt="Avatar" />
                                    <div className={`absolute bottom-0 right-0 w-4 h-4 border-2 border-white rounded-full ${currentPatient.robotStatus === 'online' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                        {currentPatient.name}
                                        {currentPatient.urgent && <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full font-bold">异常</span>}
                                    </h2>
                                    <p className="text-gray-500 text-sm mt-1">{currentPatient.conditions}</p>
                                    <div className="flex items-center gap-2 mt-2 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded w-fit">
                                        <Wifi className="w-3 h-3" />
                                        机器人连接稳定 | 电量 82%
                                    </div>
                                </div>
                            </div>
                            <button 
                                onClick={handleVideoCall}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-600/20 active:scale-95 transition-all flex items-center justify-center gap-2 w-full md:w-auto"
                            >
                                <Video className="w-5 h-5" />
                                远程听诊 (视频)
                            </button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Chart Card */}
                            <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                        <Activity className="w-5 h-5 text-blue-500" />
                                        近期血压监测趋势
                                    </h3>
                                    <select className="bg-gray-50 border-gray-200 text-xs rounded-md p-1 outline-none">
                                        <option>最近7天</option>
                                        <option>最近30天</option>
                                    </select>
                                </div>
                                <div className="h-64 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={MOCK_VITALS_BP}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                            <XAxis dataKey="time" fontSize={12} tickLine={false} axisLine={false} tick={{fill: '#9ca3af'}} />
                                            <YAxis domain={[60, 160]} fontSize={12} tickLine={false} axisLine={false} tick={{fill: '#9ca3af'}} />
                                            <Tooltip 
                                                contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}}
                                                itemStyle={{fontSize: '12px'}}
                                            />
                                            <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={3} dot={{r:4, fill:'#2563eb', strokeWidth:2, stroke:'#fff'}} name="收缩压" activeDot={{r:6}} />
                                            <Line type="monotone" dataKey="value2" stroke="#93c5fd" strokeWidth={3} dot={{r:4, fill:'#93c5fd', strokeWidth:2, stroke:'#fff'}} name="舒张压" />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Note Card */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col">
                                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <ClipboardList className="w-5 h-5 text-purple-500" />
                                    随访/医嘱记录
                                </h3>
                                <div className="flex-1 relative mb-4">
                                    <textarea 
                                        className="w-full h-full min-h-[200px] p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none resize-none transition-all"
                                        placeholder="在此输入随访记录..."
                                        value={visitNote}
                                        onChange={(e) => setVisitNote(e.target.value)}
                                    ></textarea>
                                    {/* Magic Import Button */}
                                    <button 
                                        onClick={handleImportRobotData}
                                        className="absolute bottom-3 right-3 text-xs bg-white hover:bg-blue-50 text-blue-600 border border-blue-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors shadow-sm font-medium"
                                        title="从机器人同步数据"
                                    >
                                        <Bot className="w-3 h-3" />
                                        一键生成报告
                                    </button>
                                </div>
                                <button 
                                    onClick={handleSaveRecord}
                                    className="w-full bg-gray-900 hover:bg-black text-white py-3 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2"
                                >
                                    <Check className="w-4 h-4" />
                                    保存记录并下发
                                </button>
                            </div>
                        </div>

                        {/* Recent History List (Optional) */}
                         <div className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-orange-500" />
                                历史记录
                            </h3>
                            <div className="space-y-3">
                                {[1, 2].map((_, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs">
                                                {10 - idx}月
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-800">常规季度随访</p>
                                                <p className="text-xs text-gray-500">2023-10-{20-idx*5} 14:30</p>
                                            </div>
                                        </div>
                                        <button className="text-xs text-blue-600 font-medium hover:underline">查看详情</button>
                                    </div>
                                ))}
                            </div>
                         </div>

                    </div>
                ) : (
                    <div className="h-full flex items-center justify-center text-gray-400 flex-col">
                        <Users className="w-20 h-20 mb-4 opacity-10" />
                        <p>请从左侧列表选择患者</p>
                    </div>
                )}
            </main>
       </div>
    </div>
  );
};

export default DoctorView;