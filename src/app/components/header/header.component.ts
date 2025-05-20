import { Component, AfterViewInit, ElementRef, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VolumeService } from '../../services/volume.service';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush // Optimización de change detection
})
export class HeaderComponent implements AfterViewInit {
  @ViewChild('soundSlider') private soundSlider!: ElementRef<HTMLInputElement>;
  public isMuted: boolean = false;

  constructor(
    private volumeService: VolumeService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private cdr: ChangeDetectorRef
  ) {}

  public ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const savedVolume: string | null = localStorage.getItem('volume');
      if (savedVolume !== null) {
        const volume: number = parseFloat(savedVolume) * 100;
        this.soundSlider.nativeElement.value = volume.toString();
        this.isMuted = volume === 0;
        this.cdr.markForCheck(); // Forzar detección de cambios con OnPush
      }
      this.soundSlider.nativeElement.addEventListener('input', () => {
        const value: number = Number(this.soundSlider.nativeElement.value);
        this.isMuted = value === 0;
        const volume: number = value / 100;
        this.volumeService.setVolume(volume);
        this.cdr.markForCheck(); // Actualizar la UI después del cambio
      });
    }
  }
}