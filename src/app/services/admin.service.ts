import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AdminSession, DashboardStats } from '../models/admin.model';
import { School, Track } from '../models/survey.model';
// import { environment } from '../../environment.prod';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  // อย่าลืมใช้ IP 127.0.0.1 เพื่อความเร็ว
  // private apiUrl = 'http://127.0.0.1:8080/api/admin';
  // private trackUrl = 'http://127.0.0.1:8080/api/tracks';
  // private schoolUrl = 'http://127.0.0.1:8080/api/schools';
  // private questionUrl = 'http://127.0.0.1:8080/api/questions';
  // private programUrl = 'http://127.0.0.1:8080/api/programs';
  // private levelUrl = 'http://127.0.0.1:8080/api/levels';
  
  // private apiUrl = `${environment.apiUrl}/auth`;
  // private adminUrl = `${environment.apiUrl}/admin`; 
  // private trackUrl = `${environment.apiUrl}/tracks`;
  // private schoolUrl = `${environment.apiUrl}/schools`;
  // private questionUrl = `${environment.apiUrl}/questions`;
  // private programUrl = `${environment.apiUrl}/programs`;
  // private levelUrl = `${environment.apiUrl}/levels`;

  private readonly BASE_URL = 'https://decision-support-backend.onrender.com/api';
  private apiUrl = `${this.BASE_URL}/auth`;
  private adminUrl = `${this.BASE_URL}/admin`;
  private trackUrl = `${this.BASE_URL}/tracks`;
  private schoolUrl = `${this.BASE_URL}/schools`;
  private questionUrl = `${this.BASE_URL}/questions`;
  private programUrl = `${this.BASE_URL}/programs`;
  private levelUrl = `${this.BASE_URL}/levels`;


  constructor(private http: HttpClient) {}

  login(credentials: any) {
    // URL สุดท้ายจะเป็น: https://decision-support-backend.onrender.com/api/auth/login
    return this.http.post(`${this.apiUrl}/login`, credentials);
    
  }

  // ดึงข้อมูลกราฟสถิติ
  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.adminUrl}/dashboard-stats`);
  }

  // ดึงรายชื่อคนทำแบบทดสอบทั้งหมด
  getSessions(): Observable<AdminSession[]> {
    return this.http.get<AdminSession[]>(`${this.adminUrl}/sessions`);
  }

  deleteSession(id: number): Observable<void> {
    return this.http.delete<void>(`${this.adminUrl}/sessions/${id}`);
  }

  //----------------------------------------------------------------
  getAllTracks(): Observable<Track[]> {
    return this.http.get<Track[]>(this.trackUrl);
  }

  createTrack(data: any): Observable<any> {
    return this.http.post(this.trackUrl, data);
  }

  updateTrack(id: number, data: any): Observable<any> {
    return this.http.put(`${this.trackUrl}/${id}`, data);
  }

  deleteTrack(id: number): Observable<any> {
    return this.http.delete(`${this.trackUrl}/${id}`);
  }

  //----------------------------------------------------------------
  getAllSchools(): Observable<School[]> {
    return this.http.get<School[]>(this.schoolUrl);
  }

  createSchool(data: any): Observable<any> {
    return this.http.post(this.schoolUrl, data);
  }

  updateSchool(id: number, data: any): Observable<any> {
    return this.http.put(`${this.schoolUrl}/${id}`, data);
  }

  deleteSchool(id: number): Observable<any> {
    return this.http.delete(`${this.schoolUrl}/${id}`);
  }

  //----------------------------------------------------------------
  getAllQuestionsAdmin(): Observable<any[]> {
    return this.http.get<any[]>(`${this.questionUrl}/admin`);
  }

  updateQuestion(id: number, data: any): Observable<any> {
    return this.http.put(`${this.questionUrl}/${id}`, data);
  }

  createQuestion(data: any): Observable<any> {
    return this.http.post(this.questionUrl, data);
  }

  deleteQuestion(id: number): Observable<any> {
    return this.http.delete(`${this.questionUrl}/${id}`);
  }

  //----------------------------------------------------------------
  getAllPrograms(): Observable<any[]> {
    return this.http.get<any[]>(this.programUrl);
  }

  createProgram(data: any): Observable<any> {
    return this.http.post(this.programUrl, data);
  }

  updateProgram(id: number, data: any): Observable<any> {
    return this.http.put(`${this.programUrl}/${id}`, data);
  }

  deleteProgram(id: number): Observable<any> {
    return this.http.delete(`${this.programUrl}/${id}`);
  }

  //----------------------------------------------------------------
  getAllLevels(): Observable<any[]> {
    return this.http.get<any[]>(this.levelUrl);
  }

  createLevel(data: any): Observable<any> {
    return this.http.post(this.levelUrl, data);
  }

  updateLevel(id: number, data: any): Observable<any> {
    return this.http.put(`${this.levelUrl}/${id}`, data);
  }

  deleteLevel(id: number): Observable<any> {
    return this.http.delete(`${this.levelUrl}/${id}`);
  }
}
