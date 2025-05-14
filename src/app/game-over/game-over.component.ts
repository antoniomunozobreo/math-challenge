import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
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
  operations: { left: number; right: number; operator: string; result: number; selectedAnswer: number }[] = [];
  score: number = 0;

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    // Try to get state from navigation
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.operations = navigation.extras.state['operations'] || [];
      this.score = navigation.extras.state['score'] || 0;
      console.log('Loaded operations from navigation:', this.operations);
      console.log('Loaded score from navigation:', this.score);
    } else {
      console.log('No state data found in navigation, trying history.state');
      // Fallback to history.state
      const state = history.state;
      if (state && (state.operations || state.score)) {
        this.operations = state.operations || [];
        this.score = state.score || 0;
        console.log('Loaded operations from history.state:', this.operations);
        console.log('Loaded score from history.state:', this.score);
      } else {
        console.log('No state data in history.state, trying localStorage');

        if (isPlatformBrowser(this.platformId)) {
          const lastGame = localStorage.getItem('lastGame');
          if (lastGame) {
            const gameData = JSON.parse(lastGame);
            this.operations = gameData.operations || [];
            this.score = gameData.score || 0;
            console.log('Loaded operations from localStorage:', this.operations);
            console.log('Loaded score from localStorage:', this.score);
          } else {
            console.error('No game data found in localStorage');
          }
        }
      }
    }
  }

  playAgain() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('lastGame'); // Clean up
    }
    this.router.navigate(['game']);
  }

  goToMenu() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('lastGame');
    }
    this.router.navigate(['']);
  }

  goToStats() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('lastGame');
    }
    this.router.navigate(['stats']);
  }
}