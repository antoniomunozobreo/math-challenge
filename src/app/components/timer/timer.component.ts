import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, Inject } from '@angular/core';

@Component({
  selector: 'app-timer',
  standalone: true,
  template: `
    <div class="timer">Tiempo: {{ timeLeft }}</div>
  `,
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent implements OnInit, OnDestroy, OnChanges {
  @Input() timeLeft: number = 60;
  @Input() isPaused: boolean = false;
  @Output() timeUp = new EventEmitter<void>();

  private timerInterval: any = null;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.startTimer();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isPaused']) {
      if (this.isPaused) {
        this.pauseTimer();
      } else if (isPlatformBrowser(this.platformId)) {
        this.resumeTimer();
      }
    }
  }

  ngOnDestroy(): void {
    this.clearTimer();
  }

  private startTimer(): void {
    if (!this.timerInterval && this.timeLeft > 0) {
      this.timerInterval = setInterval(() => {
        if (!this.isPaused && this.timeLeft > 0) {
          this.timeLeft--;
          if (this.timeLeft <= 0) {
            this.clearTimer();
            this.timeUp.emit();
          }
        }
      }, 1000);
    }
  }

  private pauseTimer(): void {
    this.clearTimer();
  }

  private resumeTimer(): void {
    if (!this.timerInterval && this.timeLeft > 0) {
      this.startTimer();
    }
  }

  private clearTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }
}