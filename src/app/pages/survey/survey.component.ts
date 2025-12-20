import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SurveyService } from '../../services/survey.service';
import { Question, SurveyAnswer } from '../../models/survey.component.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-survey',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen flex flex-col p-4 md:p-8 relative">
      <div
        *ngIf="loading"
        class="absolute inset-0 flex items-center justify-center bg-cyber-bg z-50"
      >
        <div
          class="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyber-primary"
        ></div>
      </div>

      <div class="flex justify-between items-end mb-6 border-b border-white/10 pb-4">
        <div>
          <h3 class="text-cyber-primary text-sm uppercase tracking-widest mb-1">Current Section</h3>
          <h2 class="text-2xl font-bold text-white capitalize">
            {{ currentQuestion?.section }} Phase
          </h2>
        </div>
        <div class="text-right">
          <span class="text-4xl font-bold text-cyber-secondary">{{ currentIndex + 1 }}</span>
          <span class="text-gray-500 text-xl">/{{ questions.length }}</span>
        </div>
      </div>

      <div class="w-full bg-gray-800 h-1 rounded-full mb-12 overflow-hidden">
        <div
          class="bg-gradient-to-r from-cyber-primary to-cyber-secondary h-full transition-all duration-500"
          [style.width.%]="((currentIndex + 1) / questions.length) * 100"
        ></div>
      </div>

      <div
        class="flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto w-full slide-in"
        *ngIf="currentQuestion"
      >
        <div
          class="bg-gradient-to-b from-white/5 to-transparent border border-white/10 p-8 md:p-12 rounded-3xl w-full text-center mb-12 backdrop-blur-sm relative overflow-hidden"
        >
          <div
            class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyber-primary to-transparent opacity-50"
          ></div>

          <h1 class="text-2xl md:text-4xl font-medium leading-relaxed text-white">
            {{ currentQuestion.text }}
          </h1>
        </div>

        <div class="w-full max-w-2xl px-4">
          <div class="flex justify-center mb-8 h-24">
            <div
              class="text-7xl transition-all duration-300 transform drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
              [ngClass]="{ 'scale-125': isInteracting }"
            >
              {{ getEmoji(currentScore) }}
            </div>
          </div>

          <div class="text-center text-cyber-primary text-lg mb-6 font-bold tracking-wider">
            {{ getLabel(currentScore) }}
          </div>

          <div class="relative w-full h-12 flex items-center">
            <div class="absolute w-full h-2 bg-gray-800 rounded-full overflow-hidden">
              <div
                class="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 opacity-50"
              ></div>
            </div>

            <div class="absolute w-full flex justify-between px-1">
              <div *ngFor="let i of [1, 2, 3, 4, 5]" class="w-2 h-2 rounded-full bg-white/20"></div>
            </div>

            <input
              type="range"
              min="1"
              max="5"
              step="1"
              [(ngModel)]="currentScore"
              (mousedown)="isInteracting = true"
              (mouseup)="isInteracting = false"
              (touchstart)="isInteracting = true"
              (touchend)="isInteracting = false"
              class="w-full absolute z-20 opacity-0 cursor-pointer h-12"
            />

            <div
              class="absolute h-8 w-8 bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,0.5)] border-4 border-cyber-bg pointer-events-none transition-all duration-100 ease-out"
              [style.left.%]="(currentScore - 1) * 25"
              style="transform: translateX(-50%)"
            ></div>
          </div>

          <div
            class="flex justify-between text-xs text-gray-500 mt-4 uppercase tracking-widest font-mono"
          >
            <span>Disagree</span>
            <span>Agree</span>
          </div>

          <div class="flex justify-center mt-12">
            <button
              (click)="nextQuestion()"
              class="bg-cyber-primary text-cyber-bg font-bold py-3 px-12 rounded-full hover:bg-white hover:scale-105 transition-all shadow-[0_0_20px_rgba(0,243,255,0.4)]"
            >
              CONFIRM CHOICE
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class SurveyComponent implements OnInit {
  questions: Question[] = [];
  currentIndex = 0;
  currentScore = 3; // Default ตรงกลาง
  answers: SurveyAnswer[] = [];
  loading = true;
  isInteracting = false;

  constructor(private surveyService: SurveyService, private router: Router) {}

  ngOnInit() {
    this.surveyService.getQuestions().subscribe((q) => {
      this.questions = q;
      this.loading = false;
    });
  }

  get currentQuestion() {
    return this.questions[this.currentIndex];
  }

  // Option C: Logic เปลี่ยน Emoji
  getEmoji(score: number): string {
    switch (score) {
      case 1:
        return '😫'; // หรือใช้ไฟล์ภาพ Icon ก็ได้
      case 2:
        return '🙁';
      case 3:
        return '😐';
      case 4:
        return '🙂';
      case 5:
        return '🤩';
      default:
        return '😐';
    }
  }

  getLabel(score: number): string {
    const labels = [
      'ไม่เห็นด้วยอย่างยิ่ง',
      'ไม่ค่อยเห็นด้วย',
      'เฉยๆ / ไม่แน่ใจ',
      'ค่อนข้างเห็นด้วย',
      'เห็นด้วยอย่างยิ่ง!',
    ];
    return labels[score - 1];
  }

  nextQuestion() {
    // Save answer
    this.answers.push({
      questionId: this.currentQuestion.id,
      score: this.currentScore,
    });

    if (this.currentIndex < this.questions.length - 1) {
      this.currentIndex++;
      this.currentScore = 3; // Reset Slider
    } else {
      // จบเกม ส่งข้อมูล
      this.finish();
    }
  }

  finish() {
    this.loading = true; // Show loading spinner again
    this.surveyService.submitSurvey(this.answers).subscribe((results) => {
      // ส่ง results ไปหน้า Result (ใน Angular ปกติจะส่งผ่าน State หรือ Service)
      // แต่ในที่นี้ Service เก็บ State ไว้ได้ หรือส่งผ่าน Navigation Extras ก็ได้
      // เพื่อความง่าย ผมจะให้ Service เก็บ Result ไว้ (ต้องไปเพิ่มตัวแปรใน Service) หรือส่งไปใน URL
      // เอาเป็นว่าส่งผ่าน Navigation State
      this.router.navigate(['/result'], { state: { results } });
    });
  }
}
