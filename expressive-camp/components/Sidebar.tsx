
import React from 'react';
import { Page, Stats } from '../types';
import { Home, BarChart3, Target, BookOpen, LineChart, ChevronRight } from 'lucide-react';

interface SidebarProps {
  currentPage: Page;
  setPage: (page: Page) => void;
  stats: Stats;
}

const navItems = [
  { key: 'home' as Page, label: '首页', icon: <Home size={20} /> },
  { key: 'diagnosis' as Page, label: '能力诊断', icon: <BarChart3 size={20} /> },
  { key: 'training' as Page, label: '场景训练', icon: <Target size={20} />, badge: 'NEW' },
  { key: 'knowledge' as Page, label: '知识库', icon: <BookOpen size={20} /> },
  { key: 'progress' as Page, label: '成长追踪', icon: <LineChart size={20} /> },
];

const Sidebar: React.FC<SidebarProps> = ({ currentPage, setPage, stats }) => {
  return (
    <aside className="w-80 p-6 hidden lg:flex flex-col h-screen sticky top-0">
      <div className="glass-card rounded-[32px] p-6 h-full flex flex-col">
        {/* Logo */}
        <div 
          className="flex items-center gap-3 cursor-pointer group mb-8" 
          onClick={() => setPage('home')}
        >
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white hero-gradient shadow-lg group-hover:scale-105 transition-transform">
            <Target size={24} />
          </div>
          <div>
            <h1 className="font-bold text-slate-900 leading-tight">表达力训练营</h1>
            <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Expressive Pro V3</p>
          </div>
        </div>

        {/* Stats Card */}
        <div className="bg-indigo-50/50 rounded-3xl p-5 mb-8 border border-indigo-100/50 shadow-inner">
          <p className="text-[11px] font-bold text-indigo-400 uppercase tracking-widest mb-4">你的实时状态</p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: '等级', value: stats.level },
              { label: '连续', value: `${stats.streak}d` },
              { label: '次数', value: stats.count }
            ].map((s, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-2 text-center shadow-sm border border-white/50">
                <p className="text-[9px] text-slate-400 font-bold mb-1">{s.label}</p>
                <p className="text-sm font-extrabold text-slate-800">{s.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-2 flex-1">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setPage(item.key)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-semibold transition-all duration-300 ${
                currentPage === item.key 
                ? 'bg-slate-900 text-white shadow-xl translate-x-1' 
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <span className={currentPage === item.key ? 'text-indigo-400' : 'text-slate-400'}>
                {item.icon}
              </span>
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  currentPage === item.key ? 'bg-indigo-500 text-white' : 'bg-red-500 text-white'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="mt-auto pt-6 border-t border-slate-100">
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl">
            <div className="w-8 h-8 rounded-full bg-slate-200"></div>
            <div className="flex-1">
              <p className="text-xs font-bold text-slate-800">训练营导师</p>
              <p className="text-[10px] text-slate-500">Gemini 3.0 Flash</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
