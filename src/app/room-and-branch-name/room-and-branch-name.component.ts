import { Component, OnInit} from '@angular/core';



export interface RoomBranchData {
  branch: string;
  room: string;
}
// Temporary test data
const ROOM_BRANCH_DATA: RoomBranchData[] = [{branch: "Vapen", room: "Materialrum 2"},
{branch: "Bio", room:"Materialrum 11"}];

@Component({
  selector: 'app-room-and-branch-name',
  templateUrl: './room-and-branch-name.component.html',
  styleUrls: ['./room-and-branch-name.component.less']
})

  // TODO: Get information into ROOM_BRANCH_DATA from backend instead
export class RoomAndBranchNameComponent implements OnInit { 
  data: RoomBranchData[] = ROOM_BRANCH_DATA;
  constructor() { }

  ngOnInit() {
  }

}