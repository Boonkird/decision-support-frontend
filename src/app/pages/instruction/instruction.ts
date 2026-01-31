import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SoundService } from '../../services/sound.service';

@Component({
  selector: 'app-instruction',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="min-h-screen bg-cyber-bg flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans text-white"
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
        class="bg-white/5 border border-white/20 p-8 md:p-12 rounded-[2.5rem] w-full max-w-3xl backdrop-blur-sm relative z-10 shadow-[0_0_60px_rgba(0,243,255,0.15)] animate-fadeInUp"
      >
        <div class="text-center mb-10">
          <div
            class="inline-block mb-4 px-4 py-1 rounded-full border border-cyber-primary/30 bg-cyber-primary/10 text-cyber-primary text-xs font-bold uppercase tracking-[0.2em]"
          >
            Protocol Alpha
          </div>
          <h1
            class="text-3xl md:text-5xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-cyber-primary to-white drop-shadow-lg mb-4"
          >
            MISSION BRIEFING
          </h1>
          <p class="text-gray-300 text-sm md:text-base font-light tracking-wide max-w-xl mx-auto">
            ยินดีต้อนรับสู่ระบบค้นหาตัวตน โปรดทำความเข้าใจขั้นตอนปฏิบัติการทั้ง 3 ขั้นตอนด้านล่าง
            เพื่อให้ผลลัพธ์การวิเคราะห์ออกมาแม่นยำที่สุด
          </p>
        </div>

        <div class="space-y-8 mb-12">
          <div class="flex items-start gap-5 group">
            <div
              class="flex-shrink-0 w-14 h-14 rounded-2xl bg-gray-800/50 border border-white/10 flex items-center justify-center text-cyber-primary font-bold text-2xl group-hover:bg-cyber-primary group-hover:text-black transition-all duration-300 shadow-[0_0_15px_rgba(0,243,255,0.1)]"
            >
              1
            </div>
            <div>
              <h3
                class="text-xl font-bold text-white mb-2 group-hover:text-cyber-primary transition-colors"
              >
                ระบุตัวตน (Identify)
              </h3>
              <p class="text-gray-400 text-sm leading-relaxed">
                เข้าสู่ระบบฐานข้อมูลด้วยการกรอกข้อมูลส่วนตัวของท่าน เช่น
                <span class="text-white">ระดับชั้น, สายการเรียน, และโรงเรียน</span> ให้ครบถ้วน
                ข้อมูลพื้นฐานเหล่านี้เป็นกุญแจสำคัญที่จะช่วยให้ AI สามารถปรับเทียบ (Calibrate)
                ผลลัพธ์ให้เหมาะสมกับบริบททางการศึกษาของท่าน
              </p>
            </div>
          </div>

          <div class="flex items-start gap-5 group">
            <div
              class="flex-shrink-0 w-14 h-14 rounded-2xl bg-gray-800/50 border border-white/10 flex items-center justify-center text-cyber-secondary font-bold text-2xl group-hover:bg-cyber-secondary group-hover:text-white transition-all duration-300 shadow-[0_0_15px_rgba(188,19,254,0.1)]"
            >
              2
            </div>
            <div>
              <h3
                class="text-xl font-bold text-white mb-2 group-hover:text-cyber-secondary transition-colors"
              >
                ทำแบบทดสอบ (Scan)
              </h3>
              <p class="text-gray-400 text-sm leading-relaxed">
                เริ่มกระบวนการสแกนความถนัดผ่านชุดคำถามจิตวิทยา โดยให้คะแนนตั้งแต่
                <span class="text-white">1 (ไม่เห็นด้วย) ถึง 5 (เห็นด้วยอย่างยิ่ง)</span>
                ขอให้ตอบตามความเป็นจริงและความรู้สึกของท่าน ณ ปัจจุบัน
                <span class="text-cyber-secondary">ไม่มีคำตอบที่ถูกหรือผิด</span>
                มีเพียงคำตอบที่เป็น "ตัวท่าน" เท่านั้น
              </p>
            </div>
          </div>

          <div class="flex items-start gap-5 group">
            <div
              class="flex-shrink-0 w-14 h-14 rounded-2xl bg-gray-800/50 border border-white/10 flex items-center justify-center text-green-400 font-bold text-2xl group-hover:bg-green-400 group-hover:text-black transition-all duration-300 shadow-[0_0_15px_rgba(74,222,128,0.1)]"
            >
              3
            </div>
            <div>
              <h3
                class="text-xl font-bold text-white mb-2 group-hover:text-green-400 transition-colors"
              >
                รับผลลัพธ์ (Result)
              </h3>
              <p class="text-gray-400 text-sm leading-relaxed">
                ระบบ AI จะประมวลผลข้อมูลทั้งหมดและถอดรหัสออกมาเป็น
                <span class="text-white">"Tech DNA"</span> ของท่าน พร้อมกราฟวิเคราะห์ทักษะและ
                <span class="text-green-400 font-bold"
                  >แนะนำสาขาวิชาคอมพิวเตอร์ (CS, IT, CE, CDT)</span
                >
                ที่ตรงกับจุดแข็งของท่านมากที่สุด เพื่อใช้เป็นแนวทางในการวางแผนการศึกษาต่อ
              </p>
            </div>
          </div>
        </div>

        <div class="text-center">
          <button
            (click)="nextPage()"
            class="group relative inline-flex items-center gap-3 px-12 py-4 bg-white text-black font-bold text-sm uppercase tracking-[0.2em] rounded-full overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.4)]"
          >
            <span>Acknowledge & Proceed</span>
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
          </button>
        </div>
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

      /* ⭐ เพิ่ม CSS สำหรับดาว (Copy มาจาก Intro) */
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
    `,
  ],
})

export class InstructionComponent {
  
  constructor(private router: Router, private soundService: SoundService) {}

  nextPage() {
    this.soundService.playSfx('click.mp3');
    this.router.navigate(['/student-info']);
  }
}
