import React, { useState, useEffect } from 'react';
import { Users, FileText, ClipboardList, Clock, Search, Bell, ChevronRight, Phone, Check, Mic, MicOff, Video, VideoOff, PhoneOff, Maximize2 } from 'lucide-react';
import { MOCK_VITALS_BP } from '../types';

const DoctorView: React.FC = () => {
  const [selectedPatientIndex, setSelectedPatientIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [toast, setToast] = useState<{show: boolean, message: string}>({show: false, message: ''});
  
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
     { name: '张建国', age: 76, gender: '男', issue: '血压异常', time: '10:30', urgent: true, conditions: '慢性病史：高血压 II 级, 糖尿病', avatar: 'https://picsum.photos/seed/grandpa/400/400' },
     { name: '王淑芬', age: 82, gender: '女', issue: '常规回访', time: '14:00', urgent: false, conditions: '慢性病史：冠心病，关节炎', avatar: 'https://picsum.photos/seed/grandma/400/400' },
     { name: '刘志强', age: 69, gender: '男', issue: '用药咨询', time: '15:15', urgent: false, conditions: '慢性病史：高脂血症', avatar: 'https://picsum.photos/seed/man1/400/400' },
     { name: '陈大爷', age: 72, gender: '男', issue: '血糖监测', time: '16:00', urgent: false, conditions: '慢性病史：2型糖尿病', avatar: 'https://picsum.photos/seed/man2/400/400' },
     { name: '李奶奶', age: 78, gender: '女', issue: '体检报告解读', time: '16:30', urgent: false, conditions: '慢性病史：无', avatar: 'https://picsum.photos/seed/woman1/400/400' },
  ];

  const filteredPatients = allPatients.filter(p => p.name.includes(searchTerm));
  const currentPatient = filteredPatients[selectedPatientIndex] || filteredPatients[0];

  const handleVideoCall = () => {
      if(currentPatient) {
        setIsVideoCallActive(true);
      }
  };

  const endVideoCall = () => {
      setIsVideoCallActive(false);
      showToast("诊疗通话已结束，时长 " + formatDuration(callDuration));
  };

  const handleSaveRecord = () => {
      showToast("随访记录已保存到云端");
  };

  const renderToast = () => (
    <div className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-[70] transition-all duration-300 pointer-events-none ${toast.show ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
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
        <div className="relative flex-1 bg-gray-900 overflow-hidden">
             <img 
               src={currentPatient.avatar} 
               className="w-full h-full object-cover opacity-90" 
               alt="Patient" 
             />
             
             {/* Status Badge */}
             <div className="absolute top-8 left-8 bg-black/40 backdrop-blur-md px-4 py-2 rounded-lg text-white flex items-center gap-3">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="font-mono text-lg">{formatDuration(callDuration)}</span>
                <span className="border-l border-white/20 pl-3 text-sm opacity-80">{currentPatient.name} (实时诊疗)</span>
             </div>

             {/* Doctor PiP (Picture in Picture) */}
             <div className="absolute top-8 right-8 w-32 h-48 bg-gray-800 rounded-xl overflow-hidden border-2 border-white/20 shadow-2xl">
                {!isCameraOff ? (
                    <div className="w-full h-full bg-blue-900 flex items-center justify-center text-white/50 text-xs">
                        医生视角(模拟)
                    </div>
                ) : (
                    <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                        <VideoOff className="text-white/50 w-8 h-8" />
                    </div>
                )}
             </div>
        </div>

        {/* Controls Bar */}
        <div className="h-24 bg-gray-900 flex items-center justify-center gap-6 pb-4">
             <button 
                onClick={() => setIsMuted(!isMuted)}
                className={`p-4 rounded-full transition-all ${isMuted ? 'bg-white text-gray-900' : 'bg-gray-700/50 text-white hover:bg-gray-700'}`}
             >
                {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
             </button>
             
             <button 
                onClick={endVideoCall}
                className="p-5 bg-red-600 rounded-full text-white shadow-lg shadow-red-600/30 hover:bg-red-700 active:scale-95 transition-all mx-4"
             >
                <PhoneOff className="w-8 h-8" />
             </button>

             <button 
                onClick={() => setIsCameraOff(!isCameraOff)}
                className={`p-4 rounded-full transition-all ${isCameraOff ? 'bg-white text-gray-900' : 'bg-gray-700/50 text-white hover:bg-gray-700'}`}
             >
                {isCameraOff ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
             </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
       {renderToast()}
       {renderVideoOverlay()}

       {/* Doctor Header */}
       <header className="bg-white border-b border-gray-200 p-4 flex justify-between items-center sticky top-0 z-30">
         <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold shrink-0">李</div>
            <div className="hidden sm:block">
              <h1 className="text-sm font-bold text-gray-900">李医生</h1>
              <p className="text-xs text-gray-500">社区健康管理中心</p>
            </div>
         </div>
         
         <div className="flex-1 max-w-md mx-4">
             <div className="relative">
                 <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                 <input 
                    type="text" 
                    placeholder="搜索患者姓名..." 
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setSelectedPatientIndex(0); // Reset selection on search
                    }}
                    className="w-full bg-gray-100 rounded-full pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                 />
             </div>
         </div>

         <div className="flex gap-4 text-gray-500 shrink-0">
            <Bell className="w-5 h-5 hover:text-gray-700 cursor-pointer" />
         </div>
       </header>

       <main className="flex-1 p-6 max-w-5xl mx-auto w-full">
         
         {/* Stats Overview */}
         <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-500">
              <p className="text-xs text-gray-500 uppercase">今日随访</p>
              <p className="text-2xl font-bold text-gray-800">12</p>
            </div>
             <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-red-500">
              <p className="text-xs text-gray-500 uppercase">异常警报</p>
              <p className="text-2xl font-bold text-gray-800">3</p>
            </div>
             <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-green-500">
              <p className="text-xs text-gray-500 uppercase">健康档案</p>
              <p className="text-2xl font-bold text-gray-800">128</p>
            </div>
         </div>

         <div className="flex gap-6 items-start">
            {/* Patient List */}
            <div className="w-full md:w-1/3 bg-white rounded-xl shadow-sm overflow-hidden flex flex-col min-h-[500px]">
                <div className="p-4 border-b border-gray-100 font-bold text-gray-700 flex justify-between items-center">
                  <span>列表 ({filteredPatients.length})</span>
                  <span className="text-blue-600 text-xs bg-blue-50 px-2 py-1 rounded">待处理</span>
                </div>
                <div className="divide-y divide-gray-100 overflow-y-auto max-h-[600px]">
                   {filteredPatients.length === 0 ? (
                       <div className="p-8 text-center text-gray-400 text-sm">
                           未找到相关患者
                       </div>
                   ) : (
                       filteredPatients.map((p, i) => (
                         <div 
                            key={i} 
                            onClick={() => setSelectedPatientIndex(i)}
                            className={`p-4 hover:bg-gray-50 cursor-pointer flex justify-between items-center transition-colors ${selectedPatientIndex === i ? 'bg-blue-50 border-l-4 border-blue-600 pl-3' : 'pl-4'}`}
                         >
                            <div>
                              <div className="flex items-center gap-2">
                                 <span className={`font-bold ${selectedPatientIndex === i ? 'text-blue-800' : 'text-gray-800'}`}>{p.name}</span>
                                 <span className="text-xs text-gray-400">{p.age}岁</span>
                              </div>
                              <p className={`text-sm mt-1 ${p.urgent ? 'text-red-500 font-medium' : 'text-gray-500'}`}>{p.issue}</p>
                            </div>
                            <div className="text-right">
                               <span className="text-xs text-gray-400 block">{p.time}</span>
                               <ChevronRight className={`w-4 h-4 inline-block mt-1 ${selectedPatientIndex === i ? 'text-blue-500' : 'text-gray-300'}`} />
                            </div>
                         </div>
                       ))
                   )}
                </div>
            </div>

            {/* Detailed View (Right side) */}
            <div className="hidden md:block flex-1 bg-white rounded-xl shadow-sm p-6 animate-in fade-in duration-200" key={currentPatient ? currentPatient.name : 'empty'}>
                {currentPatient ? (
                    <>
                        <div className="flex justify-between items-start mb-6">
                          <div>
                            <h2 className="text-2xl font-bold text-gray-800">
                                {currentPatient.name} 
                                <span className="text-lg font-normal text-gray-500 ml-2">{currentPatient.gender}, {currentPatient.age}岁</span>
                            </h2>
                            <p className="text-gray-500 mt-1">{currentPatient.conditions}</p>
                          </div>
                          <button 
                            onClick={handleVideoCall}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm active:scale-95 transform"
                          >
                            <Phone className="w-4 h-4" /> 远程视频
                          </button>
                        </div>

                        {/* Medical Data Grid */}
                        <div className="grid grid-cols-2 gap-6 mb-8">
                           <div className="border border-gray-200 rounded-lg p-4">
                              <h3 className="font-bold text-gray-700 mb-3">近期血压记录</h3>
                              <div className="space-y-2">
                                 {MOCK_VITALS_BP.slice(-3).reverse().map((r, idx) => (
                                   <div key={idx} className="flex justify-between text-sm border-b border-gray-100 pb-2 last:border-0">
                                     <span className="text-gray-500">{r.time}</span>
                                     <span className={`${r.value > 120 ? 'text-red-500 font-bold' : 'text-gray-700'}`}>{r.value}/{r.value2} mmHg</span>
                                   </div>
                                 ))}
                              </div>
                           </div>
                           <div className="border border-gray-200 rounded-lg p-4">
                              <h3 className="font-bold text-gray-700 mb-3">随访记录</h3>
                              <textarea className="w-full h-24 p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none" placeholder={`输入对 ${currentPatient.name} 的随访情况...`}></textarea>
                              <button 
                                onClick={handleSaveRecord}
                                className="mt-2 w-full bg-gray-800 hover:bg-gray-900 text-white py-2 rounded text-sm transition-colors"
                              >
                                  保存记录
                              </button>
                           </div>
                        </div>

                        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                           <h3 className="font-bold text-yellow-800 mb-2">医生建议</h3>
                           <ul className="list-disc list-inside text-sm text-yellow-900 space-y-1">
                             <li>注意低盐饮食，每日食盐摄入不超过6g。</li>
                             <li>建议增加户外散步时间，保持心情舒畅。</li>
                             <li>下周三（10月30日）复查空腹血糖。</li>
                           </ul>
                        </div>
                    </>
                ) : (
                    <div className="h-full flex items-center justify-center text-gray-400 flex-col">
                        <Users className="w-16 h-16 mb-4 opacity-50" />
                        <p>请选择左侧患者查看详情</p>
                    </div>
                )}
            </div>
         </div>
       </main>

       {/* Doctor Mobile Nav (simplified) */}
       <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-2 flex justify-around">
          <button className="p-2 text-blue-600 flex flex-col items-center">
            <Users className="w-6 h-6" />
            <span className="text-xs">患者</span>
          </button>
          <button className="p-2 text-gray-400 flex flex-col items-center">
            <ClipboardList className="w-6 h-6" />
            <span className="text-xs">档案</span>
          </button>
           <button className="p-2 text-gray-400 flex flex-col items-center">
            <Clock className="w-6 h-6" />
            <span className="text-xs">排班</span>
          </button>
       </nav>
    </div>
  );
};

export default DoctorView;