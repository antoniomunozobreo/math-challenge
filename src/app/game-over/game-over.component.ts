import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-game-over',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: './game-over.component.html',
  styleUrls: ['./game-over.component.scss']
})
export class GameOverComponent {
  @Input() operations: { left: number; right: number; operator: string; result: number; selectedAnswer: number }[] = [];
  @Input() score: number = 0;

  constructor(private router: Router) {}

  playAgain() {
    this.router.navigate(['game']);
  }

  goToMenu() {
    this.router.navigate(['']);
  }

  goToStats() {
    this.router.navigate(['stats']);
  }
}