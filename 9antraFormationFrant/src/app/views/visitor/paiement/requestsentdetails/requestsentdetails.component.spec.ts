import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestsentdetailsComponent } from './requestsentdetails.component';

describe('RequestsentdetailsComponent', () => {
  let component: RequestsentdetailsComponent;
  let fixture: ComponentFixture<RequestsentdetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestsentdetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestsentdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
