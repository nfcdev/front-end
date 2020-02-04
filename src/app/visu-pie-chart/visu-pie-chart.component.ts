import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartOptions, ChartType } from 'chart.js';
import { Label, SingleDataSet, BaseChartDirective } from 'ng2-charts';
import { DataService } from '../data.service';

@Component({
  selector: 'app-visu-pie-chart',
  templateUrl: './visu-pie-chart.component.html',
  styleUrls: ['./visu-pie-chart.component.less']
})
export class VisuPieChartComponent implements OnInit {

  @ViewChild(BaseChartDirective, { static: false }) chart: BaseChartDirective;

  public pieChartOptions: ChartOptions = {
    responsive: true,
  };
  public pieChartLabels: Label[] = ['In-checkad', 'Ut-checkad'];
  public pieChartData: SingleDataSet = [1, 1];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [];

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.dataService.sendGetRequest("/article").subscribe((data: any[]) => {
      let checkedIn = 0;
      let checkedOut = 0;
      data.forEach(dataRow => {
        console.log(dataRow.status);
        if (dataRow.status === "checked_out") {
          checkedOut++;
        } else if (dataRow.status === "checked_in") {
          checkedIn++;
        }

      });
      this.pieChartData = [checkedIn, checkedOut];
      this.chart.chart.update();
    })
  }

}
