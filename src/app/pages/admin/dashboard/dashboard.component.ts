import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChildren,
  QueryList,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AdminService } from '../../../services/admin.service';
import { AdminSession } from '../../../models/admin.model';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-cyber-bg p-4 md:p-6 text-white font-sans">
      <div
        class="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 border-b border-white/10 pb-4"
      >
        <div>
          <h1
            class="text-2xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyber-primary to-cyber-secondary"
          >
            STUDENT DATA CENTER
          </h1>
          <p class="text-gray-400 text-xs uppercase tracking-[0.2em] mt-1">
            Total Records: {{ filteredSessions.length }}
          </p>
        </div>
        <div class="flex gap-2">
          <button
            (click)="toggleCharts()"
            class="flex items-center gap-2 px-4 py-2 rounded transition-all text-xs font-bold tracking-wider border"
            [ngClass]="
              showCharts
                ? 'bg-cyber-primary text-black border-cyber-primary'
                : 'bg-transparent text-cyber-primary border-cyber-primary hover:bg-cyber-primary/10'
            "
          >
            <span class="text-lg">{{ showCharts ? '✕' : '📊' }}</span>
            {{ showCharts ? 'HIDE ANALYTICS' : 'SHOW ANALYTICS' }}
          </button>
          <button
            (click)="exportToCSV()"
            class="px-4 py-2 bg-green-600/20 border border-green-500/50 text-green-500 rounded hover:bg-green-600 hover:text-white transition-all text-xs font-bold tracking-wider flex items-center gap-2"
          >
            📥 EXPORT CSV
          </button>
          <button
            (click)="goToManage()"
            class="px-4 py-2 border border-blue-500/50 text-blue-400 rounded hover:bg-blue-500 hover:text-white transition-all text-xs font-bold tracking-wider flex items-center gap-2"
          >
            ⚙️ SYSTEM CONFIG
          </button>
          <button
            (click)="resetFilters()"
            class="px-4 py-2 border border-white/30 text-white rounded hover:bg-white/10 transition-all text-xs font-bold tracking-wider"
          >
            ↺ RESET
          </button>
          <button
            (click)="logout()"
            class="px-4 py-2 border border-red-500/50 text-red-500 rounded hover:bg-red-500 hover:text-white transition-all text-xs font-bold tracking-wider"
          >
            LOGOUT
          </button>
        </div>
      </div>

      <div
        class="bg-gray-900/60 border border-cyber-primary/30 p-4 rounded-xl mb-6 backdrop-blur-md shadow-lg"
      >
        <h3
          class="text-cyber-primary text-xs uppercase tracking-widest mb-3 font-bold flex items-center gap-2"
        >
          <span class="w-2 h-2 rounded-full bg-cyber-primary animate-pulse"></span> Data Filters
        </h3>

        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
          <div>
            <label class="text-gray-500 text-[10px] uppercase mb-1 block">Time Period</label>
            <select [(ngModel)]="filters.period" (change)="applyFilters()" class="cyber-select">
              <option value="all">All Time</option>
              <option value="year">This Year</option>
              <option value="month">This Month</option>
              <option value="week">This Week</option>
            </select>
          </div>
          <div>
            <label class="text-gray-500 text-[10px] uppercase mb-1 block">Track</label>
            <select [(ngModel)]="filters.track" (change)="applyFilters()" class="cyber-select">
              <option value="">All Tracks</option>
              <option *ngFor="let t of options.tracks" [value]="t">{{ t }}</option>
            </select>
          </div>

          <div>
            <label class="text-gray-500 text-[10px] uppercase mb-1 block">Program</label>
            <select
              [(ngModel)]="filters.studyProgram"
              (change)="applyFilters()"
              class="cyber-select"
            >
              <option value="">All Programs</option>
              <option *ngFor="let p of options.studyPrograms" [value]="p">{{ p }}</option>
            </select>
          </div>

          <div>
            <label class="text-gray-500 text-[10px] uppercase mb-1 block">Level</label>
            <select [(ngModel)]="filters.level" (change)="applyFilters()" class="cyber-select">
              <option value="">All Levels</option>
              <option *ngFor="let l of options.levels" [value]="l">{{ l }}</option>
            </select>
          </div>

          <div>
            <label class="text-gray-500 text-[10px] uppercase mb-1 block">Gender</label>
            <select [(ngModel)]="filters.gender" (change)="applyFilters()" class="cyber-select">
              <option value="">All</option>
              <option *ngFor="let g of options.genders" [value]="g">{{ g }}</option>
            </select>
          </div>
          <div>
            <label class="text-gray-500 text-[10px] uppercase mb-1 block">Age</label>
            <select [(ngModel)]="filters.age" (change)="applyFilters()" class="cyber-select">
              <option value="">All</option>
              <option *ngFor="let a of options.ages" [value]="a">{{ a }}</option>
            </select>
          </div>
          <div>
            <label class="text-gray-500 text-[10px] uppercase mb-1 block">Province</label>
            <select [(ngModel)]="filters.province" (change)="applyFilters()" class="cyber-select">
              <option value="">All</option>
              <option *ngFor="let p of options.provinces" [value]="p">{{ p }}</option>
            </select>
          </div>
          <div>
            <label class="text-gray-500 text-[10px] uppercase mb-1 block">School</label>
            <input
              type="text"
              [(ngModel)]="filters.school"
              (input)="applyFilters()"
              placeholder="Search..."
              class="w-full bg-black/50 border border-white/20 rounded-lg px-3 py-2 text-sm text-white focus:border-cyber-primary outline-none focus:shadow-[0_0_10px_rgba(0,243,255,0.3)] transition-all"
            />
          </div>
        </div>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div class="bg-gray-900/80 border border-white/10 p-4 rounded-xl">
          <h3 class="text-gray-400 text-[10px] uppercase mb-1">Total Found</h3>
          <div class="text-3xl font-bold text-white">{{ filteredSessions.length }}</div>
        </div>
        <div class="bg-gray-900/80 border border-white/10 p-4 rounded-xl">
          <h3 class="text-gray-400 text-[10px] uppercase mb-1">Most Popular</h3>
          <div class="text-3xl font-bold text-cyber-secondary truncate">{{ kpi.topTrack }}</div>
        </div>
        <div class="bg-gray-900/80 border border-white/10 p-4 rounded-xl">
          <h3 class="text-gray-400 text-[10px] uppercase mb-1">Avg Score</h3>
          <div class="text-3xl font-bold text-cyber-primary">{{ kpi.avgScore }}%</div>
        </div>
        <div class="bg-gray-900/80 border border-white/10 p-4 rounded-xl">
          <h3 class="text-gray-400 text-[10px] uppercase mb-1">Avg Age</h3>
          <div class="text-3xl font-bold text-white">{{ kpi.avgAge }}</div>
        </div>
      </div>

      <div
        *ngIf="showCharts"
        class="mb-8 animate-fadeIn border-t border-b border-white/10 py-6 bg-black/20"
      >
        <h2 class="text-xl font-bold text-white mb-4 pl-2 border-l-4 border-cyber-primary">
          Visual Analytics
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4">
          <div class="bg-gray-900/80 border border-white/10 p-3 rounded-xl lg:col-span-3">
            <h3 class="text-xs uppercase text-gray-400 mb-2">Track Distribution</h3>
            <div class="relative h-48 w-full"><canvas #trackChart></canvas></div>
          </div>
          <div class="bg-gray-900/80 border border-white/10 p-3 rounded-xl lg:col-span-3">
            <h3 class="text-xs uppercase text-gray-400 mb-2">Gender Ratio</h3>
            <div class="relative h-48 w-full flex justify-center">
              <canvas #genderChart></canvas>
            </div>
          </div>
          <div class="bg-gray-900/80 border border-white/10 p-3 rounded-xl lg:col-span-3">
            <h3 class="text-xs uppercase text-gray-400 mb-2">Age Groups</h3>
            <div class="relative h-48 w-full"><canvas #ageChart></canvas></div>
          </div>

          <div class="bg-gray-900/80 border border-white/10 p-3 rounded-xl lg:col-span-3">
            <h3 class="text-xs uppercase text-gray-400 mb-2">Education Levels</h3>
            <div class="relative h-48 w-full"><canvas #levelChart></canvas></div>
          </div>

          <div class="bg-gray-900/80 border border-white/10 p-3 rounded-xl lg:col-span-8">
            <h3 class="text-xs uppercase text-gray-400 mb-2">
              User Growth Trend ({{ filters.period | titlecase }})
            </h3>
            <div class="relative h-48 w-full"><canvas #trendChart></canvas></div>
          </div>
          <div class="bg-gray-900/80 border border-white/10 p-3 rounded-xl lg:col-span-4">
            <h3 class="text-xs uppercase text-gray-400 mb-2">Selections by Gender</h3>
            <div class="relative h-48 w-full"><canvas #genderTrackChart></canvas></div>
          </div>

          <div class="bg-gray-900/80 border border-white/10 p-3 rounded-xl lg:col-span-6">
            <h3 class="text-xs uppercase text-gray-400 mb-2">Top Provinces</h3>
            <div class="relative h-48 w-full"><canvas #provinceChart></canvas></div>
          </div>
          <div class="bg-gray-900/80 border border-white/10 p-3 rounded-xl lg:col-span-6">
            <h3 class="text-xs uppercase text-gray-400 mb-2">Study Programs</h3>
            <div class="relative h-48 w-full"><canvas #programChart></canvas></div>
          </div>
        </div>
      </div>

      <div
        class="bg-gray-900/80 border border-white/10 rounded-xl overflow-hidden backdrop-blur-sm shadow-2xl"
      >
        <div class="p-4 border-b border-white/10 bg-white/5 flex justify-between items-center">
          <h3 class="text-white font-bold text-sm tracking-wider flex items-center gap-2">
            📄 DETAILED RECORDS
          </h3>
          <span class="text-xs text-gray-400">Scroll to view more</span>
        </div>
        <div class="overflow-x-auto max-h-[600px] custom-scrollbar">
          <table class="w-full text-left text-xs border-collapse">
            <thead class="bg-gray-800 text-gray-400 sticky top-0 z-10 shadow-md">
              <tr>
                <th class="p-4 font-semibold uppercase tracking-wider">Date/Time</th>
                <th class="p-4 font-semibold uppercase tracking-wider">Name</th>
                <th class="p-4 font-semibold uppercase tracking-wider">Gender</th>
                <th class="p-4 font-semibold uppercase tracking-wider">Age</th>
                <th class="p-4 font-semibold uppercase tracking-wider">Level</th>
                <th class="p-4 font-semibold uppercase tracking-wider">Province</th>
                <th class="p-4 font-semibold uppercase tracking-wider">School</th>
                <th class="p-4 font-semibold uppercase tracking-wider">Program</th>
                <th class="p-4 text-center font-semibold uppercase tracking-wider">Result</th>
                <th class="p-4 text-center font-semibold uppercase tracking-wider">Score</th>
                <th class="p-4 text-center font-semibold uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/5">
              <tr
                *ngFor="let s of paginatedSessions"
                class="hover:bg-white/5 transition-colors group"
              >
                <td class="p-4 text-gray-400 whitespace-nowrap font-mono">
                  {{ s.createdAt | date: 'dd/MM/yy HH:mm' }}
                </td>
                <td class="p-4 font-medium text-white text-sm">{{ s.studentName }}</td>
                <td class="p-4 text-gray-300">{{ s.gender || '-' }}</td>
                <td class="p-4 text-gray-300">{{ s.age || '-' }}</td>

                <td class="p-4 text-gray-300">{{ s.levelEducation || '-' }}</td>

                <td class="p-4 text-gray-300">{{ s.province || '-' }}</td>
                <td class="p-4 text-gray-400 truncate max-w-[150px]" title="{{ s.school }}">
                  {{ s.school }}
                </td>
                <td class="p-4 text-gray-300 truncate max-w-[150px]">
                  {{ s.studyProgram || '-' }}
                </td>
                <td class="p-4 text-center">
                  <span
                    class="inline-block px-3 py-1 rounded bg-cyber-primary/10 text-cyber-primary font-bold border border-cyber-primary/30 group-hover:bg-cyber-primary group-hover:text-black transition-colors"
                  >
                    {{ s.topTrack }}
                  </span>
                </td>
                <td class="p-4 text-center font-mono text-white">
                  {{ s.topScorePercent | number: '1.0-0' }}%
                </td>
                <td class="p-4 text-center">
                  <button
                    (click)="deleteSession(s.sessionId, s.studentName)"
                    class="bg-red-500/20 text-red-500 border border-red-500/50 p-2 rounded-full hover:bg-red-600 hover:text-white transition-all shadow-[0_0_10px_rgba(239,68,68,0.4)]"
                    title="DELETE"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="2"
                      stroke="currentColor"
                      class="w-4 h-4"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                      />
                    </svg>
                  </button>
                </td>
              </tr>
              <tr *ngIf="filteredSessions.length === 0">
                <td colspan="11" class="p-12 text-center text-gray-500 border-t border-white/5">
                  <div class="flex flex-col items-center gap-2">
                    <span class="text-2xl">🔍</span>
                    <span>No data matches the current filters.</span>
                    <button
                      (click)="resetFilters()"
                      class="text-cyber-primary underline hover:text-white mt-2"
                    >
                      Clear Filters
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div
        class="p-4 border-t border-white/10 bg-white/5 flex flex-col md:flex-row justify-between items-center gap-4"
      >
        <div class="text-xs text-gray-400">
          Showing {{ (currentPage - 1) * itemsPerPage + 1 }} -
          {{ Math.min(currentPage * itemsPerPage, filteredSessions.length) }} of
          {{ filteredSessions.length }} records
        </div>

        <div class="flex items-center gap-2" *ngIf="totalPages > 1">
          <button
            (click)="changePage(currentPage - 1)"
            [disabled]="currentPage === 1"
            class="px-3 py-1 rounded border border-white/10 text-xs font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            [ngClass]="currentPage === 1 ? 'text-gray-500' : 'text-white hover:bg-white/10'"
          >
            PREV
          </button>

          <div class="flex gap-1">
            <span
              class="px-3 py-1 rounded bg-cyber-primary text-black text-xs font-bold shadow-[0_0_10px_rgba(0,243,255,0.4)]"
            >
              {{ currentPage }}
            </span>
            <span class="px-2 py-1 text-gray-400 text-xs flex items-center"
              >/ {{ totalPages }}</span
            >
          </div>

          <button
            (click)="changePage(currentPage + 1)"
            [disabled]="currentPage === totalPages"
            class="px-3 py-1 rounded border border-white/10 text-xs font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            [ngClass]="
              currentPage === totalPages ? 'text-gray-500' : 'text-white hover:bg-white/10'
            "
          >
            NEXT
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .custom-scrollbar::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }
      .custom-scrollbar::-webkit-scrollbar-track {
        background: rgba(0, 0, 0, 0.3);
      }
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.2);
        border-radius: 4px;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: rgba(255, 255, 255, 0.4);
      }
      .animate-fadeIn {
        animation: fadeIn 0.3s ease-out;
      }
      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(-10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      .cyber-select {
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
        background-position: right 0.75rem center;
        background-repeat: no-repeat;
        background-size: 1.25em 1.25em;
        padding-right: 2.5rem;
        width: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 0.5rem;
        padding: 0.75rem 1rem;
        color: white;
        font-size: 0.875rem;
        outline: none;
        transition: all 0.2s;
        cursor: pointer;
      }

      .cyber-select:focus {
        border-color: #00f3ff;
        box-shadow: 0 0 0 1px #00f3ff;
      }

      .cyber-select option {
        background-color: #111827;
        color: white;
        padding: 10px;
      }
    `,
  ],
})
export class DashboardComponent implements OnInit, AfterViewInit {
  @ViewChildren(
    'trackChart, genderChart, ageChart, provinceChart, genderTrackChart, trendChart, programChart, levelChart',
  )
  chartRefs!: QueryList<ElementRef>;

  sessions: AdminSession[] = [];
  filteredSessions: AdminSession[] = [];
  charts: any[] = [];
  showCharts = false;
  Math = Math;

  options = {
    genders: [] as string[],
    ages: [] as number[],
    provinces: [] as string[],
    tracks: [] as string[],
    studyPrograms: [] as string[],
    levels: [] as string[],
  };

  currentPage = 1;
  itemsPerPage = 50;
  paginatedSessions: AdminSession[] = [];

  filters = {
    period: 'all',
    track: '',
    gender: '',
    age: '',
    province: '',
    school: '',
    studyProgram: '',
    level: '',
  };
  kpi = { topTrack: '-', avgScore: '0', avgAge: '0' };

  constructor(
    private adminService: AdminService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.checkAuth();
    this.loadData();
  }

  ngAfterViewInit() {}

  checkAuth() {
    if (!localStorage.getItem('isAdmin')) this.router.navigate(['/admin/login']);
  }
  goToManage() {
    this.router.navigate(['/admin/manage']);
  }
  logout() {
    localStorage.removeItem('isAdmin');
    this.router.navigate(['/admin/login']);
  }

  loadData() {
    this.adminService.getSessions().subscribe({
      next: (res) => {
        this.sessions = res;
        this.extractFilterOptions();
        this.applyFilters();
      },
      error: (err) => console.error(err),
    });
  }

  toggleCharts() {
    this.showCharts = !this.showCharts;
    if (this.showCharts) setTimeout(() => this.initCharts(), 50);
  }

  deleteSession(id: number, name: string) {
    Swal.fire({
      title: '🚨 DELETE RECORD?',
      html: `You are about to delete survey data for: <br/><b style="color: #ef4444">${name}</b><br/><br/>This action cannot be undone.<br/>Type <b>DELETE</b> to confirm.`,
      input: 'text',
      inputPlaceholder: 'Type DELETE',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it',
      confirmButtonColor: '#d33',
      background: '#1a1a1a',
      color: '#fff',
      customClass: { input: 'bg-gray-800 text-white border-gray-600' },
      preConfirm: (v) => {
        if (v !== 'DELETE') Swal.showValidationMessage('Type DELETE to confirm!');
      },
    }).then((result) => {
      if (result.isConfirmed) {
        this.adminService.deleteSession(id).subscribe({
          next: () => {
            this.sessions = this.sessions.filter((s) => s.sessionId !== id);
            this.applyFilters();
            Swal.fire({
              title: 'Deleted!',
              icon: 'success',
              timer: 1500,
              showConfirmButton: false,
              background: '#1a1a1a',
              color: '#fff',
            });
          },
          error: () => Swal.fire('Error', 'Failed to delete record.', 'error'),
        });
      }
    });
  }

  extractFilterOptions() {
    this.options.genders = [
      ...new Set(this.sessions.map((s) => s.gender).filter(Boolean) as string[]),
    ];
    this.options.ages = [
      ...new Set(this.sessions.map((s) => s.age).filter(Boolean) as number[]),
    ].sort((a, b) => a - b);
    this.options.provinces = [
      ...new Set(this.sessions.map((s) => s.province).filter(Boolean) as string[]),
    ].sort();
    this.options.tracks = [
      ...new Set(this.sessions.map((s) => s.topTrack).filter(Boolean) as string[]),
    ].sort();
    this.options.studyPrograms = [
      ...new Set(this.sessions.map((s) => s.studyProgram).filter(Boolean) as string[]),
    ].sort();

    // ดึง Level มาทำ Filter
    this.options.levels = [
      ...new Set(this.sessions.map((s) => s.levelEducation).filter(Boolean) as string[]),
    ].sort();
  }

  applyFilters() {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - 7);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    this.filteredSessions = this.sessions.filter((s) => {
      const date = new Date(s.createdAt);
      let matchTime = true;
      if (this.filters.period === 'year') matchTime = date >= startOfYear;
      else if (this.filters.period === 'month') matchTime = date >= startOfMonth;
      else if (this.filters.period === 'week') matchTime = date >= startOfWeek;

      const matchTrack = !this.filters.track || s.topTrack === this.filters.track;
      const matchGender = !this.filters.gender || s.gender === this.filters.gender;
      const matchAge = !this.filters.age || s.age === Number(this.filters.age);
      const matchProvince = !this.filters.province || s.province === this.filters.province;
      const matchSchool =
        !this.filters.school ||
        (s.school && s.school.toLowerCase().includes(this.filters.school.toLowerCase()));
      const matchProgram =
        !this.filters.studyProgram || s.studyProgram === this.filters.studyProgram;
      const matchLevel = !this.filters.level || s.levelEducation === this.filters.level;

      return (
        matchTime &&
        matchTrack &&
        matchGender &&
        matchAge &&
        matchProvince &&
        matchSchool &&
        matchProgram &&
        matchLevel
      );
    });

    this.calculateKPI();
    if (this.showCharts) setTimeout(() => this.initCharts(), 50);

    this.currentPage = 1;
    this.updatePagination();

    if (this.showCharts) setTimeout(() => this.initCharts(), 50);
  }

  resetFilters() {
    this.filters = {
      period: 'all',
      track: '',
      gender: '',
      age: '',
      province: '',
      school: '',
      studyProgram: '',
      level: '',
    };
    this.applyFilters();
  }

  updatePagination() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedSessions = this.filteredSessions.slice(startIndex, endIndex);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  get totalPages(): number {
    return Math.ceil(this.filteredSessions.length / this.itemsPerPage);
  }

  calculateKPI() {
    if (this.filteredSessions.length === 0) {
      this.kpi = { topTrack: '-', avgScore: '0', avgAge: '0' };
      return;
    }
    const counts: any = {};
    this.filteredSessions.forEach((s) => (counts[s.topTrack] = (counts[s.topTrack] || 0) + 1));
    const sortedTracks = Object.keys(counts).sort((a, b) => counts[b] - counts[a]);
    this.kpi.topTrack = sortedTracks.length > 0 ? sortedTracks[0] : '-';

    const totalScore = this.filteredSessions.reduce((sum, s) => sum + (s.topScorePercent || 0), 0);
    this.kpi.avgScore = (totalScore / this.filteredSessions.length).toFixed(0);

    const validAges = this.filteredSessions.filter((s) => s.age).map((s) => s.age!);
    const totalAge = validAges.reduce((a, b) => a + b, 0);
    this.kpi.avgAge = validAges.length ? (totalAge / validAges.length).toFixed(1) : '-';
  }

  normalizeGender(g: string | undefined): 'Male (ชาย)' | 'Female (หญิง)' | 'Others (อื่นๆ)' {
    if (!g) return 'Others (อื่นๆ)';
    const lower = g.toLowerCase();

    if (
      lower === 'male' ||
      lower === 'men' ||
      lower === 'ชาย' ||
      lower === 'man' ||
      lower === 'นาย'
    ) {
      return 'Male (ชาย)';
    }
    if (
      lower === 'female' ||
      lower === 'women' ||
      lower === 'หญิง' ||
      lower === 'woman' ||
      lower === 'นาง' ||
      lower === 'นางสาว'
    ) {
      return 'Female (หญิง)';
    }
    return 'Others (อื่นๆ)';
  }

  getGenderColor(category: string) {
    if (category === 'Male (ชาย)') return '#36A2EB'; // Blue
    if (category === 'Female (หญิง)') return '#FF6384'; // Pink
    return '#FFCD56'; // Yellow
  }

  initCharts() {
    this.charts.forEach((c) => c.destroy());
    this.charts = [];
    const data = this.filteredSessions;

    // 1. Track Chart
    const trackCounts: any = {};
    data.forEach((s) => (trackCounts[s.topTrack] = (trackCounts[s.topTrack] || 0) + 1));
    this.createChart('trackChart', 'bar', Object.keys(trackCounts), Object.values(trackCounts), [
      '#00f3ff',
      '#bc13fe',
      '#ffff00',
      '#00ff00',
    ]);

    // 2. Gender Chart (Normalized)
    const genderCounts = { 'Male (ชาย)': 0, 'Female (หญิง)': 0, 'Others (อื่นๆ)': 0 };
    data.forEach((s) => {
      const category = this.normalizeGender(s.gender);
      genderCounts[category]++;
    });
    const activeGenders = Object.entries(genderCounts).filter(([k, v]) => v > 0);
    this.createChart(
      'genderChart',
      'doughnut',
      activeGenders.map((e) => e[0]),
      activeGenders.map((e) => e[1]),
      activeGenders.map((e) => this.getGenderColor(e[0])),
    );

    // 3. Age Chart
    const ageCounts: any = {};
    data.forEach((s) => {
      if (s.age) ageCounts[s.age] = (ageCounts[s.age] || 0) + 1;
    });
    const ageKeys = Object.keys(ageCounts).sort();
    this.createChart(
      'ageChart',
      'bar',
      ageKeys,
      ageKeys.map((k) => ageCounts[k]),
      '#bc13fe',
    );

    // 4. Selections by Gender (Grouped Bar - NO STACK)
    const tracks = ['CS', 'IT', 'CDT', 'CE'];
    const genderDatasets = ['Male (ชาย)', 'Female (หญิง)', 'Others (อื่นๆ)'].map((category) => {
      return {
        label: category,
        data: tracks.map(
          (t) =>
            data.filter((s) => s.topTrack === t && this.normalizeGender(s.gender) === category)
              .length,
        ),
        backgroundColor: this.getGenderColor(category),
      };
    });
    this.createCustomChart('genderTrackChart', {
      type: 'bar',
      data: { labels: tracks, datasets: genderDatasets },
      options: { responsive: true, maintainAspectRatio: false, scales: { x: {}, y: {} } },
    });

    // 5. Trend Chart
    const trend = this.getTrendData(data);
    this.createCustomChart('trendChart', {
      type: 'line',
      data: {
        labels: trend.labels,
        datasets: [
          {
            label: 'Users',
            data: trend.data,
            borderColor: '#00f3ff',
            backgroundColor: 'rgba(0,243,255,0.2)',
            fill: true,
            tension: 0.4,
          },
        ],
      },
      options: { responsive: true, maintainAspectRatio: false },
    });

    // 6. Province Chart
    const provCounts: any = {};
    data.forEach((s) => {
      if (s.province) provCounts[s.province] = (provCounts[s.province] || 0) + 1;
    });
    const sortedProv = Object.entries(provCounts)
      .sort((a: any, b: any) => b[1] - a[1])
      .slice(0, 20);
    this.createChart(
      'provinceChart',
      'bar',
      sortedProv.map((p) => p[0]),
      sortedProv.map((p) => p[1]),
      '#00f3ff',
      { indexAxis: '' },
    );

    // 7. Program Chart
    const progCounts: any = {};
    data.forEach((s) => {
      const prog = s.studyProgram || 'Unknown';
      progCounts[prog] = (progCounts[prog] || 0) + 1;
    });
    const sortedProg = Object.entries(progCounts)
      .sort((a: any, b: any) => b[1] - a[1])
      .slice(0, 6);
    this.createChart(
      'programChart',
      'bar',
      sortedProg.map((p) => p[0]),
      sortedProg.map((p) => p[1]),
      '#ff0055',
      { indexAxis: 'y' },
    );

    // ✅ 8. Level Chart (กราฟใหม่: ระดับชั้น)
    const levelCounts: any = {};
    data.forEach((s) => {
      const lvl = s.levelEducation || 'Unknown';
      levelCounts[lvl] = (levelCounts[lvl] || 0) + 1;
    });
    const sortedLevel = Object.entries(levelCounts).sort((a: any, b: any) =>
      a[0].localeCompare(b[0]),
    ); // เรียงตามชื่อชั้นปี
    this.createChart(
      'levelChart',
      'bar',
      sortedLevel.map((p) => p[0]),
      sortedLevel.map((p) => p[1]),
      '#00ff99',
    );
  }

  getTrendData(data: AdminSession[]) {
    const isDaily = this.filters.period === 'week' || this.filters.period === 'month';
    const counts: any = {};
    const sortedData = [...data].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );
    sortedData.forEach((s) => {
      const d = new Date(s.createdAt);
      const key = isDaily
        ? d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })
        : `${d.toLocaleString('default', { month: 'short' })} ${d.getFullYear()}`;
      counts[key] = (counts[key] || 0) + 1;
    });
    return { labels: Object.keys(counts), data: Object.values(counts) };
  }

  createChart(ref: string, type: any, lbl: any[], dat: any[], col: any, opts: any = {}) {
    let ctx = this.getCanvasCtx(ref);
    if (ctx) this.createCustomChartBase(ctx, type, lbl, dat, col, opts);
  }
  createCustomChart(ref: string, config: any) {
    let ctx = this.getCanvasCtx(ref);
    if (ctx) this.charts.push(new Chart(ctx, config));
  }
  createCustomChartBase(ctx: any, type: any, labels: any[], data: any[], colors: any, extra: any) {
    this.charts.push(
      new Chart(ctx, {
        type: type,
        data: {
          labels,
          datasets: [{ label: 'Count', data, backgroundColor: colors, borderWidth: 0 }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: 'bottom', labels: { color: '#aaa' } } },
          scales:
            type.includes('bar') || type.includes('line')
              ? {
                  y: { grid: { color: 'rgba(255,255,255,0.1)' }, ticks: { color: '#aaa' } },
                  x: {
                    grid: { display: false },
                    ticks: { color: '#aaa' },
                    ...(extra.indexAxis === 'y' ? {} : {}),
                  },
                }
              : {},
          ...extra,
        },
      }),
    );
  }

  // ✅ เพิ่ม Mapping ของ levelChart
  getCanvasCtx(ref: string) {
    const arr = this.chartRefs.toArray();
    const map: any = {
      trackChart: 0,
      genderChart: 1,
      ageChart: 2,
      levelChart: 3,
      trendChart: 4,
      genderTrackChart: 5,
      provinceChart: 6,
      programChart: 7,
    };
    return arr[map[ref]]?.nativeElement;
  }

  exportToCSV() {
    if (this.filteredSessions.length === 0) {
      alert('No data to export!');
      return;
    }

    const headers = [
      'Date',
      'Time',
      'Name',
      'Gender',
      'Age',
      'Level',
      'Province',
      'School',
      'Program',
      'Track',
      'Score(%)',
    ];

    const rows = this.filteredSessions.map((s) => {
      let dateStr = '-';
      let timeStr = '-';

      if (s.createdAt) {
        // แปลงเป็น String เพื่อความชัวร์
        const rawStr = s.createdAt.toString();

        // 🛠️ วิธีแยก String (แม่นยำที่สุดสำหรับรูปแบบที่มี T คั่น)
        // JSON: "2026-01-11T04:50:28.786808"
        const parts = rawStr.split('T');

        if (parts.length >= 2) {
          const datePart = parts[0]; // ได้ "2026-01-11"
          const timePart = parts[1]; // ได้ "04:50:28..."

          // แปลงวันที่: 2026-01-11 => 11/01/2026
          const [year, month, day] = datePart.split('-');
          if (day && month && year) {
            dateStr = `${day}/${month}/${year}`;
          }

          // แปลงเวลา: 04:50:28... => 04:50
          const [hour, minute] = timePart.split(':');
          if (hour && minute) {
            timeStr = `${hour}:${minute}`;
          }
        }
        // Fallback: ถ้าไม่มี T ให้ใช้ Date Object ช่วย (เผื่อข้อมูลเก่า)
        else {
          const dateObj = new Date(s.createdAt);
          if (!isNaN(dateObj.getTime())) {
            const d = ('0' + dateObj.getDate()).slice(-2);
            const m = ('0' + (dateObj.getMonth() + 1)).slice(-2);
            const y = dateObj.getFullYear();
            dateStr = `${d}/${m}/${y}`;

            const h = ('0' + dateObj.getHours()).slice(-2);
            const min = ('0' + dateObj.getMinutes()).slice(-2);
            timeStr = `${h}:${min}`;
          }
        }
      }

      return [
        // ✅ Trick: ใส่ \t ข้างหน้า เพื่อบังคับ Excel ให้แสดงเป็น Text (แก้ปัญหา ####### และวันที่สลับเดือน)
        `"\t${dateStr}"`,
        `"\t${timeStr}"`,
        `"${s.studentName}"`,
        s.gender || '-',
        s.age || '-',
        `"${s.levelEducation || '-'}"`,
        s.province || '-',
        `"${s.school}"`,
        `"${s.studyProgram || '-'}"`,
        s.topTrack,
        s.topScorePercent,
      ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');

    // เพิ่ม BOM \ufeff เพื่อให้รองรับภาษาไทยใน Excel
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `survey_report_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
