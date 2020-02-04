import { Component, OnInit } from "@angular/core";
import { StorageRoomStore } from "../storage-room/storage-room-store";
import { StorageRoomService } from "../storage-room/storage-room.service";
import { StorageRoom } from "../storage-room/storage-room-store";

export interface RoomBranchData {
  branch: String;
  room: String;
}
// Temporary test data
const ROOM_BRANCH_DATA: RoomBranchData = { branch: undefined, room: undefined };

@Component({
  selector: "app-room-and-branch-name",
  templateUrl: "./room-and-branch-name.component.html",
  styleUrls: ["./room-and-branch-name.component.less"],
  providers: [StorageRoomStore, StorageRoomService]
}) // TODO: Get information into ROOM_BRANCH_DATA from backend instead
export class RoomAndBranchNameComponent implements OnInit {
  data: RoomBranchData = ROOM_BRANCH_DATA;
  constructor(
    private storageRoomStore: StorageRoomStore,
    private storageRoomService: StorageRoomService
  ) {}

  ngOnInit() {
    this.storageRoomStore.currentStorageRoom.subscribe(currentRoom => {
      console.log("Changed");

      this.storageRoomService
        .getBranchNameForStorageRoom(currentRoom)
        .subscribe(branchName => {
          this.data.branch = branchName;
          this.data.room = currentRoom.name;
        });
    });
  }
}
