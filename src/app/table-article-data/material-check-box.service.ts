import { Injectable, Output, EventEmitter } from '@angular/core'
import { SelectionModel } from '@angular/cdk/collections';

@Injectable()
export class MaterialCheckBoxService {
// Make it possible to subscribe to checkbox changes in other components
  @Output() checkBoxChange: EventEmitter<SelectionModel<[]>> = new EventEmitter();
// Call to update the selected checkboxes
  update(newSelection: SelectionModel<[]> ) {
    this.checkBoxChange.emit(newSelection);
  }

  
}