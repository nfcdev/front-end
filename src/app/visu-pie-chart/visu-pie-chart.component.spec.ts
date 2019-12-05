import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisuPieChartComponent } from './visu-pie-chart.component';

describe('VisuPieChartComponent', () => {
  let component: VisuPieChartComponent;
  let fixture: ComponentFixture<VisuPieChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisuPieChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisuPieChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
