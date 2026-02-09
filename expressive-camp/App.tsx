
import React, { useState, useEffect } from 'react';
import { Page, Stats, TrainingRecord } from './types';
import Sidebar from './components/Sidebar';
import HomeView from './views/HomeView';
import DiagnosisView from './views/DiagnosisView';
import TrainingView from './views/TrainingView';
import KnowledgeView from './views/KnowledgeView';
import ProgressView from './views/ProgressView';
import { Menu, X, Target, Home, BarChart3, BookOpen, LineChart } from 'lucide-react';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [stats, setStats] = useState<Stats>({
    level: 'L1',
    streak: 0,
    count: 0
  });
  const [records, setRecords] = useState<TrainingRecord[]>([]);

  // Initialize data from localStorage
  useEffect(() => {
    const savedStats = localStorage.getItem('ec_stats');
    if (savedStats) setStats(JSON.parse(savedStats));
    
    const savedRecords = localStorage.getItem('ec_records');
    if (savedRecords) setRecords(JSON.parse(savedRecords));
  }, []);

  // Persist data
  useEffect(() => {
    localStorage.setItem('ec_stats', JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    localStorage.setItem('ec_records', JSON.stringify(records));
  }, [records]);

  const updateStatsAfterTraining = (newScore: number) => {
    setStats(prev => {
      const nextCount = prev.count + 1;
      let nextLevel = prev.level;
      if (nextCount >= 5 && prev.level === 'L1') nextLevel = 'L2';
      if (nextCount >= 12 && prev.level === 'L2') nextLevel = 'L3';
      return {
        ...prev,
        count: nextCount,
        streak: Math.max(prev.streak, 1),
        level: nextLevel
      };
    });
  };

  const addRecord = (record: TrainingRecord) => {
    setRecords(prev => [record, ...prev]);
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'home': return <HomeView setPage={setCurrentPage} stats={stats} />;
      case 'diagnosis': return <DiagnosisView setPage={setCurrentPage} />;
      case 'training': return <TrainingView onComplete={updateStatsAfterTraining} addRecord={addRecord} />;
      case 'knowledge': return <KnowledgeView />;
      case 'progress': return <ProgressView stats={stats} records={records} />;
      default: return <HomeView setPage={setCurrentPage} stats={stats} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 overflow-x-hidden">
      <Sidebar currentPage={currentPage} setPage={setCurrentPage} stats={stats} />

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 p-4">
        <div className="glass-card rounded-2xl flex items-center justify-between px-4 py-3 border border-indigo-100">
          <div className="flex items-center gap-2" onClick={() => setCurrentPage('home')}>
            <div className="w-8 h-8 rounded-xl hero-gradient flex items-center justify-center text-white">
              <Target size={18} />
            </div>
            <span className="font-bold text-slate-800 tracking-tight">Express Camp</span>
          </div>
          <button 
            className="p-2 bg-slate-100 rounded-xl text-slate-600 hover:bg-slate-200 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="mt-2 glass-card rounded-2xl overflow-hidden border border-indigo-100 animate-in slide-in-from-top duration-300">
            <div className="grid grid-cols-2 gap-2 p-2">
              {[
                { key: 'home', label: '首页', icon: <Home size={16} /> },
                { key: 'diagnosis', label: '诊断', icon: <BarChart3 size={16} /> },
                { key: 'training', label: '训练', icon: <Target size={16} /> },
                { key: 'knowledge', label: '百科', icon: <BookOpen size={16} /> },
                { key: 'progress', label: '进度', icon: <LineChart size={16} /> }
              ].map((item) => (
                <button
                  key={item.key}
                  onClick={() => {
                    setCurrentPage(item.key as Page);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 p-3 rounded-xl font-bold text-sm ${
                    currentPage === item.key 
                    ? 'bg-slate-900 text-white' 
                    : 'bg-white text-slate-600'
                  }`}
                >
                  {item.icon} {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <main className="flex-1 w-full min-w-0 pt-24 lg:pt-0">
        <div className="max-w-6xl mx-auto p-4 lg:p-10">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
