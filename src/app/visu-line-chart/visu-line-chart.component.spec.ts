import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisuLineChartComponent } from './visu-line-chart.component';

describe('VisuLineChartComponent', () => {
  let component: VisuLineChartComponent;
  let fixture: ComponentFixture<VisuLineChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisuLineChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisuLineChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
