
import React from 'react';
import { Stats, TrainingRecord } from '../types';
import { Calendar, Activity, Trophy, History, Star, Clock } from 'lucide-react';

interface ProgressViewProps {
  stats: Stats;
  records: TrainingRecord[];
}

const ProgressView: React.FC<ProgressViewProps> = ({ stats, records }) => {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="max-w-2xl">
        <h2 className="text-3xl font-black text-slate-900 mb-2">成长轨迹</h2>
        <p className="text-slate-500 font-medium">所有的伟大都源于一点一滴的坚持。</p>
      </div>

      {/* Big Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        {[
          { icon: <Activity className="text-blue-500" />, label: '练习总数', value: stats.count, unit: '次练习' },
          { icon: <Trophy className="text-amber-500" />, label: '能力等级', value: stats.level, unit: '当前阶位' },
          { icon: <Calendar className="text-emerald-500" />, label: '连续训练', value: stats.streak, unit: '天连续' }
        ].map((item, idx) => (
          <div key={idx} className="glass-card p-8 rounded-[40px] border-slate-100 flex flex-col justify-between h-48">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-100">
              {item.icon}
            </div>
            <div>
              <p className="text-sm font-bold text-slate-400 mb-1">{item.label}</p>
              <div className="flex items-end gap-2">
                <span className="text-4xl font-black text-slate-900 leading-none">{item.value}</span>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{item.unit}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* History List */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <History className="text-indigo-500" />
            <h3 className="text-2xl font-black text-slate-800">训练记录</h3>
          </div>
          <span className="text-xs font-bold text-slate-400">共计 {records.length} 条</span>
        </div>

        {records.length === 0 ? (
          <div className="glass-card rounded-[40px] p-20 text-center border-dashed border-2 border-slate-200">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Star size={32} className="text-slate-200" />
            </div>
            <p className="text-slate-400 font-bold">暂无练习记录，快去开启你的第一次训练吧！</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {records.map(record => (
              <div key={record.id} className="glass-card p-6 rounded-[32px] border-slate-100 hover:border-indigo-100 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-500 font-black text-sm">
                    {record.score}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{record.sceneName}</h4>
                    <div className="flex items-center gap-3 text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">
                      <span className="flex items-center gap-1"><Clock size={12}/> {record.time}</span>
                    </div>
                  </div>
                </div>
                <div className="flex-1 md:px-12">
                  <p className="text-sm text-slate-500 font-medium line-clamp-1 italic">
                    "{record.summary}"
                  </p>
                </div>
                <div className="flex gap-1">
                   {[1,2,3,4,5].map(i => (
                     <Star key={i} size={14} fill={i * 20 <= record.score ? '#f59e0b' : 'transparent'} stroke={i * 20 <= record.score ? '#f59e0b' : '#e2e8f0'} />
                   ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default ProgressView;
