import { Component, OnInit, ViewChild } from '@angular/core';
import { SingleDataSet, Label, BaseChartDirective } from 'ng2-charts';
import { ChartType } from 'chart.js';
import { DataService } from '../data.service';

@Component({
  selector: 'app-visu-polar-area-chart',
  templateUrl: './visu-polar-area-chart.component.html',
  styleUrls: ['./visu-polar-area-chart.component.less']
})
export class VisuPolarAreaChartComponent implements OnInit {

  @ViewChild(BaseChartDirective, { static: false }) chart: BaseChartDirective;

  public polarAreaChartLabels: Label[] = ['Vapen', 'Bio', 'Finger', 'Drog', 'Brand'];
  public polarAreaChartData: SingleDataSet = [0, 0, 0, 0, 0];
  public polarAreaLegend = true;

  public polarAreaChartType: ChartType = 'polarArea';

  constructor(private dataService: DataService) { }

  ngOnInit() {
    let LabelList: Label[] = [];
    let DataList: SingleDataSet = [];
    var branchMap = new Map();
    this.dataService.sendGetRequest("/branch").subscribe((data: any[]) => {   //Gets all branches
      console.log(data);
      data.forEach(dataRow => {
        LabelList.push(dataRow.name)
        branchMap.set(dataRow.name, 0);
      });
      this.polarAreaChartLabels = LabelList;
      this.dataService.sendGetRequest("/article").subscribe((data: any[]) => {  //Gets all articles
        data.forEach(dataRow => {                                               //Loop though all articles to count them
          for (var i = 0; i <= LabelList.length; ++i){
            if (dataRow.branch === LabelList[i]){
              branchMap.set(LabelList[i], (branchMap.get(LabelList[i]))+1);     //Adds count for correct branch
            }
          }
        });
        for (var branch of LabelList){
          DataList.push(branchMap.get(branch));
        }
        this.polarAreaChartData = DataList;
      })      
    })
    this.chart.chart.update();
  }

  // events
  public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

}
