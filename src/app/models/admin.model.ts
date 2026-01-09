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