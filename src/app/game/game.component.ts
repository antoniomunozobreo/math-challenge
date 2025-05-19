import { Component, OnInit, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { TimerComponent } from '../timer/timer.component';
import { OperationComponent } from '../operation/operation.component';
import { AnswerOptionsComponent } from '../answer-options/answer-options.component';
import { HeaderComponent } from '../header/header.component';
import { CommonModule } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, Inject } from '@angular/core';
import { VolumeService } from '../services/volume.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, HeaderComponent, TimerComponent, OperationComponent, AnswerOptionsComponent],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit, AfterViewInit, OnDestroy {
  public score: number = 0;
  public lives: number = 3;
  public currentOperation: { left: number; right: number; operator: string; result: number } = { left: 0, right: 0, operator: '+', result: 0 };
  public answerOptions: number[] = [];
  public correctAnswer: number = 0;
  public timeLeft: number = 60;
  public isPaused: boolean = false;
  public showInstructions: boolean = false;

  private correctSound: HTMLAudioElement | null = null;
  private wrongSound: HTMLAudioElement | null = null;
  private volumeSubscription: Subscription | null = null;
  private resolvedOperations: { left: number; right: number; operator: string; result: number; selectedAnswer: number }[] = [];
  private startTime: number = 0;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private volumeService: VolumeService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  public ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.showInstructions = true;

      this.correctSound = new Audio('/assets/correct.wav');
      this.wrongSound = new Audio('/assets/wrong.wav');
      this.loadVolumeToAudio();
      this.volumeSubscription = this.volumeService.volume$.subscribe((volume: number) => {
        this.loadVolumeToAudio(volume);
      });
      this.startTime = Date.now();
      if (!this.showInstructions) {
        this.generateOperation();
      }
    } else {
      this.currentOperation = { left: 0, right: 0, operator: '+', result: 0 };
      this.answerOptions = [];
      this.correctAnswer = 0;
    }
  }

  public ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId) && !this.correctSound) {
      this.correctSound = new Audio('/assets/correct.wav');
      this.wrongSound = new Audio('/assets/wrong.wav');
      this.loadVolumeToAudio();
    }
  }

  public ngOnDestroy(): void {
    if (this.volumeSubscription) {
      this.volumeSubscription.unsubscribe();
    }
    if (isPlatformBrowser(this.platformId)) {
      this.saveStats();
    }
  }

  private loadVolumeToAudio(volume?: number): void {
    if (isPlatformBrowser(this.platformId)) {
      const currentVolume: number = volume !== undefined ? volume : this.volumeService.getVolume();
      if (this.correctSound) this.correctSound.volume = currentVolume;
      if (this.wrongSound) this.wrongSound.volume = currentVolume;
      console.log('Applied volume to audio:', currentVolume);
    }
  }

  private saveStats(): void {
    if (isPlatformBrowser(this.platformId)) {
      const playTime: number = Math.floor((Date.now() - this.startTime) / 1000);
      const stats: string | null = localStorage.getItem('gameStats');
      let gameStats: { totalPlayTime: number; totalOperationsResolved: number; highestScore: number } = stats
        ? JSON.parse(stats)
        : { totalPlayTime: 0, totalOperationsResolved: 0, highestScore: 0 };
      gameStats.totalPlayTime += playTime;
      gameStats.totalOperationsResolved += this.score;
      gameStats.highestScore = Math.max(gameStats.highestScore, this.score);
      localStorage.setItem('gameStats', JSON.stringify(gameStats));
    }
  }

  private generateOperation(): void {
    const operators: string[] = ['+', '-', '*', '/'];
    this.currentOperation = {
      left: Math.floor(Math.random() * 12) + 1,
      right: Math.floor(Math.random() * 12) + 1,
      operator: operators[Math.floor(Math.random() * operators.length)],
      result: 0
    };

    switch (this.currentOperation.operator) {
      case '+':
        this.currentOperation.result = this.currentOperation.left + this.currentOperation.right;
        break;
      case '-':
        this.currentOperation.result = this.currentOperation.left - this.currentOperation.right;
        break;
      case '*':
        this.currentOperation.result = this.currentOperation.left * this.currentOperation.right;
        break;
      case '/':
        this.currentOperation.right = Math.floor(Math.random() * 12) + 1;
        this.currentOperation.result = Math.floor(Math.random() * 12) + 1;
        this.currentOperation.left = this.currentOperation.result * this.currentOperation.right;
        break;
    }

    this.correctAnswer = this.currentOperation.result;

    const optionsSet: Set<number> = new Set([this.correctAnswer]);
    for (let i = 0; i < 3; i++) {
      let wrongAnswer: number;
      let foundUnique = false;
      for (let attempt = 0; attempt < 10 && !foundUnique; attempt++) {
        wrongAnswer = this.correctAnswer + (Math.floor(Math.random() * 10) - 5);
        if (!optionsSet.has(wrongAnswer)) {
          foundUnique = true;
          optionsSet.add(wrongAnswer);
        }
      }
    }
    this.answerOptions = Array.from(optionsSet).sort(() => Math.random() - 0.5);
    this.cdr.detectChanges();
  }

  public checkAnswer(selectedAnswer: number): void {
    if (!this.isPaused && !this.showInstructions) {
      const operationRecord: { left: number; right: number; operator: string; result: number; selectedAnswer: number } = { ...this.currentOperation, selectedAnswer };
      this.resolvedOperations.push(operationRecord);

      if (selectedAnswer === this.correctAnswer) {
        this.score += 1;
        if (this.correctSound) this.correctSound.play();
        this.generateOperation();
      } else {
        this.lives -= 1;
        if (this.wrongSound) this.wrongSound.play();
        this.timeLeft = Math.max(0, this.timeLeft - 10);
        if (this.lives <= 0) {
          this.endGame();
        }
      }
    }
  }

  public endGame(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.saveStats();
      console.log('Navigating to game-over with score:', this.score);
      localStorage.setItem('lastGame', JSON.stringify({ operations: this.resolvedOperations, score: this.score }));
    }
    this.router.navigate(['game-over'], { state: { operations: this.resolvedOperations, score: this.score } });
  }

  public timeUp(): void {
    this.endGame();
  }

  public getLivesArray(): number[] {
    return Array.from({ length: this.lives }, (_, index) => index);
  }

  public togglePause(): void {
    if (!this.showInstructions) {
      this.isPaused = !this.isPaused;
      console.log('Game paused:', this.isPaused);
    }
  }

  public resumeGame(): void {
    this.isPaused = false;
  }

  public goToStats(): void {
    this.isPaused = false;
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('lastGame');
    }
    this.router.navigate(['stats']);
  }

  public goToMenu(): void {
    this.isPaused = false;
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('lastGame');
    }
    this.router.navigate(['']);
  }

  public startGame(): void {
    this.showInstructions = false;
    this.generateOperation();
  }
}