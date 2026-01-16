import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { AdminService } from '../../../services/admin.service';
import { Track, School } from '../../../models/survey.model';
import { AdminQuestion } from '../../../models/admin.model';

@Component({
  selector: 'app-admin-manage',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-cyber-bg p-4 md:p-8 text-white font-sans">
      <div class="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
        <div>
          <h1
            class="text-3xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyber-primary to-cyber-secondary"
          >
            SYSTEM MANAGEMENT
          </h1>
        </div>
        <button
          (click)="goBack()"
          class="px-4 py-2 bg-cyber-primary/10 border border-cyber-primary text-cyber-primary hover:bg-cyber-primary hover:text-black font-bold rounded-lg transition-all text-xs tracking-wider flex items-center gap-2 shadow-[0_0_10px_rgba(0,243,255,0.2)] hover:shadow-[0_0_20px_rgba(0,243,255,0.6)]"
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
              d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
            />
          </svg>
          BACK TO DASHBOARD
        </button>
      </div>

      <div class="flex gap-2 mb-6 overflow-x-auto pb-2">
        <button
          (click)="switchTab('tracks')"
          [class]="
            activeTab === 'tracks'
              ? 'bg-cyber-primary text-black shadow-[0_0_15px_rgba(0,243,255,0.4)]'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
          "
          class="px-6 py-3 rounded-t-lg font-bold text-sm tracking-wider transition-all border-b-2 border-transparent flex items-center gap-2 whitespace-nowrap"
        >
          📂 TRACKS
        </button>
        <button
          (click)="switchTab('schools')"
          [class]="
            activeTab === 'schools'
              ? 'bg-cyber-primary text-black shadow-[0_0_15px_rgba(0,243,255,0.4)]'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
          "
          class="px-6 py-3 rounded-t-lg font-bold text-sm tracking-wider transition-all border-b-2 border-transparent flex items-center gap-2 whitespace-nowrap"
        >
          🏫 SCHOOLS
        </button>

        <button
          (click)="switchTab('programs')"
          [class]="
            activeTab === 'programs'
              ? 'bg-cyber-primary text-black shadow-[0_0_15px_rgba(0,243,255,0.4)]'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
          "
          class="px-6 py-3 rounded-t-lg font-bold text-sm tracking-wider transition-all border-b-2 border-transparent flex items-center gap-2 whitespace-nowrap"
        >
          📚 PROGRAMS
        </button>
        <button
          (click)="switchTab('levels')"
          [class]="
            activeTab === 'levels'
              ? 'bg-cyber-primary text-black shadow-[0_0_15px_rgba(0,243,255,0.4)]'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
          "
          class="px-6 py-3 rounded-t-lg font-bold text-sm tracking-wider transition-all border-b-2 border-transparent flex items-center gap-2 whitespace-nowrap"
        >
          🎓 LEVELS
        </button>

        <button
          (click)="switchTab('questions')"
          [class]="
            activeTab === 'questions'
              ? 'bg-cyber-primary text-black shadow-[0_0_15px_rgba(0,243,255,0.4)]'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
          "
          class="px-6 py-3 rounded-t-lg font-bold text-sm tracking-wider transition-all border-b-2 border-transparent flex items-center gap-2 whitespace-nowrap"
        >
          🧠 QUESTIONS & WEIGHTS
        </button>
      </div>

      <div
        *ngIf="activeTab === 'tracks'"
        class="bg-gray-900/60 border border-cyber-primary/30 rounded-xl rounded-tl-none overflow-hidden backdrop-blur-md shadow-lg p-4 animate-fadeIn"
      >
        <div class="bg-black/40 border border-white/10 p-4 rounded-xl mb-6 shadow-inner">
          <label
            class="text-[10px] text-cyber-primary uppercase tracking-wider mb-3 block font-bold flex items-center gap-2"
          >
            ✨ Add New Track
          </label>
          <div class="flex flex-col lg:flex-row gap-4 items-start">
            <div class="grid grid-cols-2 md:grid-cols-4 gap-2 w-full">
              <input
                type="text"
                [(ngModel)]="newTrack.trackCode"
                placeholder="Code (e.g. AI)"
                class="bg-gray-900 border border-white/20 rounded px-3 py-2 text-sm text-white focus:border-cyber-primary outline-none"
              />
              <input
                type="text"
                [(ngModel)]="newTrack.trackNameTh"
                placeholder="Name (TH)"
                class="bg-gray-900 border border-white/20 rounded px-3 py-2 text-sm text-white focus:border-cyber-primary outline-none"
              />
              <input
                type="text"
                [(ngModel)]="newTrack.trackNameEn"
                placeholder="Name (EN)"
                class="bg-gray-900 border border-white/20 rounded px-3 py-2 text-sm text-white focus:border-cyber-primary outline-none"
              />
              <input
                type="text"
                [(ngModel)]="newTrack.description"
                placeholder="Description"
                class="bg-gray-900 border border-white/20 rounded px-3 py-2 text-sm text-white focus:border-cyber-primary outline-none"
              />
            </div>
            <button
              (click)="addTrack()"
              [disabled]="!newTrack.trackCode || !newTrack.trackNameTh"
              class="bg-cyber-primary text-black px-6 py-2 rounded-lg font-bold text-xs uppercase tracking-wider hover:scale-105 transition-all shadow-[0_0_15px_rgba(0,243,255,0.3)] disabled:opacity-50 h-[38px] flex items-center gap-2 whitespace-nowrap"
            >
              <span>+</span> Add
            </button>
          </div>
        </div>

        <div class="flex justify-between items-center mb-4">
          <h3
            class="text-cyber-primary font-bold uppercase tracking-wider text-sm border-l-4 border-cyber-primary pl-2"
          >
            Manage Tracks
          </h3>
          <button
            (click)="toggleDeleteMode()"
            [class]="
              isDeleteMode
                ? 'bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.6)] animate-pulse'
                : 'bg-gray-800 text-gray-400 border border-gray-600 hover:bg-gray-700'
            "
            class="px-4 py-2 rounded-full font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2"
          >
            <span *ngIf="!isDeleteMode">🗑 Enter Delete Mode</span>
            <span *ngIf="isDeleteMode">🚫 Exit Delete Mode</span>
          </button>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm text-gray-300">
            <thead class="bg-gray-800 uppercase text-xs">
              <tr>
                <th class="p-3">Code</th>
                <th class="p-3">Name (TH)</th>
                <th class="p-3">Name (EN)</th>
                <th class="p-3">Description</th>
                <th class="p-3 text-center w-24">{{ isDeleteMode ? 'DELETE' : 'EDIT' }}</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/5">
              <tr *ngFor="let t of tracks" class="hover:bg-white/5 transition-colors">
                <ng-container *ngIf="editingTrackId !== t.trackId; else editTrackMode">
                  <td class="p-3 text-cyber-primary font-bold">{{ t.trackCode }}</td>
                  <td class="p-3 font-medium text-white">{{ t.trackNameTh }}</td>
                  <td class="p-3">{{ t.trackNameEn || '-' }}</td>
                  <td class="p-3 text-xs leading-relaxed max-w-md text-gray-400">
                    {{ t.description || '-' }}
                  </td>
                  <td class="p-3 text-center">
                    <button
                      *ngIf="!isDeleteMode"
                      (click)="startEditTrack(t)"
                      class="group text-cyber-secondary hover:text-white transition-all p-2 rounded-full hover:bg-cyber-secondary/20"
                      title="Edit"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="w-5 h-5"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                        />
                      </svg>
                    </button>
                    <button
                      *ngIf="isDeleteMode"
                      (click)="confirmDeleteTrack(t)"
                      class="bg-red-500/20 text-red-500 border border-red-500/50 p-2 rounded-full hover:bg-red-600 hover:text-white transition-all shadow-[0_0_10px_rgba(239,68,68,0.4)]"
                      title="DELETE"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="2"
                        stroke="currentColor"
                        class="w-5 h-5"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                        />
                      </svg>
                    </button>
                  </td>
                </ng-container>

                <ng-template #editTrackMode>
                  <td class="p-3 font-bold text-gray-500">{{ t.trackCode }}</td>
                  <td class="p-3 text-gray-500">{{ t.trackNameTh }}</td>
                  <td class="p-3">
                    <input
                      [(ngModel)]="tempTrackData.trackNameEn"
                      class="bg-black/50 border border-cyber-primary p-2 rounded w-full text-white text-xs focus:ring-1 focus:ring-cyber-primary outline-none"
                    />
                  </td>
                  <td class="p-3">
                    <textarea
                      [(ngModel)]="tempTrackData.description"
                      rows="2"
                      class="bg-black/50 border border-cyber-primary p-2 rounded w-full text-white text-xs focus:ring-1 focus:ring-cyber-primary outline-none"
                    ></textarea>
                  </td>
                  <td class="p-3">
                    <div class="flex gap-2 justify-center">
                      <button
                        (click)="saveTrack(t.trackId)"
                        class="text-green-400 font-bold hover:text-green-300"
                      >
                        SAVE
                      </button>
                      <button (click)="cancelEditTrack()" class="text-gray-400 hover:text-white">
                        ✕
                      </button>
                    </div>
                  </td>
                </ng-template>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div
        *ngIf="activeTab === 'schools'"
        class="bg-gray-900/60 border border-cyber-primary/30 rounded-xl rounded-tl-none overflow-hidden backdrop-blur-md shadow-lg p-4 animate-fadeIn"
      >
        <div class="bg-black/40 border border-white/10 p-4 rounded-xl mb-6 shadow-inner">
          <div class="flex flex-col xl:flex-row gap-6">
            <div class="flex-1">
              <label
                class="text-[10px] text-gray-400 uppercase tracking-wider mb-2 block font-bold flex items-center gap-1"
                >🔍 Find School</label
              >
              <div class="relative">
                <input
                  type="text"
                  [(ngModel)]="schoolSearchTerm"
                  placeholder="Type school name..."
                  class="w-full bg-gray-900 border border-white/20 rounded-lg px-4 py-3 text-sm text-white focus:border-cyber-primary outline-none"
                />
                <span class="absolute right-3 top-3 text-gray-500 text-xs" *ngIf="schoolSearchTerm"
                  >Found {{ (filteredSchools | slice: 0 : 50).length }}</span
                >
              </div>
            </div>
            <div class="flex-[1.5] bg-white/5 p-3 rounded-lg border border-white/5">
              <label
                class="text-[10px] text-cyber-primary uppercase tracking-wider mb-2 block font-bold flex items-center gap-2"
                >✨ Add New School</label
              >
              <div class="flex flex-col sm:flex-row gap-2 items-stretch">
                <div class="flex-grow flex flex-col sm:flex-row gap-2">
                  <div class="w-full sm:flex-[7]">
                    <input
                      type="text"
                      [(ngModel)]="newSchoolName"
                      placeholder="School Name"
                      class="w-full h-full bg-gray-900 border border-white/20 rounded-lg px-3 py-2 text-sm text-white focus:border-cyber-primary outline-none"
                    />
                  </div>
                  <div class="w-full sm:flex-[3]">
                    <input
                      type="text"
                      [(ngModel)]="newSchoolProv"
                      placeholder="Province"
                      class="w-full h-full bg-gray-900 border border-white/20 rounded-lg px-3 py-2 text-sm text-white focus:border-cyber-primary outline-none"
                    />
                  </div>
                </div>
                <button
                  (click)="confirmAddSchool()"
                  [disabled]="!newSchoolName"
                  class="bg-cyber-primary text-black px-6 py-2 rounded-lg font-bold text-xs uppercase tracking-wider hover:scale-105 transition-all h-[42px] flex items-center gap-1"
                >
                  <span>+</span> Add
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-between items-center mb-4">
          <h3
            class="text-cyber-primary font-bold uppercase tracking-wider text-sm border-l-4 border-cyber-primary pl-2"
          >
            School List
          </h3>
          <button
            (click)="toggleDeleteMode()"
            [class]="
              isDeleteMode
                ? 'bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.6)] animate-pulse'
                : 'bg-gray-800 text-gray-400 border border-gray-600 hover:bg-gray-700'
            "
            class="px-4 py-2 rounded-full font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2"
          >
            <span *ngIf="!isDeleteMode">🗑 Enter Delete Mode</span>
            <span *ngIf="isDeleteMode">🚫 Exit Delete Mode</span>
          </button>
        </div>

        <div class="overflow-x-auto max-h-[500px] custom-scrollbar">
          <table class="w-full text-left text-sm text-gray-300">
            <thead class="bg-gray-800 uppercase text-xs sticky top-0 z-10 shadow-md">
              <tr>
                <th class="p-3 w-16 text-center">ID</th>
                <th class="p-3">School Name</th>
                <th class="p-3 w-40">Province</th>
                <th class="p-3 w-32 text-center">{{ isDeleteMode ? 'DELETE' : 'EDIT' }}</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/5">
              <tr
                *ngFor="let s of filteredSchools | slice: 0 : 50"
                class="hover:bg-white/5 transition-colors group"
              >
                <td class="p-3 text-center text-gray-600 text-xs">{{ s.id }}</td>
                <ng-container *ngIf="editingSchoolId !== s.id; else editSchoolMode">
                  <td class="p-3 text-white font-medium">
                    <span [innerHTML]="highlightText(s.name, schoolSearchTerm)"></span>
                  </td>
                  <td class="p-3 text-gray-400">{{ s.province }}</td>
                  <td class="p-3 text-center">
                    <button
                      *ngIf="!isDeleteMode"
                      (click)="startEditSchool(s)"
                      class="group text-cyber-secondary hover:text-white transition-all p-2 rounded-full hover:bg-cyber-secondary/20"
                      title="Edit"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="w-5 h-5"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                        />
                      </svg>
                    </button>
                    <button
                      *ngIf="isDeleteMode"
                      (click)="confirmDeleteSchool(s.id, s.name)"
                      class="bg-red-500/20 text-red-500 border border-red-500/50 p-2 rounded-full hover:bg-red-600 hover:text-white transition-all shadow-[0_0_10px_rgba(239,68,68,0.4)]"
                      title="DELETE"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="2"
                        stroke="currentColor"
                        class="w-5 h-5"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                        />
                      </svg>
                    </button>
                  </td>
                </ng-container>
                <ng-template #editSchoolMode>
                  <td class="p-3">
                    <input
                      [(ngModel)]="tempSchoolData.name"
                      class="bg-black/50 border border-cyber-primary p-2 rounded w-full text-white text-xs"
                    />
                  </td>
                  <td class="p-3">
                    <input
                      [(ngModel)]="tempSchoolData.province"
                      class="bg-black/50 border border-cyber-primary p-2 rounded w-full text-white text-xs"
                    />
                  </td>
                  <td class="p-3 text-center flex gap-2 justify-center">
                    <button
                      (click)="saveSchool(s.id)"
                      class="text-green-400 font-bold hover:text-green-300"
                    >
                      SAVE
                    </button>
                    <button (click)="cancelEditSchool()" class="text-gray-400 hover:text-white">
                      ✕
                    </button>
                  </td>
                </ng-template>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div
        *ngIf="activeTab === 'programs'"
        class="bg-gray-900/60 border border-cyber-primary/30 rounded-xl rounded-tl-none overflow-hidden backdrop-blur-md shadow-lg p-4 animate-fadeIn"
      >
        <div class="bg-black/40 border border-white/10 p-4 rounded-xl mb-6 shadow-inner">
          <label
            class="text-[10px] text-cyber-primary uppercase tracking-wider mb-3 block font-bold flex items-center gap-2"
          >
            ✨ Add New Program
          </label>
          <div class="flex flex-col sm:flex-row gap-4 items-start">
            <div class="flex-grow w-full">
              <input
                type="text"
                [(ngModel)]="newProgram.name"
                placeholder="Program Name (e.g. Science-Math)"
                class="w-full bg-gray-900 border border-white/20 rounded px-3 py-2 text-sm text-white focus:border-cyber-primary outline-none"
              />
            </div>
            <div class="w-full sm:w-1/3">
              <input
                type="text"
                [(ngModel)]="newProgram.description"
                placeholder="Description (Optional)"
                class="w-full bg-gray-900 border border-white/20 rounded px-3 py-2 text-sm text-white focus:border-cyber-primary outline-none"
              />
            </div>
            <button
              (click)="addProgram()"
              [disabled]="!newProgram.name"
              class="bg-cyber-primary text-black px-6 py-2 rounded-lg font-bold text-xs uppercase tracking-wider hover:scale-105 transition-all shadow-[0_0_15px_rgba(0,243,255,0.3)] disabled:opacity-50 h-[38px] flex items-center gap-2 whitespace-nowrap"
            >
              <span>+</span> Add
            </button>
          </div>
        </div>

        <div class="flex justify-between items-center mb-4">
          <h3
            class="text-cyber-primary font-bold uppercase tracking-wider text-sm border-l-4 border-cyber-primary pl-2"
          >
            Manage Study Programs
          </h3>
          <button
            (click)="toggleDeleteMode()"
            [class]="
              isDeleteMode
                ? 'bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.6)] animate-pulse'
                : 'bg-gray-800 text-gray-400 border border-gray-600 hover:bg-gray-700'
            "
            class="px-4 py-2 rounded-full font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2"
          >
            <span *ngIf="!isDeleteMode">🗑 Enter Delete Mode</span>
            <span *ngIf="isDeleteMode">🚫 Exit Delete Mode</span>
          </button>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm text-gray-300">
            <thead class="bg-gray-800 uppercase text-xs">
              <tr>
                <th class="p-3 w-16 text-center">ID</th>
                <th class="p-3">Program Name</th>
                <th class="p-3">Description</th>
                <th class="p-3 text-center w-24">{{ isDeleteMode ? 'DELETE' : 'EDIT' }}</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/5">
              <tr *ngFor="let p of programs" class="hover:bg-white/5 transition-colors">
                <td class="p-3 text-center text-gray-600 font-mono text-xs">{{ p.id }}</td>
                <ng-container *ngIf="editingProgramId !== p.id; else editProgramMode">
                  <td class="p-3 text-white font-bold">{{ p.name }}</td>
                  <td class="p-3 text-gray-400 text-xs">{{ p.description || '-' }}</td>
                  <td class="p-3 text-center">
                    <button
                      *ngIf="!isDeleteMode"
                      (click)="startEditProgram(p)"
                      class="group text-cyber-secondary hover:text-white transition-all p-2 rounded-full hover:bg-cyber-secondary/20"
                      title="Edit"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="w-5 h-5"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                        />
                      </svg>
                    </button>
                    <button
                      *ngIf="isDeleteMode"
                      (click)="confirmDeleteProgram(p)"
                      class="bg-red-500/20 text-red-500 border border-red-500/50 p-2 rounded-full hover:bg-red-600 hover:text-white transition-all shadow-[0_0_10px_rgba(239,68,68,0.4)]"
                      title="DELETE"
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
                          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                        />
                      </svg>
                    </button>
                  </td>
                </ng-container>
                <ng-template #editProgramMode>
                  <td class="p-3">
                    <input
                      [(ngModel)]="tempProgramData.name"
                      class="bg-black/50 border border-cyber-primary p-2 rounded w-full text-white text-xs"
                    />
                  </td>
                  <td class="p-3">
                    <input
                      [(ngModel)]="tempProgramData.description"
                      class="bg-black/50 border border-cyber-primary p-2 rounded w-full text-white text-xs"
                    />
                  </td>
                  <td class="p-3 text-center flex gap-2 justify-center">
                    <button
                      (click)="saveProgram(p.id)"
                      class="text-green-400 font-bold hover:text-green-300"
                    >
                      SAVE
                    </button>
                    <button (click)="cancelEditProgram()" class="text-gray-400 hover:text-white">
                      ✕
                    </button>
                  </td>
                </ng-template>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div
        *ngIf="activeTab === 'levels'"
        class="bg-gray-900/60 border border-cyber-primary/30 rounded-xl rounded-tl-none overflow-hidden backdrop-blur-md shadow-lg p-4 animate-fadeIn"
      >
        <div class="bg-black/40 border border-white/10 p-4 rounded-xl mb-6 shadow-inner">
          <label
            class="text-[10px] text-cyber-primary uppercase tracking-wider mb-3 block font-bold flex items-center gap-2"
          >
            ✨ Add Education Level
          </label>
          <div class="flex flex-col sm:flex-row gap-4 items-start">
            <div class="flex-grow w-full">
              <input
                type="text"
                [(ngModel)]="newLevel.name"
                placeholder="Level Name (e.g. M.4, Grade 10)"
                class="w-full bg-gray-900 border border-white/20 rounded px-3 py-2 text-sm text-white focus:border-cyber-primary outline-none"
              />
            </div>
            <div class="w-full sm:w-1/3">
              <input
                type="text"
                [(ngModel)]="newLevel.description"
                placeholder="Description"
                class="w-full bg-gray-900 border border-white/20 rounded px-3 py-2 text-sm text-white focus:border-cyber-primary outline-none"
              />
            </div>
            <button
              (click)="addLevel()"
              [disabled]="!newLevel.name"
              class="bg-cyber-primary text-black px-6 py-2 rounded-lg font-bold text-xs uppercase tracking-wider hover:scale-105 transition-all shadow-[0_0_15px_rgba(0,243,255,0.3)] disabled:opacity-50 h-[38px] flex items-center gap-2 whitespace-nowrap"
            >
              <span>+</span> Add
            </button>
          </div>
        </div>

        <div class="flex justify-between items-center mb-4">
          <h3
            class="text-cyber-primary font-bold uppercase tracking-wider text-sm border-l-4 border-cyber-primary pl-2"
          >
            Manage Levels
          </h3>
          <button
            (click)="toggleDeleteMode()"
            [class]="
              isDeleteMode
                ? 'bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.6)] animate-pulse'
                : 'bg-gray-800 text-gray-400 border border-gray-600 hover:bg-gray-700'
            "
            class="px-4 py-2 rounded-full font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2"
          >
            <span *ngIf="!isDeleteMode">🗑 Enter Delete Mode</span>
            <span *ngIf="isDeleteMode">🚫 Exit Delete Mode</span>
          </button>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm text-gray-300">
            <thead class="bg-gray-800 uppercase text-xs">
              <tr>
                <th class="p-3 w-16 text-center">ID</th>
                <th class="p-3">Level Name</th>
                <th class="p-3">Description</th>
                <th class="p-3 text-center w-24">{{ isDeleteMode ? 'DELETE' : 'EDIT' }}</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/5">
              <tr *ngFor="let l of levels" class="hover:bg-white/5 transition-colors">
                <td class="p-3 text-center text-gray-600 font-mono text-xs">{{ l.id }}</td>
                <ng-container *ngIf="editingLevelId !== l.id; else editLevelMode">
                  <td class="p-3 text-white font-bold">{{ l.name }}</td>
                  <td class="p-3 text-gray-400 text-xs">{{ l.description || '-' }}</td>
                  <td class="p-3 text-center">
                    <button
                      *ngIf="!isDeleteMode"
                      (click)="startEditLevel(l)"
                      class="group text-cyber-secondary hover:text-white transition-all p-2 rounded-full hover:bg-cyber-secondary/20"
                      title="Edit"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="w-5 h-5"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                        />
                      </svg>
                    </button>
                    <button
                      *ngIf="isDeleteMode"
                      (click)="confirmDeleteLevel(l)"
                      class="bg-red-500/20 text-red-500 border border-red-500/50 p-2 rounded-full hover:bg-red-600 hover:text-white transition-all shadow-[0_0_10px_rgba(239,68,68,0.4)]"
                      title="DELETE"
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
                          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                        />
                      </svg>
                    </button>
                  </td>
                </ng-container>
                <ng-template #editLevelMode>
                  <td class="p-3">
                    <input
                      [(ngModel)]="tempLevelData.name"
                      class="bg-black/50 border border-cyber-primary p-2 rounded w-full text-white text-xs"
                    />
                  </td>
                  <td class="p-3">
                    <input
                      [(ngModel)]="tempLevelData.description"
                      class="bg-black/50 border border-cyber-primary p-2 rounded w-full text-white text-xs"
                    />
                  </td>
                  <td class="p-3 text-center flex gap-2 justify-center">
                    <button
                      (click)="saveLevel(l.id)"
                      class="text-green-400 font-bold hover:text-green-300"
                    >
                      SAVE
                    </button>
                    <button (click)="cancelEditLevel()" class="text-gray-400 hover:text-white">
                      ✕
                    </button>
                  </td>
                </ng-template>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div
        *ngIf="activeTab === 'questions'"
        class="bg-gray-900/60 border border-cyber-primary/30 rounded-xl rounded-tl-none overflow-hidden backdrop-blur-md shadow-lg p-4 animate-fadeIn"
      >
        <div
          class="bg-black/40 border border-white/10 p-6 rounded-xl mb-6 shadow-inner relative overflow-hidden group"
        >
          <div
            class="absolute -right-10 -top-10 w-32 h-32 bg-cyber-primary/10 blur-[50px] rounded-full group-hover:bg-cyber-primary/20 transition-all"
          ></div>

          <label
            class="text-[12px] text-cyber-primary uppercase tracking-wider mb-4 font-bold flex items-center gap-2 border-b border-white/5 pb-2"
          >
            <span class="text-lg">✨</span> Add New Question
          </label>

          <div class="flex flex-col gap-6">
            <div class="flex gap-4">
              <div class="w-24 shrink-0">
                <label class="text-[10px] text-gray-400 uppercase mb-1 block pl-1">Order</label>
                <input
                  type="number"
                  [(ngModel)]="newQuestion.order"
                  class="w-full bg-gray-900 border border-white/20 rounded-lg px-3 py-3 text-center text-white font-bold focus:border-cyber-primary focus:ring-1 focus:ring-cyber-primary outline-none transition-all"
                />
              </div>
              <div class="flex-grow">
                <label class="text-[10px] text-gray-400 uppercase mb-1 block pl-1"
                  >Question Text</label
                >
                <input
                  type="text"
                  [(ngModel)]="newQuestion.text"
                  placeholder="Enter question description..."
                  class="w-full bg-gray-900 border border-white/20 rounded-lg px-4 py-3 text-white focus:border-cyber-primary focus:ring-1 focus:ring-cyber-primary outline-none transition-all placeholder-gray-600"
                />
              </div>
            </div>

            <div class="bg-white/5 rounded-lg p-4 border border-white/5">
              <label class="text-[10px] text-gray-400 uppercase mb-3 block flex items-center gap-2">
                ⚖️ Scoring Weights <span class="text-gray-600">(Points for each track)</span>
              </label>

              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div *ngFor="let code of allTrackCodes" class="relative group/input">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span class="text-cyber-secondary font-bold text-xs">{{ code }}</span>
                  </div>
                  <input
                    type="number"
                    [(ngModel)]="newQuestion.weights[code]"
                    placeholder="0"
                    class="w-full bg-black/50 border border-gray-600 rounded-lg pl-12 pr-3 py-2 text-right text-white font-mono focus:border-cyber-primary focus:ring-1 focus:ring-cyber-primary outline-none transition-all group-hover/input:border-white/30"
                  />
                </div>
              </div>
            </div>

            <button
              (click)="addQuestion()"
              [disabled]="!newQuestion.text"
              class="w-full bg-gradient-to-r from-cyber-primary/20 to-cyber-secondary/20 border border-cyber-primary/50 hover:border-cyber-primary text-white py-3 rounded-lg font-bold text-sm uppercase tracking-widest hover:bg-cyber-primary hover:text-black transition-all shadow-[0_0_15px_rgba(0,243,255,0.1)] hover:shadow-[0_0_30px_rgba(0,243,255,0.4)] flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="2.5"
                stroke="currentColor"
                class="w-5 h-5"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              CONFIRM ADD QUESTION
            </button>
          </div>
        </div>

        <div class="flex justify-between items-center mb-4">
          <h3
            class="text-cyber-primary font-bold uppercase tracking-wider text-sm border-l-4 border-cyber-primary pl-2"
          >
            Adjust Scoring Weights
          </h3>
          <button
            (click)="toggleDeleteMode()"
            [class]="
              isDeleteMode
                ? 'bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.6)] animate-pulse'
                : 'bg-gray-800 text-gray-400 border border-gray-600 hover:bg-gray-700'
            "
            class="px-4 py-2 rounded-full font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2"
          >
            <span *ngIf="!isDeleteMode">🗑 Enter Delete Mode</span>
            <span *ngIf="isDeleteMode">🚫 Exit Delete Mode</span>
          </button>
        </div>

        <div class="overflow-x-auto custom-scrollbar">
          <table class="w-full text-left text-sm text-gray-300">
            <thead class="bg-gray-800 uppercase text-xs">
              <tr>
                <th class="p-3 w-16 text-center">#</th>
                <th class="p-3 w-1/3">Question Text</th>
                <th
                  *ngFor="let code of allTrackCodes"
                  class="p-3 text-center text-cyber-secondary w-20"
                >
                  {{ code }}
                </th>
                <th class="p-3 text-center w-24">{{ isDeleteMode ? 'DELETE' : 'EDIT' }}</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/5">
              <tr *ngFor="let q of questions" class="hover:bg-white/5 transition-colors group">
                <ng-container *ngIf="editingQuestionId !== q.questionId; else editQMode">
                  <td class="p-3 text-center text-gray-500 font-bold">{{ q.questionOrder }}</td>
                  <td class="p-3 text-white font-medium">{{ q.questionText }}</td>
                  <td *ngFor="let code of allTrackCodes" class="p-3 text-center">
                    <span
                      [class.text-green-400]="(q.weights[code] || 0) > 0"
                      class="font-mono font-bold"
                      >{{ q.weights[code] || 0 }}</span
                    >
                  </td>
                  <td class="p-3 text-center">
                    <button
                      *ngIf="!isDeleteMode"
                      (click)="startEditQuestion(q)"
                      class="group text-cyber-secondary hover:text-white transition-all p-2 rounded-full hover:bg-cyber-secondary/20"
                      title="Edit"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="w-5 h-5"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                        />
                      </svg>
                    </button>
                    <button
                      *ngIf="isDeleteMode"
                      (click)="confirmDeleteQuestion(q)"
                      class="bg-red-500/20 text-red-500 border border-red-500/50 p-2 rounded-full hover:bg-red-600 hover:text-white transition-all shadow-[0_0_10px_rgba(239,68,68,0.4)]"
                      title="DELETE"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="2"
                        stroke="currentColor"
                        class="w-5 h-5"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                        />
                      </svg>
                    </button>
                  </td>
                </ng-container>
                <ng-template #editQMode>
                  <td class="p-3">
                    <input
                      type="number"
                      [(ngModel)]="tempQuestionData.questionOrder"
                      class="w-12 bg-black/50 border border-cyber-primary rounded text-center text-white"
                    />
                  </td>
                  <td class="p-3">
                    <textarea
                      [(ngModel)]="tempQuestionData.questionText"
                      rows="2"
                      class="w-full bg-black/50 border border-cyber-primary p-2 rounded text-white text-xs"
                    ></textarea>
                  </td>
                  <td *ngFor="let code of allTrackCodes" class="p-3 text-center">
                    <input
                      type="number"
                      [(ngModel)]="tempQuestionData.weights[code]"
                      class="w-16 bg-black/50 border border-cyber-primary p-1 rounded text-center text-cyber-primary font-bold"
                    />
                  </td>
                  <td class="p-3 text-center flex gap-2 justify-center">
                    <button
                      (click)="saveQuestion(q.questionId)"
                      class="text-green-400 font-bold hover:text-green-300"
                    >
                      SAVE
                    </button>
                    <button (click)="cancelEditQuestion()" class="text-gray-400 hover:text-white">
                      ✕
                    </button>
                  </td>
                </ng-template>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .animate-fadeIn {
        animation: fadeIn 0.4s ease-out;
      }
      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      .custom-scrollbar::-webkit-scrollbar {
        width: 6px;
      }
      .custom-scrollbar::-webkit-scrollbar-track {
        background: rgba(0, 0, 0, 0.2);
      }
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background: #333;
        border-radius: 3px;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: #00f3ff;
      }

      input[type='number']::-webkit-outer-spin-button,
      input[type='number']::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }
    `,
  ],
})
export class AdminManageComponent implements OnInit {
  activeTab: 'tracks' | 'schools' | 'questions' | 'programs' | 'levels' = 'tracks';
  isDeleteMode = false;

  // --- 1. TRACKS ---
  tracks: Track[] = [];
  editingTrackId: number | null = null;
  tempTrackData: any = {};
  newTrack: any = { trackCode: '', trackNameTh: '', trackNameEn: '', description: '' };

  // --- 2. SCHOOLS ---
  schools: School[] = [];
  editingSchoolId: number | null = null;
  tempSchoolData: any = {};
  newSchoolName = '';
  newSchoolProv = '';
  schoolSearchTerm = '';

  // --- 3. QUESTIONS ---
  questions: AdminQuestion[] = [];
  editingQuestionId: number | null = null;
  tempQuestionData: any = {};
  newQuestion: any = { order: 1, text: '', weights: {} };

  // --- 4. PROGRAMS (NEW) ---
  programs: any[] = [];
  editingProgramId: number | null = null;
  tempProgramData: any = {};
  newProgram: any = { name: '', description: '' };

  // --- 5. LEVELS (NEW) ---
  levels: any[] = [];
  editingLevelId: number | null = null;
  tempLevelData: any = {};
  newLevel: any = { name: '', description: '' };

  constructor(
    private adminService: AdminService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.checkAuth();
    this.loadTracks();
    this.loadSchools();
    this.loadPrograms(); // ✅ NEW
    this.loadLevels(); // ✅ NEW
    this.loadQuestions();
  }

  checkAuth() {
    if (!localStorage.getItem('isAdmin')) this.router.navigate(['/admin/login']);
  }
  goBack() {
    this.router.navigate(['/admin/dashboard']);
  }

  switchTab(tab: 'tracks' | 'schools' | 'questions' | 'programs' | 'levels') {
    this.activeTab = tab;
    this.isDeleteMode = false;
    this.cancelEditTrack();
    this.cancelEditSchool();
    this.cancelEditQuestion();
    this.cancelEditProgram();
    this.cancelEditLevel();
  }

  toggleDeleteMode() {
    this.isDeleteMode = !this.isDeleteMode;
    this.cancelEditTrack();
    this.cancelEditSchool();
    this.cancelEditQuestion();
    this.cancelEditProgram();
    this.cancelEditLevel();
  }

  // --- TRACKS ---
  loadTracks() {
    this.adminService.getAllTracks().subscribe((res) => {
      this.tracks = Array.isArray(res) ? res : (res as any).data || [];
      this.cdr.detectChanges();
    });
  }

  addTrack() {
    this.adminService.createTrack(this.newTrack).subscribe({
      next: () => {
        Swal.fire({
          title: 'Track Added!',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
          background: '#1a1a1a',
          color: '#fff',
        });
        this.newTrack = { trackCode: '', trackNameTh: '', trackNameEn: '', description: '' };
        this.loadTracks();
      },
      error: () => Swal.fire('Error', 'Failed to add track', 'error'),
    });
  }

  confirmDeleteTrack(t: Track) {
    this.safeDeleteConfirm(`Delete Track '${t.trackCode}'?`, t.trackNameTh, () => {
      this.adminService.deleteTrack(t.trackId).subscribe({
        next: () => {
          this.loadTracks();
          Swal.fire({
            title: 'Deleted!',
            icon: 'success',
            timer: 1000,
            showConfirmButton: false,
            background: '#1a1a1a',
            color: '#fff',
          });
        },
        error: () => Swal.fire('Error', 'Cannot delete (data might be linked)', 'error'),
      });
    });
  }

  startEditTrack(t: Track) {
    this.editingTrackId = t.trackId;
    this.tempTrackData = { ...t };
  }
  cancelEditTrack() {
    this.editingTrackId = null;
  }
  saveTrack(id: number) {
    this.adminService.updateTrack(id, this.tempTrackData).subscribe(() => {
      this.loadTracks();
      this.editingTrackId = null;
      Swal.fire({
        title: 'Saved!',
        icon: 'success',
        timer: 1000,
        showConfirmButton: false,
        background: '#1a1a1a',
        color: '#fff',
      });
    });
  }

  // --- SCHOOLS ---
  loadSchools() {
    this.adminService.getAllSchools().subscribe((res) => {
      this.schools = res || [];
      this.cdr.detectChanges();
    });
  }

  get filteredSchools() {
    if (!this.schoolSearchTerm) return this.schools;
    const term = this.schoolSearchTerm.toLowerCase();
    return this.schools.filter((s) => s.name.toLowerCase().includes(term));
  }

  confirmAddSchool() {
    this.adminService
      .createSchool({ name: this.newSchoolName, province: this.newSchoolProv })
      .subscribe(() => {
        this.newSchoolName = '';
        this.newSchoolProv = '';
        this.schoolSearchTerm = '';
        this.loadSchools();
        Swal.fire({
          title: 'Added!',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
          background: '#1a1a1a',
          color: '#fff',
        });
      });
  }

  confirmDeleteSchool(id: number, name: string) {
    this.safeDeleteConfirm(`Delete School?`, name, () => {
      this.adminService.deleteSchool(id).subscribe({
        next: () => {
          this.loadSchools();
          Swal.fire({
            title: 'Deleted!',
            icon: 'success',
            timer: 1000,
            showConfirmButton: false,
            background: '#1a1a1a',
            color: '#fff',
          });
        },
        error: () => Swal.fire('Cannot Delete!', 'School is currently used by students.', 'error'),
      });
    });
  }

  startEditSchool(s: School) {
    this.editingSchoolId = s.id;
    this.tempSchoolData = { ...s };
  }
  cancelEditSchool() {
    this.editingSchoolId = null;
  }
  saveSchool(id: number) {
    this.adminService.updateSchool(id, this.tempSchoolData).subscribe(() => {
      this.loadSchools();
      this.editingSchoolId = null;
      Swal.fire({
        title: 'Saved!',
        icon: 'success',
        timer: 1000,
        showConfirmButton: false,
        background: '#1a1a1a',
        color: '#fff',
      });
    });
  }

  // --- ✅ PROGRAMS (NEW) ---
  loadPrograms() {
    this.adminService.getAllPrograms().subscribe((res) => {
      this.programs = res || [];
      this.cdr.detectChanges();
    });
  }
  addProgram() {
    this.adminService.createProgram(this.newProgram).subscribe({
      next: () => {
        Swal.fire({
          title: 'Program Added!',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
          background: '#1a1a1a',
          color: '#fff',
        });
        this.newProgram = { name: '', description: '' };
        this.loadPrograms();
      },
      error: () => Swal.fire('Error', 'Failed to add program', 'error'),
    });
  }
  confirmDeleteProgram(p: any) {
    this.safeDeleteConfirm(`Delete Program?`, p.name, () => {
      this.adminService.deleteProgram(p.id).subscribe({
        next: () => {
          this.loadPrograms();
          Swal.fire({
            title: 'Deleted!',
            icon: 'success',
            timer: 1000,
            showConfirmButton: false,
            background: '#1a1a1a',
            color: '#fff',
          });
        },
        error: () => Swal.fire('Error', 'Cannot delete program.', 'error'),
      });
    });
  }
  startEditProgram(p: any) {
    this.editingProgramId = p.id;
    this.tempProgramData = { ...p };
  }
  cancelEditProgram() {
    this.editingProgramId = null;
  }
  saveProgram(id: number) {
    this.adminService.updateProgram(id, this.tempProgramData).subscribe(() => {
      this.loadPrograms();
      this.editingProgramId = null;
      Swal.fire({
        title: 'Saved!',
        icon: 'success',
        timer: 1000,
        showConfirmButton: false,
        background: '#1a1a1a',
        color: '#fff',
      });
    });
  }

  // --- ✅ LEVELS (NEW) ---
  loadLevels() {
    this.adminService.getAllLevels().subscribe((res) => {
      this.levels = res || [];
      this.cdr.detectChanges();
    });
  }
  addLevel() {
    this.adminService.createLevel(this.newLevel).subscribe({
      next: () => {
        Swal.fire({
          title: 'Level Added!',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
          background: '#1a1a1a',
          color: '#fff',
        });
        this.newLevel = { name: '', description: '' };
        this.loadLevels();
      },
      error: () => Swal.fire('Error', 'Failed to add level', 'error'),
    });
  }
  confirmDeleteLevel(l: any) {
    this.safeDeleteConfirm(`Delete Level?`, l.name, () => {
      this.adminService.deleteLevel(l.id).subscribe({
        next: () => {
          this.loadLevels();
          Swal.fire({
            title: 'Deleted!',
            icon: 'success',
            timer: 1000,
            showConfirmButton: false,
            background: '#1a1a1a',
            color: '#fff',
          });
        },
        error: () => Swal.fire('Error', 'Cannot delete level.', 'error'),
      });
    });
  }
  startEditLevel(l: any) {
    this.editingLevelId = l.id;
    this.tempLevelData = { ...l };
  }
  cancelEditLevel() {
    this.editingLevelId = null;
  }
  saveLevel(id: number) {
    this.adminService.updateLevel(id, this.tempLevelData).subscribe(() => {
      this.loadLevels();
      this.editingLevelId = null;
      Swal.fire({
        title: 'Saved!',
        icon: 'success',
        timer: 1000,
        showConfirmButton: false,
        background: '#1a1a1a',
        color: '#fff',
      });
    });
  }

  // --- QUESTIONS ---
  loadQuestions() {
    this.adminService.getAllQuestionsAdmin().subscribe((res) => {
      this.questions = res || [];
      this.questions.sort((a, b) => a.questionOrder - b.questionOrder);
      const maxOrder =
        this.questions.length > 0 ? Math.max(...this.questions.map((q) => q.questionOrder)) : 0;
      this.newQuestion.order = maxOrder + 1;
      this.cdr.detectChanges();
    });
  }

  addQuestion() {
    this.adminService
      .createQuestion({
        questionOrder: this.newQuestion.order,
        questionText: this.newQuestion.text,
        weights: this.newQuestion.weights,
      })
      .subscribe({
        next: () => {
          Swal.fire({
            title: 'Added!',
            icon: 'success',
            timer: 1000,
            showConfirmButton: false,
            background: '#1a1a1a',
            color: '#fff',
          });
          this.newQuestion.text = '';
          this.newQuestion.weights = {};
          this.loadQuestions();
        },
        error: () => Swal.fire('Error', 'Failed to add question', 'error'),
      });
  }

  confirmDeleteQuestion(q: AdminQuestion) {
    this.safeDeleteConfirm(`Delete Question #${q.questionOrder}?`, q.questionText, () => {
      this.adminService.deleteQuestion(q.questionId).subscribe({
        next: () => {
          this.loadQuestions();
          Swal.fire({
            title: 'Deleted!',
            icon: 'success',
            timer: 1000,
            showConfirmButton: false,
            background: '#1a1a1a',
            color: '#fff',
          });
        },
        error: () => Swal.fire('Error', 'Could not delete question.', 'error'),
      });
    });
  }

  startEditQuestion(q: AdminQuestion) {
    this.editingQuestionId = q.questionId;
    this.tempQuestionData = { ...q, weights: { ...q.weights } };
  }
  cancelEditQuestion() {
    this.editingQuestionId = null;
    this.tempQuestionData = {};
  }
  saveQuestion(id: number) {
    this.adminService.updateQuestion(id, this.tempQuestionData).subscribe(() => {
      this.loadQuestions();
      this.editingQuestionId = null;
      Swal.fire({
        title: 'Saved!',
        icon: 'success',
        timer: 1000,
        showConfirmButton: false,
        background: '#1a1a1a',
        color: '#fff',
      });
    });
  }

  // --- HELPERS ---
  get allTrackCodes(): string[] {
    return this.tracks.map((t) => t.trackCode);
  }

  highlightText(text: string, term: string): string {
    if (!term) return text;
    const re = new RegExp(`(${term})`, 'gi');
    return text.replace(
      re,
      '<span class="text-cyber-primary font-bold border-b border-cyber-primary">$1</span>',
    );
  }

  safeDeleteConfirm(title: string, itemName: string, callback: () => void) {
    Swal.fire({
      title: title,
      html: `
        You are about to delete: <br/>
        <b style="color: #ef4444">${itemName}</b><br/><br/>
        This action cannot be undone.<br/>
        Type <b>DELETE</b> to confirm.
      `,
      input: 'text',
      inputPlaceholder: 'Type DELETE',
      showCancelButton: true,
      confirmButtonText: 'I understand, delete it',
      confirmButtonColor: '#d33',
      background: '#1a1a1a',
      color: '#fff',
      customClass: { input: 'bg-gray-800 text-white border-gray-600' },
      preConfirm: (inputValue) => {
        if (inputValue !== 'DELETE') Swal.showValidationMessage('Type DELETE to confirm!');
      },
    }).then((result) => {
      if (result.isConfirmed) callback();
    });
  }
}
