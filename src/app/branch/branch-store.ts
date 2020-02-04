import { Injectable, Output, EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Branch {
  name: String;
  id: Number;
}

@Injectable()
export class BranchStore {
    public currentBranch: BehaviorSubject<Branch> = new BehaviorSubject<Branch>({
    name: undefined,
    id: undefined,
  });

  constructor() {
    const stored = localStorage.getItem('app_config');
    let storedBranch: Branch;
    if (stored) {
      storedBranch = JSON.parse(atob(stored));
      this.setBranch(storedBranch);
    }
  }

  public setBranch(branch: Branch) {
    localStorage.setItem('app_config', btoa(JSON.stringify(branch)));
    this.currentBranch.next(branch);
  }

  public getBranch(): Branch {
    return this.currentBranch.value;
  }
}
