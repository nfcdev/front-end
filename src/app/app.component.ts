import { Component, OnInit } from "@angular/core";
import { AuthenticationService } from "./auth/authService";
import { Router } from "@angular/router";
import { LoginService } from "./login/login.service";
import { StorageRoomService } from "./storage-room/storage-room.service";
import {
  StorageRoomStore,
  StorageRoom
} from "./storage-room/storage-room-store";
import { BranchService } from './branch/branch.service';
import { BranchStore, Branch } from './branch/branch-store';

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.less"],
  providers: [LoginService, StorageRoomService, BranchService]
})
export class AppComponent implements OnInit {
  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private loginService: LoginService,
    private storageRoomService: StorageRoomService,
    private storageRoomStore: StorageRoomStore,
    private branchService: BranchService,
    private branchStore: BranchStore
  ) {}
  userLoggedIn = false;
  user:any = {};
  title = "front-end";
  storageRooms: StorageRoom [] = [];
  storageRoomsInCurrentBranch: StorageRoom [] = [];
  selectedStorageRoomId = this.storageRoomStore.getStorageRoom().id;
  selectedStorageName = this.storageRoomStore.getStorageRoom().name;
  branches: Branch [] = [];
  selectedBranchId = this.storageRoomStore.getStorageRoom().branch;
  selectedBranchName : String;
  
  isAdmin: boolean = false;

  ngOnInit(): void {
    this.storageRoomService
    .getBranchNameForStorageRoom(this.storageRoomStore.getStorageRoom())
    .subscribe(branchName => {
      this.selectedBranchName = branchName;
    });
    this.authService.user.subscribe(user => {
      this.user = user;
      this.isAdmin = this.authService.isUserAdmin();
    });
    this.authService.isUserLoggedIn.subscribe(loggedIn => {
      this.userLoggedIn = loggedIn;
    });
    this.branchService.getBranches().subscribe(res => {
      this.branches = res;
    });
    this.storageRoomStore.currentStorageRoom.subscribe(room => {
      this.selectedStorageRoomId = room.id;
      this.selectedStorageName = room.name;
      this.selectedBranchId = room.branch;
      for (let i=0; i < this.branches.length ; i++) { 
        if (this.branches[i].id == this.selectedBranchId) {
          this.selectedBranchName = this.branches[i].name;
        }
      }
      console.log("Vi gick in hit");
      console.log(this.selectedBranchName);
    });
    this.storageRoomService.getStorageRooms().subscribe(res => {
      this.storageRooms = res;
      this.updateStorageRoomsInCurrentBranch();
    });
  }

  updateStorageRoomsInCurrentBranch() {
    this.storageRoomsInCurrentBranch = [];
    for (let i=0; i < this.storageRooms.length; i ++) {
      if (this.storageRooms[i].branch == this.selectedBranchId) {
        this.storageRoomsInCurrentBranch.push(this.storageRooms[i]);
      }
    }
  }

  logOut(): void {
    this.authService.logout();
    this.router.navigateByUrl("/");
  }

  onStorageRoomSelected(roomId) {
    this.storageRoomService.changeStorageRoom().subscribe(res => {
      if (res) {
        this.storageRoomStore.setStorageRoom(
          this.storageRooms.find(it => it.id == roomId)
        );
      }
    });
  }

  onBranchSelected(branchId) {
    this.branchService.changeBranch().subscribe(res => {
      if (res) {
        this.branchStore.setBranch(
          this.branches.find(it => it.id == branchId)
        );
        this.updateStorageRoomsInCurrentBranch();
        this.storageRoomStore.setStorageRoom(
          this.storageRoomsInCurrentBranch[0]
        );
      }
    });
  }
}
