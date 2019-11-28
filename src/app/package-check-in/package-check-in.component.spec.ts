import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageCheckInComponent } from './package-check-in.component';

describe('PackageCheckInComponent', () => {
  let component: PackageCheckInComponent;
  let fixture: ComponentFixture<PackageCheckInComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PackageCheckInComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PackageCheckInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
