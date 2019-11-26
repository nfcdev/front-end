import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnInit } from '@angular/core';
import { MatChipInputEvent, MatCheckboxModule, MatCheckbox } from '@angular/material';
import { 
  applyFilter, 
  updateFilters, 
  includeActiveMaterials, 
  includeAllMaterials, 
  includeInactiveMaterials 
} from '../table-article-data/table-article-data.component';
import { TableArticleDataItem } from '../table-article-data/table-article-data-datasource';
import EXAMPLE_DATA from '../table-article-data/example_data.json';


// This creates the type "option" which collects the data from the search
export interface Option {
  name: string;
  category: string; // Will represent a post in the table: {reference_number, material_number, storage_room, shelf, package, status}
}

export const activeStatuses: String [] = ["check_in", "check_out"];
export const inactiveStatuses: String [] = ["discarded", "processed"];

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
  statuses: String [] = activeStatuses.concat(inactiveStatuses);
  shelves: String [] = [];

  // Triggers each time checkbox "activeMaterials" is changed
  changeActive() {
    if (this.activeMaterials) {
      includeAllMaterials(this.options);
    }else {
      this.inactiveMaterials = true;
      includeInactiveMaterials(this.options);
    }
  }

    // Triggers each time checkbox "inactiveMaterials" is changed
  changeInactive() {
    if (this.inactiveMaterials) {
      includeAllMaterials(this.options);
    }else {
      this.activeMaterials = true;
      includeActiveMaterials(this.options);
    }
  }
  
  ngOnInit() {
    // Adds all of the storage storageRooms
    for (let i = 0; i < this.tableData.length; i++) {
      if ((this.storageRooms.includes(this.tableData[i].storage_room))==false) {
        this.storageRooms.push(this.tableData[i].storage_room)
      }
    }
    // Adds all of the shelves
    for (let i = 0; i < this.tableData.length; i++) {
      if ((this.shelves.includes(this.tableData[i].shelf))==false) {
        this.shelves.push(this.tableData[i].shelf)
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

      if ((value || '').trim().length == 6) {
        tempCategory = "Fall";
      }
      if ((value || '').trim().length == 2) {
        tempCategory = "Material";
      }
      if (this.storageRooms.includes((value || '').trim())) {
        tempCategory = "Avdelning"
      }
      if (this.statuses.includes((value || '').trim())) {
        tempCategory = "Status"
      }
      if (this.shelves.includes((value || '').trim())) {
        tempCategory = "Hylla"
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
      updateFilters(this.options)
    }
  }
}

