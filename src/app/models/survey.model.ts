export interface Track {
  trackId: number;        // Backend ส่ง trackId
  trackCode: string;      // Backend ส่ง trackCode
  trackNameTh: string;    // Backend ส่ง trackNameTh
  trackNameEn: string;    // Backend ส่ง trackNameEn
  description: string;
}

export interface Question {
  questionId: number;
  sectionId: number;
  sectionTitle: string;
  questionOrder: number;
  questionText: string;
  scaleMin: number;
  scaleMax: number;
  isReverse: boolean;
}

export interface StudentProfile {
  fullName: string;       // แก้จาก name เป็น fullName
  school: string;
  levelEducation: string; // แก้จาก level เป็น levelEducation
  gender: string;    
  province?: string;      // ใส่ ? ไว้ก่อนก็ได้เผื่อค่าว่าง
  age?: number;
  studyProgram?: string;     // เพิ่ม gender (Backend มี)
}

export interface AnswerRequest {
  questionId: number;
  score: number;
}

export interface SurveySubmitRequest {
  studentProfile: StudentProfile;
  answers: AnswerRequest[];
}

export interface SurveyResult {
  trackCode: string;
  trackNameTh: string;
  trackNameEn: string;
  description: string;
  percentage: number;
}

export interface School {
  id: number;
  name: string;
  province: string;
}