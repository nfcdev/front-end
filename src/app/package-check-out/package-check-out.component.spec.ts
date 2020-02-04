import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageCheckOutComponent } from './package-check-out.component';

describe('PackageCheckOutComponent', () => {
  let component: PackageCheckOutComponent;
  let fixture: ComponentFixture<PackageCheckOutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PackageCheckOutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PackageCheckOutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
