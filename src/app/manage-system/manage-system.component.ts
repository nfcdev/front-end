import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';


export interface Room {
  branch: string;
  room: string;
}

export interface Shelf {
  branch: string;
  room: string;
  shelf: string;
}

@Component({
  selector: 'app-manage-system',
  templateUrl: './manage-system.component.html',
  styleUrls: ['./manage-system.component.less']
})
export class ManageSystemComponent implements OnInit {
  branches: string[];
  rooms: Room[];
  shelves: Shelf[];

  chosenBranchInRoom: string;
  chosenBranchInShelf: string;
  chosenRoomInShelf: string;

  // Variables for alerts
  private _success = new Subject<string>();
  private _failed = new Subject<string>();
  successMessage: string;
  failedMessage: string;
  constructor() { }

  ngOnInit() {
    // TEMPORARY TEST DATA
    this.branches = ['Vapen', 'Bio', 'Finger']; // TODO: Get branches from back end
    this.rooms = [{ branch: 'Vapen', room: 'Vapen Material' },
    { branch: 'Vapen', room: 'Vapen Labb' },
    { branch: 'Vapen', room: 'Vapen Uppack' },
    { branch: 'Bio', room: 'Bio Material' },
    { branch: 'Bio', room: 'Bio Labb' },
    { branch: 'Bio', room: 'Bio Uppack' },
    { branch: 'Finger', room: 'Finger Material' },
    { branch: 'Finger', room: 'Finger Labb' },
    { branch: 'Finger', room: 'Finger Uppack' }];

    this.shelves = [{ branch: 'Vapen', room: 'Vapen Material', shelf: 'A15' },
    { branch: 'Vapen', room: 'Vapen Labb', shelf: 'A16' },
    { branch: 'Vapen', room: 'Vapen Uppack', shelf: 'A17' },
    { branch: 'Bio', room: 'Bio Material', shelf: 'A18' },
    { branch: 'Bio', room: 'Bio Labb', shelf: 'A19' },
    { branch: 'Bio', room: 'Bio Uppack', shelf: 'A11' },
    { branch: 'Finger', room: 'Finger Material', shelf: 'A12' },
    { branch: 'Finger', room: 'Finger Labb', shelf: 'A13' },
    { branch: 'Finger', room: 'Finger Uppack', shelf: 'A14' },

    { branch: 'Vapen', room: 'Vapen Material', shelf: 'B15' },
    { branch: 'Vapen', room: 'Vapen Labb', shelf: 'B16' },
    { branch: 'Vapen', room: 'Vapen Uppack', shelf: 'B17' },
    { branch: 'Bio', room: 'Bio Material', shelf: 'B18' },
    { branch: 'Bio', room: 'Bio Labb', shelf: 'B19' },
    { branch: 'Bio', room: 'Bio Uppack', shelf: 'B11' },
    { branch: 'Finger', room: 'Finger Material', shelf: 'B12' },
    { branch: 'Finger', room: 'Finger Labb', shelf: 'B13' },
    { branch: 'Finger', room: 'Finger Uppack', shelf: 'B14' }];

   

    this._success.subscribe((message) => this.successMessage = message);
    this._success.pipe(
      debounceTime(5000)
    ).subscribe(() => this.successMessage = null);

    this._failed.subscribe((message) => this.failedMessage = message);
    this._failed.pipe(
      debounceTime(5000)
    ).subscribe(() => this.failedMessage = null);


  }
  // Alert system
  public changeSuccessMessage(message: string) {
    this._success.next(message);
  }

  public changeFailedMessage(message: string) {
    this._failed.next(message);
  }



  // MANAGE BRANCHES
  addBranch(newBranch: string): void {
    if (newBranch.length > 0) {
      this.branches.push(newBranch);
      this.changeSuccessMessage('Ny avdelning ' + newBranch + ' skapad.');
    }
    // TODO: save new branch in back-end
  }
  removeBranch(branch: string): void {
    if (this.isEmptyBranch(branch)) {
      this.branches.forEach((item, index) => {
        if (item === branch) this.branches.splice(index, 1);

        // TODO: remove branch from back-end too
      });
      this.changeSuccessMessage('Avdelning ' + branch + ' borttagen.');
    } else {
      this.changeFailedMessage('Kan inte ta bort avdelning som innehåller incheckade material.');
    }
  }
  // Returns true if branch is empty. TODO: check in back-end if branch is empty
  isEmptyBranch(branch: string): boolean {
    if (branch == 'Vapen') {
      return false;
    } else {
      return true;
    }
  }

  // MANAGE ROOMS
  addRoom(newRoom: string): void {
    if (newRoom.length > 0) {
      if(this.chosenBranchInRoom){
      var temp: Room = { room: newRoom, branch: this.chosenBranchInRoom };
      this.rooms.push(temp);
      this.changeSuccessMessage('Nytt rum ' + newRoom + ' skapad i avdelning ' + this.chosenBranchInRoom);
      } else {
        this.changeFailedMessage('Välj en avdelning att skapa rummet i först.');
      }
    }
    // TODO: save new room in back-end
  }
  removeRoom(room: string): void {
    if (this.isEmptyRoom(room)) {
      this.rooms.forEach((item, index) => {
        if (item.room === room) this.rooms.splice(index, 1);
        this.changeSuccessMessage('Rum ' + room + ' borttagen från avdelning ' + this.chosenBranchInRoom);
        // TODO: remove room from back-end too
      });
    } else {
      this.changeFailedMessage('Kan inte ta bort rum som innehåller incheckade material');
    }
  }
  // Returns true if room is empty. TODO: check in back-end if room is empty
  isEmptyRoom(room: string): boolean {
    if (room == 'Vapen Material') {
      return false;
    } else {
      return true;
    }
  }

  // MANAGE SHELVES
  addShelf(newShelf: string): void {
    if (newShelf.length > 0) {
      if(this.chosenBranchInShelf && this.chosenRoomInShelf){
      var temp: Shelf = { shelf: newShelf, room: this.chosenRoomInShelf, branch: this.chosenBranchInShelf };
      this.shelves.push(temp);
      this.changeSuccessMessage('Ny hylla ' + newShelf + ' skapad i rum ' + this.chosenRoomInShelf +
       ' i avdelning ' + this.chosenBranchInShelf);
      } else {
        this.changeFailedMessage('Välj avdelning och rum först att skapa hyllan i först.');
      }
    }
    // TODO: save new shelf in back-end
  }
  removeShelf(shelf: string): void {
    if (this.isEmptyShelf(shelf)) {
      this.shelves.forEach((item, index) => {
        if (item.shelf === shelf) this.shelves.splice(index, 1);
        this.changeSuccessMessage('Hylla ' + shelf + ' borttagen från rum ' +
         this.chosenRoomInShelf + ' i avdelning ' + this.chosenBranchInShelf);
        // TODO: remove shelf from back-end too
      });
    } else {
      this.changeFailedMessage('Kan inte ta bort hylla som innehåller incheckade material');
    }
  }
  // Returns true if shelf is empty. TODO: check in back-end if shelf is empty
  isEmptyShelf(shelf: string): boolean {
    if (shelf == 'A15') {
      return false;
    } else {
      return true;
    }
  }

}
