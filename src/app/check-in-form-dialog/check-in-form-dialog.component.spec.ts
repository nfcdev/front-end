import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckInFormDialogComponent } from './check-in-form-dialog.component';

describe('CheckInFormDialogComponent', () => {
  let component: CheckInFormDialogComponent;
  let fixture: ComponentFixture<CheckInFormDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckInFormDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckInFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
