import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-answer-options',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './answer-options.component.html',
  styleUrls: ['./answer-options.component.scss']
})
export class AnswerOptionsComponent implements OnChanges {
  @Input() options: number[] = [];
  @Input() correctAnswer: number = 0;
  @Output() answerSelected = new EventEmitter<number>();
  incorrectAnswer: number | null = null;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['options']) {
      this.incorrectAnswer = null;
    }
  }

  selectAnswer(answer: number) {
    if (answer !== this.correctAnswer) {
      this.incorrectAnswer = answer;
      setTimeout(() => {
        this.incorrectAnswer = null;
      }, 1000);
    }
    this.answerSelected.emit(answer);
  }
}