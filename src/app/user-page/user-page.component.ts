import { Component, OnInit, Input, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { AuthenticationService } from '../auth/authService';
import { Router } from '@angular/router';
import { DataService } from '../data.service'


export interface MaterialData {
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

export interface UserData {
  id: number;
  shortcode: string;
  role: string;
  unaccountedTime: number;
}

export interface DialogData{
  materials: MaterialData[];
  user: any;
  unaccountedTime: string;
}

// Temporary test data
//const MATERIALS: string[] = ['55123123', '42123123', '33123123', '42123123', '7723123333', '33123123', '21123'];


@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.less']
})
export class UserPageComponent implements OnInit {

  materials: MaterialData[];
  user : UserData;
  unaccountedTime: number;

  constructor(public dialog: MatDialog,
    private authService: AuthenticationService,
    private router: Router,
    private dataService: DataService,
    ) { }


  openDialog(): void {

    // TODO: Get unnacounted time from back-end



    const dialogRef = this.dialog.open(UserPageDialogComponent, {
      width: '1000px',
      height: '500px',
      data:
      {
       materials: this.materials,
       user: this.user,
      }
    });
    dialogRef.afterClosed().subscribe(result => {

      if(result != null ){
        this.authService.logout();
        this.router.navigateByUrl("/");
      } else {
        
      }
    });

  }
  ngOnInit() {
    // fetches the user
    this.authService.user.subscribe(user => {
      console.log("user", user);
      this.user = user;

    });

    this.dataService.sendGetRequest("/user/me").subscribe((data: UserData) => {
      console.log(data);
      this.user = data;
      console.log(this.user);
      this.unaccountedTime = this.user.unaccountedTime;
      console.log(this.unaccountedTime);
    })


    this.dataService.sendGetRequest("/user/material").subscribe((data: MaterialData[]) => {
      console.log(data);
      this.materials = data;
      console.log(this.materials);
    })


  }

}

@Component({
  selector: 'app-user-page-dialog',
  templateUrl: './user-page-dialog.component.html',
})
export class UserPageDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<UserPageDialogComponent>,
    private allDialogRef: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    ) {
      console.log(data.materials);
    }

    // Runs when X-button is clicked
  onNoClick(): void {
    this.allDialogRef.closeAll();
  }
  onBackButton(): void {
    this.dialogRef.close();
  }
}
