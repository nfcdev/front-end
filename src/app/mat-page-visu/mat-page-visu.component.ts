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
    maintainAspectRatio: false,
    tooltips: {
      callbacks: {
        title: function (tooltipItem, data) { return data.labels[tooltipItem[0].index]; },
        label: function (tooltipItem, data) {
          var amount = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
          var total = eval(data.datasets[tooltipItem.datasetIndex].data.join("+"));
          let t = Number.parseInt('' + amount);

          let cd = 24 * 60 * 60 * 1000;
          let ch = 60 * 60 * 1000;
          let d = Math.floor(t / cd);
          let h = Math.floor((t - d * cd) / ch);
          let m = Math.round((t - d * cd - h * ch) / 60000);
          if (m === 60) {
            h++;
            m = 0;
          }
          if (h === 24) {
            d++;
            h = 0;
          }
          return '' + d + 'd ' + h + 'h ' + m + 'm';
        },
      }
    },

  };
  public pieChartLabels: Label[] = [];
  public pieChartData: SingleDataSet = [];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [];
  public pieChartColors: Color[] = [{
    backgroundColor: ['#1862a8', '#bb2b20', '#669966', '#ffcc33',
      '#8e40b2', '#f448ce', '#f17c49']
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
        if (data[i].action == 'checked_in' || data[i].action == 'checked_out') {
          if (i !== data.length - 1) {
            this.values.set(data[i].branch, this.values.get(data[i].branch) + (data[i + 1].timestamp - data[i].timestamp));
          } else {
            this.values.set(data[i].branch, this.values.get(data[i].branch) + ((currTime.getTime() / 1000) - data[i].timestamp));
          }
        }
      }

      this.values.forEach((value, key) => {
        this.pieChartLabels.push(key);
        this.pieChartData.push((value * 1000) );

      });
      this.chart.chart.update();
    })
  }
  roundToTwo(num) {
    return num.toFixed(2);
  }

}
