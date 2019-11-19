import { Injectable, Output, EventEmitter } from '@angular/core'
import { SelectionModel } from '@angular/cdk/collections';

@Injectable()
export class MaterialCheckOutService {

  @Output() checkBoxChange: EventEmitter<SelectionModel<[]>> = new EventEmitter();

  update(newSelection: SelectionModel<[]> ) {
    this.checkBoxChange.emit(newSelection);
  }
}