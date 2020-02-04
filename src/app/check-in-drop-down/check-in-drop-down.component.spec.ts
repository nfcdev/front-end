import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckInDropDownComponent } from './check-in-drop-down.component';

describe('CheckInDropDownComponent', () => {
  let component: CheckInDropDownComponent;
  let fixture: ComponentFixture<CheckInDropDownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckInDropDownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckInDropDownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
