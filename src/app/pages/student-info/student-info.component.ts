import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SurveyService } from '../../services/survey.service';
import { StudentProfile } from '../../models/survey.model';

@Component({
  selector: 'app-student-info',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div
      class="min-h-screen bg-cyber-bg flex items-center justify-center p-4 relative overflow-hidden font-sans"
    >
      <div
        class="absolute inset-0 bg-[url('https://assets.codepen.io/13471/sparkles.gif')] opacity-60 mix-blend-screen pointer-events-none"
      ></div>

      <div class="fixed inset-0 z-0 pointer-events-none">
        <div class="absolute w-[2px] h-[2px] bg-white rounded-full star-1 opacity-90"></div>
        <div class="absolute w-[3px] h-[3px] bg-blue-200 rounded-full star-2 opacity-70"></div>
      </div>

      <div
        class="absolute w-full h-full bg-gradient-to-b from-gray-900/80 via-[#050b14]/90 to-cyber-bg z-0"
      ></div>
      <div
        class="absolute top-[-10%] left-[-10%] w-96 h-96 bg-cyber-primary/20 blur-[150px] rounded-full animate-pulse-slow"
      ></div>
      <div
        class="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-cyber-secondary/20 blur-[150px] rounded-full animate-pulse-slow"
        style="animation-delay: 2s"
      ></div>

      <div
        class="bg-white/5 border border-white/20 p-6 md:p-10 rounded-[2.5rem] w-full max-w-lg backdrop-blur-sm relative z-10 shadow-[0_0_60px_rgba(0,243,255,0.15)] animate-fadeInUp"
      >
        <div class="text-center mb-8 relative">
          <div
            class="absolute -top-10 left-1/2 -translate-x-1/2 w-32 h-1 bg-cyber-primary shadow-[0_0_20px_#00f3ff]"
          ></div>
          <h1
            class="text-3xl md:text-4xl font-black text-white mb-2 tracking-wider drop-shadow-[0_0_10px_rgba(0,243,255,0.5)]"
          >
            IDENTIFY YOURSELF
          </h1>
          <p class="text-cyber-primary text-sm uppercase tracking-[0.3em] animate-pulse font-bold">
            System Access Required
          </p>
        </div>

        <form (ngSubmit)="onSubmit(infoForm)" #infoForm="ngForm" class="space-y-5">
          <div class="space-y-2">
            <label class="text-cyber-primary text-xs uppercase tracking-wider font-bold"
              >Full Name</label
            >
            <input
              type="text"
              [(ngModel)]="data.fullName"
              name="fullName"
              required
              class="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyber-primary focus:bg-black/60 focus:outline-none transition-all placeholder-gray-500"
              placeholder="กรอกชื่อ-นามสกุลของคุณ"
            />
          </div>

          <div class="space-y-2">
            <label class="text-cyber-primary text-xs uppercase tracking-wider font-bold"
              >Gender</label
            >
            <div class="flex gap-3">
              <button
                type="button"
                (click)="data.gender = 'male'"
                class="flex-1 py-3 rounded-xl border transition-all duration-300 font-medium tracking-wide"
                [ngClass]="
                  data.gender === 'male'
                    ? 'bg-cyber-primary text-black font-bold shadow-[0_0_15px_rgba(0,243,255,0.4)]'
                    : 'bg-black/40 text-gray-400 border-white/10 hover:border-white/30'
                "
              >
                ชาย
              </button>
              <button
                type="button"
                (click)="data.gender = 'female'"
                class="flex-1 py-3 rounded-xl border transition-all duration-300 font-medium tracking-wide"
                [ngClass]="
                  data.gender === 'female'
                    ? 'bg-cyber-secondary text-white font-bold shadow-[0_0_15px_rgba(236,72,153,0.4)]'
                    : 'bg-black/40 text-gray-400 border-white/10 hover:border-white/30'
                "
              >
                หญิง
              </button>
              <button
                type="button"
                (click)="data.gender = 'other'"
                class="flex-1 py-3 rounded-xl border transition-all duration-300 font-medium tracking-wide"
                [ngClass]="
                  data.gender === 'other'
                    ? 'bg-white text-black font-bold shadow-[0_0_15px_rgba(255,255,255,0.4)]'
                    : 'bg-black/40 text-gray-400 border-white/10 hover:border-white/30'
                "
              >
                อื่นๆ
              </button>
            </div>
            <input type="text" [(ngModel)]="data.gender" name="gender" required hidden />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
              <label class="text-cyber-primary text-xs uppercase tracking-wider font-bold"
                >Age</label
              >
              <input
                type="number"
                [(ngModel)]="data.age"
                name="age"
                required
                min="10"
                max="99"
                class="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyber-primary focus:bg-black/60 focus:outline-none transition-all placeholder-gray-500 text-center"
                placeholder="00"
              />
            </div>

            <div class="space-y-2 relative">
              <label class="text-cyber-primary text-xs uppercase tracking-wider font-bold"
                >Province</label
              >
              <input
                type="text"
                name="province"
                [(ngModel)]="data.province"
                (input)="onProvinceInput($event)"
                (focus)="onProvinceFocus()"
                (blur)="onProvinceBlur()"
                autocomplete="off"
                required
                class="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyber-primary focus:bg-black/60 focus:outline-none transition-all placeholder-gray-500"
                placeholder="พิมพ์จังหวัด..."
              />

              <div
                *ngIf="showProvinceList && filteredProvinces.length > 0"
                (mouseenter)="isOverProvinceList = true"
                (mouseleave)="isOverProvinceList = false"
                class="absolute z-50 w-full mt-1 bg-gray-900/95 border border-cyber-primary rounded-xl shadow-xl max-h-60 overflow-y-auto custom-scrollbar backdrop-blur-md"
              >
                <div
                  *ngFor="let p of filteredProvinces"
                  (mousedown)="selectProvince(p.name); $event.preventDefault()"
                  class="px-4 py-3 text-white hover:bg-cyber-primary hover:text-black cursor-pointer transition-colors border-b border-white/10 last:border-0"
                >
                  {{ p.name }}
                </div>
              </div>
            </div>
          </div>

          <div class="space-y-2 relative">
            <label class="text-cyber-primary text-xs uppercase tracking-wider font-bold"
              >School</label
            >
            <input
              type="text"
              name="school"
              [(ngModel)]="data.school"
              (input)="onSchoolInput($event)"
              (blur)="onSchoolBlur()"
              autocomplete="off"
              required
              class="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyber-primary focus:bg-black/60 focus:outline-none transition-all placeholder-gray-500"
              placeholder="พิมพ์ชื่อโรงเรียน..."
            />

            <div
              *ngIf="showSchoolList && filteredSchools.length > 0"
              (mouseenter)="isOverSchoolList = true"
              (mouseleave)="isOverSchoolList = false"
              class="absolute z-50 w-full mt-1 bg-gray-900/95 border border-cyber-primary rounded-xl shadow-xl max-h-60 overflow-y-auto custom-scrollbar backdrop-blur-md"
            >
              <div
                *ngFor="let school of filteredSchools"
                (mousedown)="selectSchool(school.name); $event.preventDefault()"
                class="px-4 py-3 text-white hover:bg-cyber-primary hover:text-black cursor-pointer transition-colors border-b border-white/10 last:border-0"
              >
                {{ school.name }}
              </div>
            </div>
            <input type="text" [(ngModel)]="data.school" name="school_valid" required hidden />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2 relative">
              <label class="text-cyber-primary text-xs uppercase tracking-wider font-bold"
                >Level</label
              >
              <input
                type="text"
                name="levelEducation"
                [(ngModel)]="data.levelEducation"
                (input)="onLevelInput($event)"
                (focus)="onLevelFocus()"
                (blur)="onLevelBlur()"
                autocomplete="off"
                required
                class="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyber-primary focus:bg-black/60 focus:outline-none transition-all placeholder-gray-500"
                placeholder="ระดับชั้น..."
              />

              <div
                *ngIf="showLevelList && filteredLevels.length > 0"
                (mouseenter)="isOverLevelList = true"
                (mouseleave)="isOverLevelList = false"
                class="absolute z-50 w-full mt-1 bg-gray-900/95 border border-cyber-primary rounded-xl shadow-xl max-h-60 overflow-y-auto custom-scrollbar backdrop-blur-md"
              >
                <div
                  *ngFor="let l of filteredLevels"
                  (mousedown)="selectLevel(l.name); $event.preventDefault()"
                  class="px-4 py-3 text-white hover:bg-cyber-primary hover:text-black cursor-pointer transition-colors border-b border-white/10 last:border-0"
                >
                  {{ l.name }}
                </div>
              </div>
            </div>

            <div class="space-y-2 relative">
              <label class="text-cyber-primary text-xs uppercase tracking-wider font-bold"
                >Program</label
              >
              <input
                type="text"
                name="studyProgram"
                [(ngModel)]="data.studyProgram"
                (input)="onProgramInput($event)"
                (focus)="onProgramFocus()"
                (blur)="onProgramBlur()"
                autocomplete="off"
                required
                class="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyber-primary focus:bg-black/60 focus:outline-none transition-all placeholder-gray-500"
                placeholder="สายการเรียน..."
              />

              <div
                *ngIf="showProgramList && filteredPrograms.length > 0"
                (mouseenter)="isOverProgramList = true"
                (mouseleave)="isOverProgramList = false"
                class="absolute z-50 w-full mt-1 bg-gray-900/95 border border-cyber-primary rounded-xl shadow-xl max-h-60 overflow-y-auto custom-scrollbar backdrop-blur-md"
              >
                <div
                  *ngFor="let p of filteredPrograms"
                  (mousedown)="selectProgram(p.name); $event.preventDefault()"
                  class="px-4 py-3 text-white hover:bg-cyber-primary hover:text-black cursor-pointer transition-colors border-b border-white/10 last:border-0"
                >
                  {{ p.name }}
                </div>
              </div>
            </div>
          </div>

          <div class="pt-6">
            <button
              type="submit"
              [disabled]="!infoForm.form.valid"
              class="w-full group relative flex justify-center items-center gap-3 px-12 py-4 bg-white text-black font-bold text-sm uppercase tracking-[0.2em] rounded-full overflow-hidden transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
            >
              <div
                class="absolute inset-0 bg-gradient-to-r from-cyber-primary to-cyber-secondary opacity-0 group-hover:opacity-20 transition-opacity duration-300"
              ></div>

              <span class="relative z-10 flex items-center gap-3">
                INITIATE SCAN
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke="currentColor"
                  class="w-5 h-5 group-hover:translate-x-1 transition-transform"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                  />
                </svg>
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [
    `
      .animate-fadeInUp {
        animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1);
      }

      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(20px);
          scale: 0.95;
        }
        to {
          opacity: 1;
          transform: translateY(0);
          scale: 1;
        }
      }

      /* ⭐ เพิ่ม CSS สำหรับดาว (เหมือน Intro) */
      .star-1 {
        box-shadow:
          10vw 10vh #fff,
          20vw 80vh #fff,
          80vw 10vh #fff,
          70vw 70vh #fff,
          40vw 30vh #fff,
          90vw 50vh #fff,
          30vw 60vh #fff;
        animation: twinkle 3s infinite ease-in-out;
      }
      .star-2 {
        box-shadow:
          50vw 20vh #a5f3fc,
          80vw 80vh #a5f3fc,
          10vw 50vh #a5f3fc;
        animation: twinkle 5s infinite ease-in-out 1s;
      }
      @keyframes twinkle {
        0%,
        100% {
          opacity: 0.3;
          transform: scale(0.8);
        }
        50% {
          opacity: 1;
          transform: scale(1.2);
        }
      }

      .animate-pulse-slow {
        animation: pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite;
      }
      .custom-scrollbar::-webkit-scrollbar {
        width: 6px;
      }
      .custom-scrollbar::-webkit-scrollbar-track {
        background: rgba(0, 0, 0, 0.2);
      }
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background: #333;
        border-radius: 3px;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: #00f3ff;
      }

      input[type='number']::-webkit-outer-spin-button,
      input[type='number']::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }
    `,
  ],
})
export class StudentInfoComponent implements OnInit {
  data: StudentProfile = {
    fullName: '',
    school: '',
    levelEducation: '',
    gender: '',
    province: '',
    age: undefined,
    studyProgram: '',
  };

  // Province & School
  allProvinces: any[] = [];
  filteredProvinces: any[] = [];
  showProvinceList = false;
  isOverProvinceList = false;

  filteredSchools: any[] = [];
  showSchoolList = false;
  isOverSchoolList = false;

  // Level & Program
  allLevels: any[] = [];
  filteredLevels: any[] = [];
  showLevelList = false;
  isOverLevelList = false;

  allPrograms: any[] = [];
  filteredPrograms: any[] = [];
  showProgramList = false;
  isOverProgramList = false;

  constructor(
    private router: Router,
    private surveyService: SurveyService,
  ) {}

  ngOnInit() {
    this.loadInitialData();
  }

  loadInitialData() {
    // 1. Load Provinces
    this.surveyService.getProvinces().subscribe({
      next: (res) => {
        this.allProvinces = res;
        this.filteredProvinces = res.slice(0, 20);
      },
      error: () => console.log('Provinces fetch error or not ready'),
    });

    // 2. Load Levels
    if (typeof (this.surveyService as any).getLevels === 'function') {
      (this.surveyService as any).getLevels().subscribe({
        next: (res: any) => {
          this.allLevels = res || [];
          this.filteredLevels = this.allLevels;
        },
        error: () => {
          console.log('Levels: Backend not ready');
          this.allLevels = [];
          this.filteredLevels = [];
        },
      });
    }

    // 3. Load Programs
    if (typeof (this.surveyService as any).getPrograms === 'function') {
      (this.surveyService as any).getPrograms().subscribe({
        next: (res: any) => {
          this.allPrograms = res || [];
          this.filteredPrograms = this.allPrograms;
        },
        error: () => {
          console.log('Programs: Backend not ready');
          this.allPrograms = [];
          this.filteredPrograms = [];
        },
      });
    }
  }

  // --- Province Logic ---
  onProvinceInput(event: any) {
    const query = event.target.value.toLowerCase();
    this.showProvinceList = true;
    if (!query) this.filteredProvinces = this.allProvinces.slice(0, 20);
    else
      this.filteredProvinces = this.allProvinces
        .filter((p) => p.name.toLowerCase().includes(query))
        .slice(0, 20);
  }
  onProvinceFocus() {
    this.showProvinceList = true;
    if (!this.data.province) this.filteredProvinces = this.allProvinces.slice(0, 20);
  }
  onProvinceBlur() {
    if (!this.isOverProvinceList) this.showProvinceList = false;
  }
  selectProvince(name: string) {
    this.data.province = name;
    this.showProvinceList = false;
  }

  // --- School Logic ---
  onSchoolInput(event: any) {
    const query = event.target.value;
    this.showSchoolList = true;
    if (query.length >= 2) {
      this.surveyService.searchSchools(query).subscribe({
        next: (res) => (this.filteredSchools = res.slice(0, 20)),
        error: () => {
          /* No mock fallback */
        },
      });
    } else this.filteredSchools = [];
  }
  onSchoolBlur() {
    if (!this.isOverSchoolList) this.showSchoolList = false;
  }
  selectSchool(name: string) {
    this.data.school = name;
    this.showSchoolList = false;
  }

  // --- Level Logic ---
  onLevelInput(event: any) {
    const query = event.target.value.toLowerCase();
    this.showLevelList = true;
    if (!query) this.filteredLevels = this.allLevels;
    else this.filteredLevels = this.allLevels.filter((l) => l.name.toLowerCase().includes(query));
  }
  onLevelFocus() {
    this.showLevelList = true;
    this.filteredLevels = this.allLevels;
  }
  onLevelBlur() {
    if (!this.isOverLevelList) this.showLevelList = false;
  }
  selectLevel(name: string) {
    this.data.levelEducation = name;
    this.showLevelList = false;
  }

  // --- Program Logic ---
  onProgramInput(event: any) {
    const query = event.target.value.toLowerCase();
    this.showProgramList = true;
    if (!query) this.filteredPrograms = this.allPrograms;
    else
      this.filteredPrograms = this.allPrograms.filter((p) => p.name.toLowerCase().includes(query));
  }
  onProgramFocus() {
    this.showProgramList = true;
    this.filteredPrograms = this.allPrograms;
  }
  onProgramBlur() {
    if (!this.isOverProgramList) this.showProgramList = false;
  }
  selectProgram(name: string) {
    this.data.studyProgram = name;
    this.showProgramList = false;
  }

  onSubmit(form: any) {
    if (form.valid) {
      this.surveyService.saveProfile(this.data);
      this.router.navigate(['/survey']);
    }
  }
}
