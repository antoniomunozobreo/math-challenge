import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatsComponent implements OnInit {
  public totalPlayTime: number = 0;
  public totalOperationsResolved: number = 0;
  public highestScore: number = 0;

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
    private cdr: ChangeDetectorRef
  ) {}

  public ngOnInit(): void {
    this.loadStats();
  }

  private loadStats(): void {
    if (isPlatformBrowser(this.platformId)) {
      const stats: string | null = localStorage.getItem('gameStats');
      if (stats) {
        const parsedStats: { totalPlayTime?: number; totalOperationsResolved?: number; highestScore?: number } = JSON.parse(stats);
        this.totalPlayTime = parsedStats.totalPlayTime || 0;
        this.totalOperationsResolved = parsedStats.totalOperationsResolved || 0;
        this.highestScore = parsedStats.highestScore || 0;
        this.cdr.markForCheck();
      }
    }
  }

  public goToMenu(): void {
    this.router.navigate(['']);
  }

  public formatTime(seconds: number): string {
    const minutes: number = Math.floor(seconds / 60);
    const remainingSeconds: number = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  }
}