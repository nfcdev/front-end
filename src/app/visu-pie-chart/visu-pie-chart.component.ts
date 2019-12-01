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

  @ViewChild(BaseChartDirective) chart: BaseChartDirective;

  public pieChartOptions: ChartOptions = {
    responsive: true,
  };
  public pieChartLabels: Label[] = ['Vapen', 'Bio', 'Finger', 'Drog'];
  public pieChartData: SingleDataSet = [300, 500, 200, 300];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [];

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.dataService.sendGetRequest("/article").subscribe((data: any[])=>{
     let noOfVapen = 0;
     let noOfDNA = 0;
     let noOfFinger = 0;
     let noOfBio = 0;
      data.forEach(dataRow => {
        console.log(dataRow.branch);
        if (dataRow.branch == 'Vapen'){
          noOfVapen++;
          this.pieChartData[0] = noOfVapen;
        } else if (dataRow.branch == 'Bio-analys'){
          noOfBio++;
          this.pieChartData[1] = noOfBio;
        } else if (dataRow.branch == 'Finger'){
          noOfFinger++;
          this.pieChartData[2] = noOfFinger;
        } else if (dataRow.branch == 'DNA'){
          noOfDNA++;
          this.pieChartData[3] = noOfDNA;
        }
      });
      this.chart.chart.update();
    })
  }

}
