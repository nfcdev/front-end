import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatPageVisuComponent } from './mat-page-visu.component';

describe('MatPageVisuComponent', () => {
  let component: MatPageVisuComponent;
  let fixture: ComponentFixture<MatPageVisuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatPageVisuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatPageVisuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
