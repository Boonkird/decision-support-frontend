import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // 1. ต้องใช้ HttpClient ยิง API
import { Observable } from 'rxjs';
import {
  Question,
  StudentProfile,
  AnswerRequest,
  SurveyResult,
  SurveySubmitRequest,
} from '../models/survey.model';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class SurveyService {

  // private apiUrl = 'http://127.0.0.1:8080/api';
  private apiUrl = environment.apiUrl;
  // ตัวแปรเก็บข้อมูลนักเรียนชั่วคราว (รอส่งตอนทำแบบสอบถามเสร็จ)
  private userProfile: StudentProfile | null = null;
  private storedResult: any = null;

  constructor(private http: HttpClient) {}

  // ดึงจังหวัด
  getProvinces(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/master/provinces`);
  }

  // ค้นหาโรงเรียน
  searchSchools(query: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/master/schools?query=${query}`);
  }

  // --- 1. จัดการ Profile (เก็บไว้ใน Memory ก่อน) ---
  saveProfile(profile: StudentProfile) {
    this.userProfile = profile;
  }

  getProfile() {
    return this.userProfile;
  }

  // --- 2. ดึงคำถามจาก Backend (GET) ---
  getQuestions(): Observable<Question[]> {
    // ยิงไปที่ http://localhost:8080/api/questions
    return this.http.get<Question[]>(`${this.apiUrl}/questions`);
  }

  getLevels() {
    // ยิงไปหา Backend จริง
    return this.http.get<any[]>(`${this.apiUrl}/levels`);
  }

  getPrograms() {
    // ยิงไปหา Backend จริง
    return this.http.get<any[]>(`${this.apiUrl}/programs`);
  }

  // --- 3. ส่งคำตอบไปประมวลผล (POST) ---
  submitSurvey(answers: AnswerRequest[]): Observable<SurveyResult[]> {
    if (!this.userProfile) {
      throw new Error('User profile not found! Please fill in student info first.');
    }

    // เตรียมข้อมูลตาม Format ที่ Backend ต้องการ (SurveySubmitRequest)
    const payload: SurveySubmitRequest = {
      studentProfile: this.userProfile,
      answers: answers,
    };

    // ยิงไปที่ http://localhost:8080/api/survey/submit
    return this.http.post<SurveyResult[]>(`${this.apiUrl}/survey/submit`, payload);
  }

  setResult(result: any) {
    this.storedResult = result;
  }

  // ✅ ฟังก์ชันดึงข้อมูล (ต้องมี public)
  getResult() {
    return this.storedResult;
  }
}
