import { Routes } from '@angular/router';
import { GameComponent } from './pages/game/game.component';
import { GameOverComponent } from './pages/game-over/game-over.component';
import { MenuComponent } from './pages/menu/menu.component';
import { StatsComponent } from './pages/stats/stats.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
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