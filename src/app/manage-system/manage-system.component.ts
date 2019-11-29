import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { DataService } from '../data.service';

export interface DataBranch {
  id: number;
  name: string;
}

export interface Room {
  branch: string;
  room: string;
}

export interface DataRoom {
  id: number;
  branch: number;
  name: string;
}

export interface Shelf {
  branch: string;
  room: string;
  shelf: string;
}

export interface DataShelf {
  id: number;
  shelf_name: string;
  current_storage_room: number;
}

export interface DataUser {
  id: number;
  shortcode: string;
  role: string;
}

export interface DataArticle {
  material_number: string;
  reference_number: string;
  branch: string;
  storage_room: string;
  package: string;
  shelf: string;
  status: string;
  timestamp: number;
  last_modified: number;
  description: string;
}


@Component({
  selector: 'app-manage-system',
  templateUrl: './manage-system.component.html',
  styleUrls: ['./manage-system.component.less']
})
export class ManageSystemComponent implements OnInit {
  branches: string[] = [];
  dataBranches: DataBranch [] = [];
  rooms: Room[] = [];
  dataRooms: DataRoom [] = [];
  shelves: Shelf[] = [];
  dataShelves: DataShelf [] = [];
  users: string[] = [];
  admins: string[]= [];
  dataArticles: DataArticle [] = [];

  chosenBranchInRoom: string;
  chosenBranchInShelf: string;
  chosenRoomInShelf: string;

  // Variables for alerts
  private _success = new Subject<string>();
  private _failed = new Subject<string>();
  private _branchConfirmation = new Subject<string>();
  private _roomConfirmation = new Subject<string>();
  private _shelfConfirmation = new Subject<string>();
  private _userConfirmation = new Subject<string>();
  private _adminConfirmation = new Subject<string>();

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

  userConfirmationMessage: string;
  adminConfirmationMessage: string;
  userToRemove: string;
  adminToRemove: string;



  constructor(private dataService: DataService) { }

  ngOnInit() {
    // Get all branches from database
    this.dataService.sendGetRequest("/branch").subscribe((getBranches: DataBranch [] )=> {
      this.dataBranches = getBranches;
      for (let i=0; i < this.dataBranches.length ; i++) {
        this.branches.push(this.dataBranches[i].name);
      }
      // Get all storage rooms from database
      this.dataService.sendGetRequest("/storageroom").subscribe((getRooms: DataRoom []) => {
        this.dataRooms = getRooms;
        var tempRoom: Room;
        for (let i=0; i < this.dataRooms.length; i++) {
          tempRoom = {branch: this.dataBranches.find(it => it.id == this.dataRooms[i].branch).name, room: this.dataRooms[i].name };
          this.rooms.push(tempRoom);
        }
        // Get all shelves from database
        this.dataService.sendGetRequest("/shelf").subscribe((getShelves: DataShelf[]) => {
          this.dataShelves = getShelves;
          var tempShelf: Shelf;
          for (let i=0; i < this.dataShelves.length; i++) {
            tempShelf = {
              branch: this.dataBranches.find(it => it.id == this.dataRooms.find(it => it.id == this.dataShelves[i].current_storage_room).branch).name,
              room: this.dataRooms.find(it => it.id == this.dataShelves[i].current_storage_room).name,
              shelf: this.dataShelves[i].shelf_name
            }
            this.shelves.push(tempShelf);
          }
        })

      })
    });
    // Get all articles for checking if shelves are empy in "isEmptyShelf"
    this.dataService.sendGetRequest("/article").subscribe((getArticles: DataArticle []) => {
      this.dataArticles = getArticles;
    })

    // Get all users and admins from database
    this.dataService.sendGetRequest("/user").subscribe((dataUsers: DataUser []) => {
      for (let i=0; i < dataUsers.length ; i ++) {
        if (dataUsers[i].role == "user") {
          this.users.push(dataUsers[i].shortcode);
        }else if (dataUsers[i].role == "admin") {
          this.admins.push(dataUsers[i].shortcode);
        }
      }
    })



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

    this._userConfirmation.subscribe((message) => this.userConfirmationMessage = message);
    this._userConfirmation.pipe(
      debounceTime(10000)
    ).subscribe(() => this.userConfirmationMessage = null);

    this._adminConfirmation.subscribe((message) => this.adminConfirmationMessage = message);
    this._adminConfirmation.pipe(
      debounceTime(10000)
    ).subscribe(() => this.adminConfirmationMessage = null);


  }
  // Alert system methods
  public changeSuccessMessage(message: string) {
    this._success.next(message);
    this.failedMessage = null;
  }

  public changeFailedMessage(message: string) {
    this._failed.next(message);
    this.successMessage = null;
  }

  public changeBranchConfirmationMessage(message: string) {
    this._branchConfirmation.next(message);
    this.failedMessage = null;
    this.successMessage = null;
  }

  public changeRoomConfirmationMessage(message: string) {
    this._roomConfirmation.next(message);
    this.failedMessage = null;
    this.successMessage = null;
  }

  public changeShelfConfirmationMessage(message: string) {
    this._shelfConfirmation.next(message);
    this.failedMessage = null;
    this.successMessage = null;
  }

  public changeUserConfirmationMessage(message: string) {
    this._userConfirmation.next(message);
    this.failedMessage = null;
    this.successMessage = null;
  }

  public changeAdminConfirmationMessage(message: string) {
    this._adminConfirmation.next(message);
    this.failedMessage = null;
    this.successMessage = null;
  }

  public clearConfirmations(): void {
    this.branchConfirmationMessage = null;
    this.shelfConfirmationMessage = null;
    this.roomConfirmationMessage = null;
    this.userConfirmationMessage = null;
    this.adminConfirmationMessage = null;
  }


  // --------------- MANAGE BRANCHES -----------------------

  // Adds a new branch
  addBranch(newBranch: string): void {
    this.clearConfirmations();
    if (!this.branches.includes(newBranch)) {
      if (newBranch.length > 0) {
        // Saves the new branch to back-end and updates the branch-list in front-end.
        this.dataService.sendPostRequest("/branch", {"name": newBranch}).subscribe(data=>{ console.log(data)});
        this.branches.push(newBranch);
        this.changeSuccessMessage('Du har lagt till avdelning ' + newBranch + '.');

      } else {
        this.changeFailedMessage('Avdelning ' + newBranch + ' finns redan.')
      }
    }
    
  }
  // Sends the confirmation message to remove a branch
  removeBranchConfirmation(branch: string): void {
    this.clearConfirmations();
    this.successMessage = null;
    this.failedMessage = null;
    if (this.isEmptyBranch(branch)) {
      this.changeBranchConfirmationMessage('Vill du verkligen ta bort avdelning ' + branch + '?');
      this.branchToRemove = branch;
    } else {
      this.changeFailedMessage('Kan inte ta bort avdelning som innehåller rum.');
      this.clearConfirmations();
    }
  }

  // Removes the branch when the confirm button is pressed
  removeBranch(branch: string): void {
    this.dataService.sendGetRequest("/branch").subscribe((getBranches: DataBranch []) =>  {
      console.log(getBranches.find(it => it.name === branch).id);
      this.dataService.sendDeleteRequest("/branch/" + getBranches.find(it => it.name === branch).id).subscribe();
      this.branches.splice(this.branches.indexOf(branch), 1);
    })
    this.changeSuccessMessage('Avdelning ' + branch + ' borttagen.');
    this.clearConfirmations();
  }

  // TEMPORARY: Returns true if branch is empty. TODO: check in back-end if branch is empty
  isEmptyBranch(branch: string): boolean {
    // TODO : Check database instead
    if (this.rooms.find(it => it.branch === branch)) {
      return false;
    } else {
      return true;
    }
  }

  // ----------------- MANAGE ROOMS -------------------------
  addRoom(newRoom: string): void {
    this.clearConfirmations();

    var temp: Room = { room: newRoom, branch: this.chosenBranchInRoom };
    if (newRoom.length > 0) {
      if (this.chosenBranchInRoom) {
        if (!this.roomAlreadyExists(newRoom, this.chosenBranchInRoom)) {
          // Add the new room to the database.
          this.dataService.sendPostRequest("/storageroom", {"name": newRoom, "branch": this.dataBranches.find(it => it.name == this.chosenBranchInRoom).id}).subscribe(data => {console.log(data)});
          this.rooms.push(temp);
          this.changeSuccessMessage('Du har lagt till rum ' + newRoom + '.');
        } else {
          this.changeFailedMessage('Rum ' + newRoom + ' finns redan i denna avdelning.');
        }
      }
    }
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
    this.clearConfirmations();
    this.successMessage = null;
    this.failedMessage = null;
    if (this.isEmptyRoom(room)) {
      this.changeRoomConfirmationMessage('Vill du verkligen ta bort rum ' + room + '?');
      this.roomToRemove = room;
      this.roomToRemoveBranch = branch;
    } else {
      this.changeFailedMessage('Kan inte ta bort rum som innehåller incheckade material');
      this.clearConfirmations();
    }

  }
  removeRoom(room: string): void {
    this.dataService.sendGetRequest("/storageroom").subscribe((getRooms:DataRoom[])=> {
      this.dataService.sendDeleteRequest("/storageroom/" + getRooms.find(it => it.name === room).id).subscribe();
    })
    this.rooms.forEach((item, index) => {
      if (item.room === room) this.rooms.splice(index, 1);
    });
    this.changeSuccessMessage('Rum ' + room + ' borttagen från avdelning ' + this.roomToRemoveBranch);
    this.clearConfirmations();
    this.chosenRoomInShelf = null;
    // TODO: remove room from back-end too
  }
  // TEMPORARY: Returns true if room is empty. TODO: check in back-end if room is empty
  isEmptyRoom(room: string): boolean {
    // TODO : Check database instead
    if (this.shelves.find(it => it.room === room)) {
      return false;
    } else {
      return true;
    }
  }

  // ------------------------ MANAGE SHELVES ---------------------------------
  addShelf(newShelf: string): void {
    this.clearConfirmations();

    var temp: Shelf = { shelf: newShelf, room: this.chosenRoomInShelf, branch: this.chosenBranchInShelf };
    if (this.chosenBranchInShelf && this.chosenRoomInShelf) {
      if (newShelf.length > 0) {
        if (!this.shelfAlreadyExists(newShelf, this.chosenRoomInShelf, this.chosenBranchInShelf)) {
          this.dataService.sendPostRequest("/shelf/storageroom/" 
                                          + this.dataRooms.find(it => it.name === this.chosenRoomInShelf).id,
                                           {"shelf_name": newShelf}).subscribe();
          this.shelves.push(temp);
          this.changeSuccessMessage('Du har lagt till hylla ' + newShelf + '.');
        } else {
          this.changeFailedMessage('Hylla ' + newShelf + ' finns redan i detta rum');
        }
      }
    }
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
    this.clearConfirmations();
    this.successMessage = null;
    this.failedMessage = null;
    if (this.isEmptyShelf(shelf)) {
      this.changeShelfConfirmationMessage('Vill du verkligen ta bort hylla ' + shelf + '?');
      this.shelfToRemove = shelf;
      this.shelfToRemoveRoom = room;
      this.shelfToRemoveBranch = branch;
    } else {
      this.changeFailedMessage('Kan inte ta bort hylla som innehåller incheckade material');
      this.clearConfirmations();
    }

  }
  removeShelf(shelf: string): void {
    this.dataService.sendGetRequest("/shelf").subscribe((getShelves:DataShelf[]) => {
      this.dataService.sendDeleteRequest("/shelf/" + getShelves.find(it => it.shelf_name === shelf).id).subscribe();
    })
    this.shelves.forEach((item, index) => {
      if (item.shelf === shelf) this.shelves.splice(index, 1);
    });
    this.changeSuccessMessage('Hylla ' + shelf + ' borttagen från rum ' +
      this.shelfToRemoveRoom + '.');
    this.clearConfirmations();
    // TODO: remove shelf from back-end too
  }
  // TEMPORARY: Returns true if shelf is empty. TODO: check in back-end if shelf is empty
  isEmptyShelf(shelf: string): boolean {
    if (this.dataArticles.find(it => it.shelf === shelf)) {
      return false;
    } else {
      return true;
    }
  }

  // --------------- MANAGE USERS -----------------------

  // Adds a new user
  addUser(newUser: string): void {
    this.clearConfirmations();
    if (!this.users.includes(newUser)) {
      if (newUser.length > 0) {
        this.users.push(newUser);
        this.changeSuccessMessage('Du har lagt till användare ' + newUser + '.');
        // TODO: save new user in back-end
      }
    } else {
      this.changeFailedMessage('Användare ' + newUser + ' finns redan.')
    }

  }
  // Sends the confirmation message to remove a user
  removeUserConfirmation(user: string): void {
    this.clearConfirmations();
    this.successMessage = null;
    this.failedMessage = null;

    if (this.isEmptyUser(user)) {
      if (!this.admins.includes(user)) {
        this.changeUserConfirmationMessage('Vill du verkligen ta bort användare ' + user + '?');
        this.userToRemove = user;
      } else {
        this.changeFailedMessage('Kan inte ta bort en användare som är admin.');
        this.clearConfirmations();
      }
    } else {
      this.changeFailedMessage('Kan inte ta bort en användare som har utcheckade material.');
      this.clearConfirmations();
    }
  }

  // Removes the user when the confirm button is pressed
  removeUser(user: string): void {
    this.users.forEach((item, index) => {
      if (item === user) this.users.splice(index, 1);

      // TODO: remove user from back-end too
    });
    this.changeSuccessMessage('Användare ' + user + ' borttagen.');
    this.clearConfirmations();
  }
  // TEMPORARY: Returns true if user doesnt have any checked-out materials . TODO: check in back-end if user is "empty"
  isEmptyUser(user: string): boolean {
    if (user == 'user2') {
      return false;
    } else {
      return true;
    }
  }

  // --------------- MANAGE ADMINS -----------------------

  // Adds a new admin
  addAdmin(newAdmin: string): void {
    this.clearConfirmations();
    if (this.users.includes(newAdmin)) {
      if (!this.admins.includes(newAdmin)) {
        if (newAdmin.length > 0) {
          this.admins.push(newAdmin);
          this.changeSuccessMessage('Du har lagt till användare ' + newAdmin + ' som admin.');
          // TODO: save new admin status in back-end
        }
      } else {
        this.changeFailedMessage('Användare ' + newAdmin + ' är redan admin.');
      }
    } else {
      if (newAdmin.length > 0) {
        this.changeFailedMessage('Användare ' + newAdmin + ' finns inte.');
      }
    }

  }
  // Sends the confirmation message to remove an admin
  removeAdminConfirmation(admin: string): void {
    this.clearConfirmations();
    this.successMessage = null;
    this.failedMessage = null;
    this.changeAdminConfirmationMessage('Vill du verkligen ta bort användare ' + admin + ' som admin?');
    this.adminToRemove = admin;
  }

  // Removes the admin when the confirm button is pressed
  removeAdmin(admin: string): void {
    this.admins.forEach((item, index) => {
      if (item === admin) this.admins.splice(index, 1);

      // TODO: remove admin from back-end too
    });
    this.changeSuccessMessage('Användare ' + admin + ' är nu inte längre admin.');
    this.clearConfirmations();
  }


}
