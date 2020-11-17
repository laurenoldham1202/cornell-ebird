import { Component, OnInit } from '@angular/core';
import * as data from 'src/assets/michigan-hex-update.json';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  // data2 = (data as any).default;
  // dataSeries = [
  //   {name: 'mean', series: []},
  //   {name: 'min', series: []},
  //   {name: 'max', series: []},
  // ];
  //
  //
  // // TODO hide on small screen sizes
  // view: any[] = [90, 90];
  // // view: any[] = [500, 250];  // 560 310
  //
  // // options
  // legend: boolean = false;
  // showLabels: boolean = false;
  // animations: boolean = true;
  // xAxis: boolean = false;
  // yAxis: boolean = false;
  // showYAxisLabel: boolean = false;
  // showXAxisLabel: boolean = false;
  // xAxisLabel: string = '';
  // yAxisLabel: string = '';
  // timeline: boolean = true;
  //
  // colorScheme = {
  //   domain: ['#c7457a', '#fec027', '#673ab7']
  // };

  constructor() { }

  ngOnInit(): void {

    // const keys = Object.keys(this.data2.features[0].properties);
    // keys.splice(keys.indexOf('id'), 1);
    // const vals = {};
    //
    // const mean = this.dataSeries.filter(x => x.name === 'mean')[0]['series'];
    // const min = this.dataSeries.filter(x => x.name === 'min')[0]['series'];
    // const max = this.dataSeries.filter(x => x.name === 'max')[0]['series'];
    //
    // keys.forEach(key => {
    //   // console.log(key);
    //   vals[key] = [];
    //
    //   this.data2.features.forEach(feature => {
    //     vals[key].push(feature.properties[key]);
    //   });
    //   max.push({value: Math.max(...vals[key]), name: key});
    //   min.push({value: Math.min(...vals[key]), name: key});
    //   mean.push({value: this.mean(vals[key]), name: key});
    // });

  }


  // TODO move to shared service
  mean(nums) {
    return nums.reduce((a, b) => (a + b)) / nums.length;
  }

}
