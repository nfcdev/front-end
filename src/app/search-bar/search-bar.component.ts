import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, Input } from '@angular/core';
import { MatChipInputEvent } from '@angular/material';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DataService } from '../data.service'
import { TableArticleDataComponent } from '../table-article-data/table-article-data.component'

// This creates the type "option" which collects the data from the search
export interface Option {
  name: string;
  value: string;
  category: string;
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


export interface Category {
  category: string;
  name: string;
}

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.less'],
  providers: [TableArticleDataComponent]
})
export class SearchBarComponent {

  searchCategory: Category[] = [{ "category": "Materialnummer", "name": "material_number" },
  { "category": "Diarienummer", "name": "reference_number" },
  { "category": "Rum", "name": "storage_room" },
  { "category": "Hylla", "name": "shelf" },
  { "category": "Paket", "name": "package_number" }];

  category: string;
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


  constructor(private dataService: DataService) { }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    // Add our input searchoption
    if ((value || '').trim() && this.category !== undefined) {

      var cat: Category[] = this.searchCategory.filter(obj => {
        if (obj.category === this.category) {
          return obj;
        }
      })


      var option: Option = { value: value.trim(), name: cat[0].name, category: cat[0].category }

      this.options.push(option);

      this.search();
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(option: Option): void {
    console.log("remove");
    const index = this.options.indexOf(option);
    if (index >= 0) {
      this.options.splice(index, 1);
    }
    this.search();
  }

  onSubmit(): void {

    const size = this.options.length;
    for (let i = 0; i < size; i++) {
      console.log(this.options[i]);
    }
    this.options.splice(0, size);

    this.search();
  }

  createQuery(): String {
    //Loop through options + create string
    var query: String = "?";
    for (var opt of this.options) {
      query = query + opt.name + "=" + opt.value + "&";
    }
    console.log("creating query", query);

    return query;
  }


  getSearchData(query) {
    console.log("query was:", query);

    this.dataService.sendGetRequest("/article" + query).subscribe((data: ArticleData[]) => {
      this.searchData = data;
      this.articleTable.setTableData(data);
    })
  }

  search() {
    this.getSearchData(this.createQuery());
  }

}
