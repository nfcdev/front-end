import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { StorageRoom } from "./storage-room-store";
import { map, find, filter, every, tap, flatMap } from "rxjs/operators";

@Injectable()
export class StorageRoomService {
  constructor(private http: HttpClient) {}

  getStorageRooms(): Observable<any> {
    return this.http.get("http://localhost:9000/storageroom");
  }

  changeStorageRoom(): Observable<any> {
    return this.http.get("http://localhost:9000/login/admin", {});
  }

  getBranchNameForStorageRoom(storageroom: StorageRoom): Observable<String> {
    return this.http.get(`http://localhost:9000/branch`).pipe(
      flatMap((x: any) => x),
      filter((x: any) => x.id === storageroom.branch),
      map((x: any) => x.name)
    );
  }
}
