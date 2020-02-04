import { Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label } from 'ng2-charts';
import { DataService } from '../data.service';

@Component({
  selector: 'app-visu-bar-chart',
  templateUrl: './visu-bar-chart.component.html',
  styleUrls: ['./visu-bar-chart.component.less']
})
export class VisuBarChartComponent implements OnInit {

  public barChartOptions: ChartOptions = {
    responsive: true,
  };
  public barChartLabels: Label[] = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];

  public barChartData: ChartDataSets[] = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Vapen' },
    { data: [28, 48, 40, 19, 86, 27, 90], label: 'Bio' },
    { data: [20, 32, 25, 45, 63, 37, 55], label: 'Finger' }
  ];

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.dataService.sendGetRequest("/article").subscribe((data: any[])=>{
     // console.log("From bar chart" + data);
    })
  }

}
