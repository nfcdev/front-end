import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormGroup,  FormBuilder,  Validators } from '@angular/forms';


export interface DialogData {
  material_number: string;
  reference_number: number;
  area: string;
  storage_room: string;
  shelf: string;
  package: string;
  placement: any;
}

export interface Room {
  roomName: string;
  roomId: number;
}
export interface Area {
  areaName: string;
  areaId: number;
}

@Component({
  selector: 'app-check-in-form',
  templateUrl: './check-in-form.component.html',
  styleUrls: ['./check-in-form.component.less']
})

export class CheckInFormComponent implements OnInit {

  given_storage_room_id : number;
  given_area_id: number;

  // TODO: Get rooms from database instead of hard-coding them
  rooms: Room[] = [
    {roomName: 'Rum 1', roomId : 1},
    {roomName: 'Rum 2', roomId : 2}
  ];

  areas: Area[] = [
    {areaName: 'Område 1', areaId: 1},
    {areaName: 'Område 2', areaId: 1}
  ];


  constructor(public dialog: MatDialog) { }

  openDialog(): void {

    this.given_storage_room_id = 1; //TODO: Get storage room ID here
    this.given_area_id = 1; //TODO: Get area id here

    const dialogRef = this.dialog.open(CheckInFormDialogComponent, {
      width: '500px',
      // send in data to form to be filled automatically TODO: send in room computer is in
      data:
      {area: this.areas.find(x => x.areaId === this.given_area_id ).areaName, //finds the room name from the given id
      storage_room: this.rooms.find(x => x.roomId === this.given_storage_room_id ).roomName //finds the room name from the given id
      }
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

  shelves: string[] = [ //TODO: Get shelves from database here instead
    'A15', 'A18', 'B18', 'B23'
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
      material_number: ['', Validators.required],
      reference_number: ['', Validators.required],
      area: [{value: '', disabled: true}, Validators.required],
      storage_room: [{value: '', disabled: true}, Validators.required],
      shelf: ['', Validators.required],
      package: ['']
    });

  }

  onNoClick(): void {  // The cancel-button runs this function
    this.dialogRef.close();
  }
}

