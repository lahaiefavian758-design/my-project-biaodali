
import React from 'react';
import { Page, Stats } from '../types';
import { ArrowRight, Zap, Trophy, BrainCircuit, Globe } from 'lucide-react';

interface HomeViewProps {
  setPage: (page: Page) => void;
  stats: Stats;
}

const HomeView: React.FC<HomeViewProps> = ({ setPage, stats }) => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Hero Section */}
      <section className="relative overflow-hidden glass-card rounded-[48px] border-indigo-100/50 p-8 lg:p-16">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-indigo-50/50 to-transparent"></div>
        <div className="absolute -right-24 -top-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px]"></div>
        <div className="absolute -left-24 -bottom-24 w-96 h-96 bg-violet-500/10 rounded-full blur-[100px]"></div>

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 rounded-full px-4 py-1.5 mb-6">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
            <span className="text-[11px] font-extrabold text-indigo-600 uppercase tracking-widest">AI 赋能 · 表达进阶</span>
          </div>

          <h1 className="text-4xl lg:text-6xl font-black text-slate-900 leading-[1.1] mb-6">
            像顶级领袖一样<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">清晰表达你的观点</span>
          </h1>

          <p className="text-lg text-slate-600 mb-8 leading-relaxed font-medium">
            告别言之无物，拒绝逻辑混乱。通过 AI 教练的实战演练，从底层框架到即兴表达，全方位打磨你的职场说服力。
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => setPage('diagnosis')}
              className="px-8 py-4 hero-gradient text-white rounded-[24px] font-bold shadow-xl shadow-indigo-200 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
            >
              立刻诊断能力 <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => setPage('training')}
              className="px-8 py-4 bg-white border-2 border-slate-100 text-slate-800 rounded-[24px] font-bold hover:bg-slate-50 transition-all"
            >
              直接进入训练场景
            </button>
          </div>
        </div>
      </section>

      {/* Stats Summary Mobile */}
      <div className="lg:hidden grid grid-cols-3 gap-4">
        {[
          { icon: <Trophy size={16} className="text-amber-500" />, label: '等级', value: stats.level },
          { icon: <Zap size={16} className="text-blue-500" />, label: '连续', value: stats.streak },
          { icon: <BrainCircuit size={16} className="text-indigo-500" />, label: '练习', value: stats.count }
        ].map((item, idx) => (
          <div key={idx} className="glass-card p-4 rounded-3xl text-center border-indigo-50">
            <div className="flex justify-center mb-1">{item.icon}</div>
            <p className="text-[10px] text-slate-400 font-bold mb-0.5">{item.label}</p>
            <p className="text-lg font-black text-slate-800">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Grid Features */}
      <section className="grid md:grid-cols-3 gap-6">
        {[
          { 
            title: '全能诊断', 
            desc: '3个维度真实画像，精准定位表达短板。', 
            icon: '📊', 
            color: 'bg-indigo-50', 
            action: () => setPage('diagnosis') 
          },
          { 
            title: '场景演练', 
            desc: '覆盖汇报、谈判、面试等50+真实工作场景。', 
            icon: '🎯', 
            color: 'bg-violet-50', 
            action: () => setPage('training') 
          },
          { 
            title: '知识百科', 
            desc: 'PREP, STAR, SCQA 等沟通框架随手查。', 
            icon: '📚', 
            color: 'bg-amber-50', 
            action: () => setPage('knowledge') 
          }
        ].map((feat, idx) => (
          <div 
            key={idx} 
            onClick={feat.action}
            className="group glass-card p-8 rounded-[40px] border-slate-100 hover:border-indigo-200 transition-all cursor-pointer hover:shadow-2xl hover:shadow-indigo-100/50"
          >
            <div className={`w-16 h-16 rounded-[24px] ${feat.color} flex items-center justify-center text-3xl mb-6 shadow-sm`}>
              {feat.icon}
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">{feat.title}</h3>
            <p className="text-slate-500 font-medium leading-relaxed mb-6">
              {feat.desc}
            </p>
            <div className="flex items-center gap-2 text-indigo-500 font-bold text-sm">
              立即开启 <ArrowRight size={16} />
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default HomeView;
