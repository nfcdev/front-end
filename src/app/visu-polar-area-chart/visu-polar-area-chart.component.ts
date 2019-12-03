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
  public polarAreaChartData: SingleDataSet = [50, 80, 40, 60, 20];
  public polarAreaLegend = true;

  public polarAreaChartType: ChartType = 'polarArea';

  constructor(private dataService: DataService) { }

  ngOnInit() {
    let LabelList: Label[] = [];
    let branchIDList = [];
    let DataList: SingleDataSet = [];
    this.dataService.sendGetRequest("/branch").subscribe((data: any[]) => {
      console.log(data);
      data.forEach(dataRow => {
        LabelList.push(dataRow.name)
        branchIDList.push(dataRow.id);
      });
      this.polarAreaChartLabels = LabelList;
      for (var id of branchIDList) {
        this.dataService.sendGetRequest("/article/branch/" + id).subscribe((data: any[]) => {
          DataList.push(data.length);
        })
      }
      this.polarAreaChartData = DataList;
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
