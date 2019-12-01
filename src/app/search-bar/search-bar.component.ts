import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, Input } from '@angular/core';
import { MatChipInputEvent } from '@angular/material';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DataService } from '../data.service'
import { TableArticleDataComponent } from '../table-article-data/table-article-data.component'
import { AnimationFrameScheduler } from 'rxjs/internal/scheduler/AnimationFrameScheduler';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { log } from 'util';

//import { dataSource, transformData } from '../table-article-data/table-article-data.component'


// This creates the type "option" which collects the data from the search
export interface Option {
  value: string;
}


export interface ArticleData {
  material_number: string;
  reference_number: string;
  branch: string;
  storage_room: string;
  shelf: string;
  package: string;
  status: string;
  timestamp: number;
  last_modified: number;
}

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.less'],
  providers: [TableArticleDataComponent]
})
export class SearchBarComponent {
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  options: Option[] = [];
  activeMaterials: Boolean = true;
  inactiveMaterials: Boolean = false;
  searchData: ArticleData[];
  @Input() articleTable: TableArticleDataComponent;
  checkInForm: FormGroup;


  constructor(private dataService: DataService,
    private fb: FormBuilder) {
    this.createForm();
  }

  createForm() {
    // create variables and validators for form fields
    this.checkInForm = this.fb.group({
      searchcomponent: [''],
    });

  }
  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    // Add our input searchoption
    if ((value || '').trim()) {

      var option: Option = { value: value.trim() }

      this.options.push(option);

      this.search();
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(option: Option): void {
    const index = this.options.indexOf(option);
    if (index >= 0) {
      this.options.splice(index, 1);
    }
    this.search();
  }

  onSubmit(): void {

    const size = this.options.length;
    this.options.splice(0, size);

    this.search();
  }

  // Triggers each time checkbox "activeMaterials" is changed
  changeActive() {
    this.inactiveMaterials = !this.activeMaterials;
    this.search();
  }

  // Triggers each time checkbox "inactiveMaterials" is changed
  changeInactive() {
    this.activeMaterials = !this.inactiveMaterials;
    this.search();
  }

  createQuery(): String {
    //Loop through options + create string
    var query: String = "?";
    for (var opt of this.options) {
      query = query + "q" + "=" + opt.value + "&";
    }

    return query;
  }

  getStatusNames(): String[] {
    if (this.activeMaterials) {
      return ["checked_in", "checked_out"];
    }

    if (this.inactiveMaterials) {
      return ["discarded", "processed", "incorporated"];
    }
  }

  filterStatus(material): ArticleData[] {
    var currentStatusNames: String[] = this.getStatusNames();
    var filteredData: ArticleData[] = [];
    for (var mat of material) {
      if (mat.status === currentStatusNames[0] || mat.status === currentStatusNames[1]) {
        filteredData.push(mat);
      }
    }
    return filteredData;
  }

  getSearchData(query) {

    this.dataService.sendGetRequest("/article/search" + query).subscribe((data: ArticleData[]) => {
      this.searchData = this.filterStatus(data);
      this.articleTable.setTableData(this.searchData);
    })
  }

  search() {
    this.getSearchData(this.createQuery());
  }

}
