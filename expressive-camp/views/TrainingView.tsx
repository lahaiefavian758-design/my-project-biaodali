
import React, { useState, useEffect, useRef } from 'react';
import { Scenario, TrainingFeedback, TrainingRecord } from '../types';
import { SCENARIOS } from '../constants';
import { getTrainingFeedback } from '../services/geminiService';
import { Mic, Send, RefreshCcw, Loader2, Star, CheckCircle, AlertTriangle, Lightbulb, ChevronLeft, MicOff, Target } from 'lucide-react';

interface TrainingViewProps {
  onComplete: (score: number) => void;
  addRecord: (record: TrainingRecord) => void;
}

const TrainingView: React.FC<TrainingViewProps> = ({ onComplete, addRecord }) => {
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<TrainingFeedback | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  
  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<any>(null);
  const isFinalTriggeredRef = useRef(false);
  const baseTextRef = useRef('');

  const realSubmit = async () => {
    if (!selectedScenario || !answer) return;
    
    setLoading(true);
    try {
      const result = await getTrainingFeedback(
        selectedScenario.name, 
        selectedScenario.taskTitle, 
        selectedScenario.background, 
        answer
      );
      setFeedback(result);
      onComplete(result.score);
      addRecord({
        id: Date.now().toString(),
        sceneName: selectedScenario.name,
        time: new Date().toLocaleString(),
        summary: answer.slice(0, 50) + (answer.length > 50 ? '...' : ''),
        score: result.score
      });
    } catch (error) {
      console.error("Training error:", error);
      alert("分析失败。");
    } finally {
      setLoading(false);
    }
  };

  const handleFinalSubmit = () => {
    if (recognitionRef.current) {
      recognitionRef.current.onend = null;
      recognitionRef.current.stop();
    }
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    setIsRecording(false);
    realSubmit();
  };

  const initRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return null;

    const rec = new SpeechRecognition();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = 'zh-CN';
    
    rec.onstart = () => {
      console.log("[Training] 录音已启动");
      isFinalTriggeredRef.current = false;
    };

    rec.onresult = (event: any) => {
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);

      let sessionTranscript = '';
      for (let i = 0; i < event.results.length; ++i) {
        sessionTranscript += event.results[i][0].transcript;
      }

      setAnswer(baseTextRef.current + sessionTranscript);

      silenceTimerRef.current = setTimeout(() => {
        if (!isFinalTriggeredRef.current && isRecording) {
          console.log("[Training] 检测到静默，自动提交...");
          isFinalTriggeredRef.current = true;
          handleFinalSubmit();
        }
      }, 2000);
    };
    
    rec.onend = () => {
      if (isRecording && !isFinalTriggeredRef.current) {
        try { rec.start(); } catch (e) {}
      } else {
        setIsRecording(false);
      }
    };

    rec.onerror = () => setIsRecording(false);
    
    return rec;
  };

  useEffect(() => {
    recognitionRef.current = initRecognition();
    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    };
  }, []);

  const toggleRecording = () => {
    if (!recognitionRef.current) return alert("不支持语音录制");
    if (isRecording) {
      isFinalTriggeredRef.current = true;
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      baseTextRef.current = answer;
      isFinalTriggeredRef.current = false;
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (err) {
        recognitionRef.current = initRecognition();
        recognitionRef.current?.start();
        setIsRecording(true);
      }
    }
  };

  if (!selectedScenario) {
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div>
          <h2 className="text-3xl font-black text-slate-900">选择实战场景</h2>
          <p className="text-slate-500 font-medium mt-1">AI 教练已在各工位就绪。</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {SCENARIOS.map(s => (
            <div 
              key={s.id} 
              onClick={() => setSelectedScenario(s)} 
              className="glass-card p-8 rounded-[40px] cursor-pointer hover:shadow-2xl hover:border-indigo-200 transition-all group border-slate-100"
            >
              <div className="text-4xl mb-6 group-hover:scale-110 transition-transform inline-block">{s.icon}</div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-indigo-600 transition-colors">{s.name}</h3>
              <p className="text-slate-500 text-sm mb-8 leading-relaxed font-medium">{s.desc}</p>
              <div className="text-indigo-500 font-black text-xs uppercase tracking-widest flex items-center gap-1">
                开始练习 <ChevronLeft size={14} className="rotate-180" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex items-center gap-4">
        <button onClick={() => { setSelectedScenario(null); setFeedback(null); setAnswer(''); }} className="w-12 h-12 glass-card rounded-2xl flex items-center justify-center hover:bg-slate-100 cursor-pointer">
          <ChevronLeft size={20} />
        </button>
        <div>
          <h2 className="text-2xl font-black text-slate-900">{selectedScenario.name}</h2>
          <p className="text-xs text-slate-400 font-bold tracking-widest">REAL-TIME COACHING</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card rounded-[40px] p-8 border-indigo-100/50">
            <h3 className="text-xl font-black text-slate-800 mb-6">{selectedScenario.taskTitle}</h3>
            <div className="space-y-4">
              <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">背景描述</p>
                <p className="text-sm text-slate-700 font-medium leading-relaxed">{selectedScenario.background}</p>
              </div>
              <div className="bg-amber-50 p-5 rounded-3xl border border-amber-100">
                <p className="text-[10px] font-black text-amber-500 mb-2 uppercase tracking-widest">训练重点</p>
                <p className="text-sm text-amber-800 font-bold leading-relaxed">{selectedScenario.requirement}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-8">
          <div className="glass-card rounded-[40px] p-8 relative border-indigo-100/50">
            <textarea 
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="请在这里说话或输入内容..."
              className="w-full h-64 bg-slate-50 border-2 border-slate-100 rounded-3xl p-6 text-slate-700 font-medium focus:border-indigo-500 focus:outline-none transition-all resize-none"
              disabled={loading || !!feedback}
            />
            {isRecording && (
              <div className="absolute top-12 right-12 flex gap-1 h-8 items-end">
                {[1,2,3,4].map(i => <div key={i} className="w-1.5 bg-indigo-500 wave-bar rounded-full" style={{ animationDelay: `${i * 0.1}s` }}></div>)}
              </div>
            )}
            <div className="mt-6 flex gap-4 relative z-50">
              <button 
                disabled={!answer || loading || !!feedback} 
                onClick={handleFinalSubmit} 
                className="flex-1 py-4 hero-gradient text-white rounded-[24px] font-black shadow-xl shadow-indigo-200 disabled:opacity-30 disabled:grayscale transition-all hover:scale-[1.02] cursor-pointer"
              >
                {loading ? <Loader2 className="animate-spin mx-auto" size={20}/> : '提交获取点评'}
              </button>
              <button 
                onClick={toggleRecording} 
                disabled={!!feedback}
                className={`p-4 rounded-2xl transition-all cursor-pointer shadow-lg ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                {isRecording ? <MicOff size={24}/> : <Mic size={24}/>}
              </button>
            </div>
          </div>

          {feedback && (
            <div className="space-y-6 animate-in slide-in-from-top-8 duration-500">
              <div className="bg-white glass-card p-8 rounded-[40px] border-indigo-100">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-black">评分：{feedback.score}</h3>
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map(i => <Star key={i} size={20} fill={i * 20 <= feedback.score ? '#f59e0b' : 'transparent'} stroke={i * 20 <= feedback.score ? '#f59e0b' : '#e2e8f0'} />)}
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h4 className="font-black text-emerald-600 flex items-center gap-2"><CheckCircle size={18}/> 核心亮点</h4>
                    <ul className="space-y-2">{feedback.good.map((g, i) => <li key={i} className="text-sm text-slate-600 font-medium leading-relaxed">• {g}</li>)}</ul>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-black text-amber-600 flex items-center gap-2"><AlertTriangle size={18}/> 改进空间</h4>
                    <ul className="space-y-2">{feedback.improve.map((m, i) => <li key={i} className="text-sm text-slate-600 font-medium leading-relaxed">• {m}</li>)}</ul>
                  </div>
                </div>
                <div className="mt-8 pt-8 border-t border-slate-100">
                  <p className="text-indigo-600 text-sm font-bold italic">💡 教练寄语：{feedback.tip}</p>
                </div>
              </div>
              <button onClick={() => { setFeedback(null); setAnswer(''); }} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black shadow-xl hover:bg-slate-800 transition-all cursor-pointer relative z-50">再次挑战</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrainingView;
