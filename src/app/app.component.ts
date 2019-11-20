import { Component, OnInit } from "@angular/core";
import { AuthenticationService } from "./auth/authService";
import { Router } from "@angular/router";
import { LoginService } from "./login/login.service";
import { StorageRoomService } from "./storage-room/storage-room.service";
import {
  StorageRoomStore,
  StorageRoom
} from "./storage-room/storage-room-store";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.less"],
  providers: [LoginService, StorageRoomService]
})
export class AppComponent implements OnInit {
  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private loginService: LoginService,
    private storageRoomService: StorageRoomService,
    private storageRoomStore: StorageRoomStore
  ) {}
  userLoggedIn = false;
  user = {};
  title = "front-end";
  storageRooms = [];
  selectedStorageRoomId = this.storageRoomStore.getStorageRoom().id;
  selectedStorageName = this.storageRoomStore.getStorageRoom().name;

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
}
