import { Component, OnInit, Input, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MaterialCheckBoxService } from '../table-article-data/material-check-box.service';


export interface CaseInfo {
  created_date: string;
  status: string;
  time_active: string;
  last_modified: string;
}


export interface DialogData {
  reference_number: number;
  case_info: CaseInfo;
  materials: MaterialInfo[];
  branchData: Branch[];
}

export interface MaterialInfo {
  material_number: string;
  reference_number: string;
  branch: string;
  storage_room: string;
  shelf: string;
  package: string;
}

export interface MaterialBox {
  branch: string;
  storage_room: string;
  shelf: string;
  package: string;
  material;
}

export interface Branch {
  name: string;
  storage_rooms: StorageRoom[];
}
export interface StorageRoom {
  name: string;
  shelves: Shelf[];
}
export interface Shelf {
  name: string;
  packages: Package[];
}
export interface Package {
  name: string;
  materials: string[];
}

@Component({
  selector: 'app-case-page',
  templateUrl: './case-page.component.html',
  styleUrls: ['./case-page.component.less']
})



export class CasePageComponent implements OnInit {

  @Input() reference_number: number;
  case_info: CaseInfo;
  materials: MaterialInfo[];
  branches: string[];
  storage_rooms: string[];
  shelves: string[];
  packages: string[];
  materialBoxes: MaterialBox[] = [];

  branchData: Branch[] = [];

  constructor(public dialog: MatDialog) { }


  openDialog(): void {

    // TODO: Get information about the case from the back end here and then send it to the dialog
    this.case_info = {
      created_date: '20190123 11.02', status: 'Aktiv',
      time_active: '21d 2h 3min', last_modified: '21d 2h 3min'
    };
    this.materials = [{
      material_number: '10', reference_number: '12', branch: 'Bio',
      storage_room: 'Bio Uppack', shelf: 'B15', package: 'P2'
    },
    {
      material_number: '11', reference_number: '12', branch: 'Vapen',
      storage_room: 'Vapen Uppack', shelf: 'A15', package: null
    },
    {
      material_number: '12', reference_number: '12', branch: 'Vapen',
      storage_room: 'Vapen Labb', shelf: 'C15', package: 'K2'
    },
    {
      material_number: '13', reference_number: '12', branch: 'Finger',
      storage_room: 'Finger Labb', shelf: 'H2', package: null
    },
    {
      material_number: '14', reference_number: '12', branch: 'Vapen',
      storage_room: 'Vapen Labb', shelf: 'C15', package: 'K2'
    },
    {
      material_number: '15', reference_number: '12', branch: 'Vapen',
      storage_room: 'Vapen Labb', shelf: 'E15', package: 'K3'
    },

    {
      material_number: '16', reference_number: '12', branch: 'Bio',
      storage_room: 'Bio Uppack', shelf: 'B15', package: 'P2'
    },
    {
      material_number: '17', reference_number: '12', branch: 'Vapen',
      storage_room: 'Vapen Uppack', shelf: 'A15', package: null
    },
    {
      material_number: '18', reference_number: '12', branch: 'Vapen',
      storage_room: 'Vapen Labb', shelf: 'D15', package: 'K2'
    },
    {
      material_number: '19', reference_number: '12', branch: 'Finger',
      storage_room: 'Finger Labb', shelf: 'F15', package: 'K2'
    },
    {
      material_number: '20', reference_number: '12', branch: 'Finger',
      storage_room: 'Finger Uppack', shelf: 'F15', package: 'P7'
    },
    {
      material_number: '30', reference_number: '12', branch: 'Finger',
      storage_room: 'Finger Uppack', shelf: 'K15', package: 'P17'
    }
    ];


    this.branches = [];
    this.storage_rooms = [];
    this.shelves = [];
    this.packages = [];
    this.branchData = [];
    // ---------- This very long code allows us to draw the accordion ------------------------------------------------
    
    // Finds the unique branches, rooms etc.
    this.branches = this.materials
      .map(item => item.branch)
      .filter((value, index, self) => self.indexOf(value) === index);
    this.storage_rooms = this.materials
      .map(item => item.storage_room)
      .filter((value, index, self) => self.indexOf(value) === index);
    this.shelves = this.materials
      .map(item => item.shelf)
      .filter((value, index, self) => self.indexOf(value) === index);
    this.packages = this.materials
      .map(item => item.package)
      .filter((value, index, self) => self.indexOf(value) === index);

    //Loops through, for each branch determines which rooms belong there, then which shelves belong in that rooms etc.
    this.branches.forEach((branch) => {
      var tempBranch: Branch = { name: branch, storage_rooms: [] };
      var uniqueRooms: string[] = [];
      this.materials.forEach((box) => {
        if (box.branch === branch) {
          var tempRoom: StorageRoom = { name: box.storage_room, shelves: [] };
          if (!uniqueRooms.includes(box.storage_room)) {
            // Find rooms in that branch
            this.storage_rooms.forEach((storage_room) => {
              var uniqueShelves: string[] = [];
              this.materials.forEach((box1) => {
                if (box1.branch === branch && box1.storage_room === storage_room && box.storage_room == storage_room) {
                  var tempShelf: Shelf = { name: box1.shelf, packages: [] };
                  if (!uniqueShelves.includes(box1.shelf)) {
                    //Find packages in that shelf
                    this.shelves.forEach((shelf) => {
                      var uniquePackages: string[] = [];
                      this.materials.forEach((box2) => {
                        if (box2.branch === branch && box2.storage_room === storage_room && box2.shelf === shelf
                          && box1.shelf == shelf) {
                          var tempPackage: Package = { name: box2.package, materials: [] };
                          if (!uniquePackages.includes(box2.package)) {
                            //Find materials in that package
                            this.packages.forEach((pack) => {
                              this.materials.forEach((box3) => {
                                if (box3.branch === branch && box3.storage_room === storage_room && box3.shelf === shelf && box3.package == pack
                                  && box2.package == pack) {
                                  tempPackage.materials.push(box3.material_number);
                                }
                              });
                            });
                            tempShelf.packages.push(tempPackage);

                            uniquePackages.push(box2.package);
                          }
                        }
                      });
                    });
                    tempRoom.shelves.push(tempShelf);

                    uniqueShelves.push(box1.shelf);
                  }
                }
              });
            });
            tempBranch.storage_rooms.push(tempRoom);
            uniqueRooms.push(box.storage_room);
          }
        }
      });

      this.branchData.push(tempBranch);
    });

    // -------------------------------------------------------------------------------------------------------------


    const dialogRef = this.dialog.open(CasePageDialogComponent, {
      width: '1000px',
      height: '500px',
      data:
      {
        reference_number: this.reference_number,
        case_info: this.case_info,
        branchData: this.branchData

      }
    });

  }

  ngOnInit() {
    // this.caseInfo.branches
  }

}
const STATUSES: string[] = ['Aktiv', 'Inaktiv'];

@Component({
  selector: 'app-case-page-dialog',
  templateUrl: './case-page-dialog.component.html',
})
export class CasePageDialogComponent {

  statuses: string[] = STATUSES;


  constructor(
    public dialogRef: MatDialogRef<CasePageDialogComponent>,
    private allDialogRef: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {
  }

  // Runs when X-button is clicked
  onNoClick(): void {
    this.allDialogRef.closeAll();
  }
  // Runs when the back arrow button is clicked
  onBackButton(): void {
    this.dialogRef.close();
  }
  // This function is run when a new status is selected in the status selection 
  changeStatus(): void {
    // TODO: change the status in the back-end
    // console.log(this.data.material_data.status);
  }
}
