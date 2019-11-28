import { Component, OnInit, Input, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { DataService } from '../data.service';


export interface DialogData{
  package: string;
  materials: string[];
}

export interface Package {
  id: number;
  package_number: string;
  shelf: number;
  case: number;
  current_storage_room: number;
}

export interface Material {
  material_number: string;
  reference_number: string;
  branch: string;
  storage_room: string;
  shelf: string;
  status: string;
  timestamp: number;
  last_modified: number;
  description: string;
  id: number;
}


// Temporary test data
// const MATERIALS: string[] = ['2019020355-14', '2019020355-15', '33123123', '42123123', '772312333', '33123123', '21123'];


@Component({
  selector: 'app-package-page',
  templateUrl: './package-page.component.html',
  styleUrls: ['./package-page.component.less']
})
export class PackagePageComponent implements OnInit {
  @Input()package: string;
  constructor(public dialog: MatDialog, private dataService: DataService) { }


  openDialog(): void {
    if(!(this.package.trim() == "-")) /*Assumes that the table sends "-" when there is no package */ {
      var materials: String [] = [];
      // TODO: Get information about the materials that are in this package from the back end here and then send it to the dialog
      this.dataService.sendGetRequest("/package/package_number/" + this.package).subscribe((backPackage: Package) => {
        console.log(backPackage.id);
        this.dataService.sendGetRequest("/article/package/" + backPackage.id).subscribe((data: Material []) => {
          for (let i=0; i < data.length ; i++) {
            materials.push(data[i].material_number);
          }
          const dialogRef = this.dialog.open(PackagePageDialogComponent, {
            width: '1000px',
            height: '500px',
            data:
            {package: this.package,
            materials: materials
            }
          });
        })
      });
    };
    // this.materials = MATERIALS;
  }
  ngOnInit() {
  }

}

@Component({
  selector: 'app-package-page-dialog',
  templateUrl: './package-page-dialog.component.html',
})
export class PackagePageDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<PackagePageDialogComponent>,
    private allDialogRef: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    ) {
    }

    // Runs when X-button is clicked
  onNoClick(): void {
    this.allDialogRef.closeAll();
  }
  onBackButton(): void {
    this.dialogRef.close();
  }
}
