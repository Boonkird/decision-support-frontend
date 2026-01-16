import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-intro',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="min-h-screen bg-cyber-bg flex flex-col items-center justify-center p-4 relative overflow-hidden text-white font-sans"
    >
      <div
        class="absolute inset-0 bg-[url('https://assets.codepen.io/13471/sparkles.gif')] opacity-50 pointer-events-none mix-blend-screen"
      ></div>

      <div class="fixed inset-0 z-0 pointer-events-none">
        <div class="absolute w-[2px] h-[2px] bg-white rounded-full star-1 opacity-90"></div>
        <div class="absolute w-[3px] h-[3px] bg-blue-200 rounded-full star-2 opacity-70"></div>
      </div>

      <div
        class="absolute w-full h-full bg-gradient-to-b from-gray-900/80 via-[#050b14]/90 to-cyber-bg z-0"
      ></div>

      <div
        class="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[500px] bg-cyber-primary/20 blur-[120px] rounded-full pointer-events-none animate-pulse-slow"
      ></div>
      <div
        class="absolute -bottom-40 -right-40 w-96 h-96 bg-cyber-secondary/20 blur-[150px] rounded-full pointer-events-none"
      ></div>

      <div class="absolute top-6 right-6 z-50">
        <button
          (click)="goToLogin()"
          class="group flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-black/20 backdrop-blur-md text-gray-400 text-xs uppercase tracking-widest hover:text-white hover:border-cyber-primary/50 hover:bg-cyber-primary/10 transition-all duration-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-4 h-4 group-hover:text-cyber-primary transition-colors"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
            />
          </svg>
          Admin Access
        </button>
      </div>

      <div
        class="relative z-10 text-center max-w-4xl px-6 flex flex-col items-center animate-fadeInUp"
      >
        <div class="inline-block mb-8">
          <span
            class="px-4 py-1.5 rounded-full border border-cyber-primary/30 bg-cyber-primary/10 text-cyber-primary text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] shadow-[0_0_15px_rgba(0,243,255,0.2)]"
          >
            Decision Support System v2.0
          </span>
        </div>

        <h1
          class="text-5xl md:text-8xl font-black mb-6 leading-tight tracking-tighter drop-shadow-2xl"
        >
          DISCOVER YOUR <br />
          <span
            class="text-transparent bg-clip-text bg-gradient-to-r from-cyber-primary via-white to-cyber-secondary drop-shadow-[0_0_20px_rgba(0,243,255,0.6)] animate-gradient"
          >
            TECH DESTINY
          </span>
        </h1>

        <p class="text-gray-400 text-base md:text-xl mb-12 font-light max-w-2xl leading-relaxed">
          ระบบค้นหาตัวตนอัจฉริยะด้วย Algorithm <br class="hidden md:block" />
          ที่จะช่วยวิเคราะห์ทักษะและความสนใจ เพื่อพาคุณไปสู่สาขาคอมพิวเตอร์ที่ "ใช่" ที่สุด
        </p>

        <button
          (click)="start()"
          class="group relative px-10 py-5 bg-white text-black font-bold text-sm md:text-lg uppercase tracking-[0.2em] rounded-full overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(0,243,255,0.5)]"
        >
          <div
            class="absolute inset-0 bg-gradient-to-r from-cyber-primary to-cyber-secondary opacity-0 group-hover:opacity-20 transition-opacity duration-300"
          ></div>
          <span class="relative z-10 flex items-center gap-3">
            Start Mission
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

        <div
          class="mt-16 flex items-center gap-2 text-gray-600 text-xs font-mono uppercase tracking-widest opacity-50"
        >
          <span>System Status:</span>
          <span class="flex items-center gap-1 text-green-500">
            <span class="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> Online
          </span>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
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
      .animate-fadeInUp {
        animation: fadeInUp 1.2s cubic-bezier(0.16, 1, 0.3, 1);
      }

      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(40px);
          scale: 0.95;
        }
        to {
          opacity: 1;
          transform: translateY(0);
          scale: 1;
        }
      }

      .animate-gradient {
        background-size: 200% auto;
        animation: gradientMove 5s linear infinite;
      }
      @keyframes gradientMove {
        0% {
          background-position: 0% 50%;
        }
        50% {
          background-position: 100% 50%;
        }
        100% {
          background-position: 0% 50%;
        }
      }
    `,
  ],
})
export class IntroComponent {
  constructor(private router: Router) {}

  start() {
    this.router.navigate(['/instruction']);
  }

  goToLogin() {
    this.router.navigate(['/admin/login']);
  }
}
