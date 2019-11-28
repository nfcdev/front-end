import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { StorageRoom } from "./storage-room-store";
import { map, find, filter, every, tap, flatMap } from "rxjs/operators";

import { environment } from '../../environments/environment';

const BACKEND_URL = `${environment.URL}`;

@Injectable()
export class StorageRoomService {
  constructor(private http: HttpClient) {}

  getStorageRooms(): Observable<any> {
    return this.http.get(`${BACKEND_URL}/storageroom`);
  }

  changeStorageRoom(): Observable<any> {
    return this.http.get(`${BACKEND_URL}/login/admin`, {});
  }

  getBranchNameForStorageRoom(storageroom: StorageRoom): Observable<String> {
    return this.http.get(`${BACKEND_URL}/branch`).pipe(
      flatMap((x: any) => x),
      filter((x: any) => x.id === storageroom.branch),
      map((x: any) => x.name)
    );
  }
}
