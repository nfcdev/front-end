import { Component, OnInit, Inject, ElementRef } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormGroup,  FormBuilder,  Validators } from '@angular/forms';
import { SelectionModel, DataSource } from '@angular/cdk/collections';
import { MaterialCheckBoxService } from '../table-article-data/material-check-box.service';


export interface DialogData {
  material_number: any;
  reference_number: number;
  area: string;
  storage_room: string;
  shelf: string;
  package: string;
  comment: string;
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

export interface DialogData{
  selectedMaterials: string[];
  preChosen: boolean;
}


@Component({
  selector: 'app-material-check-in',
  templateUrl: './material-check-in.component.html',
  styleUrls: ['./material-check-in.component.less']
})
export class MaterialCheckInComponent implements OnInit {

  given_storage_room_id : number;
  given_area_id: number;

  selection : any[];
  materials: string[];
  preChosen = false;

  // TODO: Get rooms from database instead of hard-coding them
  rooms: Room[] = [
    {roomName: 'Rum 1', roomId : 1},
    {roomName: 'Rum 2', roomId : 2}
  ];

  areas: Area[] = [
    {areaName: 'Område 1', areaId: 1},
    {areaName: 'Område 2', areaId: 1}
  ];


  constructor(
    private materialCheckBoxService: MaterialCheckBoxService,
    public dialog: MatDialog) { }

  openDialog(): void {

    // TODO: Get information about the material from the back end here and then send it to the dialog
    this.given_storage_room_id = 1; //TODO: Get storage room ID here
    this.given_area_id = 1; //TODO: Get area id here

    if((this.materials && this.materials.length > 0)){
      this.preChosen= true;
    } else {
      this.preChosen = false;
      this.materials = [] as string[];
    }

    const dialogRef = this.dialog.open(MaterialCheckInDialogComponent, {
      width: '500px',
      // send in data to form to be filled automatically TODO: send in room computer is in
      data:
      {area: this.areas.find(x => x.areaId === this.given_area_id ).areaName, //finds the room name from the given id
      storage_room: this.rooms.find(x => x.roomId === this.given_storage_room_id ).roomName, //finds the room name from the given id
      selectedMaterials: this.materials,
      preChosen: this.preChosen
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
    this.materialCheckBoxService.checkBoxChange.subscribe(newSelection => {
      this.selection = newSelection.selected;
      this.materials = this.selection.reduce((a, {material_number}) => a.concat(material_number), []);
    });
  }
}

@Component({
  selector: 'app-material-check-in-dialog',
  templateUrl: './material-check-in-dialog.component.html',
})
export class MaterialCheckInDialogComponent {
  checkOutConfirmed : boolean = false;

  checkInForm: FormGroup;

  shelves: string[] = [ //TODO: Get shelves from database here instead
    'A15', 'A18', 'B18', 'B23'
  ];


  constructor(
    public dialogRef: MatDialogRef<MaterialCheckInDialogComponent>,
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
      package: [''],
      comment: ['']
    });

  }

  onNoClick(): void {  // The cancel-button runs this function
    this.dialogRef.close();
  }

  // Runs when the back arrow button is clicked
  onBackButton() : void {
    this.dialogRef.close();
  }

  onConfirm() : void {
    this.checkOutConfirmed = true;
    //console.log(this.comment);
    // TODO: check-out the materials in this.data.selection in the back-end here together with this.comment
  }

  addMaterial(newMaterial : string) : void {
    if (!this.data.selectedMaterials.includes(newMaterial)) { 
      if(newMaterial.length > 0) {
        this.data.selectedMaterials.push(newMaterial);
        this.checkInForm.controls['material_number'].reset()
      }
    } else {
      // duplicate
    }
  }

  removeMaterial(material : string ) : void {
    this.data.selectedMaterials.forEach((item, index) => {
      if (item === material) this.data.selectedMaterials.splice(index, 1);
    });
  }
}

