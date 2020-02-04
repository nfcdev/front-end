import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckOutPreselectedComponent } from './check-out-preselected.component';

describe('CheckOutPreselectedComponent', () => {
  let component: CheckOutPreselectedComponent;
  let fixture: ComponentFixture<CheckOutPreselectedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckOutPreselectedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckOutPreselectedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
