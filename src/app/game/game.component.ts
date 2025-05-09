import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { TimerComponent } from '../timer/timer.component';
import { OperationComponent } from '../operation/operation.component';
import { AnswerOptionsComponent } from '../answer-options/answer-options.component';
import { HeaderComponent } from '../header/header.component';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, Inject } from '@angular/core';
import { VolumeService } from '../volume.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [HeaderComponent, TimerComponent, OperationComponent, AnswerOptionsComponent],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit, AfterViewInit, OnDestroy {
  score = 0;
  lives = 3;
  currentOperation = { left: 0, right: 0, operator: '+', result: 0 };
  answerOptions: number[] = [];
  correctAnswer: number = 0;
  timeLeft = 185;
  private correctSound: HTMLAudioElement | null = null;
  private wrongSound: HTMLAudioElement | null = null;
  private volumeSubscription: Subscription | null = null;
  private resolvedOperations: { left: number; right: number; operator: string; result: number; selectedAnswer: number }[] = [];
  private startTime: number = 0;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private volumeService: VolumeService,
    private router: Router
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.correctSound = new Audio('/assets/correct.wav');
      this.wrongSound = new Audio('/assets/wrong.wav');
      this.correctSound.volume = 0.5;
      this.wrongSound.volume = 0.5;
      this.volumeSubscription = this.volumeService.volume$.subscribe(volume => {
        if (this.correctSound) this.correctSound.volume = volume;
        if (this.wrongSound) this.wrongSound.volume = volume;
      });
      this.startTime = Date.now();
    }
    this.loadVolume();
    this.generateOperation();
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId) && !this.correctSound) {
      this.correctSound = new Audio('/assets/correct.wav');
      this.wrongSound = new Audio('/assets/wrong.wav');
      this.correctSound.volume = 0.5;
      this.wrongSound.volume = 0.5;
    }
  }

  ngOnDestroy() {
    if (this.volumeSubscription) {
      this.volumeSubscription.unsubscribe();
    }
    this.saveStats();
  }

  loadVolume() {
    if (isPlatformBrowser(this.platformId)) {
      const savedVolume = localStorage.getItem('volume');
      if (savedVolume !== null) {
        const volume = parseFloat(savedVolume);
        this.volumeService.setVolume(volume);
        if (this.correctSound) this.correctSound.volume = volume;
        if (this.wrongSound) this.wrongSound.volume = volume;
      }
    }
  }

  saveStats() {
    if (isPlatformBrowser(this.platformId)) {
      const playTime = Math.floor((Date.now() - this.startTime) / 1000); // Seconds
      const stats = localStorage.getItem('gameStats');
      let gameStats = stats ? JSON.parse(stats) : { totalPlayTime: 0, totalOperationsResolved: 0, highestScore: 0 };
      gameStats.totalPlayTime += playTime;
      gameStats.totalOperationsResolved += this.score;
      gameStats.highestScore = Math.max(gameStats.highestScore, this.score);
      localStorage.setItem('gameStats', JSON.stringify(gameStats));
    }
  }

  generateOperation() {
    const operators = ['+', '-', '*', '/'];
    this.currentOperation.operator = operators[Math.floor(Math.random() * operators.length)];
    this.currentOperation.left = Math.floor(Math.random() * 12) + 1;
    this.currentOperation.right = Math.floor(Math.random() * 12) + 1;

    switch (this.currentOperation.operator) {
      case '+':
        this.currentOperation.result = this.currentOperation.left + this.currentOperation.right;
        break;
      case '-':
        this.currentOperation.result = this.currentOperation.left - this.currentOperation.right;
        if (this.currentOperation.result < 0) this.currentOperation.result = Math.abs(this.currentOperation.result);
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

    this.answerOptions = [this.correctAnswer];
    while (this.answerOptions.length < 4) {
      const wrongAnswer = this.correctAnswer + (Math.floor(Math.random() * 10) - 5);
      if (wrongAnswer > 0 && wrongAnswer !== this.correctAnswer && !this.answerOptions.includes(wrongAnswer)) {
        this.answerOptions.push(wrongAnswer);
      }
    }
    this.answerOptions.sort(() => Math.random() - 0.5);
  }

  checkAnswer(selectedAnswer: number) {
    const operationRecord = { ...this.currentOperation, selectedAnswer };
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

  endGame() {
    this.saveStats();
    this.router.navigate(['game-over'], { state: { operations: this.resolvedOperations, score: this.score } });
  }

  timeUp() {
    this.endGame();
  }
}