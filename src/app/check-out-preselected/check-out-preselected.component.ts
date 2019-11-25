import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MaterialCheckBoxService } from '../table-article-data/material-check-box.service';


export interface DialogData{
  selectedPackages: string[];
  preSelected: boolean;
}
@Component({
  selector: 'app-check-out-preselected',
  templateUrl: './check-out-preselected.component.html',
  styleUrls: ['./check-out-preselected.component.less']
})
export class CheckOutPreselectedComponent implements OnInit{

  selection : any[];
  packages: string[];
  preChosen = false;
  constructor(private materialCheckBoxService: MaterialCheckBoxService,
    public dialog: MatDialog) {}
    
  openDialog(): void {
    this.preChosen= true;
    const dialogRef = this.dialog.open(CheckOutPreselectedDialogComponent,{
      width:'800px',
      height:'400px'
    })

  }
  ngOnInit() {
    this.materialCheckBoxService.checkBoxChange.subscribe(newSelection => {
      this.selection = newSelection.selected;
      this.packages = this.selection.reduce((a, {package_number}) => a.concat(package_number), []);
    });
  }
  
}
@Component({
  selector: 'app-check-out-preselected-dialog',
  templateUrl: 'check-out-preselected-dialog.html',
})
export class CheckOutPreselectedDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<CheckOutPreselectedDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}