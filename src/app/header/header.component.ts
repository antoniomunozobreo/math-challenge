import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VolumeService } from '../services/volume.service';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements AfterViewInit {
  @ViewChild('soundSlider') soundSlider!: ElementRef<HTMLInputElement>;
  isMuted = false;

  constructor(
    private volumeService: VolumeService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      const savedVolume = localStorage.getItem('volume');
      if (savedVolume !== null) {
        const volume = parseFloat(savedVolume) * 100;
        this.soundSlider.nativeElement.value = volume.toString();
        this.isMuted = volume === 0;
      }
      this.soundSlider.nativeElement.addEventListener('input', () => {
        const value = Number(this.soundSlider.nativeElement.value);
        this.isMuted = value === 0;
        const volume = value / 100;
        this.volumeService.setVolume(volume);
      });
    }
  }
}