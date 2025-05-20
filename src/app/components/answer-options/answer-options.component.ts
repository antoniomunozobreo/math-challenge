import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, Inject } from '@angular/core';

@Component({
  selector: 'app-answer-options',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './answer-options.component.html',
  styleUrls: ['./answer-options.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnswerOptionsComponent implements OnChanges {
  @Input() public options: number[] = [];
  @Input() public correctAnswer: number = 0;
  @Input() public disabled: boolean = false;
  @Output() public answerSelected: EventEmitter<number> = new EventEmitter<number>();
  public incorrectAnswer: number | null = null;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private cdr: ChangeDetectorRef
  ) {}

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['options']) {
      this.incorrectAnswer = null;
      this.cdr.markForCheck();
    }
  }

  public selectAnswer(answer: number): void {
    if (!this.disabled && answer !== this.correctAnswer) {
      this.incorrectAnswer = answer;
      if (isPlatformBrowser(this.platformId)) {
        setTimeout(() => {
          this.incorrectAnswer = null;
          this.cdr.markForCheck();
        }, 1000);
      }
    }
    if (!this.disabled) {
      this.answerSelected.emit(answer);
    }
  }
}