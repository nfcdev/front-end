import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-check-in-form-dialog',
  templateUrl: './check-in-form-dialog.component.html',
  styleUrls: ['./check-in-form-dialog.component.less']
})
export class CheckInFormDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<CheckInFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}  

  onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnInit() {
  }

}
