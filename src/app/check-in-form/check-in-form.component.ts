import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormGroup,  FormBuilder,  Validators } from '@angular/forms';


export interface DialogData {
  name: string;
}


@Component({
  selector: 'app-check-in-form',
  templateUrl: './check-in-form.component.html',
  styleUrls: ['./check-in-form.component.less']
})
export class CheckInFormComponent implements OnInit {


  name:string;
  material_number:number;
  reference_number:number;
  description:string;
  storage_room_id:number;
  placement:string;
  parent_article_id:number;



  constructor(public dialog: MatDialog) { }

  

  openDialog(): void {
    console.log("Hej");
    const dialogRef = this.dialog.open(CheckInFormDialog, {
      width: '500px',
      data: {name: this.name, material_number: this.material_number}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.name = result.name;
      this.material_number = result.material_number;
      this.reference_number = result.reference_number;
      this.description = result.description;
      this.storage_room_id = result.storage_room_id;
      this.placement = result.placement;
      this.parent_article_id = result.parent_article_id;
    });
  }

  ngOnInit() {
  }

  
}

@Component({
  selector: 'app-check-in-form-dialog',
  templateUrl: './check-in-form-dialog.component.html',
})
export class CheckInFormDialog {
  
  checkInForm:FormGroup;


  constructor(
    public dialogRef: MatDialogRef<CheckInFormDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: FormBuilder) {
      this.createForm();
    }
  createForm() {
    
    this.checkInForm = this.fb.group({
      name: ['', Validators.required]
    })

  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

