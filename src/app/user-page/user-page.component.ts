import { Component, OnInit, Input, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { AuthenticationService } from '../auth/authService';
import { Router } from '@angular/router';


export interface DialogData{
  materials: string[];
  user: any;
  unaccountedTime: string;
}

// Temporary test data
const MATERIALS: string[] = ['55123123', '42123123', '33123123', '42123123', '7723123333', '33123123', '21123'];


@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.less']
})
export class UserPageComponent implements OnInit {
  materials: string[] = MATERIALS;
  user : any;
  unaccountedTime: string;
  constructor(public dialog: MatDialog,
    private authService: AuthenticationService,
    private router: Router,
    ) { }


  openDialog(): void {

    // TODO: Get unnacounted time from back-end
    // TODO: Get materials related to this.user here
    this.unaccountedTime = '21d 2h 3m';



    const dialogRef = this.dialog.open(UserPageDialogComponent, {
      width: '1000px',
      height: '500px',
      data:
      {
       materials: this.materials,
       user: this.user,
       unaccountedTime : this.unaccountedTime
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
    }

    // Runs when X-button is clicked
  onNoClick(): void {
    this.allDialogRef.closeAll();
  }
  onBackButton(): void {
    this.dialogRef.close();
  }
}
