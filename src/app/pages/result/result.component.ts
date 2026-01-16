import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  AfterViewInit,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SurveyResult } from '../../models/survey.model';
import Chart from 'chart.js/auto';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-result',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="min-h-screen bg-[#050b14] flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden font-mono text-white"
    >
      <div
        class="absolute inset-0 bg-[url('https://assets.codepen.io/13471/sparkles.gif')] opacity-20 pointer-events-none mix-blend-screen"
      ></div>

      <div
        class="absolute w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-[#050b14] to-[#050b14] z-0"
      ></div>

      <div
        class="absolute inset-0 bg-[linear-gradient(rgba(0,243,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,243,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [transform:perspective(500px)_rotateX(60deg)_translateY(100px)_scale(2)] pointer-events-none opacity-30"
      ></div>

      <div *ngIf="isProcessing" class="relative z-20 w-full max-w-4xl flex flex-col items-center">
        <div class="mb-12 text-center">
          <h1
            class="text-4xl md:text-6xl font-bold text-cyber-primary tracking-widest glitch mb-4"
            data-text="ANALYZING DNA..."
          >
            ANALYZING DNA...
          </h1>
          <div class="text-xs md:text-sm text-cyber-secondary font-mono h-6">
            {{ randomCodeLine }}
          </div>
        </div>

        <div class="w-full max-w-lg space-y-4 px-8">
          <div *ngFor="let track of ['CS', 'IT', 'CDT', 'CE']; let i = index" class="relative">
            <div class="flex justify-between text-xs text-gray-400 mb-1 uppercase tracking-widest">
              <span>Scanning: {{ track }}_Module</span>
              <span class="text-cyber-primary">{{ processingProgress[i] }}%</span>
            </div>
            <div class="h-2 bg-gray-900 rounded-full overflow-hidden border border-white/10">
              <div
                class="h-full bg-cyber-primary shadow-[0_0_10px_#00f3ff] transition-all duration-100 ease-out"
                [style.width.%]="processingProgress[i]"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div
        *ngIf="!isProcessing && bestMatch"
        class="relative z-20 w-full max-w-6xl animate-materialize"
      >
        <div class="text-center mb-8">
          <span
            class="px-6 py-2 rounded-full border border-cyber-secondary/50 bg-cyber-secondary/10 text-cyber-secondary text-xs font-bold uppercase tracking-[0.3em] shadow-[0_0_20px_rgba(188,19,254,0.3)] animate-pulse"
          >
            Identity Confirmed
          </span>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full">
          <div
            class="lg:col-span-7 bg-gray-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 relative overflow-hidden group shadow-[0_0_50px_rgba(0,243,255,0.1)]"
          >
            <div
              class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyber-primary to-transparent opacity-50"
            ></div>

            <div class="relative z-10 flex flex-col h-full justify-center">
              <h3 class="text-gray-400 text-sm uppercase tracking-[0.2em] mb-2">
                Recommended Class
              </h3>
              <h1
                class="text-6xl md:text-8xl font-black text-white mb-4 tracking-tighter drop-shadow-[0_0_15px_rgba(0,243,255,0.5)] glitch-hover"
                [attr.data-text]="bestMatch.trackCode"
              >
                {{ bestMatch.trackCode }}
              </h1>
              <h2 class="text-2xl md:text-3xl text-cyber-primary font-light mb-6">
                {{ bestMatch.trackNameEn }}
              </h2>
              <p
                class="text-gray-300 leading-relaxed font-light text-sm md:text-base border-l-2 border-cyber-secondary/50 pl-4"
              >
                {{
                  bestMatch.description ||
                    'Suitable for those who love creating, logical thinking, and innovating the future.'
                }}
              </p>

              <div class="mt-8 flex items-center gap-4">
                <div class="relative w-16 h-16">
                  <svg class="w-full h-full -rotate-90">
                    <circle
                      cx="50%"
                      cy="50%"
                      r="45%"
                      fill="none"
                      stroke="#333"
                      stroke-width="4"
                    ></circle>
                    <circle
                      cx="50%"
                      cy="50%"
                      r="45%"
                      fill="none"
                      stroke="#00f3ff"
                      stroke-width="4"
                      stroke-dasharray="100"
                      [attr.stroke-dashoffset]="100 - bestMatch.percentage"
                      class="drop-shadow-[0_0_5px_#00f3ff]"
                    ></circle>
                  </svg>
                  <span class="absolute inset-0 flex items-center justify-center text-xs font-bold"
                    >{{ bestMatch.percentage | number: '1.0-0' }}%</span
                  >
                </div>
                <div>
                  <div class="text-lg font-bold text-white">Excellent Match</div>
                  <div class="text-xs text-gray-400">Based on your aptitude</div>
                </div>
              </div>
            </div>
          </div>

          <div class="lg:col-span-5 flex flex-col gap-6">
            <div
              class="bg-black/40 backdrop-blur-md border border-white/10 rounded-3xl p-6 flex flex-col items-center justify-center shadow-inner h-[320px]"
            >
              <h3 class="text-gray-500 text-xs uppercase tracking-[0.2em] mb-4 w-full text-left">
                Skill Visualization
              </h3>
              <div class="w-full h-full relative">
                <canvas #radarChart></canvas>
              </div>
            </div>

            <div
              class="bg-gray-900/60 border border-white/10 backdrop-blur-xl rounded-3xl p-6 shadow-lg"
            >
              <h3 class="text-gray-400 text-xs font-bold uppercase tracking-widest mb-4">
                Other Matches
              </h3>
              <div class="space-y-4">
                <div *ngFor="let res of otherResults.slice(0, 3)" class="group">
                  <div class="flex justify-between items-end mb-1">
                    <span
                      class="text-sm font-bold text-white group-hover:text-cyber-primary transition-colors"
                      >{{ res.trackCode }}</span
                    >
                    <span class="text-xs font-mono text-gray-400"
                      >{{ res.percentage | number: '1.0-0' }}%</span
                    >
                  </div>
                  <div class="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      class="h-full bg-gradient-to-r from-cyber-secondary to-purple-600 group-hover:from-cyber-primary group-hover:to-cyber-secondary transition-all"
                      [style.width.%]="res.percentage"
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <button
                (click)="restart()"
                class="py-4 bg-gray-800 hover:bg-gray-700 text-white rounded-xl border border-white/10 transition-all text-xs uppercase tracking-widest font-bold flex justify-center items-center gap-2"
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
                    d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"
                  />
                </svg>
                Re-Sync
              </button>
              <button
                (click)="share()"
                class="py-4 bg-cyber-primary text-black rounded-xl hover:bg-white transition-all text-xs uppercase tracking-widest font-bold shadow-[0_0_20px_rgba(0,243,255,0.4)] flex justify-center items-center gap-2"
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
                    d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
                  />
                </svg>
                Share
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .glitch {
        position: relative;
      }
      .glitch::before,
      .glitch::after {
        content: attr(data-text);
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0.8;
      }
      .glitch::before {
        left: 2px;
        text-shadow: -1px 0 red;
        clip: rect(44px, 450px, 56px, 0);
        animation: glitch-anim 2s infinite linear alternate-reverse;
      }
      .glitch::after {
        left: -2px;
        text-shadow: -1px 0 blue;
        clip: rect(44px, 450px, 56px, 0);
        animation: glitch-anim 2s infinite linear alternate-reverse;
      }

      @keyframes glitch-anim {
        0% {
          clip: rect(10px, 9999px, 30px, 0);
        }
        100% {
          clip: rect(80px, 9999px, 100px, 0);
        }
      }

      .animate-materialize {
        animation: materialize 1.5s cubic-bezier(0.19, 1, 0.22, 1) forwards;
      }
      @keyframes materialize {
        0% {
          opacity: 0;
          transform: scale(0.9) translateY(50px);
          filter: blur(20px);
        }
        100% {
          opacity: 1;
          transform: scale(1) translateY(0);
          filter: blur(0);
        }
      }
    `,
  ],
})
export class ResultComponent implements OnInit, AfterViewInit {
  @ViewChild('radarChart') radarChartRef!: ElementRef;

  allResults: SurveyResult[] = [];
  bestMatch: SurveyResult | undefined;
  otherResults: SurveyResult[] = [];

  isProcessing = true;
  processingProgress = [0, 0, 0, 0];
  randomCodeLine = '';
  chartInstance: any;

  codeSnippet = [
    'Initializing Neural Net...',
    'Optimizing Vectors...',
    'Normalizing Scores...',
    'Accessing Database...',
    'Matching Profiles...',
    'Calculating Compatibility...',
    'Decrypting Result...',
  ];

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {
    const nav = this.router.getCurrentNavigation();
    if (nav?.extras.state) {
      this.allResults = nav.extras.state['results'];
    }
  }

  ngOnInit() {
    if (!this.allResults || this.allResults.length === 0) {
      this.router.navigate(['/']);
      return;
    }

    this.allResults.sort((a, b) => b.percentage - a.percentage);
    this.bestMatch = this.allResults[0];
    this.otherResults = this.allResults.slice(1);

    this.startProcessingSimulation();
  }

  ngAfterViewInit() {}

  startProcessingSimulation() {
    let lineIndex = 0;
    const textInterval = setInterval(() => {
      this.randomCodeLine = this.codeSnippet[lineIndex % this.codeSnippet.length];
      lineIndex++;
      this.cdr.detectChanges();
    }, 150);

    const barInterval = setInterval(() => {
      this.processingProgress = this.processingProgress.map(
        () => Math.floor(Math.random() * 80) + 10,
      );
      this.cdr.detectChanges();
    }, 100);

    setTimeout(() => {
      clearInterval(textInterval);
      clearInterval(barInterval);
      this.processingProgress = [100, 100, 100, 100];
      this.cdr.detectChanges();

      setTimeout(() => {
        this.isProcessing = false;
        this.cdr.detectChanges();
        setTimeout(() => this.initChart(), 100);
      }, 500);
    }, 3000);
  }

  initChart() {
    if (!this.radarChartRef) return;

    // เรียง CS, IT, CDT, CE เพื่อให้กราฟสวย
    const order = ['CS', 'IT', 'CDT', 'CE'];
    const sortedResults = order.map(
      (code) =>
        this.allResults.find((r) => r.trackCode === code) || { trackCode: code, percentage: 0 },
    );

    const labels = sortedResults.map((r) => r.trackCode);
    const data = sortedResults.map((r) => r.percentage);

    this.chartInstance = new Chart(this.radarChartRef.nativeElement, {
      type: 'radar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Aptitude Score',
            data: data,
            backgroundColor: 'rgba(0, 243, 255, 0.2)',
            borderColor: '#00f3ff',
            pointBackgroundColor: '#fff',
            pointBorderColor: '#00f3ff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: '#00f3ff',
            pointRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            min: 0,
            max: 100,
            angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
            grid: { color: 'rgba(255, 255, 255, 0.1)' },
            pointLabels: { color: '#aaa', font: { size: 12, family: 'monospace' } },
            ticks: { display: false, backdropColor: 'transparent' },
          },
        },
        plugins: {
          legend: { display: false },
        },
      },
    });
  }

  restart() {
    this.router.navigate(['/']);
  }

  share() {
    if (!this.bestMatch) return;
    const text = `🚀 My Tech DNA: ${this.bestMatch.trackCode} (${this.bestMatch.percentage.toFixed(0)}%)\nFind yours at: [Link]`;
    navigator.clipboard.writeText(text).then(() => {
      Swal.fire({
        icon: 'success',
        title: 'Copied!',
        background: '#1a1a1a',
        color: '#fff',
        timer: 1500,
        showConfirmButton: false,
      });
    });
  }
}
