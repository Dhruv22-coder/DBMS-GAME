export type QuestionMarks = '4' | '6' | '8' | '4/6' | '6/8' | '4/6/8';

export type CategoryRealm = 
  | 'transactions'      // Q1, Q2, Q3, Q5
  | 'query_processing'  // Q4, Q8
  | 'concurrency_locks' // Q10, Q11, Q12, Q13, Q14, Q23
  | 'serializability'   // Q9, Q16, Q17, Q18
  | 'timestamp_proto'   // Q6, Q7, Q15
  | 'nosql_modern';     // Q19, Q20, Q21, Q22, Q24, Q25, Q26, Q27

export interface MiniGameStep {
  id: string;
  type: 'mcq' | 'drag_order' | 'matrix_match' | 'fill_blank' | 'cycle_detect' | 'code_terminal' | 'rule_arbiter';
  question: string;
  scenario?: string;
  options?: string[];
  correctIndex?: number;
  correctAnswers?: string[];
  explanation: string;
  hint?: string;
  codeSnippet?: string;
  data?: any;
}

export interface BossStep {
  stepNumber: number;
  title: string;
  instruction: string;
  scheduleContext: string;
  question: string;
  options: {
    label: string;
    isCorrect: boolean;
    damageToBoss: number;
    explanation: string;
  }[];
  workingHint: string;
}

export interface BossBattleData {
  bossId: string;
  bossName: string;
  title: string;
  avatar: string;
  maxHp: number;
  numericalQuestion: string;
  marks: string;
  backgroundStory: string;
  steps: BossStep[];
  victoryRewardXp: number;
}

export interface QuestionTopic {
  id: string;
  qNumber: number;
  title: string;
  shortCode: string;
  marks: QuestionMarks;
  examWeight: 'critical' | 'high' | 'medium'; // 8 marks = critical, 6 = high, 4 = medium
  realm: CategoryRealm;
  realmName: string;
  realmOrder: number;
  isBoss: boolean;
  bossData?: BossBattleData;
  teachBriefing: {
    coreDefinition: string;
    examKeyPoints: string[];
    diagramType?: 'state_machine' | 'lock_matrix' | 'wait_for_graph' | 'precedence_graph' | 'timestamp_timeline' | 'query_pipeline' | 'nosql_tree';
    diagramDescription?: string;
    examProTips: string[];
    modelAnswer4Marks?: string;
    modelAnswer6Marks?: string;
    modelAnswer8Marks?: string;
  };
  challenge: {
    title: string;
    description: string;
    steps: MiniGameStep[];
  };
  unlockedByDefault?: boolean;
}

export interface UserStats {
  xp: number;
  level: number;
  rankTitle: string;
  lives: number;
  maxLives: number;
  streak: number;
  bestStreak: number;
  completedTopics: string[]; // topic IDs
  bossesDefeated: string[];
  lastActive: string;
  soundEnabled: boolean;
  teacherMode: boolean; // unlock all for rapid cramming
}
