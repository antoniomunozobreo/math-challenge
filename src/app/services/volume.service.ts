import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VolumeService {
  private volumeSubject = new BehaviorSubject<number>(0.5);
  volume$: Observable<number> = this.volumeSubject.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      const savedVolume = localStorage.getItem('volume');
      if (savedVolume !== null) {
        const volume = parseFloat(savedVolume);
        this.volumeSubject.next(volume);
        console.log('Loaded volume from localStorage:', volume);
      } else {
        console.log('No saved volume found, using default 0.5');
      }
    }
  }

  setVolume(volume: number) {
    if (volume >= 0 && volume <= 1) {
      this.volumeSubject.next(volume);
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('volume', volume.toString());
        console.log('Saved volume to localStorage:', volume);
      }
    }
  }

  getVolume(): number {
    return this.volumeSubject.getValue();
  }
}