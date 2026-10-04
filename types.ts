
export type AgentType = 'diagnostic' | 'foodie' | 'medical';
export type AppLanguage = 'English' | 'Hindi' | 'Bengali' | 'Tamil' | 'Telugu';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  agent?: AgentType;
  sources?: any[];
}

export interface HealthProfile {
  name: string;
  age: string;
  weight: string;
  gender: string;
  allergies: string[];
  medications: string[];
  conditions: string[];
  language: AppLanguage;
  isSetup: boolean;
}

export type ViewType = 'dashboard' | 'diagnose' | 'nutrition' | 'pharmacy';

export interface Feature {
  id: string;
  name: string;
  description: string;
  riceScore: number;
  reach: string | number;
  impact: number;
  effort: number;
  priority: 'High' | 'Medium' | 'Low';
  quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4';
  status: 'Done' | 'Development' | 'Backlog';
}
