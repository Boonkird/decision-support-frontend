export interface Track {
  code: string; // CS, IT, CDT, CE
  name: string;
  description: string;
}

export interface Question {
  id: number;
  text: string;
  section: 'interest' | 'skill' | 'goal'; // ตรงกับ PDF: ความสนใจ, ความถนัด, เป้าหมาย
  trackWeights?: { [key: string]: number }; // เก็บไว้คำนวณ Mockup (ของจริง Backend จัดการ)
}

export interface StudentProfile {
  name: string;
  school: string;
  level: string;
}

export interface SurveyAnswer {
  questionId: number;
  score: number; // 1-5
}

export interface SurveyResult {
  track: Track;
  score: number;
  percentage: number;
}