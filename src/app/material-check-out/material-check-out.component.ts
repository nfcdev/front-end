import { Component, OnInit, Inject } from '@angular/core';
import { MaterialCheckBoxService } from '../table-article-data/material-check-box.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { SelectionModel, DataSource } from '@angular/cdk/collections';
import { FormGroup,  FormBuilder,  Validators } from '@angular/forms';


export interface DialogData{
  selectedMaterials: string[];
  preChosen: boolean;
}

@Component({
  selector: 'app-material-check-out',
  templateUrl: './material-check-out.component.html',
  styleUrls: ['./material-check-out.component.less']
})
export class MaterialCheckOutComponent implements OnInit {

  selection : any[];
  materials: string[];
  preChosen = false;

  constructor(
    private materialCheckBoxService: MaterialCheckBoxService,
    public dialog: MatDialog
  ) { }

  openDialog(): void {
    // TODO: Get information about the material from the back end here and then send it to the dialog

    if((this.materials && this.materials.length > 0)){
      this.preChosen= true;
    } else {
      this.preChosen = false;
      this.materials = [] as string[];
    }
    const dialogRef = this.dialog.open(MaterialCheckOutDialogComponent, {
      width: '400px',
      height: '500px',
      data:
      {selectedMaterials: this.materials,
        preChosen: this.preChosen
      }
    });

    // runs every time we close the Modal or submit
    dialogRef.afterClosed().subscribe(result => {

      console.log('The dialog was closed');

      if(result != null ){ // if user presses cancel the result is null. TODO: better solution for checking this
      //console.log(result);

      // reset material list if we press the "tillbaka-button"
      this.materials = [];

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
  selector: 'app-material-check-out-dialog',
  templateUrl: './material-check-out-dialog.component.html',
})
export class MaterialCheckOutDialogComponent implements OnInit{
  checkOutConfirmed : boolean = false;
  preChosen : boolean = false;
  comment: string;
  materials: string[];

  checkInForm: FormGroup;


  constructor(
    public dialogRef: MatDialogRef<MaterialCheckOutDialogComponent>,
    private allDialogRef: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: FormBuilder) {
      this.createForm();
    }

    createForm() {
      // create variables and validators for form fields
      this.checkInForm = this.fb.group({
        material_number: [''],
        comment: ['']
      });
    }

    // Runs when X-button is clicked
  onNoClick(): void {
    this.allDialogRef.closeAll();
  }
  // Runs when the back arrow button is clicked
  onBackButton() : void {
    this.dialogRef.close();
  }
// Runs when "Checka Ut" button is pressed
  onConfirm() : void {
    
    this.checkOutConfirmed = true;
    //console.log(this.comment);
    // TODO: check-out the materials in this.data.selectedMaterials in the back-end here together with this.comment

    // clears the selected materials so that they don't stay when check-out is clicked again
    
  }

  addMaterial(newMaterial : string) : void {
    if (!this.data.selectedMaterials.includes(newMaterial)) { 
      if(newMaterial && newMaterial.length > 0) {
        this.data.selectedMaterials.push(newMaterial);
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
  ngOnInit() : void {
    
  }
}
