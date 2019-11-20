import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialCheckOutComponent } from './material-check-out.component';

describe('MaterialCheckOutComponent', () => {
  let component: MaterialCheckOutComponent;
  let fixture: ComponentFixture<MaterialCheckOutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialCheckOutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialCheckOutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
