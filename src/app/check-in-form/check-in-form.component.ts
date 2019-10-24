import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormGroup,  FormBuilder,  Validators } from '@angular/forms';


export interface DialogData {
  user_name: string;
  material_number: number;
  reference_number: number;
  comment: string;
  storage_room: string;
  placement: string;
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

  given_storage_room_id : number;
  given_user_name: string;
  given_material_number: number;

  // TODO: Get rooms from database instead of hard-coding them
  rooms: Room[] = [
    {roomName: 'Vapen', roomId : 1},
    {roomName: 'Bio', roomId : 2}
  ];

  constructor(public dialog: MatDialog) { }

  openDialog(): void {

    this.given_material_number = 1000; //TODO: Get material number here
    this.given_storage_room_id = 1; //TODO: Get storage room ID here
    this.given_user_name = 'danbr'; //TODO: Get username here

    const dialogRef = this.dialog.open(CheckInFormDialogComponent, {
      width: '500px',
      // send in data to form to be filled automatically TODO: send in room computer is in
      data: {user_name: this.given_user_name,
      storage_room: this.rooms.find(x => x.roomId === this.given_storage_room_id ).roomName, //finds the room name from the given id
      material_number: this.given_material_number }
    });

    // runs every time we close the Modal or submit
    dialogRef.afterClosed().subscribe(result => {

      console.log('The dialog was closed');

      if(result != null ){ // if user presses cancel the result is null. TODO: better solution for checking this
      console.log(result);

      // TODO: Jsonify data and send to back-end
      // things to send: given_material_number, given_storage_room_id, given_user_name,
      // result.reference_number, result.placement, result.comment

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

  

  constructor(
    public dialogRef: MatDialogRef<CheckInFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: FormBuilder) {
      this.createForm();
    }
  createForm() {
    // create variables and validators for form fields
    this.checkInForm = this.fb.group({
      user_name: [{value: '', disabled: true}, Validators.required],
      material_number: [{value: '', disabled: true}, Validators.required],
      reference_number: ['', Validators.required],
      comment: ['', Validators.required],
      storage_room: [{value: '', disabled: true}, Validators.required],
      placement: ['', Validators.required]
    });

  }

  onNoClick(): void {  // The cancel-button runs this function
    this.dialogRef.close();
  }
}

