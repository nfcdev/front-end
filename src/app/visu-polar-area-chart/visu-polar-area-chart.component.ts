import { Component, OnInit } from '@angular/core';
import { SingleDataSet, Label } from 'ng2-charts';
import { ChartType } from 'chart.js';

@Component({
  selector: 'app-visu-polar-area-chart',
  templateUrl: './visu-polar-area-chart.component.html',
  styleUrls: ['./visu-polar-area-chart.component.less']
})
export class VisuPolarAreaChartComponent implements OnInit {

  public polarAreaChartLabels: Label[] = ['Vapen', 'Bio', 'Finger', 'Drog', 'Brand'];
  public polarAreaChartData: SingleDataSet = [50, 80, 40, 60, 20];
  public polarAreaLegend = true;

  public polarAreaChartType: ChartType = 'polarArea';

  constructor() { }

  ngOnInit() {
  }

  // events
  public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

}
