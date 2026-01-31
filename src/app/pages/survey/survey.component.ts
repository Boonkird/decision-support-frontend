import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SurveyService } from '../../services/survey.service';
import { Question, AnswerRequest } from '../../models/survey.model';
import { SoundService } from '../../services/sound.service';

@Component({
  selector: 'app-survey',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div
      class="min-h-screen bg-cyber-bg flex flex-col items-center justify-center p-4 relative overflow-hidden text-white font-sans transition-colors duration-700 ease-in-out"
    >
      <div
        class="absolute inset-0 transition-colors duration-500 ease-linear opacity-20"
        [style.backgroundColor]="getBgGradient()"
      ></div>

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

      <div *ngIf="loading" class="flex flex-col items-center justify-center z-50">
        <div
          class="text-xl font-bold tracking-[0.3em] text-transparent bg-clip-text bg-gradient-to-r from-cyber-primary to-cyber-secondary animate-pulse"
        >
          SYSTEM LOADING...
        </div>
      </div>

      <div
        *ngIf="!loading && questions.length > 0"
        class="w-full max-w-4xl relative z-10 perspective-1000 animate-fadeInUp"
      >
        <div
          class="mb-10 relative transition-opacity duration-300"
          [ngClass]="isWarping ? 'opacity-50' : 'opacity-100'"
        >
          <div class="flex justify-between items-end mb-3 px-1">
            <div>
              <span
                class="text-cyber-primary text-[10px] uppercase tracking-[0.2em] font-bold block mb-1"
                >Current Sector</span
              >
              <span
                class="text-2xl font-black text-white capitalize drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] tracking-wide"
              >
                {{ currentQuestion.sectionTitle }}
              </span>
            </div>
            <div class="text-right">
              <span class="text-gray-400 text-xs font-mono uppercase tracking-widest"
                >Question {{ currentIndex + 1 }} / {{ questions.length }}</span
              >
            </div>
          </div>

          <div class="grid grid-cols-3 gap-2 w-full">
            <div
              *ngFor="let sec of uniqueSections; let i = index"
              class="relative h-2 bg-gray-800 rounded-full overflow-hidden border border-white/5"
            >
              <div
                class="h-full transition-all duration-500 ease-out shadow-[0_0_10px_rgba(0,243,255,0.5)]"
                [ngClass]="{
                  'bg-cyber-primary': i === currentSectionIndex,
                  'bg-green-500': i < currentSectionIndex,
                  'bg-transparent': i > currentSectionIndex,
                }"
                [style.width.%]="getSectionProgress(i)"
              ></div>
            </div>
          </div>

          <div
            class="grid grid-cols-3 gap-2 w-full mt-2 text-[10px] text-gray-500 uppercase tracking-wider text-center font-mono"
          >
            <div
              *ngFor="let sec of uniqueSections; let i = index"
              [ngClass]="{ 'text-cyber-primary font-bold': i === currentSectionIndex }"
            >
              {{ sec }}
            </div>
          </div>
        </div>

        <div class="relative">
          <div
            class="bg-white/5 backdrop-blur-sm p-8 md:p-12 rounded-[2.5rem] shadow-[0_0_60px_rgba(0,243,255,0.15)] relative overflow-hidden group transition-all duration-300 origin-center"
            [ngClass]="animationClass"
            [style.borderColor]="getBorderColor()"
            [style.boxShadow]="getBoxShadow()"
            style="border-width: 1px;"
          >
            <div
              class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent to-transparent opacity-50"
              [style.backgroundColor]="getThemeColor()"
            ></div>

            <div
              class="min-h-[140px] flex items-center justify-center text-center mb-4 relative z-10 px-4"
            >
              <h1
                class="text-2xl md:text-4xl font-black leading-tight tracking-wide drop-shadow-[0_0_15px_rgba(0,243,255,0.4)] text-transparent bg-clip-text bg-gradient-to-r from-cyber-primary via-white to-cyber-primary bg-[length:200%_auto] animate-shine"
              >
                {{ currentQuestion.questionText }}
              </h1>
            </div>

            <div class="flex justify-center mb-8 h-12 relative z-10">
              <div
                class="text-3xl md:text-4xl transition-all duration-200 transform drop-shadow-[0_0_10px_rgba(255,255,255,0.1)] grayscale opacity-60"
                [ngClass]="{ 'scale-125 grayscale-0 opacity-100': isInteracting }"
              >
                {{ getEmoji(currentScore) }}
              </div>
            </div>

            <div
              class="text-center text-lg mb-8 font-bold tracking-wider uppercase relative z-10 transition-colors duration-300"
              [style.color]="getThemeColor()"
            >
              {{ getLabel(currentScore) }}
            </div>

            <div class="relative w-full h-16 flex items-center justify-center px-4 z-10">
              <div class="absolute w-full h-2 bg-gray-600/50 rounded-full overflow-hidden">
                <div
                  class="h-full opacity-60 transition-colors duration-300"
                  [style.background]="getSliderGradient()"
                ></div>
              </div>
              <div class="absolute w-full flex justify-between px-1 pointer-events-none">
                <div
                  *ngFor="let i of [1, 2, 3, 4, 5]"
                  class="w-2 h-2 rounded-full bg-white/40"
                ></div>
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
                class="absolute h-8 w-8 bg-white rounded-full border-4 pointer-events-none transition-all duration-150 ease-out shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                [style.borderColor]="getThemeColor()"
                [style.left.%]="(currentScore - 1) * 25"
                style="transform: translateX(-50%)"
              ></div>
            </div>

            <div
              class="flex justify-between text-xs text-gray-400 mt-2 uppercase tracking-widest font-mono relative z-10"
            >
              <span>Disagree</span>
              <span>Agree</span>
            </div>

            <div class="flex justify-center mt-10 relative z-10">
              <button
                (click)="nextQuestion()"
                [disabled]="isWarping"
                class="group relative flex justify-center items-center gap-3 px-12 py-4 bg-white text-black font-bold text-sm uppercase tracking-[0.2em] rounded-full overflow-hidden transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span class="relative z-10">{{ isWarping ? 'SAVING...' : 'CONFIRM CHOICE' }}</span>
                <div
                  *ngIf="isWarping"
                  class="absolute bottom-0 left-0 h-1 bg-cyber-primary animate-loading-bar"
                ></div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      /* ✅ 1. Entrance Animation */
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

      /* ✅ 2. Star Animations */
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

      /* Existing Animations */
      .crt-off {
        animation: crtOff 0.4s cubic-bezier(0.23, 1, 0.32, 1) forwards;
      }
      @keyframes crtOff {
        0% {
          transform: scale(1, 1);
          opacity: 1;
          filter: brightness(1);
        }
        40% {
          transform: scale(1, 0.005);
          opacity: 1;
          filter: brightness(3);
        }
        100% {
          transform: scale(0, 0.005);
          opacity: 0;
        }
      }
      .crt-on {
        animation: crtOn 0.4s cubic-bezier(0.23, 1, 0.32, 1) forwards;
      }
      @keyframes crtOn {
        0% {
          transform: scale(0, 0.005);
          opacity: 0;
          filter: brightness(3);
        }
        60% {
          transform: scale(1, 0.005);
          opacity: 1;
        }
        100% {
          transform: scale(1, 1);
          opacity: 1;
          filter: brightness(1);
        }
      }
      .prepare-anim {
        opacity: 0 !important;
        transform: scale(0);
      }
      .perspective-1000 {
        perspective: 1000px;
      }
      .animate-pulse-slow {
        animation: pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite;
      }
      @keyframes loading-bar {
        0% {
          width: 0%;
        }
        100% {
          width: 100%;
        }
      }
      .animate-loading-bar {
        animation: loading-bar 0.8s linear forwards;
      }
      @keyframes shine {
        0% {
          background-position: 200% center;
        }
        100% {
          background-position: -200% center;
        }
      }
      .animate-shine {
        animation: shine 5s linear infinite;
      }
    `,
  ],
})
export class SurveyComponent implements OnInit, OnDestroy {
  questions: Question[] = [];
  currentIndex = 0;
  currentScore = 3;
  answers: AnswerRequest[] = [];
  loading = true;
  isInteracting = false;
  isWarping = false;
  animationClass = '';

  uniqueSections: string[] = [];
  currentSectionIndex = 0;

  constructor(
    private surveyService: SurveyService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private soundService: SoundService,
  ) {}

  ngOnInit() {
    this.soundService.playBgm('bgm.mp3', 0.2); // ปรับความดังได้ (0.0 - 1.0)
    this.surveyService.getQuestions().subscribe({
      next: (q) => {
        this.questions = q || [];
        this.loading = false;
        this.uniqueSections = [...new Set(this.questions.map((q) => q.sectionTitle))];
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  get currentQuestion() {
    return this.questions[this.currentIndex];
  }

  getThemeColor(): string {
    if (this.currentScore <= 2) return '#ef4444';
    if (this.currentScore >= 4) return '#22c55e';
    return '#00f3ff';
  }

  getBgGradient(): string {
    if (this.currentScore <= 2) return 'rgba(239, 68, 68, 0.15)';
    if (this.currentScore >= 4) return 'rgba(34, 197, 94, 0.15)';
    return 'transparent';
  }

  getBorderColor(): string {
    if (this.currentScore <= 2) return 'rgba(239, 68, 68, 0.5)';
    if (this.currentScore >= 4) return 'rgba(34, 197, 94, 0.5)';
    return 'rgba(255, 255, 255, 0.2)';
  }

  getBoxShadow(): string {
    if (this.currentScore <= 2) return '0 0 60px rgba(239, 68, 68, 0.2)';
    if (this.currentScore >= 4) return '0 0 60px rgba(34, 197, 94, 0.2)';
    return '0 0 60px rgba(0, 243, 255, 0.15)';
  }

  getSliderGradient(): string {
    return 'linear-gradient(90deg, #ef4444 0%, #eab308 50%, #22c55e 100%)';
  }

  getEmoji(score: number): string {
    switch (score) {
      case 1:
        return '😫';
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
    return [
      'ไม่เห็นด้วยอย่างยิ่ง',
      'ไม่ค่อยเห็นด้วย',
      'เฉยๆ / ไม่แน่ใจ',
      'ค่อนข้างเห็นด้วย',
      'เห็นด้วยอย่างยิ่ง!',
    ][score - 1];
  }

  getSectionProgress(sectionIndex: number): number {
    if (sectionIndex < this.currentSectionIndex) return 100;
    if (sectionIndex > this.currentSectionIndex) return 0;

    const currentSectionName = this.uniqueSections[this.currentSectionIndex];
    const questionsInSection = this.questions.filter((q) => q.sectionTitle === currentSectionName);
    const totalInSection = questionsInSection.length;

    let questionsBeforeThisSection = 0;
    for (let i = 0; i < sectionIndex; i++) {
      questionsBeforeThisSection += this.questions.filter(
        (q) => q.sectionTitle === this.uniqueSections[i],
      ).length;
    }

    const currentInSection = this.currentIndex - questionsBeforeThisSection;
    return Math.min(100, (currentInSection / totalInSection) * 100);
  }

  updateSectionIndex() {
    if (!this.currentQuestion) return;
    this.currentSectionIndex = this.uniqueSections.indexOf(this.currentQuestion.sectionTitle);
  }

  nextQuestion() {
    this.soundService.playSfx('click.mp3');
    if (this.isWarping) return;

    this.isWarping = true;
    this.animationClass = 'crt-off';

    setTimeout(() => {
      this.answers.push({ questionId: this.currentQuestion.questionId, score: this.currentScore });

      if (this.currentIndex < this.questions.length - 1) {
        this.currentIndex++;
        this.currentScore = 3;
        this.updateSectionIndex();
        this.animationClass = 'prepare-anim';
        this.cdr.detectChanges();

        setTimeout(() => {
          this.animationClass = 'crt-on';
          this.cdr.detectChanges();
        }, 50);

        setTimeout(() => {
          this.isWarping = false;
          this.animationClass = '';
          this.cdr.detectChanges();
        }, 450);
      } else {
        this.finish();
      }
    }, 350);
  }

  finish() {
  this.loading = true;
  this.surveyService.submitSurvey(this.answers).subscribe({
    next: (results) => {
      console.log('✅ ได้รับผลลัพธ์จาก Server:', results); // เช็ค log
      
      // ⭐⭐ บรรทัดนี้สำคัญที่สุด! ต้องฝากข้อมูลไว้ก่อนเปลี่ยนหน้า ⭐⭐
      this.surveyService.setResult(results);

      // แล้วค่อยไปหน้า Result
      this.router.navigate(['/result']);
    },
    error: (err) => {
      console.error('❌ ส่งข้อมูลไม่ผ่าน:', err);
      this.loading = false;
      alert('เกิดข้อผิดพลาดในการส่งข้อมูล กรุณาลองใหม่อีกครั้ง');
      this.isWarping = false;
    }
  });
}

  calculateProgress() {
    if (!this.questions.length) return 0;
    return ((this.currentIndex + 1) / this.questions.length) * 100;
  }

  ngOnDestroy() {
    this.soundService.stopBgm();
  }
}
