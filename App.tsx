import React, { useState } from 'react';
import { UserRole } from './types';
import SeniorView from './views/SeniorView';
import FamilyView from './views/FamilyView';
import DoctorView from './views/DoctorView';
import { Settings, Users } from 'lucide-react';

const App: React.FC = () => {
  const [currentRole, setCurrentRole] = useState<UserRole>(UserRole.SENIOR);
  const [showRoleSwitcher, setShowRoleSwitcher] = useState<boolean>(true);

  const renderView = () => {
    switch (currentRole) {
      case UserRole.SENIOR:
        return <SeniorView />;
      case UserRole.FAMILY:
        return <FamilyView />;
      case UserRole.DOCTOR:
        return <DoctorView />;
      default:
        return <SeniorView />;
    }
  };

  return (
    <div className="relative min-h-screen max-w-screen overflow-x-hidden">
      {/* Simulation Control Panel - Floating */}
      <div className={`fixed bottom-24 right-4 z-[100] flex flex-col items-end gap-2 transition-opacity ${showRoleSwitcher ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="bg-gray-900/90 backdrop-blur-sm p-4 rounded-xl shadow-2xl text-white w-64 border border-gray-700">
           <div className="flex justify-between items-center mb-3 border-b border-gray-700 pb-2">
             <h3 className="font-bold flex items-center gap-2">
               <Users className="w-4 h-4" />
               角色模拟
             </h3>
             <span className="text-xs bg-blue-600 px-2 py-0.5 rounded text-white">原型演示</span>
           </div>
           
           <div className="space-y-2">
             <button 
                onClick={() => setCurrentRole(UserRole.SENIOR)}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center gap-2 ${currentRole === UserRole.SENIOR ? 'bg-teal-600' : 'hover:bg-white/10'}`}
             >
                <span className="w-2 h-2 rounded-full bg-white"></span>
                老人端 (适老化)
             </button>
             <button 
                onClick={() => setCurrentRole(UserRole.FAMILY)}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center gap-2 ${currentRole === UserRole.FAMILY ? 'bg-blue-600' : 'hover:bg-white/10'}`}
             >
                <span className="w-2 h-2 rounded-full bg-blue-200"></span>
                家属端 (监控)
             </button>
             <button 
                onClick={() => setCurrentRole(UserRole.DOCTOR)}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center gap-2 ${currentRole === UserRole.DOCTOR ? 'bg-purple-600' : 'hover:bg-white/10'}`}
             >
                <span className="w-2 h-2 rounded-full bg-purple-200"></span>
                医护端 (管理)
             </button>
           </div>
           
           <p className="text-[10px] text-gray-400 mt-3 text-center">
             点击下方齿轮隐藏/显示此面板
           </p>
        </div>
      </div>

      {/* Toggle Button for Role Switcher */}
      <button 
        onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
        className="fixed bottom-6 right-4 z-[101] bg-gray-800 text-white p-3 rounded-full shadow-lg hover:bg-gray-700 active:scale-90 transition-all"
      >
        <Settings className="w-6 h-6 animate-spin-slow" />
      </button>

      {/* Main View Container */}
      <div className="w-full h-full">
        {renderView()}
      </div>
    </div>
  );
};

export default App;