import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckInDublcateComponent } from './check-in-dublcate.component';

describe('CheckInDublcateComponent', () => {
  let component: CheckInDublcateComponent;
  let fixture: ComponentFixture<CheckInDublcateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckInDublcateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckInDublcateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
