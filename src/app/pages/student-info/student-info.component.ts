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
    <div class="min-h-screen bg-cyber-bg flex items-center justify-center p-4 relative overflow-hidden">
      
      <div class="absolute inset-0 bg-[url('https://assets.codepen.io/13471/sparkles.gif')] opacity-20 pointer-events-none"></div>
      <div class="absolute w-96 h-96 bg-cyber-primary blur-[150px] opacity-20 -top-20 -left-20 animate-pulse"></div>
      <div class="absolute w-96 h-96 bg-cyber-secondary blur-[150px] opacity-20 -bottom-20 -right-20 animate-pulse"></div>

      <div class="bg-gray-900/80 border border-white/10 p-6 md:p-8 rounded-2xl w-full max-w-lg backdrop-blur-xl relative z-10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        
        <div class="text-center mb-8">
          <h1 class="text-3xl md:text-4xl font-bold text-white mb-2 tracking-wider glitch-text">
            IDENTIFY YOURSELF
          </h1>
          <p class="text-cyber-primary text-sm uppercase tracking-[0.3em] animate-pulse">
            System Access Required
          </p>
        </div>

        <form (ngSubmit)="onSubmit(infoForm)" #infoForm="ngForm" class="space-y-5">
          
          <div class="space-y-2">
            <label class="text-cyber-primary text-sm uppercase tracking-wider">Full Name</label>
            <input type="text" [(ngModel)]="data.fullName" name="fullName" required 
              class="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-3 text-white focus:border-cyber-primary focus:outline-none transition-all" 
              placeholder="กรอกชื่อ-นามสกุลของคุณ">
          </div>

          <div class="space-y-2">
            <label class="text-cyber-primary text-sm uppercase tracking-wider">Gender</label>
            <div class="flex gap-4">
              <button type="button" (click)="data.gender = 'male'"
                class="flex-1 py-3 rounded-lg border transition-all duration-300 font-medium tracking-wide"
                [ngClass]="data.gender === 'male' ? 'bg-cyber-primary text-black font-bold' : 'bg-black/40 text-gray-400 border-white/20'">ชาย</button>
              <button type="button" (click)="data.gender = 'female'"
                class="flex-1 py-3 rounded-lg border transition-all duration-300 font-medium tracking-wide"
                [ngClass]="data.gender === 'female' ? 'bg-cyber-secondary text-white font-bold' : 'bg-black/40 text-gray-400 border-white/20'">หญิง</button>
              <button type="button" (click)="data.gender = 'other'"
                class="flex-1 py-3 rounded-lg border transition-all duration-300 font-medium tracking-wide"
                [ngClass]="data.gender === 'other' ? 'bg-white text-black font-bold' : 'bg-black/40 text-gray-400 border-white/20'">อื่นๆ</button>
            </div>
            <input type="text" [(ngModel)]="data.gender" name="gender" required hidden>
          </div>

          <div class="grid grid-cols-2 gap-4">
             <div class="space-y-2">
                <label class="text-cyber-primary text-sm uppercase tracking-wider">Age</label>
                <input type="number" [(ngModel)]="data.age" name="age" required min="10" max="99"
                       class="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-3 text-white focus:border-cyber-primary focus:outline-none transition-all" placeholder="อายุ">
             </div>

             <div class="space-y-2 relative">
                <label class="text-cyber-primary text-sm uppercase tracking-wider">Province</label>
                <input type="text" name="province"
                       [(ngModel)]="data.province"
                       (input)="onProvinceInput($event)"
                       (focus)="onProvinceFocus()"
                       (blur)="onProvinceBlur()" 
                       autocomplete="off" required
                       class="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-3 text-white focus:border-cyber-primary focus:outline-none transition-all"
                       placeholder="พิมพ์จังหวัด...">
                
                <div *ngIf="showProvinceList && filteredProvinces.length > 0" 
                     (mouseenter)="isOverProvinceList = true"
                     (mouseleave)="isOverProvinceList = false"
                     class="absolute z-50 w-full mt-1 bg-gray-900 border border-cyber-primary rounded-lg shadow-xl max-h-60 overflow-y-auto custom-scrollbar">
                  <div *ngFor="let p of filteredProvinces"
                       (mousedown)="selectProvince(p.name); $event.preventDefault()" 
                       class="px-4 py-3 text-white hover:bg-cyber-primary hover:text-black cursor-pointer transition-colors border-b border-white/10 last:border-0">
                    {{ p.name }}
                  </div>
                </div>
             </div>
          </div>

          <div class="space-y-2 relative">
            <label class="text-cyber-primary text-sm uppercase tracking-wider">School</label>
            <input type="text" name="school"
                   [(ngModel)]="data.school"
                   (input)="onSchoolInput($event)"
                   (blur)="onSchoolBlur()"
                   autocomplete="off" required
                   class="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-3 text-white focus:border-cyber-primary focus:outline-none transition-all"
                   placeholder="พิมพ์ชื่อโรงเรียน...">

            <div *ngIf="showSchoolList && filteredSchools.length > 0" 
                 (mouseenter)="isOverSchoolList = true"
                 (mouseleave)="isOverSchoolList = false"
                 class="absolute z-50 w-full mt-1 bg-gray-900 border border-cyber-primary rounded-lg shadow-xl max-h-60 overflow-y-auto custom-scrollbar">
              <div *ngFor="let school of filteredSchools"
                   (mousedown)="selectSchool(school.name); $event.preventDefault()"
                   class="px-4 py-3 text-white hover:bg-cyber-primary hover:text-black cursor-pointer transition-colors border-b border-white/10 last:border-0">
                {{ school.name }}
              </div>
            </div>
            <input type="text" [(ngModel)]="data.school" name="school_valid" required hidden>
          </div>

          <div class="grid grid-cols-2 gap-4">
            
            <div class="space-y-2 relative">
              <label class="text-cyber-primary text-sm uppercase tracking-wider">Level</label>
              <div class="relative">
                <input type="text" 
                       [value]="getLevelLabel()" 
                       readonly
                       (click)="showLevelList = !showLevelList"
                       (blur)="onLevelBlur()"
                       class="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-3 text-white focus:border-cyber-primary focus:outline-none transition-all cursor-pointer truncate"
                       placeholder="ระดับชั้น">
                <div class="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-cyber-primary">
                  <svg class="w-4 h-4 fill-current transition-transform duration-200" [class.rotate-180]="showLevelList" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
                </div>
              </div>

              <div *ngIf="showLevelList" 
                   (mouseenter)="isOverLevelList = true"
                   (mouseleave)="isOverLevelList = false"
                   class="absolute z-50 w-full mt-1 bg-gray-900 border border-cyber-primary rounded-lg shadow-xl max-h-60 overflow-y-auto custom-scrollbar">
                <div *ngFor="let opt of levelOptions"
                     (mousedown)="selectLevel(opt.value); $event.preventDefault()"
                     class="px-4 py-3 text-white hover:bg-cyber-primary hover:text-black cursor-pointer transition-colors border-b border-white/10 last:border-0">
                  {{ opt.label }}
                </div>
              </div>
              <input type="text" [(ngModel)]="data.levelEducation" name="levelEducation" required hidden>
            </div>

            <div class="space-y-2 relative">
              <label class="text-cyber-primary text-sm uppercase tracking-wider">Program</label>
              <div class="relative">
                <input type="text" 
                       [value]="getProgramLabel()" 
                       readonly
                       (click)="showProgramList = !showProgramList"
                       (blur)="onProgramBlur()"
                       class="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-3 text-white focus:border-cyber-primary focus:outline-none transition-all cursor-pointer truncate"
                       placeholder="สายการเรียน">
                 <div class="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-cyber-primary">
                  <svg class="w-4 h-4 fill-current transition-transform duration-200" [class.rotate-180]="showProgramList" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
                </div>
              </div>

              <div *ngIf="showProgramList" 
                   (mouseenter)="isOverProgramList = true"
                   (mouseleave)="isOverProgramList = false"
                   class="absolute z-50 w-full mt-1 bg-gray-900 border border-cyber-primary rounded-lg shadow-xl max-h-60 overflow-y-auto custom-scrollbar">
                <div *ngFor="let opt of programOptions"
                     (mousedown)="selectProgram(opt.value); $event.preventDefault()"
                     class="px-4 py-3 text-white hover:bg-cyber-primary hover:text-black cursor-pointer transition-colors border-b border-white/10 last:border-0">
                  {{ opt.label }}
                </div>
              </div>
              <input type="text" [(ngModel)]="data.studyProgram" name="studyProgram" required hidden>
            </div>

          </div>

          <button type="submit" [disabled]="!infoForm.form.valid"
            class="w-full mt-8 bg-gradient-to-r from-cyber-primary to-cyber-secondary text-white font-bold py-4 rounded-lg hover:scale-[1.02] transition-transform shadow-[0_0_20px_rgba(0,243,255,0.4)] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none tracking-widest text-lg">
            INITIATE SCAN
          </button>

        </form>
      </div>
    </div>
  `,
  styles: [`
    .animate-fadeIn { animation: fadeIn 0.4s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    .custom-scrollbar::-webkit-scrollbar { width: 6px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #00f3ff; }

    input[type=number]::-webkit-outer-spin-button,
    input[type=number]::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  `]
})
export class StudentInfoComponent implements OnInit {
  data: StudentProfile = { 
    fullName: '', school: '', levelEducation: '', gender: '',
    province: '', age: undefined, studyProgram: ''
  };

  // --- Province ---
  allProvinces: any[] = [];
  filteredProvinces: any[] = [];
  showProvinceList = false;
  isOverProvinceList = false;

  // --- School ---
  filteredSchools: any[] = [];
  showSchoolList = false;
  isOverSchoolList = false;

  // --- Level (Custom Dropdown Data) ---
  showLevelList = false;
  isOverLevelList = false;
  levelOptions = [
    { value: 'm3', label: 'ม.3' },
    { value: 'm4', label: 'ม.4' },
    { value: 'm5', label: 'ม.5' },
    { value: 'm6', label: 'ม.6' },
    { value: 'voc', label: 'ปวช./ปวส.' }
  ];

  // --- Program (Custom Dropdown Data) ---
  showProgramList = false;
  isOverProgramList = false;
  programOptions = [
    { value: 'sci-math', label: 'วิทย์-คณิต' },
    { value: 'arts-math', label: 'ศิลป์-คำนวณ' },
    { value: 'arts-lang', label: 'ศิลป์-ภาษา' },
    { value: 'vocational', label: 'สายอาชีพ' },
    { value: 'other', label: 'อื่นๆ' }
  ];

  constructor(private router: Router, private surveyService: SurveyService) {}

  ngOnInit() {
    this.surveyService.getProvinces().subscribe({
        next: (res) => {
            this.allProvinces = res;
            this.filteredProvinces = res.slice(0, 20);
        },
        error: () => console.log('Backend not ready')
    });
  }

  // --- Province Methods ---
  onProvinceInput(event: any) {
    const query = event.target.value.toLowerCase();
    this.showProvinceList = true;
    if (!query) this.filteredProvinces = this.allProvinces.slice(0, 20);
    else this.filteredProvinces = this.allProvinces.filter(p => p.name.toLowerCase().includes(query)).slice(0, 20);
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
    this.isOverProvinceList = false;
  }

  // --- School Methods ---
  onSchoolInput(event: any) {
    const query = event.target.value;
    this.showSchoolList = true;
    if (query.length >= 2) {
      this.surveyService.searchSchools(query).subscribe({
        next: (res) => this.filteredSchools = res.slice(0, 20),
        error: () => {
             const mockSchools = [{ name: 'โรงเรียนยุพราชวิทยาลัย' }, { name: 'โรงเรียนเตรียมอุดมศึกษา' }];
             this.filteredSchools = mockSchools.filter(s => s.name.includes(query)).slice(0, 20);
        }
      });
    } else this.filteredSchools = [];
  }
  onSchoolBlur() {
    if (!this.isOverSchoolList) this.showSchoolList = false;
  }
  selectSchool(name: string) {
    this.data.school = name;
    this.showSchoolList = false;
    this.isOverSchoolList = false;
  }

  // --- Level Methods (New) ---
  getLevelLabel(): string {
    const selected = this.levelOptions.find(o => o.value === this.data.levelEducation);
    return selected ? selected.label : '';
  }
  selectLevel(value: string) {
    this.data.levelEducation = value;
    this.showLevelList = false;
    this.isOverLevelList = false;
  }
  onLevelBlur() {
    if (!this.isOverLevelList) this.showLevelList = false;
  }

  // --- Program Methods (New) ---
  getProgramLabel(): string {
    const selected = this.programOptions.find(o => o.value === this.data.studyProgram);
    return selected ? selected.label : '';
  }
  selectProgram(value: string) {
    this.data.studyProgram = value;
    this.showProgramList = false;
    this.isOverProgramList = false;
  }
  onProgramBlur() {
    if (!this.isOverProgramList) this.showProgramList = false;
  }

  onSubmit(form: any) {
    if (form.valid) {
      this.surveyService.saveProfile(this.data);
      this.router.navigate(['/survey']);
    }
  }
}