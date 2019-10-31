import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

export interface DialogData {
  action: number;
  material_number: number;
  comment: string;
  shelf: string;
  package: string;
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


  shelfDisabled: boolean = false;
  packageDisabled: boolean = false;

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
      comment: [''],
      shelf: [''],
      package: ['']
    });

  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  toggleRequired(): void {
    this.storageEventForm.get('action').valueChanges.subscribe(act => {
      if(act && act === 1) { //Check-in
        this.storageEventForm.controls['shelf'].setValidators([Validators.required]);
        this.storageEventForm.controls['package'].setValidators([Validators.required]);
        console.log("Pack req");
        console.log("Shelf req");
      } else if (act && act === 2 ) { //Check-out
        this.storageEventForm.controls['shelf'].clearValidators();
        this.storageEventForm.controls['package'].clearValidators();
        console.log("Pack clr");
        console.log("Shelf clr");
      }
    });
    this.storageEventForm.updateValueAndValidity();
  }
  toggleShelf(): void {
    this.storageEventForm.get('package').valueChanges.subscribe(pack => {
      if(pack && pack.length > 0) {
        this.shelfDisabled = true;
        this.storageEventForm.controls['package'].setValidators([Validators.required]);
        this.storageEventForm.controls['shelf'].clearValidators();
      } else {
        this.shelfDisabled = false;
        this.storageEventForm.controls['shelf'].setValidators([Validators.required]);
        this.storageEventForm.controls['package'].clearValidators();
      }
    });
    this.storageEventForm.updateValueAndValidity();
  }
  togglePackage(): void {
    this.storageEventForm.get('shelf').valueChanges.subscribe(shelf => {
      if(shelf && shelf.length > 0) {
        this.packageDisabled = true;
        this.storageEventForm.controls['shelf'].setValidators([Validators.required]);
        this.storageEventForm.controls['package'].clearValidators();
      } else {
        this.packageDisabled = false;
        this.storageEventForm.controls['package'].setValidators([Validators.required]);
        this.storageEventForm.controls['shelf'].clearValidators();
      }
    });
    this.storageEventForm.updateValueAndValidity();
  }
}
