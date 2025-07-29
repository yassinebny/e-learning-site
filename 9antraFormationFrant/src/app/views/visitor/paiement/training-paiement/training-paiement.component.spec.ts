import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingPaiementComponent } from './training-paiement.component';

describe('TrainingPaiementComponent', () => {
  let component: TrainingPaiementComponent;
  let fixture: ComponentFixture<TrainingPaiementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrainingPaiementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrainingPaiementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
