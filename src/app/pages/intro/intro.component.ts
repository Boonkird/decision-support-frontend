import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-intro',
  standalone: true,
  template: `
    <div class="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      <div class="absolute top-10 left-10 w-32 h-32 bg-cyber-primary blur-[100px] opacity-20"></div>
      <div class="absolute bottom-10 right-10 w-32 h-32 bg-cyber-secondary blur-[100px] opacity-20"></div>

      <div class="z-10 text-center max-w-2xl px-6 slide-in">
        <div class="inline-block border border-cyber-primary/30 bg-cyber-primary/10 px-4 py-1 rounded-full mb-6 text-cyber-primary text-sm tracking-widest uppercase">
          Decision Support System
        </div>
        
        <h1 class="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          DISCOVER YOUR <br>
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-cyber-primary to-cyber-secondary drop-shadow-[0_0_10px_rgba(0,243,255,0.5)]">
            TECH DESTINY
          </span>
        </h1>

        <p class="text-gray-400 text-lg mb-10 font-light">
          ระบบค้นหาตัวตนอัจฉริยะสำหรับนักเรียนมัธยมปลาย <br>
          เพื่อค้นหาสาขาคอมพิวเตอร์ที่ "ใช่" ที่สุดสำหรับคุณ
        </p>

        <button (click)="start()" 
          class="group relative px-8 py-4 bg-transparent border border-cyber-primary text-cyber-primary font-bold text-xl uppercase tracking-wider overflow-hidden transition-all hover:text-black">
          <div class="absolute inset-0 w-0 bg-cyber-primary transition-all duration-[250ms] ease-out group-hover:w-full"></div>
          <span class="relative z-10 flex items-center gap-2">
            Start Mission <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
          </span>
        </button>
      </div>
    </div>
  `
})
export class IntroComponent {
  constructor(private router: Router) {}
  start() { this.router.navigate(['/student-info']); }
}