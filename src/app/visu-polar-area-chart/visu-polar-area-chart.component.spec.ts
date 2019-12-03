import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisuPolarAreaChartComponent } from './visu-polar-area-chart.component';

describe('VisuPolarAreaChartComponent', () => {
  let component: VisuPolarAreaChartComponent;
  let fixture: ComponentFixture<VisuPolarAreaChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisuPolarAreaChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisuPolarAreaChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
