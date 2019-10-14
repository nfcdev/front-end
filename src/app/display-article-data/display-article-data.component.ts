import { Component, OnInit } from '@angular/core';
import { variable } from '@angular/compiler/src/output/output_ast';
//import articleData from './example_data.json';


function CreateTableFromJSON() {
  var articleData = [
    {
      "id": 1,
      "material_number": "90",
      "description": "Gevrspipa",
      "parent": null,
      "case": 61
    },
    {
      "id": 2,
      "material_number": "44",
      "description": "Tops med saliv",
      "parent": null,
      "case": 85
    }
  ]
  var col = ["Article #", "Case #", "Room", "Shelf", "Status", "Time stamp", "Last modified"];
  var table = document.createElement("table");
  table.setAttribute("class","article-data-table");
  var tr = table.insertRow(-1);
  for (var i = 0; i < col.length; i++) {
    var th = document.createElement("th");      // TABLE HEADER.
    th.innerHTML = col[i];
    tr.appendChild(th);
  }

  articleData.forEach(function(obj) {
    tr = table.insertRow(-1);

    console.log(obj.description);
    Object.keys(obj).forEach(function(key){
      var tabCell = tr.insertCell(-1);
      tabCell.innerHTML = obj[key];
    });
  });

  var divContainer = document.getElementById("showTable");
  divContainer.innerHTML = "";
  divContainer.appendChild(table);

}
@Component({
  selector: 'app-display-article-data',
  templateUrl: './display-article-data.component.html',
  styleUrls: ['./display-article-data.component.less'],
})

export class DisplayArticleDataComponent implements OnInit {
  constructor() { }
  ngOnInit() {
    CreateTableFromJSON();
  }
}
