import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayArticleDataComponent } from './display-article-data.component';

describe('DisplayArticleDataComponent', () => {
  let component: DisplayArticleDataComponent;
  let fixture: ComponentFixture<DisplayArticleDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplayArticleDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayArticleDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
