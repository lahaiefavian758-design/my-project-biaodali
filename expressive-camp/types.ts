
export type Page = 'home' | 'diagnosis' | 'training' | 'knowledge' | 'progress';

export interface Stats {
  level: string;
  streak: number;
  count: number;
}

export interface DiagnosisScores {
  clarity: number;
  logic: number;
  persuasion: number;
  passion: number;
  conciseness: number;
}

export interface DiagnosisResult {
  scores: DiagnosisScores;
  level: string;
  weakness: string;
  suggestion: string;
  prescription: string[];
}

export interface Scenario {
  id: string;
  icon: string;
  name: string;
  desc: string;
  taskTitle: string;
  background: string;
  requirement: string;
}

export interface TrainingFeedback {
  good: string[];
  improve: string[];
  tip: string;
  score: number;
}

export interface TrainingRecord {
  id: string;
  sceneName: string;
  time: string;
  summary: string;
  score: number;
}
