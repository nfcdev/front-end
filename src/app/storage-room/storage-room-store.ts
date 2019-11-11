import { Injectable, Output, EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

export interface StorageRoom {
  name: String;
  id: Number;
  branch: Number;
}

@Injectable()
export class StorageRoomStore {
  public currentStorageRoom: BehaviorSubject<StorageRoom> = new BehaviorSubject<StorageRoom>({
    name: undefined,
    id: undefined,
    branch: undefined
  });

  constructor() {
    const storedRoom = JSON.parse(atob(localStorage.getItem('app_config')));
    if (storedRoom) this.setStorageRoom(storedRoom);
  }

  public setStorageRoom(storageRoom: StorageRoom) {
    localStorage.setItem('app_config', btoa(JSON.stringify(storageRoom)));
    this.currentStorageRoom.next(storageRoom);
  }

  public getStorageRoom(): StorageRoom {
    return this.currentStorageRoom.value;
  }
}
