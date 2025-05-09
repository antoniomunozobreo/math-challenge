import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VolumeService {
  private volumeSubject = new BehaviorSubject<number>(0.5);
  volume$ = this.volumeSubject.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      const savedVolume = localStorage.getItem('volume');
      if (savedVolume !== null) {
        this.volumeSubject.next(parseFloat(savedVolume));
      }
    }
  }

  setVolume(volume: number) {
    this.volumeSubject.next(volume);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('volume', volume.toString());
    }
  }
}