import { Component, OnInit, Input, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataService } from '../data.service';

export interface CaseInfo {
  created_date: string;
  time_active: string;
  last_modified: string;
}


export interface DialogData {
  reference_number: number;
  case_info: CaseInfo;
  materials: any[];
  branchData: Branch[];
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

  materials: any[];

  branches: string[];
  storage_rooms: string[];
  shelves: string[];
  packages: string[];
  materialBoxes: MaterialBox[] = [];

  branchData: Branch[] = [];

  data: any;

  constructor(public dialog: MatDialog,
    private dataService: DataService) { }


  //Loads the materials of the case before opening the dialog
  load(): void {
    this.dataService.sendGetRequest('/article?reference_number=' + this.reference_number).subscribe((data: any[]) => {
      this.data = data;
      this.openDialog();
    });
  }

  // Gets the case information by calculating/formating the timestamps of the articles
  getCaseInfo(): void {
    let timeAddedMin: number = Number.POSITIVE_INFINITY;
    let lastModMax: number = Number.NEGATIVE_INFINITY;
    // Calculates time created and last modified
    this.materials.forEach((mat) => {
      if (mat.timestamp < timeAddedMin) {
        timeAddedMin = mat.timestamp;
      }
      if (mat.last_modified > lastModMax) {
        lastModMax = mat.last_modified;
      }
    });

    let currTime = new Date();
    let lastModTime = new Date(lastModMax * 1000);
    let createdTime = new Date(timeAddedMin * 1000);

    let yearFormated: string = '' + createdTime.getUTCFullYear();
    let monthFormated: string;
    let dateFormated: string;
    let hoursFormated: string;
    let minutesFormated: string;


    // Adds a 0 before month/date/hours if they are below 10 for formating
    // Adds 1 to month since otherwise January is month 0.
    if ((createdTime.getUTCMonth() + 1) < 10) {
      monthFormated = '0' + (createdTime.getUTCMonth() + 1);
    } else {
      monthFormated = '' + (createdTime.getUTCMonth() + 1);
    }
    if (createdTime.getUTCDate() < 10) {
      dateFormated = '0' + createdTime.getUTCDate();
    } else {
      dateFormated = '' + createdTime.getUTCDate();
    }
    if (createdTime.getUTCHours() < 10) {
      hoursFormated = '0' + createdTime.getUTCHours();
    } else {
      hoursFormated = '' + createdTime.getUTCHours();
    }
    if (createdTime.getUTCMinutes() < 10) {
      minutesFormated = '0' + createdTime.getUTCMinutes();
    } else {
      minutesFormated = '' + createdTime.getUTCMinutes();
    }

    // Saves the data for the dialog to use
    this.case_info.created_date = '' + yearFormated +
      monthFormated + dateFormated + ' ' +
      hoursFormated + '.' + minutesFormated;
    this.case_info.last_modified = this.dhm(currTime.getTime() - lastModTime.getTime());
    this.case_info.time_active = this.dhm(currTime.getTime() - createdTime.getTime());
  }

  // This function converts time to days, hours and months
  dhm(t): string {
    let cd = 24 * 60 * 60 * 1000;
    let ch = 60 * 60 * 1000;
    let d = Math.floor(t / cd);
    let h = Math.floor((t - d * cd) / ch);
    let m = Math.round((t - d * cd - h * ch) / 60000);
    if (m === 60) {
      h++;
      m = 0;
    }
    if (h === 24) {
      d++;
      h = 0;
    }
    return '' + d + 'd ' + h + 'h ' + m + 'm';
  }

  openDialog(): void {
    this.materials = this.data;
    // TODO: Get information about the case from the back end here and then send it to the dialog
    this.case_info = {
      created_date: '20190123 11.02',
      time_active: '21d 2h 3min', last_modified: '21d 2h 3min'
    };


    this.getCaseInfo();


    this.branches = [];
    this.storage_rooms = [];
    this.shelves = [];
    this.packages = [];
    this.branchData = [];
    // ---------- This code allows us to draw the accordion ------------------------------------------------

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

    //Loops through, for each branch determines which rooms belong there, then which shelves belong in that rooms etc...
    this.branches.forEach((branch) => {
      let tempBranch: Branch = { name: branch, storage_rooms: [] };
      let uniqueRooms: string[] = [];
      this.materials.forEach((box) => {
        if (box.branch === branch) {
          let tempRoom: StorageRoom = { name: box.storage_room, shelves: [] };
          if (!uniqueRooms.includes(box.storage_room)) {
            // Find rooms in that branch
            this.storage_rooms.forEach((storage_room) => {
              let uniqueShelves: string[] = [];
              this.materials.forEach((box1) => {
                if (box1.branch === branch && box1.storage_room === storage_room
                  && box.storage_room === storage_room) {
                  let tempShelf: Shelf = { name: box1.shelf, packages: [] };
                  if (!uniqueShelves.includes(box1.shelf)) {
                    //Find packages in that shelf
                    this.shelves.forEach((shelf) => {
                      let uniquePackages: string[] = [];
                      this.materials.forEach((box2) => {
                        if (box2.branch === branch && box2.storage_room === storage_room && box2.shelf === shelf
                          && box1.shelf === shelf) {
                          let tempPackage: Package = { name: box2.package, materials: [] };
                          if (!uniquePackages.includes(box2.package)) {
                            //Find materials in that package
                            this.packages.forEach((pack) => {
                              this.materials.forEach((box3) => {
                                if (box3.branch === branch && box3.storage_room === storage_room &&
                                  box3.shelf === shelf && box3.package === pack
                                  && box2.package === pack) {
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
// TODO: Get list of the actual statuses, these are for testing
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
}
