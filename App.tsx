import React, { useState } from 'react';
import { ToolType } from './types';
import MenuCreator from './components/MenuCreator';
import AppointmentAssistant from './components/AppointmentAssistant';
import EventPromoter from './components/EventPromoter';
import { Utensils, CalendarCheck, Megaphone, LayoutGrid } from 'lucide-react';

const App: React.FC = () => {
  const [activeTool, setActiveTool] = useState<ToolType>(ToolType.MENU_CREATOR);

  const renderTool = () => {
    switch (activeTool) {
      case ToolType.MENU_CREATOR:
        return <MenuCreator />;
      case ToolType.APPOINTMENT_ASSISTANT:
        return <AppointmentAssistant />;
      case ToolType.EVENT_PROMOTER:
        return <EventPromoter />;
      default:
        return <MenuCreator />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col">
        <div className="p-6 border-b border-slate-100">
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <LayoutGrid className="w-6 h-6 text-brand-600" />
            BizBoost AI
          </h1>
          <p className="text-xs text-slate-500 mt-1">Marketing Suite</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setActiveTool(ToolType.MENU_CREATOR)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              activeTool === ToolType.MENU_CREATOR
                ? 'bg-orange-50 text-orange-600 font-medium shadow-sm'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Utensils className="w-5 h-5" />
            Menu Creator
          </button>
          
          <button
            onClick={() => setActiveTool(ToolType.APPOINTMENT_ASSISTANT)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              activeTool === ToolType.APPOINTMENT_ASSISTANT
                ? 'bg-teal-50 text-teal-600 font-medium shadow-sm'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <CalendarCheck className="w-5 h-5" />
            Appointments
          </button>
          
          <button
            onClick={() => setActiveTool(ToolType.EVENT_PROMOTER)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              activeTool === ToolType.EVENT_PROMOTER
                ? 'bg-indigo-50 text-indigo-600 font-medium shadow-sm'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Megaphone className="w-5 h-5" />
            Event Promoter
          </button>
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="bg-slate-50 rounded-lg p-3 text-xs text-slate-500">
            <p className="font-semibold text-slate-700 mb-1">Pro Tip</p>
            Use descriptive inputs for better AI results.
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto relative">
        {/* Mobile Header */}
        <div className="md:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between sticky top-0 z-10">
          <h1 className="font-bold text-slate-800 flex items-center gap-2">
            <LayoutGrid className="w-5 h-5 text-brand-600" />
            BizBoost
          </h1>
          <div className="flex gap-2">
             <button onClick={() => setActiveTool(ToolType.MENU_CREATOR)} className={`p-2 rounded-md ${activeTool === ToolType.MENU_CREATOR ? 'bg-orange-100 text-orange-600' : 'text-slate-500'}`}>
                <Utensils className="w-5 h-5" />
             </button>
             <button onClick={() => setActiveTool(ToolType.APPOINTMENT_ASSISTANT)} className={`p-2 rounded-md ${activeTool === ToolType.APPOINTMENT_ASSISTANT ? 'bg-teal-100 text-teal-600' : 'text-slate-500'}`}>
                <CalendarCheck className="w-5 h-5" />
             </button>
             <button onClick={() => setActiveTool(ToolType.EVENT_PROMOTER)} className={`p-2 rounded-md ${activeTool === ToolType.EVENT_PROMOTER ? 'bg-indigo-100 text-indigo-600' : 'text-slate-500'}`}>
                <Megaphone className="w-5 h-5" />
             </button>
          </div>
        </div>

        <div className="p-4 md:p-8">
          {renderTool()}
        </div>
      </main>
    </div>
  );
};

export default App;
