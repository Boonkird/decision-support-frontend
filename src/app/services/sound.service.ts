import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SoundService {
  private bgmAudio: HTMLAudioElement | null = null;
  private processAudio: HTMLAudioElement | null = null;
  private isMuted = false;

  constructor() {}

  // 1. เล่นเสียงเอฟเฟกต์ (แก้ไขให้รับ volume ได้)
  playSfx(filename: string, volume: number = 0.5) {
    if (this.isMuted) return;
    const audio = new Audio();
    audio.src = `assets/sounds/${filename}`;
    audio.load();
    audio.volume = volume;
    audio.play().catch(e => console.error('SFX Error:', e));
  }

  // 2. เล่นเพลงพื้นหลัง (แก้ไขให้รับ volume ได้)
  playBgm(filename: string, volume: number = 0.3) {
    if (this.isMuted) return;
    this.stopBgm(); // หยุดเพลงเก่าก่อน

    this.bgmAudio = new Audio();
    this.bgmAudio.src = `assets/sounds/${filename}`;
    this.bgmAudio.loop = true;
    this.bgmAudio.volume = volume;
    this.bgmAudio.play().catch(e => console.error('BGM Error:', e));
  }

  stopBgm() {
    if (this.bgmAudio) {
      this.bgmAudio.pause();
      this.bgmAudio = null;
    }
  }

  // 3. (เพิ่มใหม่) เล่นเสียง Process Loop
  playProcessSound(filename: string) {
    if (this.isMuted) return;
    this.stopProcessSound();

    this.processAudio = new Audio();
    this.processAudio.src = `assets/sounds/${filename}`;
    this.processAudio.loop = true; // วนซ้ำ
    this.processAudio.volume = 0.4;
    this.processAudio.play().catch(e => console.error('Process Sound Error:', e));
  }

  // 4. (เพิ่มใหม่) หยุดเสียง Process
  stopProcessSound() {
    if (this.processAudio) {
      this.processAudio.pause();
      this.processAudio = null;
    }
  }
}