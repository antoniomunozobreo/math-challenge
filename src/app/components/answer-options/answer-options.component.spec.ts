import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnswerOptionsComponent } from './answer-options.component';

describe('AnswerOptionsComponent', () => {
  let component: AnswerOptionsComponent;
  let fixture: ComponentFixture<AnswerOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnswerOptionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnswerOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
