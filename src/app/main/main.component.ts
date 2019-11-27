import { Component, OnInit } from "@angular/core";
import { StorageRoomStore, StorageRoom } from '../storage-room/storage-room-store';
import { StorageRoomService } from '../storage-room/storage-room.service';
import { AuthenticationService } from '../auth/authService';

@Component({
  selector: "app-main",
  templateUrl: "./main.component.html",
  styleUrls: ["./main.component.less"],
  providers: [StorageRoomService]
})
export class MainComponent implements OnInit {
  constructor(
    private storageRoomService: StorageRoomService,
    private storageRoomStore: StorageRoomStore,
    private authService: AuthenticationService) {}  

  viewOnly: Boolean = false;
  isAdmin: Boolean = false;

  ngOnInit() {
    this.authService.user.subscribe(user => {
      this.isAdmin = this.authService.isUserAdmin();
    });
    let storageRooms: StorageRoom[] = [];
    this.storageRoomService.getStorageRooms().subscribe(res => {
      storageRooms = res;
    })
    this.storageRoomStore.currentStorageRoom.subscribe(res => {
      if (!res.id && !this.isAdmin) {
        this.viewOnly = true;
      }
    })
        console.log("Viewonly = " + this.viewOnly);
  }
}
