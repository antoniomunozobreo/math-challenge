import { Component, Output, EventEmitter, OnInit, OnDestroy, PLATFORM_ID, Input, OnChanges, SimpleChanges } from '@angular/core';
   import { inject } from '@angular/core';
   import { isPlatformBrowser } from '@angular/common';

   @Component({
     selector: 'app-timer',
     standalone: true,
     templateUrl: './timer.component.html',
     styleUrls: ['./timer.component.scss']
   })
   export class TimerComponent implements OnInit, OnDestroy, OnChanges {
     @Input() timeLeft = 185;
     @Output() timeUp = new EventEmitter<void>();
     private intervalId: any;
     private platformId: Object;

     constructor() {
       this.platformId = inject(PLATFORM_ID);
     }

     ngOnInit() {
       this.startTimer();
     }

     ngOnChanges(changes: SimpleChanges) {
       if (changes['timeLeft'] && !changes['timeLeft'].firstChange) {
         if (this.intervalId) {
           clearInterval(this.intervalId);
         }
         this.startTimer();
       }
     }

     startTimer() {
       if (isPlatformBrowser(this.platformId)) {
         this.intervalId = setInterval(() => {
           this.timeLeft--;
           if (this.timeLeft <= 0) {
             clearInterval(this.intervalId);
             this.timeUp.emit();
           }
         }, 1000);
       }
     }

     ngOnDestroy() {
       if (this.intervalId) {
         clearInterval(this.intervalId);
       }
     }
   }