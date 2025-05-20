import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../components/header/header.component';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, Inject } from '@angular/core';

@Component({
  selector: 'app-game-over',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: './game-over.component.html',
  styleUrls: ['./game-over.component.scss']
})
export class GameOverComponent implements OnInit {
  public operations: { left: number; right: number; operator: string; result: number; selectedAnswer: number }[] = [];
  public score: number = 0;

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  public ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const navigation = this.router.getCurrentNavigation();
      let gameData: { operations?: { left: number; right: number; operator: string; result: number; selectedAnswer: number }[]; score?: number } | null = null;

      if (navigation?.extras.state) {
        gameData = navigation.extras.state as { operations?: { left: number; right: number; operator: string; result: number; selectedAnswer: number }[]; score?: number };
        console.log('Loaded data from navigation:', gameData);
      } else {
        const lastGame = localStorage.getItem('lastGame');
        if (lastGame) {
          gameData = JSON.parse(lastGame);
          console.log('Loaded data from localStorage:', gameData);
        } else {
          console.error('No valid game data found, redirecting to 404');
          this.router.navigate(['/404']);
          return;
        }
      }

      if (gameData) {
        this.operations = gameData.operations || [];
        this.score = gameData.score || 0;
        localStorage.removeItem('lastGame');
        console.log('Assigned operations:', this.operations, 'Assigned score:', this.score);
      } else {
        console.error('gameData is null, redirecting to 404');
        this.router.navigate(['/404']);
      }
    } else {
      this.router.navigate(['/404']);
    }
  }

  public playAgain(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('lastGame');
    }
    this.router.navigate(['game']);
  }

  public goToMenu(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('lastGame');
    }
    this.router.navigate(['']);
  }

  public goToStats(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('lastGame');
    }
    this.router.navigate(['stats']);
  }
}