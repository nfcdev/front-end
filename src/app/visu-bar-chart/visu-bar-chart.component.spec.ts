import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisuBarChartComponent } from './visu-bar-chart.component';

describe('VisuBarChartComponent', () => {
  let component: VisuBarChartComponent;
  let fixture: ComponentFixture<VisuBarChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisuBarChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisuBarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
