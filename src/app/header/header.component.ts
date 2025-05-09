import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VolumeService } from '../volume.service';

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

  constructor(private volumeService: VolumeService) {}

  ngAfterViewInit() {
    this.soundSlider.nativeElement.addEventListener('input', () => {
      const value = Number(this.soundSlider.nativeElement.value);
      this.isMuted = value === 0;
      const volume = value / 100; // Convert 0-100 to 0-1 for HTMLAudioElement volume
      this.volumeService.setVolume(volume);
    });
  }
}