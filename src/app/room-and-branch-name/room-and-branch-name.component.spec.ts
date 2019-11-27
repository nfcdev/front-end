import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomAndBranchNameComponent } from './room-and-branch-name.component';

describe('RoomAndBranchNameComponent', () => {
  let component: RoomAndBranchNameComponent;
  let fixture: ComponentFixture<RoomAndBranchNameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoomAndBranchNameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomAndBranchNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
