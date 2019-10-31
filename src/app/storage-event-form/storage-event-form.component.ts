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
  formIsValid: boolean = false;

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
       this.storageEventForm.get('shelf').setValidators([Validators.required]);
       this.storageEventForm.get('package').setValidators([Validators.required]);
      } else if (act && act === 2 ) { //Check-out
        this.storageEventForm.get('shelf').clearValidators();
        this.storageEventForm.get('shelf').clearValidators();
      }
    });
    this.storageEventForm.get('package').updateValueAndValidity();
    this.storageEventForm.get('shelf').updateValueAndValidity();
  }
  toggleShelf(): void {
    this.storageEventForm.get('package').valueChanges.subscribe(pack => {
      if(pack && pack.length > 0) {
        this.shelfDisabled = true;
        this.storageEventForm.get('package').setValidators([Validators.required]);
        this.storageEventForm.get('shelf').clearValidators();
        console.log("Package req, shelf cleared");
      } else {
        this.shelfDisabled = false;
        this.storageEventForm.get('shelf').setValidators([Validators.required]);
        this.storageEventForm.get('package').clearValidators();
        console.log("Package cleared, shelf req");
      }
    });
    this.storageEventForm.get('package').updateValueAndValidity();
    this.storageEventForm.get('shelf').updateValueAndValidity();
  }
  togglePackage(): void {
    this.storageEventForm.get('shelf').valueChanges.subscribe(shelf => {
      if(shelf && shelf.length > 0) {
        this.packageDisabled = true;
        this.storageEventForm.get('shelf').setValidators([Validators.required]);
        this.storageEventForm.get('package').clearValidators();
        console.log("Package cleared, shelf req");
      } else {
        this.packageDisabled = false;
        this.storageEventForm.get('package').setValidators([Validators.required]);
        this.storageEventForm.get('shelf').clearValidators();
        console.log("Package req, shelf cleared");
      }
    });
    this.storageEventForm.get('package').updateValueAndValidity();
    this.storageEventForm.get('shelf').updateValueAndValidity();
  }
  public updateValidity(_event: Event) {
    setTimeout(() => {
      this.storageEventForm.get('package').updateValueAndValidity();
      this.storageEventForm.get('shelf').updateValueAndValidity();
      this.formIsValid = this.storageEventForm.valid;
      console.log("set validity to " + this.storageEventForm.valid);
    }, 0);
  }
  public isSubmitEnabled() {
    return this.formIsValid;
  }
}
