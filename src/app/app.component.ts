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
import { BranchStore } from './branch/branch-store';

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
  user = {};
  title = "front-end";
  storageRooms = [];
  selectedStorageRoomId = this.storageRoomStore.getStorageRoom().id;
  selectedStorageName = this.storageRoomStore.getStorageRoom().name;
  branches = [];
  selectedBranchId = this.branchStore.getBranch().id;
  selectedBranchName = this.branchStore.getBranch().name;

  isAdmin: boolean = false;

  ngOnInit(): void {
    this.authService.user.subscribe(user => {
      console.log("user", user);
      this.user = user;
      this.isAdmin = this.authService.isUserAdmin();
    });
    this.authService.isUserLoggedIn.subscribe(loggedIn => {
      console.log("loggedIn", loggedIn);

      this.userLoggedIn = loggedIn;
    });
    this.storageRoomStore.currentStorageRoom.subscribe(room => {
      this.selectedStorageRoomId = room.id;
      this.selectedStorageName = room.name;
    });
    this.storageRoomService.getStorageRooms().subscribe(res => {
      this.storageRooms = res;
    });
    this.branchStore.currentBranch.subscribe(branch => {
      this.selectedBranchId = branch.id;
      this.selectedBranchName = branch.name;
    });
    this.branchService.getBranches().subscribe(res => {
      this.branches = res;
    });
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
      }
    });
  }
}
