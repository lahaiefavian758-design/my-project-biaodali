
import React, { useState } from 'react';
import { FRAMEWORKS } from '../constants';
import { searchKnowledge } from '../services/geminiService';
import { Search, Loader2, Sparkles, BookMarked } from 'lucide-react';

const KnowledgeView: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const res = await searchKnowledge(query);
      setResult(res);
    } catch (error) {
      console.error(error);
      setResult("搜索失败，请检查 API 配置后重试。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <h2 className="text-4xl font-black text-slate-900">沟通技巧库</h2>
        <p className="text-slate-500 font-medium leading-relaxed">
          搜索任何表达疑问，或者浏览经典的职场沟通框架。
        </p>
      </div>

      {/* AI Search Section */}
      <section className="max-w-4xl mx-auto">
        <div className="relative group">
          <input 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            type="text" 
            placeholder="例如：如何让跨部门会议更高效？"
            className="w-full px-8 py-6 bg-white border-2 border-slate-100 rounded-[32px] text-lg font-medium shadow-2xl shadow-indigo-100 group-focus-within:border-indigo-500 focus:outline-none transition-all pr-24"
          />
          <button 
            onClick={handleSearch}
            disabled={loading || !query}
            className="absolute right-3 top-3 bottom-3 px-6 hero-gradient text-white rounded-2xl font-bold flex items-center gap-2 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 size={20} className="animate-spin" /> : <Search size={20} />}
            <span className="hidden sm:inline">AI 搜索</span>
          </button>
        </div>

        {/* AI Answer Container */}
        {(loading || result) && (
          <div className="mt-8 glass-card border-indigo-100 rounded-[40px] p-8 lg:p-12 animate-in zoom-in-95 duration-500">
            <div className="flex items-center gap-2 mb-6 text-indigo-500">
              <Sparkles size={20} />
              <span className="font-black uppercase tracking-widest text-xs">AI 教练深度解答</span>
            </div>
            
            {loading ? (
              <div className="space-y-4">
                <div className="h-4 bg-slate-100 rounded-full w-3/4 animate-pulse"></div>
                <div className="h-4 bg-slate-100 rounded-full w-1/2 animate-pulse"></div>
                <div className="h-4 bg-slate-100 rounded-full w-2/3 animate-pulse"></div>
              </div>
            ) : (
              <div className="prose prose-slate max-w-none prose-p:font-medium prose-p:leading-relaxed prose-li:font-medium prose-headings:font-black">
                {/* 简单的格式化，因为原始代码没有引入 Markdown 解析器 */}
                <div className="whitespace-pre-wrap text-slate-700 font-medium leading-relaxed" dangerouslySetInnerHTML={{ __html: result.replace(/\n/g, '<br/>') }} />
              </div>
            )}
          </div>
        )}
      </section>

      {/* Framework Cards */}
      <section className="space-y-8">
        <div className="flex items-center gap-3">
          <BookMarked className="text-indigo-500" />
          <h3 className="text-2xl font-black text-slate-800">经典框架随身查</h3>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          {FRAMEWORKS.map(f => (
            <div key={f.name} className="glass-card p-8 rounded-[40px] border-slate-100 hover:border-indigo-100 transition-all group">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-slate-900 rounded-[20px] flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                  {f.icon}
                </div>
                <div>
                  <h4 className="text-xl font-black text-slate-800 mb-2">{f.name}</h4>
                  <p className="text-slate-500 font-medium text-sm mb-6">{f.desc}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    {f.steps.map(s => (
                      <span key={s} className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-wider rounded-full border border-indigo-100">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default KnowledgeView;
