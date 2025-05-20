import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-operation',
  standalone: true,
  templateUrl: './operation.component.html',
  styleUrls: ['./operation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OperationComponent {
  @Input() public operation: { left: number; right: number; operator: string; result: number } = { left: 0, right: 0, operator: '+', result: 0 };
}