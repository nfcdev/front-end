import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualisationMainComponent } from './visualisation-main.component';

describe('VisualisationMainComponent', () => {
  let component: VisualisationMainComponent;
  let fixture: ComponentFixture<VisualisationMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisualisationMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisualisationMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
