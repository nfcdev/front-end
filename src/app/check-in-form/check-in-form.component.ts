import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormGroup,  FormBuilder,  Validators } from '@angular/forms';


export interface DialogData {
  name: string;
  material_number: number;
  reference_number: number;
  description: string;
  storage_room_id: number;
  placement: string;
  parent_article_id: number;
}

export interface Room {
  roomName: string;
  roomId: number;
}

@Component({
  selector: 'app-check-in-form',
  templateUrl: './check-in-form.component.html',
  styleUrls: ['./check-in-form.component.less']
})

export class CheckInFormComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  openDialog(): void {
    const dialogRef = this.dialog.open(CheckInFormDialogComponent, {
      width: '500px',
      data: {} // send in data to form to be filled automatically TODO: send in room computer is in
    });

    // runs every time we close the Modal or submit
    dialogRef.afterClosed().subscribe(result => {

      console.log('The dialog was closed');

      if(result != null ){ // if user presses cancel the result is null. TODO: better solution for checking this
      console.log(result);

      // TODO: Jsonify data and send to back-end

      } else {
        console.log('Empty result');
      }
    });
  }

  ngOnInit() {
  }
}

@Component({
  selector: 'app-check-in-form-dialog',
  templateUrl: './check-in-form-dialog.component.html',
})
export class CheckInFormDialogComponent {
  checkInForm: FormGroup;

  // TODO: Get rooms from database instead of hard-coding them
  rooms: Room[] = [
    {roomName: 'Vapen', roomId : 1},
    {roomName: 'Bio', roomId : 2}
  ];

  constructor(
    public dialogRef: MatDialogRef<CheckInFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: FormBuilder) {
      this.createForm();
    }
  createForm() {
    // create variables and validators for form fields
    this.checkInForm = this.fb.group({
      name: ['', Validators.required],
      material_number: ['', Validators.required],
      reference_number: ['', Validators.required],
      description: ['', Validators.required],
      storage_room_id: ['', Validators.required],
      placement: ['', Validators.required],
      parent_article_id: ['']
    });

  }

  onNoClick(): void {  // The cancel-button runs this function
    this.dialogRef.close();
  }
}

