import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';


@Component({
  selector: 'app-data-visualization',
  templateUrl: './data-visualization.component.html',
  styleUrls: ['./data-visualization.component.less']
})
export class DataVisualizationComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  ngOnInit() {
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DataVisualizationDialogComponent, {
      height: '400px',
      width: '600px',
      data: {text: "Här kommer visualisering av data att presenteras" }
    });

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

}

@Component({
  selector: 'app-data-visualization-dialog',
  templateUrl: './data-visualization-dialog.component.html',
})
export class DataVisualizationDialogComponent {



  constructor( public dialogRef: MatDialogRef<DataVisualizationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    ) {}
  //Add functions to visualizae data components inside the dialog

  onNoClick(): void {  // The cancel-button runs this function
    this.dialogRef.close();
  }
}

