import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SurveyResult } from '../../models/survey.model';

@Component({
  selector: 'app-result',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-cyber-bg flex flex-col items-center p-4 md:p-8 relative overflow-hidden text-white font-sans">
      
      <div class="absolute inset-0 bg-[url('https://assets.codepen.io/13471/sparkles.gif')] opacity-20 pointer-events-none mix-blend-screen"></div>
      <div class="absolute w-full h-full bg-gradient-to-b from-gray-900/90 to-cyber-bg z-0"></div>
      <div class="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[500px] bg-cyber-primary/20 blur-[120px] rounded-full pointer-events-none"></div>

      <div *ngIf="bestMatch" class="relative z-10 w-full max-w-5xl text-center animate-fadeIn flex flex-col items-center">
        
        <h2 class="text-cyber-primary text-xs md:text-sm uppercase tracking-[0.5em] mb-8 animate-pulse font-bold border border-cyber-primary/30 px-4 py-2 rounded-full bg-black/40 backdrop-blur-md">
          Analysis Complete // System Ready
        </h2>

        <div class="w-full bg-gray-900/60 border border-white/10 backdrop-blur-xl p-8 md:p-16 rounded-[3rem] mb-12 relative overflow-hidden group shadow-[0_0_80px_rgba(0,243,255,0.15)] hover:shadow-[0_0_100px_rgba(0,243,255,0.25)] transition-all duration-500">
          
          <div class="absolute -right-32 -top-32 w-96 h-96 bg-cyber-secondary blur-[150px] opacity-30 group-hover:opacity-50 transition-opacity duration-700"></div>
          
          <div class="relative z-10 flex flex-col items-center">
             <div class="inline-block px-6 py-2 rounded-full bg-gradient-to-r from-cyber-secondary/20 to-purple-900/20 border border-cyber-secondary/50 text-cyber-secondary text-xs font-bold mb-6 tracking-widest uppercase shadow-[0_0_20px_rgba(188,19,254,0.3)]">
               ✨ Highest Compatibility Match
             </div>
             
             <h1 class="text-7xl md:text-9xl font-black text-white mb-2 tracking-tighter drop-shadow-2xl glitch-effect" [attr.data-text]="bestMatch.trackCode">
               {{ bestMatch.trackCode }}
             </h1>
             
             <h3 class="text-2xl md:text-4xl text-gray-200 font-light mb-8 tracking-wide">
               {{ bestMatch.trackNameEn || bestMatch.trackNameTh }} 
             </h3>
             
             <p class="text-gray-400 max-w-3xl mx-auto text-lg md:text-xl leading-relaxed font-light mb-10">
               {{ bestMatch.description || 'No description available.' }}
             </p>

             <div class="relative w-40 h-40 md:w-48 md:h-48 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-500">
               <svg class="absolute inset-0 w-full h-full -rotate-90">
                 <circle cx="50%" cy="50%" r="45%" fill="none" stroke="#333" stroke-width="8"></circle>
                 <circle cx="50%" cy="50%" r="45%" fill="none" stroke="url(#gradient)" stroke-width="8"
                         stroke-dasharray="283" [attr.stroke-dashoffset]="283 - (283 * bestMatch.percentage / 100)"
                         class="transition-all duration-1000 ease-out"></circle>
                 <defs>
                   <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                     <stop offset="0%" stop-color="#00f3ff" />
                     <stop offset="100%" stop-color="#bc13fe" />
                   </linearGradient>
                 </defs>
               </svg>
               <div class="flex flex-col items-center">
                 <span class="text-4xl md:text-5xl font-bold text-white">{{ bestMatch.percentage | number : '1.0-0' }}%</span>
                 <span class="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Match Rate</span>
               </div>
             </div>
          </div>
        </div>

        <h3 class="text-gray-500 text-sm uppercase tracking-[0.2em] mb-6 w-full text-left pl-4">Alternative Paths</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-16">
          <div *ngFor="let res of otherResults" 
               class="bg-black/40 border border-white/10 p-6 rounded-3xl hover:bg-white/5 hover:border-cyber-primary/50 transition-all duration-300 group hover:-translate-y-1 relative overflow-hidden">
            
            <div class="relative z-10">
              <div class="flex justify-between items-center mb-4">
                <span class="text-2xl font-bold text-white group-hover:text-cyber-primary transition-colors">{{ res.trackCode }}</span>
                <span class="text-xl font-mono text-gray-400">{{ res.percentage | number : '1.0-0' }}%</span>
              </div>
              
              <div class="text-sm text-gray-400 mb-4 h-10 line-clamp-2 leading-relaxed">
                {{ res.trackNameTh }}
              </div>

              <div class="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <div class="h-full bg-gradient-to-r from-cyber-primary to-cyber-secondary" 
                     [style.width.%]="res.percentage"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="flex gap-4">
          <button (click)="restart()" 
                  class="px-10 py-4 bg-white text-black rounded-full hover:scale-105 transition-all uppercase tracking-widest text-sm font-bold shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:shadow-[0_0_50px_rgba(255,255,255,0.5)]">
            Start New Scan
          </button>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .glitch-effect { text-shadow: 2px 2px 0px rgba(188,19,254,0.5), -2px -2px 0px rgba(0,243,255,0.5); }
    .animate-fadeIn { animation: fadeIn 1s cubic-bezier(0.16, 1, 0.3, 1); }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(40px); scale: 0.95; } to { opacity: 1; transform: translateY(0); scale: 1; } }
  `]
})
export class ResultComponent implements OnInit {
  allResults: SurveyResult[] = [];
  bestMatch: SurveyResult | undefined;
  otherResults: SurveyResult[] = [];

  constructor(private router: Router) {
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
  }

  restart() {
    this.router.navigate(['/']);
  }
}