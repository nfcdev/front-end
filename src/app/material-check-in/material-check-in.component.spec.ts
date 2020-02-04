import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialCheckInComponent } from './material-check-in.component';

describe('MaterialCheckInComponent', () => {
  let component: MaterialCheckInComponent;
  let fixture: ComponentFixture<MaterialCheckInComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialCheckInComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialCheckInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
