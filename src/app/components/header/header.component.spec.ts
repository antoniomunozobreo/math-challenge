import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements AfterViewInit {
  @ViewChild('soundSlider') soundSlider!: ElementRef<HTMLInputElement>;
  isMuted = false;

  ngAfterViewInit() {
    this.soundSlider.nativeElement.addEventListener('input', () => {
      const value = Number(this.soundSlider.nativeElement.value);
      this.isMuted = value === 0;
    });
  }
}