import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormGroup,  FormBuilder,  Validators } from '@angular/forms';


export interface DialogData {
  name: string;
  material_number:number;
  reference_number:number;
  description:string;
  storage_room_id:number;
  placement:string;
  parent_article_id:number;
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


  //declare field variable
  name:string;
  material_number:number;
  reference_number:number;
  description:string;
  storage_room_id:number;
  placement:string;
  parent_article_id:number;


  constructor(public dialog: MatDialog) { }

  openDialog(): void {
    const dialogRef = this.dialog.open(CheckInFormDialogComponent, {
      width: '500px',
      data: {} //send in data to form to be filled automatically TODO: send in room computer is in
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result != null){
      console.log('The dialog was closed');
      this.name = result.name;
      this.material_number = result.material_number;
      this.reference_number = result.reference_number;
      this.description = result.description;
      this.storage_room_id = result.storage_room_id;
      this.placement = result.placement;
      this.parent_article_id = result.parent_article_id;

      //TODO: Jsonify data and send to back-end

      //clear data
      } else {
        console.log("Invalid");
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

  //TODO: Get rooms from database instead of hard-coding them
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

  onNoClick(): void {
    this.dialogRef.close();
  }
  public getValid(): boolean{
    return this.checkInForm.valid;
  }
}

