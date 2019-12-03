import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

export interface DialogData {
  action: number;
  material_number: string;
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
  eventTypeChosen: boolean = false;

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
  toggleAction(): void { // Runs when we change the storage event type
    this.storageEventForm.get('action').valueChanges.subscribe(act => {
      if(act && act === 1) { // We chose Check-in
        // Adds new form controls for shelf and packages and makes them required
       this.storageEventForm.addControl('shelf', new FormControl('', Validators.required));
       this.storageEventForm.addControl('package', new FormControl('', Validators.required));
      } else if (act && act === 2 ) { // We chose Check-out
        // If we switch back to check-out we want to remove these controls
        this.storageEventForm.removeControl('shelf');
        this.storageEventForm.removeControl('package');
      }
    });
  }
  toggleShelf(): void {  // Checks if package is filled in and if so disables the shelf field
    this.storageEventForm.get('package').valueChanges.subscribe(pack => { // When field is changed
      if(pack && pack.length > 0) { // Package is filled in
        this.shelfDisabled = true; // Make the shelf field read-only
        this.storageEventForm.get('package').setValidators([Validators.required]); // Set package required
        this.storageEventForm.get('shelf').clearValidators(); // Remove required from shelf
      } else { // We get here if package is filled in and then erased
        this.shelfDisabled = false; // Make the shelf field editable again
        this.storageEventForm.get('shelf').setValidators([Validators.required]); // Set shelf required again
      }
    });
    // Updates the form controls
    this.storageEventForm.get('package').updateValueAndValidity();
    this.storageEventForm.get('shelf').updateValueAndValidity();
  }

  togglePackage(): void { // Same function as above but to toggle the package field
    this.storageEventForm.get('shelf').valueChanges.subscribe(shelf => {
      if(shelf && shelf.length > 0) {
        this.packageDisabled = true;
        this.storageEventForm.get('shelf').setValidators([Validators.required]);
        this.storageEventForm.get('package').clearValidators();
      } else {
        this.packageDisabled = false;
        this.storageEventForm.get('package').setValidators([Validators.required]);
      }
    });
    // Updates the form controls
    this.storageEventForm.get('package').updateValueAndValidity();
    this.storageEventForm.get('shelf').updateValueAndValidity();
  }
  public updateValidity(_event: Event) {  // Updates the validity of the form
    setTimeout(() => { // Timeout is needed in order to not get an exception when button changes to disabled on action change
      this.formIsValid = this.storageEventForm.valid;
    }, 0);
  }
  public isSubmitEnabled() {
    return this.formIsValid;
  }
}
