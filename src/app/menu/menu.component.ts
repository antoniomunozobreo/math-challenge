import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {
  @Input() titulo: string = 'Menú';
  constructor(private router: Router) {}

  play() {
    this.router.navigate(['game']);
  }

  stats() {
    this.router.navigate(['stats']);
  }
}