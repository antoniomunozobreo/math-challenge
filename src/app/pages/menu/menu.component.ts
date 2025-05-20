import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuComponent {
  @Input() public titulo: string = 'Menú';

  constructor(private router: Router) {}

  public play(): void {
    this.router.navigate(['game']);
  }

  public stats(): void {
    this.router.navigate(['stats']);
  }
}