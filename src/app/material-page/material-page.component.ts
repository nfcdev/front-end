import { Component, OnInit, Input, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon'
import { MatTable } from '@angular/material/table';
import { FormGroup, FormControl } from '@angular/forms';
import { DataService } from '../data.service';



// Event table fields
export interface EventTable {
  date: string;
  event: string;
  branch: string;
  room: string;
  shelf: string;
  package: string;
  user: string;
  comment: string;
}

// Material info fields
export interface MaterialInfo {
  created_by: string;
  created_date: string;
  status: string;
  current_placement: string;
  last_modified: string;
  description: string;
}


export interface DialogData {
  material_number: string;
  event_data: EventTable[];
  material_data: MaterialInfo;
  article_id: number;
}

// The different statuses a material can have
const STATUSES: string[] = ['Incheckad', 'Utcheckad', 'Åter', 'Införlivad', 'Kasserad'];

@Component({
  selector: 'app-material-page',
  templateUrl: './material-page.component.html',
  styleUrls: ['./material-page.component.less']
})
export class MaterialPageComponent implements OnInit {
  @Input() material_number: string;
  table_data: EventTable[];
  material_data: MaterialInfo;
  article_id : number;


  constructor(public dialog: MatDialog,
    private dataService: DataService) {


  }

  load(): void {
    this.table_data = [];

    this.dataService.sendGetRequest('/article?material_number=' + this.material_number).subscribe((data: any[]) => {
      let createdTime = new Date(data[0].timestamp * 1000);
      let lastModTime = new Date(data[0].last_modified * 1000);
      let currPlacement: string = '';
      if (data[0].package == ' - ') {
        currPlacement += '' + data[0].branch + '; ' + data[0].storage_room + '; ' + data[0].shelf + '; Löst';
      } else {
        currPlacement += '' + data[0].branch + '; ' + data[0].storage_room + '; ' + data[0].shelf + '; ' + data[0].package;
      }

      this.article_id = data[0].id;

      this.dataService.sendGetRequest('/storage-event/article/' + data[0].id).subscribe((events: any[]) => {
        let sortedEvents : any [] = events.sort( (a, b ) => (a.timestamp > b.timestamp) ? 1 : -1);
        sortedEvents.forEach( (event) => {
          let tempData : EventTable = {date: this.formatDateWithTime(new Date(event.timestamp*1000)), 
            event: this.convertStatus(event.status), branch: event.branch, room : event.storage_room,
          shelf: event.shelf, package: event.package, user: event.user, comment: event.comment};
          this.table_data.push(tempData);
        });



        this.material_data = {
          status: this.convertStatus(data[0].status), created_by: sortedEvents[0].user,
          created_date: this.formatDateNoTime(createdTime),
          current_placement: currPlacement, last_modified: this.formatDateWithTime(lastModTime), description: data[0].description
        };

        this.openDialog();



      });

    });
  }

  convertStatus(status): string {
    if (status == 'processed') {
      return 'Åter';
    } else if (status == 'checked_out') {
      return 'Utcheckad';
    } else if (status == 'checked_in') {
      return 'Incheckad';
    } else if (status == 'discarded') {
      return 'Kasserad'
    } else {
      return 'Införlivad';
    }

  }


  formatDateNoTime(time: Date): string {
    let yearFormated: string = '' + time.getUTCFullYear();
    let monthFormated: string;
    let dateFormated: string;


    // Adds a 0 before month/date/hours if they are below 10 for formating
    // Adds 1 to month since otherwise January is month 0.
    if ((time.getUTCMonth() + 1) < 10) {
      monthFormated = '0' + (time.getUTCMonth() + 1);
    } else {
      monthFormated = '' + (time.getUTCMonth() + 1);
    }
    if (time.getUTCDate() < 10) {
      dateFormated = '0' + time.getUTCDate();
    } else {
      dateFormated = '' + time.getUTCDate();
    }
    return '' + yearFormated +
      monthFormated + dateFormated;
  }
  formatDateWithTime(time: Date): string {
    let yearFormated: string = '' + time.getUTCFullYear();
    let monthFormated: string;
    let dateFormated: string;
    let hoursFormated: string;
    let minutesFormated: string;


    // Adds a 0 before month/date/hours if they are below 10 for formating
    // Adds 1 to month since otherwise January is month 0.
    if ((time.getUTCMonth() + 1) < 10) {
      monthFormated = '0' + (time.getUTCMonth() + 1);
    } else {
      monthFormated = '' + (time.getUTCMonth() + 1);
    }
    if (time.getUTCDate() < 10) {
      dateFormated = '0' + time.getUTCDate();
    } else {
      dateFormated = '' + time.getUTCDate();
    }
    if (time.getUTCHours() < 10) {
      hoursFormated = '0' + time.getUTCHours();
    } else {
      hoursFormated = '' + time.getUTCHours();
    }
    if (time.getUTCMinutes() < 10) {
      minutesFormated = '0' + time.getUTCMinutes();
    } else {
      minutesFormated = '' + time.getUTCMinutes();
    }
    return '' + yearFormated +
      monthFormated + dateFormated + ' ' +
      hoursFormated + '.' + minutesFormated;
  }

  openDialog(): void {

    const dialogRef = this.dialog.open(MaterialPageDialogComponent, {
      width: '1000px',
      height: '500px',
      data:
      {
        material_number: this.material_number,
        article_id: this.article_id,
        event_data: this.table_data,
        material_data: this.material_data
      }
    });

  }

  ngOnInit() {
  }

}


@Component({
  selector: 'app-material-page-dialog',
  templateUrl: './material-page-dialog.component.html',
})
export class MaterialPageDialogComponent implements OnInit {
  displayedColumns = ['comment', 'date', 'event', 'branch', 'room', 'shelf', 'package', 'user'];
  dataSource = this.data.event_data;
  statuses: string[] = STATUSES;

  constructor(
    public dialogRef: MatDialogRef<MaterialPageDialogComponent>,
    private allDialogRef: MatDialog,
    private dataService: DataService,
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
  // Runs when description box is unfocused
  saveDescription(): void {
    var putData = {"description": this.data.material_data.description};
    this.dataService.sendPutRequest('/article/' + this.data.article_id, putData).subscribe( (res) => {
      //console.log(res);
    });
  }

  ngOnInit(): void {
  
  }
}


