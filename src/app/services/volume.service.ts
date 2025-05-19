import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, Inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VolumeService {
  private volumeSubject = new BehaviorSubject<number>(0.5);
  public volume$ = this.volumeSubject.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      const savedVolume = localStorage.getItem('volume');
      if (savedVolume !== null) {
        this.volumeSubject.next(parseFloat(savedVolume));
      }
    }
  }

  public setVolume(volume: number): void {
    this.volumeSubject.next(volume);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('volume', volume.toString());
    }
  }

  public getVolume(): number {
    return this.volumeSubject.getValue();
  }
}