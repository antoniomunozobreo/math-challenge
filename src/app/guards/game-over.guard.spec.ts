import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { gameOverGuard } from './game-over.guard';

describe('gameOverGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => gameOverGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
