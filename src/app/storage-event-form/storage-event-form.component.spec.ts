import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StorageEventFormComponent } from './storage-event-form.component';

describe('StorageEventFormComponent', () => {
  let component: StorageEventFormComponent;
  let fixture: ComponentFixture<StorageEventFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StorageEventFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StorageEventFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
