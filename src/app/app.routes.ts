import { Routes } from '@angular/router';
import { GameComponent } from './game/game.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { MenuComponent } from './menu/menu.component';

export const routes: Routes = [
  { path: '', component: MenuComponent },
  { path: 'game', component: GameComponent },
  { path: '**', component: PageNotFoundComponent }
];