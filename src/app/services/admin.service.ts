import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AdminSession, DashboardStats } from '../models/admin.model';
import { School, Track } from '../models/survey.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  // อย่าลืมใช้ IP 127.0.0.1 เพื่อความเร็ว
  private apiUrl = 'http://127.0.0.1:8080/api/admin';
  private trackUrl = 'http://127.0.0.1:8080/api/tracks';
  private schoolUrl = 'http://127.0.0.1:8080/api/schools';
  private questionUrl = 'http://127.0.0.1:8080/api/questions';

  constructor(private http: HttpClient) {}

  // ดึงข้อมูลกราฟสถิติ
  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.apiUrl}/dashboard-stats`);
  }

  // ดึงรายชื่อคนทำแบบทดสอบทั้งหมด
  getSessions(): Observable<AdminSession[]> {
    return this.http.get<AdminSession[]>(`${this.apiUrl}/sessions`);
  }

  deleteSession(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/sessions/${id}`);
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
}