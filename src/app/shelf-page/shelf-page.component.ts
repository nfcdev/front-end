import { Component, OnInit, Input, Inject, ViewChild, AfterViewInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DataService } from '../data.service';


export interface DialogData{
  shelf: string;
  shelfPageData: ShelfPageData[];
}

export interface ShelfPageData {
  packageMaterials: string[];
  package: string;
}

@Component({ 
  selector: 'app-shelf-page',
  templateUrl: './shelf-page.component.html',
  styleUrls: ['./shelf-page.component.less']
})
export class ShelfPageComponent implements OnInit {
  @Input('shelf')shelf: string;
  @Input('storage_room')storage_room: string;
  materials : any[];
  shelfPageData: ShelfPageData[] = [];
  packages: string[];
  constructor(public dialog: MatDialog,
              private dataService: DataService) { }

  load() : void {
    
    this.shelfPageData = [];
    this.dataService.sendGetRequest('/article?storage_room=' + this.storage_room + '&shelf=' + this.shelf).subscribe( (data : any[]) => {
      this.materials = data; 
      // Get list of packages
      this.packages = this.materials
      .map(item => item.package)
      .filter((value, index, self) => self.indexOf(value) === index);
      // Link materials to packages and saves them in a format that can be displayed in the component
      this.packages.forEach( (pack) => {
        let temp : ShelfPageData = {package: pack, packageMaterials : []};
        this.materials.forEach( (mat) => {
          if(mat.package === pack){
            temp.packageMaterials.push(mat.material_number);
          }
        });  
        this.shelfPageData.push(temp);
      });
      

      this.openDialog();
    });
    
  }

  openDialog(): void {

    const dialogRef = this.dialog.open(ShelfPageDialogComponent, {
      width: '1000px',
      height: '500px',
      data:
      {shelf: this.shelf,
        shelfPageData: this.shelfPageData
      }
    });

  }
  ngOnInit() {
    
  }

}

@Component({
  selector: 'app-shelf-page-dialog',
  templateUrl: './shelf-page-dialog.component.html',
})
export class ShelfPageDialogComponent implements AfterViewInit{


  constructor(
    public dialogRef: MatDialogRef<ShelfPageDialogComponent>,
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
  ngAfterViewInit() {
  }
}

