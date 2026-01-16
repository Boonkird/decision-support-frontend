import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SurveyService } from '../../services/survey.service';
import { Question, AnswerRequest } from '../../models/survey.model';

@Component({
  selector: 'app-survey',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div
      class="min-h-screen bg-cyber-bg flex flex-col items-center justify-center p-4 relative overflow-hidden text-white font-sans"
    >
      <div
        class="absolute inset-0 bg-[url('https://assets.codepen.io/13471/sparkles.gif')] opacity-20 pointer-events-none mix-blend-screen"
      ></div>

      <div
        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyber-primary/20 blur-[150px] rounded-full pointer-events-none animate-pulse"
      ></div>

      <div
        class="absolute w-full h-1 top-0 bg-gradient-to-r from-transparent via-cyber-primary to-transparent opacity-50 shadow-[0_0_20px_rgba(0,243,255,0.5)]"
      ></div>
      <div
        class="absolute -bottom-40 -left-40 w-96 h-96 bg-cyber-primary blur-[150px] opacity-20 animate-pulse"
      ></div>
      <div
        class="absolute -top-40 -right-40 w-96 h-96 bg-cyber-secondary blur-[150px] opacity-20 animate-pulse"
        style="animation-delay: 1s;"
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
        class="w-full max-w-3xl relative z-10 perspective-1000"
      >
        <div
          class="mb-8 relative transition-opacity duration-300"
          [ngClass]="isWarping ? 'opacity-50' : 'opacity-100'"
        >
          <div class="flex justify-between items-end mb-2">
            <div class="flex flex-col">
              <span class="text-cyber-primary text-xs uppercase tracking-[0.2em] font-bold"
                >Current Phase</span
              >
              <span class="text-2xl font-bold text-white capitalize drop-shadow-md">{{
                currentQuestion.sectionTitle
              }}</span>
            </div>
            <div class="text-right">
              <span class="text-4xl font-bold text-cyber-secondary font-mono">{{
                currentIndex + 1
              }}</span>
              <span class="text-gray-500 text-xl font-mono">/{{ questions.length }}</span>
            </div>
          </div>
          <div
            class="h-2 bg-gray-800 w-full relative rounded-full overflow-hidden border border-white/10"
          >
            <div
              class="h-full bg-gradient-to-r from-cyber-primary via-white to-cyber-secondary transition-all duration-500 ease-out shadow-[0_0_15px_rgba(0,243,255,0.8)]"
              [style.width.%]="calculateProgress()"
            ></div>
          </div>
        </div>

        <div class="relative">
          <div
            class="bg-gray/5 border border-white/20 backdrop-blur-sm p-8 md:p-12 rounded-[2.5rem] shadow-[0_0_50px_rgba(0,243,255,0.15)] relative overflow-hidden group hover:shadow-[0_0_80px_rgba(0,243,255,0.3)] hover:border-white/50 transition-all duration-500 origin-center"
            [ngClass]="animationClass"
          >
            <div
              class="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_2px,3px_100%] pointer-events-none z-0 opacity-10"
            ></div>

            <div
              class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyber-primary to-transparent opacity-50"
            ></div>

            <div
              class="min-h-[120px] flex items-center justify-center text-center mb-6 relative z-10 px-4"
            >
              <h1
                class="text-3xl md:text-5xl font-extrabold leading-tight text-white drop-shadow-[0_0_25px_rgba(0,243,255,0.6)] tracking-wide"
              >
                {{ currentQuestion.questionText }}
              </h1>
            </div>

            <div class="flex justify-center mb-8 h-16 relative z-10">
              <div
                class="text-5xl md:text-6xl transition-all duration-300 transform drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                [ngClass]="{ 'scale-125 opacity-100': isInteracting, 'opacity-80': !isInteracting }"
              >
                {{ getEmoji(currentScore) }}
              </div>
            </div>

            <div
              class="text-center text-cyber-primary text-lg mb-8 font-bold tracking-wider uppercase relative z-10"
            >
              {{ getLabel(currentScore) }}
            </div>

            <div class="relative w-full h-16 flex items-center justify-center px-4 z-10">
              <div class="absolute w-full h-2 bg-gray-500/50 rounded-full overflow-hidden">
                <div
                  class="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 opacity-60"
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
                class="absolute h-8 w-8 bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,0.8)] border-4 border-cyber-bg pointer-events-none transition-all duration-150 ease-out"
                [style.left.%]="(currentScore - 1) * 25"
                style="transform: translateX(-50%)"
              ></div>
            </div>

            <div
              class="flex justify-between text-xs text-gray-500 mt-2 uppercase tracking-widest font-mono relative z-10"
            >
              <span>Disagree</span>
              <span>Agree</span>
            </div>

            <div class="flex justify-center mt-10 relative z-10">
              <button
                (click)="nextQuestion()"
                [disabled]="isWarping"
                class="group relative bg-cyber-primary text-black font-bold py-4 px-12 rounded-full hover:scale-105 transition-all shadow-[0_0_20px_rgba(0,243,255,0.4)] overflow-hidden"
              >
                <span class="relative z-10 tracking-widest">
                  {{ isWarping ? 'CLOSING...' : 'CONFIRM CHOICE' }}
                </span>
                <div
                  class="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"
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
      /* --- 1. CRT TURN OFF (ขาออก) --- */
      .crt-off {
        animation: crtOff 0.8s cubic-bezier(0.23, 1, 0.32, 1) forwards;
      }
      @keyframes crtOff {
        0% {
          transform: scale(1, 1);
          opacity: 1;
          filter: brightness(1);
        }
        30% {
          transform: scale(1, 0.005);
          opacity: 1;
          filter: brightness(5);
        }
        60% {
          transform: scale(1, 0.005);
          opacity: 1;
        }
        100% {
          transform: scale(0, 0.005);
          opacity: 0;
        }
      }

      /* --- 2. CRT TURN ON (ขาเข้า) --- */
      .crt-on {
        animation: crtOn 0.8s cubic-bezier(0.23, 1, 0.32, 1) forwards;
      }
      @keyframes crtOn {
        0% {
          transform: scale(0, 0.005);
          opacity: 0;
          filter: brightness(5);
        }
        30% {
          transform: scale(1, 0.005);
          opacity: 1;
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

      /* --- 3. PREPARE --- */
      .prepare-anim {
        opacity: 0 !important;
        transform: scale(0);
      }

      .perspective-1000 {
        perspective: 1000px;
      }
    `,
  ],
})
export class SurveyComponent implements OnInit {
  questions: Question[] = [];
  currentIndex = 0;
  currentScore = 3;
  answers: AnswerRequest[] = [];
  loading = true;
  isInteracting = false;
  isWarping = false;
  animationClass = '';

  constructor(
    private surveyService: SurveyService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.surveyService.getQuestions().subscribe({
      next: (q) => {
        this.questions = q || [];
        this.loading = false;
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

  nextQuestion() {
    if (this.isWarping) return;

    // 1. CRT Off
    this.isWarping = true;
    this.animationClass = 'crt-off';

    // 2. Logic Delay
    setTimeout(() => {
      this.answers.push({ questionId: this.currentQuestion.questionId, score: this.currentScore });

      if (this.currentIndex < this.questions.length - 1) {
        this.currentIndex++;
        this.currentScore = 3;

        // --- Fix Flicker ---
        this.animationClass = 'prepare-anim';
        this.cdr.detectChanges();

        // 3. CRT On
        setTimeout(() => {
          this.animationClass = 'crt-on';
          this.cdr.detectChanges();
        }, 100);

        // 4. Finish Anim
        setTimeout(() => {
          this.isWarping = false;
          this.animationClass = '';
          this.cdr.detectChanges();
        }, 900);
      } else {
        this.finish();
      }
    }, 750);
  }

  finish() {
    this.loading = true;
    this.surveyService.submitSurvey(this.answers).subscribe({
      next: (results) => this.router.navigate(['/result'], { state: { results } }),
      error: () => {
        this.loading = false;
        alert('Error');
        this.isWarping = false;
        this.animationClass = '';
      },
    });
  }

  calculateProgress() {
    if (!this.questions.length) return 0;
    return ((this.currentIndex + 1) / this.questions.length) * 100;
  }
}
