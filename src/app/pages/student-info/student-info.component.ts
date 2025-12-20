import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SurveyService } from '../../services/survey.service';

@Component({
  selector: 'app-student-info',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen flex items-center justify-center p-4">
      <div class="w-full max-w-md bg-cyber-glass border border-white/10 backdrop-blur-xl p-8 rounded-2xl shadow-2xl slide-in">
        <h2 class="text-3xl font-bold text-white mb-6 border-l-4 border-cyber-secondary pl-4">Identification</h2>
        
        <form (ngSubmit)="onSubmit()" #infoForm="ngForm" class="space-y-6">
          <div class="space-y-2">
            <label class="text-cyber-primary text-sm uppercase tracking-wider">Full Name</label>
            <input type="text" [(ngModel)]="data.name" name="name" required 
              class="w-full bg-black/40 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyber-primary focus:ring-1 focus:ring-cyber-primary transition-all"
              placeholder="กรอกชื่อ-นามสกุลของคุณ">
          </div>

          <div class="space-y-2">
            <label class="text-cyber-primary text-sm uppercase tracking-wider">School</label>
            <input type="text" [(ngModel)]="data.school" name="school" required
              class="w-full bg-black/40 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyber-primary transition-all"
              placeholder="โรงเรียน">
          </div>

          <div class="space-y-2">
            <label class="text-cyber-primary text-sm uppercase tracking-wider">Level</label>
            <select [(ngModel)]="data.level" name="level" required
              class="w-full bg-black/40 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyber-primary transition-all">
              <option value="" disabled selected>เลือกระดับชั้น</option>
              <option value="m4">มัธยมศึกษาปีที่ 4</option>
              <option value="m5">มัธยมศึกษาปีที่ 5</option>
              <option value="m6">มัธยมศึกษาปีที่ 6</option>
              <option value="voc">ปวช.</option>
            </select>
          </div>

          <button type="submit" [disabled]="!infoForm.form.valid"
            class="w-full bg-gradient-to-r from-cyber-secondary to-blue-600 text-white font-bold py-4 rounded-lg shadow-lg hover:shadow-cyber-secondary/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-8">
            CONFIRM IDENTITY
          </button>
        </form>
      </div>
    </div>
  `
})
export class StudentInfoComponent {
  data = { name: '', school: '', level: '' };

  constructor(private router: Router, private surveyService: SurveyService) {}

  onSubmit() {
    this.surveyService.saveProfile(this.data);
    this.router.navigate(['/survey']);
  }
}