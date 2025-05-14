import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, Inject } from '@angular/core';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent implements OnInit {
  totalPlayTime: number = 0;
  totalOperationsResolved: number = 0;
  highestScore: number = 0;

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    if (isPlatformBrowser(this.platformId)) {
      const stats = localStorage.getItem('gameStats');
      if (stats) {
        const parsedStats = JSON.parse(stats);
        this.totalPlayTime = parsedStats.totalPlayTime || 0;
        this.totalOperationsResolved = parsedStats.totalOperationsResolved || 0;
        this.highestScore = parsedStats.highestScore || 0;
      }
    }
  }

  goToMenu() {
    this.router.navigate(['']);
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  }
}