import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { ChartOptions, ChartType } from 'chart.js';
import { Label, SingleDataSet, BaseChartDirective, Color } from 'ng2-charts';
import { DataService } from '../data.service';


@Component({
  selector: 'app-mat-page-visu',
  templateUrl: './mat-page-visu.component.html',
  styleUrls: ['./mat-page-visu.component.less']
})
export class MatPageVisuComponent implements OnInit {
  @Input() article_id: number;
  @ViewChild(BaseChartDirective, { static: false }) chart: BaseChartDirective;

  public pieChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false
  };
  public pieChartLabels: Label[] = [];
  public pieChartData: SingleDataSet = [];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [];
  public pieChartColors: Color[] = [{
    backgroundColor: ['#1862a8', '#bb2b20', '#669966', '#ffcc33',
     '#8e40b2','#f448ce','#f17c49']
  }];

  values: Map<string, number> = new Map<string, number>();

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.pieChartLabels = [];
    this.pieChartData = [];
    this.dataService.sendGetRequest("/storage-event/article/" + this.article_id).subscribe((data: any[]) => {

      data.forEach((dat) => {

        this.values.set(dat.branch, 0);


      });
      let currTime = new Date();

      for (var i = 0; i < data.length; i++) {
        if (data[i].action == 'checked_in' || data[i].action =='checked_out' ) {
          if (i !== data.length - 1) {
            this.values.set(data[i].branch, this.values.get(data[i].branch) + (data[i + 1].timestamp - data[i].timestamp));
          } else {
            this.values.set(data[i].branch, this.values.get(data[i].branch) + ((currTime.getTime() / 1000) - data[i].timestamp));
          }
        }
      }

      this.values.forEach((value, key) => {
        this.pieChartLabels.push(key);
        this.pieChartData.push(Math.floor((value) / (60 * 60 * 24)));

      });
      this.chart.chart.update();
    })
  }

}
