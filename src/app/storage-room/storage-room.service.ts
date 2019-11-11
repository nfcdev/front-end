import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class StorageRoomService {
  constructor(private http: HttpClient) {}

  getStorageRooms(): Observable<any> {
    return this.http.get('http://localhost:9000/storageroom', { withCredentials: true });
  }

  changeStorageRoom(): Observable<any> {
    return this.http.post('http://localhost:9000/storageroom/change', {}, { withCredentials: true });
  }
}
