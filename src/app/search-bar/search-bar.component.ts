import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnInit } from '@angular/core';
import { MatChipInputEvent } from '@angular/material';
import { applyFilter, removeFilter } from '../table-article-data/table-article-data.component';
import { TableArticleDataItem } from '../table-article-data/table-article-data-datasource';
import EXAMPLE_DATA from '../table-article-data/example_data.json';


// This creates the type "option" which collects the data from the search
export interface Option {
  name: string;
  category: string; // Will represent a post in the table: {reference_number, material_number, storage_room, shelf, package, status}
}

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.less']
})

export class SearchBarComponent implements OnInit {
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  options: Option[] = [];
  activeMaterials: Boolean = true;
  inactiveMaterials: Boolean = false;
  tableData: TableArticleDataItem [] = EXAMPLE_DATA; // TODO: adjust for actual data
  storageRooms: String [] = [];

  ngOnInit() {
    // Adds all of the storage storageRooms
    for (let i = 0; i < this.tableData.length; i++) {
      if ((this.storageRooms.includes(this.tableData[i].storage_room))==false) {
        this.storageRooms.push(this.tableData[i].storage_room)
      }
    }
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    var tempCategory = '?';

    // Add our input searchoption
    if ((value || '').trim()) {
      // The following functions categorise the input option and is currently based on the "example_data.json"
      // TODO: Update according to fit the actual data.
      /** IMPORTANT! The name of the tempCategories created below are used in "table-article-data.component.ts" as well,
       *  so if they are changed here they need to altered in that file also*/ 

      // Reference number
      if ((value || '').trim().length == 6) {
        tempCategory = "Fall";
      }
      // Material number
      if ((value || '').trim().length == 2) {
        tempCategory = "Material";
      }
      if (this.storageRooms.includes((value || '').trim())) {
        tempCategory = "Avdelning"
      }
      var tempOption: Option =  { name: value.trim(), category: tempCategory }
      this.options.push({ name: value.trim(), category: tempCategory });
      applyFilter(tempOption);
    }
    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove (option: Option):void {
    const index = this.options.indexOf(option);
    if (index >=0) {
      this.options.splice(index, 1);
      removeFilter(this.options)
    }
  }
}

