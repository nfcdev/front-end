import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageSystemDialogComponent } from './manage-system-dialog.component';

describe('ManageSystemDialogComponent', () => {
  let component: ManageSystemDialogComponent;
  let fixture: ComponentFixture<ManageSystemDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageSystemDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageSystemDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
