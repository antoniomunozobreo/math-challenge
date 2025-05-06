import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { inject } from '@angular/core';

@Component({
  selector: 'app-menu',
  standalone: true,
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {
  @Input() titulo: string = 'Menú';
  private router = inject(Router);

  jugar() {
    this.router.navigateByUrl('/game');
  }

  estadisticas() {
    console.log('Estadísticas');
  }
}