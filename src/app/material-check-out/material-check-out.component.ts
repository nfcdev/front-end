import { Component, OnInit, Inject } from '@angular/core';
import { MaterialCheckBoxService } from '../table-article-data/material-check-box.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SelectionModel, DataSource } from '@angular/cdk/collections';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { StorageRoomStore } from '../storage-room/storage-room-store'
import { DataService } from '../data.service'
import { TableDataService } from '../table-article-data/table-data-service';


export interface ArticleData {
  material_number: string;
  reference_number: string;
  branch: string;
  storage_room: string;
  shelf: string;
  package_number: string;
  status: string;
  timestamp: number;
  last_modified: number;
}
export interface ShelfData {
  id: number;
  shelf_name: string;
  current_storage_room: number;
}
export interface DialogData {
  selectedMaterials: string[];
  preChosen: boolean;
  material_number: string;
  status: string;
}

@Component({
  selector: 'app-material-check-out',
  templateUrl: './material-check-out.component.html',
  styleUrls: ['./material-check-out.component.less']
})
export class MaterialCheckOutComponent implements OnInit {

  selection: any[];
  materials: string[];
  preChosen = false;

  constructor(
    private materialCheckBoxService: MaterialCheckBoxService,
    public dialog: MatDialog,
    public tableDataService: TableDataService
  ) { }

  openDialog(): void {
    // TODO: Get information about the material from the back end here and then send it to the dialog

    if ((this.materials && this.materials.length > 0)) {
      this.preChosen = true;
    } else {
      this.preChosen = false;
      this.materials = [] as string[];
    }
    const dialogRef = this.dialog.open(MaterialCheckOutDialogComponent, {
      width: '400px',
      height: '500px',
      data:
      {
        selectedMaterials: this.materials,
        preChosen: this.preChosen
      }
    });

    // runs every time we close the Modal or submit
    dialogRef.afterClosed().subscribe(result => {
      this.tableDataService.refreshData();
      this.tableDataService.resetSelection();
      console.log('The dialog was closed');

      if (result != null) { // if user presses cancel the result is null. TODO: better solution for checking this
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
      this.materials = this.selection.reduce((a, { material_number }) => a.concat(material_number), []);
    });
  }

}

@Component({
  selector: 'app-material-check-out-dialog',
  templateUrl: './material-check-out-dialog.component.html',
})
export class MaterialCheckOutDialogComponent implements OnInit {
  checkOutConfirmed: boolean = false;
  preChosen: boolean = false;
  comment: string;
  materials: string[];

  checkInForm: FormGroup;
  status: string[] = [ //TODO: Get status from database here instead
    'Utcheckat', 'Införlivat', 'Kasserat', 'Åter'
  ];
  storage_room_id: Number;

  constructor(
    public dialogRef: MatDialogRef<MaterialCheckOutDialogComponent>,
    private allDialogRef: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: FormBuilder,
    private storageRoomStore: StorageRoomStore,
    private dataService: DataService) {
    this.createForm();

    this.storageRoomStore.currentStorageRoom.subscribe(currentRoom => {
      this.storage_room_id = currentRoom.id;
    });

  }

  createForm() {
    // create variables and validators for form fields
    this.checkInForm = this.fb.group({
      material_number: [''],
      status: ['', Validators.required],
      comment: ['']
    });
  }

  // Runs when X-button is clicked
  onNoClick(): void {
    this.allDialogRef.closeAll();
  }
  // Runs when the back arrow button is clicked
  onBackButton(): void {
    this.dialogRef.close();
  }
  // Runs when "Checka Ut" button is pressed
  onConfirm(): void {
    this.checkOutConfirmed = true;
    //console.log(this.comment);
    // TODO: check-out the materials in this.data.selectedMaterials in the back-end here together with this.comment
    for (var mat of this.data.selectedMaterials) {

      var post_data = {
        "material_number": mat,
        "storage_room": this.storage_room_id,
      };

      //If comment is added then add it to data for post-request
      if (this.comment !== "" && this.comment !== null) {
        post_data["comment"] = this.comment;
      }


      switch (this.data.status) {
        case "Utcheckat":
          this.dataService.sendPostRequest("/article/check-out", post_data).subscribe((data: any[]) => {
          })
          break;
        case "Införlivat":
          console.log(mat);
          this.dataService.sendGetRequest("/article?material_number=" + mat).subscribe((data: ArticleData) => {
            var shelf_name = data[0].shelf;
            this.dataService.sendGetRequest("/shelf/storageroom/" + post_data.storage_room).subscribe((data: ShelfData[]) => {
              for (var shelf of data) {
                if (shelf.shelf_name === shelf_name) {
                  post_data["shelf"] = shelf.id;
                }
              }
              console.log(post_data);
              this.dataService.sendPostRequest("/article/incorporate", post_data).subscribe((data: any[]) => {
              })
            })
          })

          break;
        case "Kasserat":
          this.dataService.sendPostRequest("/article/discard", post_data).subscribe((data: any[]) => {
          })
          break;
        case "Åter":
          this.dataService.sendPostRequest("/article/process", post_data).subscribe((data: any[]) => {
          })
          break;
        default:
          this.dataService.sendPostRequest("/article/check-out", post_data).subscribe((data: any[]) => {
          })

      }
    }
  }

  addMaterial(newMaterial: string): void {
    if (!this.data.selectedMaterials.includes(newMaterial)) {
      if (newMaterial.length > 0) {
        this.data.selectedMaterials.push(newMaterial);
      }
    } else {
      // duplicate
    }
  }

  removeMaterial(material: string): void {
    this.data.selectedMaterials.forEach((item, index) => {
      if (item === material) this.data.selectedMaterials.splice(index, 1);
    });
  }
  ngOnInit(): void {

  }
}
