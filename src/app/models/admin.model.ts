export interface DashboardStats {
  totalStudents: number;
  trackDistribution: { [key: string]: number }; // เช่น { "CS": 5, "IT": 2 }
}

export interface AdminSession {
  sessionId: number;
  createdAt: string;
  studentName: string;
  school: string;
  topTrack: string;
  topScorePercent: number;
  gender?: string;
  age?: number;
  province?: string;
  studyProgram?: string;
  levelEducation?: string;
  durationSeconds?: number;
}

export interface AdminQuestion {
  questionId: number;
  questionOrder: number;
  questionText: string;
  weights: { [key: string]: number }; // เก็บน้ำหนักเป็น Object เช่น { "CS": 5, "IT": 2 }
}