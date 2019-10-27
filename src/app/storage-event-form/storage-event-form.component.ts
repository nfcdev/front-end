import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

export interface DialogData {
  action: number;
  material_number: number;
  comment: string;
}
export interface Action {
  action_id: number;
  action_name: string;
}

@Component({
  selector: 'app-storage-event-form',
  templateUrl: './storage-event-form.component.html',
  styleUrls: ['./storage-event-form.component.less']
})
export class StorageEventFormComponent implements OnInit {
  constructor(public dialog: MatDialog) { }

  openDialog(): void {

    const dialogRef = this.dialog.open(StorageEventFormDialogComponent, {
      width: '500px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {

    console.log('The dialog was closed');
    if (result != null) {
      console.log(result);
      // TODO: Skicka till back-end här.
      // vilken typ av event kommer som en siffra som är definierad
      // i actions-arrayen nedan, behöver översättas
    } else {
      console.log('Empty result');

    }
  });
}
  ngOnInit() {
  }

}

@Component({
  selector: 'app-storage-event-form-dialog',
  templateUrl: './storage-event-form-dialog.component.html',
})
export class StorageEventFormDialogComponent {

  actions: Action[] = [
    {action_id: 1, action_name: 'Checka in'},
    {action_id: 2, action_name: 'Checka ut'}
  ];

  storageEventForm: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<StorageEventFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: FormBuilder) {
      this.createForm();
    }
  createForm(){
    this.storageEventForm = this.fb.group({
      action: ['', Validators.required],
      material_number: ['', Validators.required],
      comment: ['']
    });
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
