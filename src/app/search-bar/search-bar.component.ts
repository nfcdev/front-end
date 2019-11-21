import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component } from '@angular/core';
import { MatChipInputEvent } from '@angular/material';
import { MatCheckboxModule } from '@angular/material/checkbox';

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
export class SearchBarComponent  {
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  options: Option[] = [];
  activeMaterials: Boolean = true;
  inactiveMaterials: Boolean = false;

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    var tempCategory = '?';

    // Add our input searchoption
    if ((value || '').trim()) {
      // The following functions categorise the input option and is currently based on the "example_data.json"
      // TODO: Update according to fit the actual data.

      // Reference number
      if ((value || '').trim().length == 6) {
        tempCategory = "reference_number";
      }
      // Material number
      if ((value || '').trim().length == 2) {
        tempCategory = "material_number";
      }
      var tempOption: Option =  { name: value.trim(), category: tempCategory }
      this.options.push({ name: value.trim(), category: tempCategory });
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
    }
  }

  onSubmit ():void {
    // TODO: handle the output and filter the table
    
    const size = this.options.length;
    for (let i =0; i < size; i++ ){
      console.log(this.options[i]);
    }
    this.options.splice(0, size);
  }

}
