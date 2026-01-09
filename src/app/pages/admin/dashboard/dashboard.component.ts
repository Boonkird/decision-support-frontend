import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // ✅ ต้อง Import forms เพื่อใช้ช่องค้นหา
import { Router } from '@angular/router';
import { AdminService } from '../../../services/admin.service';
import { AdminSession, DashboardStats } from '../../../models/admin.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule], // ✅ ใส่ FormsModule ด้วย
  template: `
    <div class="min-h-screen bg-cyber-bg p-6 md:p-8">
      
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-bold text-white tracking-wider">ADMIN COMMAND CENTER</h1>
          <p class="text-cyber-primary text-sm uppercase tracking-[0.2em]">System Status: Online</p>
        </div>
        <button (click)="logout()" class="px-6 py-2 border border-red-500/50 text-red-500 rounded hover:bg-red-500 hover:text-white transition-all">
          LOGOUT
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-gray-900/80 border border-white/10 p-4 rounded-xl backdrop-blur-sm">
          <h3 class="text-gray-400 text-xs uppercase mb-1">Total Users</h3>
          <div class="text-3xl font-bold text-white">{{ sessions.length }}</div>
        </div>
        <div class="bg-gray-900/80 border border-white/10 p-4 rounded-xl backdrop-blur-sm">
          <h3 class="text-gray-400 text-xs uppercase mb-1">Avg Score</h3>
          <div class="text-3xl font-bold text-cyber-primary">{{ getAvgScore() | number:'1.0-1' }}%</div>
        </div>
        <div class="bg-gray-900/80 border border-white/10 p-4 rounded-xl backdrop-blur-sm">
          <h3 class="text-gray-400 text-xs uppercase mb-1">Top Track</h3>
          <div class="text-3xl font-bold text-cyber-secondary">{{ getTopTrack() }}</div>
        </div>
        <div class="bg-gray-900/80 border border-white/10 p-4 rounded-xl backdrop-blur-sm">
          <h3 class="text-gray-400 text-xs uppercase mb-1">Avg Time</h3>
          <div class="text-3xl font-bold text-white">{{ getAvgTime() }} <span class="text-xs text-gray-500">mins</span></div>
        </div>
      </div>

      <div class="bg-gray-900/80 border border-white/10 rounded-xl overflow-hidden backdrop-blur-sm">
        
        <div class="p-6 border-b border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <h3 class="text-white font-bold tracking-wider">USER DATABASE</h3>
          
          <div class="flex gap-4 w-full md:w-auto">
            <input type="text" [(ngModel)]="searchTerm" (input)="filterData()" 
                   placeholder="Search name, school, province..." 
                   class="bg-black/50 border border-white/20 rounded px-4 py-2 text-white focus:border-cyber-primary outline-none w-full md:w-64">
            
            <button (click)="loadData()" class="px-4 py-2 border border-cyber-primary text-cyber-primary rounded hover:bg-cyber-primary hover:text-black transition-all">
              ↻ REFRESH
            </button>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead class="bg-white/5 text-gray-400 text-xs uppercase">
              <tr>
                <th class="p-4 cursor-pointer hover:text-white" (click)="sort('createdAt')">Date ↕</th>
                <th class="p-4 cursor-pointer hover:text-white" (click)="sort('studentName')">Name ↕</th>
                <th class="p-4 cursor-pointer hover:text-white" (click)="sort('province')">Province ↕</th>
                <th class="p-4 cursor-pointer hover:text-white" (click)="sort('school')">School ↕</th>
                <th class="p-4 cursor-pointer hover:text-white" (click)="sort('age')">Age ↕</th>
                <th class="p-4 text-center cursor-pointer hover:text-white" (click)="sort('topTrack')">Result ↕</th>
                <th class="p-4 text-center cursor-pointer hover:text-white" (click)="sort('topScorePercent')">Score ↕</th>
                <th class="p-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/5 text-sm">
              <tr *ngFor="let session of filteredSessions" class="hover:bg-white/5 transition-colors">
                <td class="p-4 text-gray-400 whitespace-nowrap">{{ session.createdAt | date:'short' }}</td>
                <td class="p-4 text-white font-medium">{{ session.studentName }}</td>
                <td class="p-4 text-gray-300">{{ session.province || '-' }}</td>
                <td class="p-4 text-gray-300">{{ session.school }}</td>
                <td class="p-4 text-gray-300">{{ session.age || '-' }}</td>
                <td class="p-4 text-center">
                  <span class="inline-block px-2 py-1 bg-cyber-primary/20 text-cyber-primary rounded text-xs font-bold border border-cyber-primary/30">
                    {{ session.topTrack }}
                  </span>
                </td>
                <td class="p-4 text-center text-white">{{ session.topScorePercent | number:'1.0-0' }}%</td>
                <td class="p-4 text-center">
                  <button (click)="deleteSession(session.sessionId)" class="text-red-500 hover:text-red-400 hover:scale-110 transition-transform">
                    🗑
                  </button>
                </td>
              </tr>
              <tr *ngIf="filteredSessions.length === 0">
                <td colspan="8" class="p-8 text-center text-gray-500">No records found.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  `
})
export class DashboardComponent implements OnInit {
  sessions: AdminSession[] = []; // ข้อมูลดิบทั้งหมด
  filteredSessions: AdminSession[] = []; // ข้อมูลที่ผ่านการกรอง/เรียงแล้ว
  
  searchTerm: string = '';
  sortColumn: string = 'createdAt';
  sortDirection: 'asc' | 'desc' = 'desc';

  constructor(private adminService: AdminService, private router: Router) {}

  ngOnInit() {
    this.checkAuth();
    this.loadData();
  }

  checkAuth() {
    if (!localStorage.getItem('isAdmin')) {
      this.router.navigate(['/admin/login']);
    }
  }

  loadData() {
    this.adminService.getSessions().subscribe({
      next: (res) => {
        this.sessions = res;
        this.filterData(); // โหลดเสร็จสั่งกรอง 1 รอบ
      },
      error: (err) => console.error(err)
    });
  }

  // --- Logic การลบ ---
  deleteSession(id: number) {
    if(confirm('Are you sure you want to delete this record?')) {
      this.adminService.deleteSession(id).subscribe({
        next: () => {
          // ลบจาก Array ใน Frontend ด้วย ไม่ต้องโหลดใหม่
          this.sessions = this.sessions.filter(s => s.sessionId !== id);
          this.filterData();
        },
        error: (err) => alert('Delete failed')
      });
    }
  }

  // --- Logic การค้นหาและเรียงลำดับ ---
  filterData() {
    let data = [...this.sessions];

    // 1. Search Filter
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      data = data.filter(s => 
        s.studentName?.toLowerCase().includes(term) ||
        s.school?.toLowerCase().includes(term) ||
        s.province?.toLowerCase().includes(term)
      );
    }

    // 2. Sorting
    data.sort((a: any, b: any) => {
      let valA = a[this.sortColumn];
      let valB = b[this.sortColumn];

      // Handle nulls
      if (valA == null) valA = '';
      if (valB == null) valB = '';

      if (valA < valB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    this.filteredSessions = data;
  }

  sort(column: string) {
    // สลับทิศทางถ้ากดคอลัมน์เดิม
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.filterData();
  }

  logout() {
    localStorage.removeItem('isAdmin');
    this.router.navigate(['/admin/login']);
  }

  // --- Helper Functions สำหรับคำนวณ Stats ---
  getAvgScore() {
    if (!this.sessions.length) return 0;
    return this.sessions.reduce((sum, s) => sum + s.topScorePercent, 0) / this.sessions.length;
  }

  getTopTrack() {
    if (!this.sessions.length) return '-';
    const counts: any = {};
    this.sessions.forEach(s => counts[s.topTrack] = (counts[s.topTrack] || 0) + 1);
    return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
  }

  getAvgTime() {
    if (!this.sessions.length) return 0;
    const totalSec = this.sessions.reduce((sum, s) => sum + (s.durationSeconds || 0), 0);
    const avgMin = (totalSec / this.sessions.length) / 60;
    return avgMin.toFixed(1);
  }
}