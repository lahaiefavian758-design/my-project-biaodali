
import React, { useState, useEffect, useRef } from 'react';
import { Page, DiagnosisResult } from '../types';
import { getDiagnosisAnalysis } from '../services/geminiService';
import { ChevronRight, Mic, Send, RefreshCcw, Loader2, CheckCircle2, BrainCircuit, Target, BarChart3, MicOff } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell, Tooltip } from 'recharts';

interface DiagnosisViewProps {
  setPage: (page: Page) => void;
}

const QUESTIONS = [
  { id: 1, title: '30秒自我介绍', desc: '请介绍你自己和你的核心优势，让面试官或上司快速记住你。' },
  { id: 2, title: '专业概念解构', desc: '如何向一个外行解释“区块链”或“机器学习”等专业术语？' },
  { id: 3, title: '工作成果复盘', desc: '描述一次你解决复杂问题的经历，突出你的决策逻辑。' }
];

const DiagnosisView: React.FC<DiagnosisViewProps> = ({ setPage }) => {
  const [step, setStep] = useState(0); 
  const [answers, setAnswers] = useState(['', '', '']);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  
  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<any>(null);
  const isFinalTriggeredRef = useRef(false);
  
  // 关键：记录开启录音瞬间的原始文字
  const baseTextRef = useRef('');
  const stepRef = useRef(step);

  useEffect(() => {
    stepRef.current = step;
  }, [step]);

  const handleNext = async () => {
    console.log("[Diagnosis] 准备进入下一步...");
    
    // 彻底停止当前识别
    if (recognitionRef.current) {
      recognitionRef.current.onend = null; 
      recognitionRef.current.stop();
    }
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    setIsRecording(false);

    if (stepRef.current < 3) {
      setStep(prev => prev + 1);
    } else {
      setStep(4);
      setLoading(true);
      try {
        const analysis = await getDiagnosisAnalysis(answers);
        setResult(analysis);
        setStep(5);
      } catch (error) {
        console.error("Diagnosis error:", error);
        alert("诊断分析失败，请检查网络或 API 配置。");
        setStep(3);
      } finally {
        setLoading(false);
      }
    }
  };

  const initRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return null;

    const rec = new SpeechRecognition();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = 'zh-CN';
    
    rec.onstart = () => {
      console.log("[Speech] 录音正式开始");
      isFinalTriggeredRef.current = false;
    };

    rec.onresult = (event: any) => {
      // 只要有输入，重置 2s 静默计时器
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);

      let sessionTranscript = '';
      for (let i = 0; i < event.results.length; ++i) {
        sessionTranscript += event.results[i][0].transcript;
      }

      // 将 Session 产生的所有文字追加到开启时的 baseText 之后
      setAnswers(prev => {
        const newAnswers = [...prev];
        const currentIdx = stepRef.current - 1;
        newAnswers[currentIdx] = baseTextRef.current + sessionTranscript;
        return newAnswers;
      });

      // 开启静默检测 (2.0s 让表达更自然)
      silenceTimerRef.current = setTimeout(() => {
        if (!isFinalTriggeredRef.current) {
          console.log("[Speech] 检测到 2s 静默，自动提交...");
          isFinalTriggeredRef.current = true;
          handleNext();
        }
      }, 2000);
    };
    
    rec.onend = () => {
      console.log("[Speech] 录音 Session 结束");
      // 只有在非主动停止且非自动提交的情况下才尝试重启（防止浏览器自动断连）
      if (!isFinalTriggeredRef.current && isRecording) {
        try { rec.start(); } catch (e) {}
      } else {
        setIsRecording(false);
      }
    };

    rec.onerror = (e: any) => {
      console.error("[Speech] 错误:", e.error);
      if (e.error === 'not-allowed') alert("请开启麦克风权限");
      setIsRecording(false);
    };

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
    if (!recognitionRef.current) return alert("浏览器不支持语音功能");

    if (isRecording) {
      isFinalTriggeredRef.current = true;
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      // 开启前记录当前输入框文字作为 Base
      baseTextRef.current = answers[step - 1] || '';
      isFinalTriggeredRef.current = false;
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (e) {
        recognitionRef.current = initRecognition();
        recognitionRef.current.start();
        setIsRecording(true);
      }
    }
  };

  if (step === 0) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-in zoom-in duration-500">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 hero-gradient rounded-[28px] mx-auto flex items-center justify-center text-white shadow-2xl">
            <BarChart3 size={40} />
          </div>
          <h2 className="text-3xl font-black text-slate-900">核心表达力诊断</h2>
          <p className="text-slate-500 font-medium">深度拆解你的表达习惯，生成专属能力画像。</p>
        </div>
        <div className="glass-card rounded-[40px] p-10 flex flex-col md:flex-row gap-10">
          <div className="flex-1 space-y-6">
            <h3 className="text-xl font-bold text-slate-800">完成诊断后，你将获得：</h3>
            <ul className="space-y-4">
              {['5个维度的能力雷达图', '致命短板的精准定位', 'AI 教练定制的 30 天训练处方'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-600">
                  <CheckCircle2 className="text-emerald-500" size={20} /> {item}
                </li>
              ))}
            </ul>
            <button 
              onClick={() => setStep(1)} 
              className="relative z-50 cursor-pointer px-10 py-4 hero-gradient text-white rounded-3xl font-bold shadow-lg hover:scale-105 transition-all"
            >
              立即开始测试
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step <= 3) {
    const q = QUESTIONS[step - 1];
    return (
      <div className="max-w-3xl mx-auto space-y-8 animate-in slide-in-from-right duration-500">
        <div className="flex items-center justify-between">
          <div className="flex gap-4 items-center">
            <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-black text-xl">{step}</div>
            <div><h3 className="font-bold">{q.title}</h3><p className="text-xs text-slate-400">Step {step} / 3</p></div>
          </div>
        </div>
        <div className="glass-card rounded-[40px] p-8 space-y-6 relative overflow-hidden">
          <p className="text-lg font-bold text-slate-700 leading-relaxed italic border-l-4 border-indigo-400 pl-4">{q.desc}</p>
          <div className="relative">
            <textarea 
              value={answers[step - 1]}
              onChange={(e) => { 
                const n = [...answers]; 
                n[step - 1] = e.target.value; 
                setAnswers(n); 
              }}
              placeholder="点击下方麦克风开启语音录入。录音期间请保持说话，停顿 2 秒后系统将自动跳转下一步..."
              className="w-full h-56 bg-slate-50 border-2 border-slate-100 rounded-3xl p-6 text-slate-700 focus:border-indigo-500 focus:outline-none transition-all resize-none font-medium"
            />
            {isRecording && (
              <div className="absolute top-4 right-4 flex gap-1 items-end h-6">
                {[1,2,3,4,5].map(i => <div key={i} className="w-1.5 bg-indigo-500 wave-bar rounded-full" style={{animationDelay: `${i * 0.1}s`}}></div>)}
              </div>
            )}
          </div>
          <div className="flex justify-between items-center relative z-50">
            <button 
              onClick={toggleRecording}
              className={`flex items-center gap-2 font-bold px-6 py-3.5 rounded-2xl transition-all cursor-pointer shadow-lg ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'}`}
            >
              {isRecording ? <MicOff size={20}/> : <Mic size={20}/>}
              {isRecording ? '录音中 (停顿即提交)' : '语音录入'}
            </button>
            <button 
              disabled={!answers[step - 1] || isRecording} 
              onClick={handleNext} 
              className="px-10 py-3.5 bg-slate-900 text-white rounded-2xl font-bold flex items-center gap-2 disabled:opacity-30 transition-all hover:bg-slate-800 shadow-lg cursor-pointer"
            >
              {step < 3 ? '下一题' : '生成报告'} <ChevronRight size={18}/>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 4) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-8 animate-in fade-in">
        <div className="relative">
          <div className="absolute inset-0 bg-indigo-500 blur-3xl opacity-20 animate-pulse"></div>
          <Loader2 className="w-20 h-20 text-indigo-500 animate-spin relative z-10" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black text-slate-900">AI 正在深度解析你的表达风格</h2>
          <p className="text-slate-500 font-medium">采用 Gemini 3.0 Pro 进行语义建模，请稍候...</p>
        </div>
      </div>
    );
  }

  if (step === 5 && result) {
    const chartData = [
      { name: '清晰度', value: result.scores.clarity, color: '#6366f1' },
      { name: '逻辑性', value: result.scores.logic, color: '#8b5cf6' },
      { name: '说服力', value: result.scores.persuasion, color: '#ec4899' },
      { name: '感染力', value: result.scores.passion, color: '#f59e0b' },
      { name: '简洁度', value: result.scores.conciseness, color: '#10b981' },
    ];

    return (
      <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-700 pb-20">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-4xl font-black text-slate-900">核心能力画像</h2>
            <p className="text-slate-500 mt-2 font-medium">基于你的 3 组表达片段生成的综合诊断</p>
          </div>
          <button 
            onClick={() => setPage('training')} 
            className="px-8 py-3.5 hero-gradient text-white rounded-2xl font-bold shadow-xl flex items-center gap-2 hover:scale-105 transition-all cursor-pointer relative z-50"
          >
            开启实战演练 <Target size={18}/>
          </button>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 glass-card rounded-[40px] p-8 border-indigo-50">
            <h3 className="text-xl font-black mb-8 flex items-center gap-2">
              <BarChart3 className="text-indigo-500" size={20} />
              多维能力分布
            </h3>
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontWeight: 'bold', fontSize: 12}} />
                  <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={40}>
                    {chartData.map((e, i) => <Cell key={i} fill={e.color} fillOpacity={0.8} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-900 rounded-[32px] p-8 text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-indigo-500/30 transition-all"></div>
              <p className="text-indigo-400 text-[10px] font-black mb-2 uppercase tracking-widest">综合评估等级</p>
              <h4 className="text-6xl font-black mb-4 tracking-tighter">{result.level}</h4>
              <div className="space-y-4 relative z-10">
                <div className="h-px bg-slate-800 w-full"></div>
                <p className="text-slate-400 text-sm leading-relaxed font-medium">
                  <span className="text-indigo-300">核心痛点：</span>{result.weakness}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-[40px] p-10 border-indigo-50">
          <h3 className="text-2xl font-black mb-8 flex items-center gap-3"><BrainCircuit className="text-indigo-500"/> AI 定制训练处方</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {result.prescription.map((s, i) => (
              <div key={i} className="bg-slate-50 rounded-3xl p-8 border border-slate-100 relative group hover:border-indigo-200 transition-all">
                <div className="absolute -top-3 -left-3 w-10 h-10 bg-white border border-indigo-100 rounded-2xl shadow-sm flex items-center justify-center font-black text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                  {i+1}
                </div>
                <p className="text-slate-700 font-bold leading-relaxed">{s}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default DiagnosisView;
