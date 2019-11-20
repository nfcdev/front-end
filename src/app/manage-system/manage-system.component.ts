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
  private _branchConfirmation = new Subject<string>();
  private _roomConfirmation = new Subject<string>();
  private _shelfConfirmation = new Subject<string>();
  successMessage: string;
  failedMessage: string;

  // Variables for removal confirmation alerts
  branchConfirmationMessage: string;
  branchToRemove: string;

  roomConfirmationMessage: string;
  roomToRemove: string;
  roomToRemoveBranch: string;

  shelfConfirmationMessage: string;
  shelfToRemove: string;
  shelfToRemoveRoom: string;
  shelfToRemoveBranch: string;

 
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



    // Sets up the alert system subscriptions. Debounce time sets how long the message stays before it disappears.
    this._success.subscribe((message) => this.successMessage = message);
    this._success.pipe(
      debounceTime(5000)
    ).subscribe(() => this.successMessage = null);

    this._failed.subscribe((message) => this.failedMessage = message);
    this._failed.pipe(
      debounceTime(5000)
    ).subscribe(() => this.failedMessage = null);

    this._branchConfirmation.subscribe((message) => this.branchConfirmationMessage = message);
    this._branchConfirmation.pipe(
      debounceTime(10000)
    ).subscribe(() => this.branchConfirmationMessage = null);

    this._roomConfirmation.subscribe((message) => this.roomConfirmationMessage = message);
    this._roomConfirmation.pipe(
      debounceTime(10000)
    ).subscribe(() => this.roomConfirmationMessage = null);

    this._shelfConfirmation.subscribe((message) => this.shelfConfirmationMessage = message);
    this._shelfConfirmation.pipe(
      debounceTime(10000)
    ).subscribe(() => this.shelfConfirmationMessage = null);


  }
  // Alert system methods
  public changeSuccessMessage(message: string) {
    this._success.next(message);
  }

  public changeFailedMessage(message: string) {
    this._failed.next(message);
  }

  public changeBranchConfirmationMessage(message: string) {
    this._branchConfirmation.next(message);
  }

  public changeRoomConfirmationMessage(message: string) {
    this._roomConfirmation.next(message);
  }

  public changeShelfConfirmationMessage(message: string) {
    this._shelfConfirmation.next(message);
  }



  // --------------- MANAGE BRANCHES -----------------------

  // Adds a new branch
  addBranch(newBranch: string): void {
    this.branchConfirmationMessage = null;
    this.shelfConfirmationMessage = null;
    this.roomConfirmationMessage = null;
    if (!this.branches.includes(newBranch)) {
      if (newBranch.length > 0) {
        this.branches.push(newBranch);
        this.changeSuccessMessage('Du har lagt till avdelning ' + newBranch + '.');
      }
    } else {
      this.changeFailedMessage('Avdelning ' + newBranch + ' finns redan.')
    }
    // TODO: save new branch in back-end
  }
  // Sends the confirmation message to remove a branch
  removeBranchConfirmation(branch: string): void {
    this.successMessage = null;
    this.failedMessage = null;
    if (this.isEmptyBranch(branch)) {
      this.changeBranchConfirmationMessage('Vill du verkligen ta bort avdelning ' + branch + '?');
      this.branchToRemove = branch;
    } else {
      this.changeFailedMessage('Kan inte ta bort avdelning som innehåller incheckade material.');
      this.branchConfirmationMessage = null;
      this.shelfConfirmationMessage = null;
      this.roomConfirmationMessage = null;
    }
  }

  // Removes the branch when the confirm button is pressed
  removeBranch(branch: string): void {
    this.branches.forEach((item, index) => {
      if (item === branch) this.branches.splice(index, 1);

      // TODO: remove branch from back-end too
    });
    this.changeSuccessMessage('Avdelning ' + branch + ' borttagen.');
    this.branchConfirmationMessage = null;
    this.chosenBranchInRoom = null;
    this.chosenBranchInShelf = null;
  }
  // TEMPORARY: Returns true if branch is empty. TODO: check in back-end if branch is empty
  isEmptyBranch(branch: string): boolean {
    if (branch == 'Vapen') {
      return false;
    } else {
      return true;
    }
  }

  // ----------------- MANAGE ROOMS -------------------------
  addRoom(newRoom: string): void {
    this.branchConfirmationMessage = null;
    this.shelfConfirmationMessage = null;
    this.roomConfirmationMessage = null;

    var temp: Room = { room: newRoom, branch: this.chosenBranchInRoom };
    if (this.chosenBranchInRoom) {
      if (!this.roomAlreadyExists(newRoom, this.chosenBranchInRoom)) {
        if (newRoom.length > 0) {
          this.rooms.push(temp);
          this.changeSuccessMessage('Du har lagt till rum ' + newRoom + '.');
        }
      } else {
        this.changeFailedMessage('Rum ' + newRoom + ' finns redan i denna avdelning.');
      }
    } else {
      this.changeFailedMessage('Välj en avdelning att skapa rummet i först.');
    }
    // TODO: save new room in back-end
  }
  roomAlreadyExists(room: string, branch: string): boolean {
    var exists: boolean = false;
    this.rooms.forEach(function (value) {
      if (value.room.match(room) && value.branch.match(branch)) {
        exists = true;
      }
    });
    return exists;
  }
  removeRoomConfirmation(room: string, branch: string): void {
    this.successMessage = null;
    this.failedMessage = null;
    if (this.isEmptyRoom(room)) {
      this.changeRoomConfirmationMessage('Vill du verkligen ta bort rum ' + room + '?');
      this.roomToRemove = room;
      this.roomToRemoveBranch = branch;
    } else {
      this.changeFailedMessage('Kan inte ta bort rum som innehåller incheckade material');
      this.branchConfirmationMessage = null;
      this.shelfConfirmationMessage = null;
      this.roomConfirmationMessage = null;
    }

  }
  removeRoom(room: string): void {
    this.rooms.forEach((item, index) => {
      if (item.room === room) this.rooms.splice(index, 1);
    });
    this.changeSuccessMessage('Rum ' + room + ' borttagen från avdelning ' + this.roomToRemoveBranch);
    this.roomConfirmationMessage = null;
    this.chosenRoomInShelf = null;
    // TODO: remove room from back-end too
  }
  // TEMPORARY: Returns true if room is empty. TODO: check in back-end if room is empty
  isEmptyRoom(room: string): boolean {
    if (room == 'Vapen Material') {
      return false;
    } else {
      return true;
    }
  }

  // ------------------------ MANAGE SHELVES ---------------------------------
  addShelf(newShelf: string): void {
    this.branchConfirmationMessage = null;
    this.shelfConfirmationMessage = null;
    this.roomConfirmationMessage = null;

    var temp: Shelf = { shelf: newShelf, room: this.chosenRoomInShelf, branch: this.chosenBranchInShelf };
    if (this.chosenBranchInShelf && this.chosenRoomInShelf) {
      if (!this.shelfAlreadyExists(newShelf, this.chosenRoomInShelf, this.chosenBranchInShelf)) {
        if (newShelf.length > 0) {
          this.shelves.push(temp);
          this.changeSuccessMessage('Du har lagt till hylla ' + newShelf + '.');
        }
      } else {
        this.changeFailedMessage('Hylla ' + newShelf + ' finns redan i detta rum');
      }
    } else {
      this.changeFailedMessage('Välj avdelning och rum att skapa hyllan i först.');
    }
    // TODO: save new shelf in back-end
  }
  shelfAlreadyExists(shelf: string, room: string, branch: string): boolean {
    var exists: boolean = false;
    this.shelves.forEach(function (value) {
      if (value.shelf.match(shelf) && value.room.match(room) && value.branch.match(branch)) {
        exists = true;
      }
    });
    return exists;
  }

  removeShelfConfirmation(shelf: string, room: string, branch: string): void {
    this.successMessage = null;
    this.failedMessage = null;
    if (this.isEmptyShelf(shelf)) {
      this.changeShelfConfirmationMessage('Vill du verkligen ta bort hylla ' + shelf + '?');
      this.shelfToRemove = shelf;
      this.shelfToRemoveRoom = room;
      this.shelfToRemoveBranch = branch;
    } else {
      this.changeFailedMessage('Kan inte ta bort hylla som innehåller incheckade material');
      this.branchConfirmationMessage = null;
      this.shelfConfirmationMessage = null;
      this.roomConfirmationMessage = null;
    }

  }
  removeShelf(shelf: string): void {
    this.shelves.forEach((item, index) => {
      if (item.shelf === shelf) this.shelves.splice(index, 1);
    });
    this.changeSuccessMessage('Hylla ' + shelf + ' borttagen från rum ' +
        this.shelfToRemoveRoom + '.');
      this.shelfConfirmationMessage = null;
      // TODO: remove shelf from back-end too
  }
  // TEMPORARY: Returns true if shelf is empty. TODO: check in back-end if shelf is empty
  isEmptyShelf(shelf: string): boolean {
    if (shelf == 'A15') {
      return false;
    } else {
      return true;
    }
  }

}
