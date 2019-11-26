import { Component, OnInit, Input } from '@angular/core';


export interface CaseInfo {
  //
}

@Component({
  selector: 'app-case-page',
  templateUrl: './case-page.component.html',
  styleUrls: ['./case-page.component.less']
})



export class CasePageComponent implements OnInit {

  @Input()reference_number: number;

  constructor() { }

  ngOnInit() {
    // this.caseInfo.branches
  }

}
