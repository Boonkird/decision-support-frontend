import { Injectable } from '@angular/core';
import { Observable, of, } from 'rxjs';
import {
  Question,
  StudentProfile,
  SurveyAnswer,
  SurveyResult,
  Track,
} from '../models/survey.model';

@Injectable({
  providedIn: 'root',
})
export class SurveyService {
  // --- ข้อมูลสาขา (Tracks) ---
  private tracks: Track[] = [
    {
      code: 'CS',
      name: 'Computer Science',
      description:
        'วิทยาการคอมพิวเตอร์: เน้นการเขียนโปรแกรม อัลกอริทึม และ AI เจาะลึกทฤษฎีเบื้องหลังเทคโนโลยี',
    },
    {
      code: 'IT',
      name: 'Information Technology',
      description:
        'เทคโนโลยีสารสนเทศ: เน้นระบบเครือข่าย ฐานข้อมูล Cyber Security และการประยุกต์ใช้ในองค์กร',
    },
    {
      code: 'CDT',
      name: 'Computer & Digital Tech',
      description:
        'เทคโนโลยีคอมพิวเตอร์และดิจิทัล: เน้นสื่อดิจิทัล กราฟิก UX/UI และการสร้างสรรค์ผลงาน',
    },
    {
      code: 'CE',
      name: 'Computer Education',
      description: 'คอมพิวเตอร์ศึกษา: เน้นการสอน การถ่ายทอดความรู้ และนวัตกรรมเพื่อการศึกษา',
    },
  ];

  // --- ข้อมูลคำถาม (Questions) พร้อมน้ำหนักดิบ ---
  // อ้างอิงจาก PDF หน้า 1-2
  private questions: Question[] = [
    // Section 1: ความสนใจ
    {
      id: 1,
      text: 'ฉันรู้สึกสนุกเวลานั่งเขียนโค้ดหรือสร้างโปรแกรมง่ายๆ',
      section: 'interest',
      trackWeights: { CS: 1.0, IT: 0.5 },
    },
    {
      id: 2,
      text: 'ฉันสนุกกับการออกแบบภาพหรือการจัดหน้าตาเว็บไซต์ให้ดูดี',
      section: 'interest',
      trackWeights: { CDT: 1.0, CS: 0.5 },
    },
    {
      id: 3,
      text: 'ฉันชอบลองใช้เทคโนโลยีใหม่ๆ เช่น แอปพลิเคชันหรือระบบอัตโนมัติ',
      section: 'interest',
      trackWeights: { CS: 1.0, IT: 0.5 },
    },
    {
      id: 4,
      text: 'ฉันสนใจระบบอินเทอร์เน็ตและการเชื่อมต่อของคอมพิวเตอร์หลายเครื่อง',
      section: 'interest',
      trackWeights: { IT: 1.0, CS: 0.5 },
    },
    {
      id: 5,
      text: 'ฉันชอบคิดไอเดียการทำสื่อออนไลน์ เช่น คลิปวิดีโอหรือเกม',
      section: 'interest',
      trackWeights: { CDT: 1.0, CE: 0.5 },
    },
    {
      id: 6,
      text: 'ฉันสนใจใช้คอมพิวเตอร์เพื่อช่วยให้คนเรียนรู้หรือเข้าใจเรื่องต่างๆ ได้ดีขึ้น',
      section: 'interest',
      trackWeights: { CE: 1.0, CDT: 0.5 },
    },

    // Section 2: ทักษะ
    {
      id: 15,
      text: 'ฉันสามารถคิดวิเคราะห์เป็นขั้นตอนอย่างมีเหตุผล (Logical Thinking)',
      section: 'skill',
      trackWeights: { CS: 1.0, IT: 0.5 },
    },
    {
      id: 16,
      text: 'ฉันสามารถใช้คอมพิวเตอร์หรืออุปกรณ์ไอทีได้อย่างคล่องแคล่ว',
      section: 'skill',
      trackWeights: { IT: 1.0 },
    },
    {
      id: 17,
      text: 'ฉันสามารถใช้โปรแกรมออกแบบหรือจัดภาพให้สวยงามได้',
      section: 'skill',
      trackWeights: { CDT: 1.0 },
    },
    {
      id: 18,
      text: 'ฉันสามารถอธิบายเนื้อหาด้วยวิธีที่เข้าใจง่าย',
      section: 'skill',
      trackWeights: { CE: 1.0 },
    },

    // Section 3: เป้าหมาย
    {
      id: 28,
      text: 'ฉันอยากเป็นนักพัฒนาโปรแกรมหรือนักเขียนโค้ด (Programmer)',
      section: 'goal',
      trackWeights: { CS: 1.0 },
    },
    {
      id: 29,
      text: 'ฉันอยากเป็นครูหรืออาจารย์ด้านคอมพิวเตอร์',
      section: 'goal',
      trackWeights: { CE: 1.0 },
    },
    {
      id: 30,
      text: 'ฉันอยากเป็นผู้ดูแลระบบเครือข่ายหรือระบบสารสนเทศ',
      section: 'goal',
      trackWeights: { IT: 1.0 },
    },
    {
      id: 31,
      text: 'ฉันอยากเป็นนักออกแบบเว็บไซต์หรือแอปพลิเคชัน',
      section: 'goal',
      trackWeights: { CDT: 1.0 },
    },
  ];

  // เก็บ Profile ผู้ใช้
  private userProfile: StudentProfile | null = null;

  // เก็บ Scaling Factor ของแต่ละ Track (คำนวณ Auto)
  private trackScalingFactors: { [key: string]: number } = {};

  constructor() {
    // คำนวณ Scaling Factor ทันทีที่ Service ถูกสร้าง (ตามสูตร PDF หน้า 3-4)
    this.calculateNormalization();
  }

  // --- LOGIC 1: Normalization (เตรียมน้ำหนักคะแนนให้เป็นธรรม) ---
  private calculateNormalization() {
    this.tracks.forEach((track) => {
      let maxScoreCurr = 0;
      let nTrack = 0;

      // วนลูปหาคำถามที่เกี่ยวข้องกับ Track นี้
      this.questions.forEach((q) => {
        if (q.trackWeights && q.trackWeights[track.code]) {
          const wOriginal = q.trackWeights[track.code];
          maxScoreCurr += 5 * wOriginal; // สูตร: MaxScore = Sum(5 * w_original)
          nTrack++;
        }
      });

      // สูตร: Scaling = (5 * N) / MaxScore
      if (maxScoreCurr > 0) {
        this.trackScalingFactors[track.code] = (5 * nTrack) / maxScoreCurr;
      } else {
        this.trackScalingFactors[track.code] = 1; // กัน Error
      }

      console.log(
        `Track: ${track.code}, N: ${nTrack}, MaxScore: ${maxScoreCurr}, Scaling: ${
          this.trackScalingFactors[track.code]
        }`
      );
    });
  }

  // --- API Methods ---

  saveProfile(profile: StudentProfile) {
    this.userProfile = profile;
  }

  getProfile() {
    return this.userProfile;
  }

  getQuestions(): Observable<Question[]> {
    console.log('SurveyService: Requesting questions...'); // เพิ่ม Log
    return of(this.questions); // ส่งของทันที ไม่ต้องรอ!
  }

  // --- LOGIC 2: Scoring (คำนวณคะแนนจริงตอนส่งคำตอบ) ---
  submitSurvey(answers: SurveyAnswer[]): Observable<SurveyResult[]> {
    console.log('SurveyService: Submitting answers...');
    let trackTotals: { [key: string]: number } = { CS: 0, IT: 0, CDT: 0, CE: 0 };
    let trackCounts: { [key: string]: number } = { CS: 0, IT: 0, CDT: 0, CE: 0 };

    // คำนวณคะแนนตามสูตร PDF หน้า 4
    answers.forEach((ans) => {
      const q = this.questions.find((q) => q.id === ans.questionId);
      if (q && q.trackWeights) {
        for (const [trackCode, wOriginal] of Object.entries(q.trackWeights)) {
          // สูตร: w* = w_original * Scaling
          const scaling = this.trackScalingFactors[trackCode] || 1;
          const wStar = wOriginal * scaling;

          // สูตร: Total += Response * w*
          trackTotals[trackCode] += ans.score * wStar;
          trackCounts[trackCode]++;
        }
      }
    });

    // แปลงผลลัพธ์
    const results: SurveyResult[] = this.tracks
      .map((t) => {
        const totalScore = trackTotals[t.code] || 0;
        const n = trackCounts[t.code] || 1;

        // สูตร: Avg = Total / N
        const avgScore = totalScore / n;

        // แปลงเป็น % เพื่อแสดงกราฟ (เต็ม 5 คะแนน = 100%)
        const percentage = (avgScore / 5) * 100;

        return {
          track: t,
          score: avgScore, // เก็บค่าเฉลี่ยไว้ดู (เช่น 4.25)
          percentage: percentage, // เก็บ % ไว้โชว์กราฟ
        };
      })
      .sort((a, b) => b.percentage - a.percentage); // เรียงจากมากไปน้อย

    return of(results); // จำลองเวลาประมวลผล AI
  }
}
