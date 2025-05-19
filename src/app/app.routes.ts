import { Routes } from '@angular/router';
import { GameComponent } from './game/game.component';
import { GameOverComponent } from './game-over/game-over.component';
import { MenuComponent } from './menu/menu.component';
import { StatsComponent } from './stats/stats.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { GameOverGuard } from './guards/game-over.guard';

export const routes: Routes = [
  { path: 'menu', component: MenuComponent },
  { path: 'game', component: GameComponent },
  { path: 'game-over', component: GameOverComponent, canActivate: [GameOverGuard] },
  { path: '404', component: PageNotFoundComponent },
   { path: 'stats', component: StatsComponent },
  { path: '', redirectTo: '/menu', pathMatch: 'full' },
  { path: '**', redirectTo: '/404' }
];