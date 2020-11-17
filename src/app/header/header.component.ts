import { Component, OnInit } from '@angular/core';
import * as data from 'src/assets/michigan-hex-update.json';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  data2 = (data as any).default;
  dataSeries = [
    {name: 'mean', series: []},
    {name: 'min', series: []},
    {name: 'max', series: []},
  ];

  data = [
    {
      "name": "mean",
      "series": [
        {
          "value": 0.3,
          "name": "a"
        },
        {
          "value": 0.5,
          "name": "b"
        },
        {
          "value": 1.5,
          "name": "c"
        },
        {
          "value": 0.75,
          "name": "d"
        },
        {
          "value": 0.3,
          "name": "e"
        }
      ]
    },
    {
      "name": "min",
      "series": [
        {
          "value": 0.03,
          "name": "a"
        },
        {
          "value": 0.15,
          "name": "b"
        },
        {
          "value": 1.05,
          "name": "c"
        },
        {
          "value": 0.795,
          "name": "d"
        },
        {
          "value": 0.23,
          "name": "e"
        }
      ]
    },
    ];
  view: any[] = [500, 250];

  // options
  legend: boolean = false;
  showLabels: boolean = false;
  animations: boolean = true;
  xAxis: boolean = false;
  yAxis: boolean = false;
  showYAxisLabel: boolean = false;
  showXAxisLabel: boolean = false;
  xAxisLabel: string = '';
  yAxisLabel: string = '';
  timeline: boolean = true;

  colorScheme = {
    domain: ['#c7457a', '#fec027', '#673ab7']
  };

  constructor() { }

  ngOnInit(): void {
    // console.log(this.dataSeries.filter(x => x.name === 'mean')[0]['series']);
    // console.log(...this.dataSeries)

    const keys = Object.keys(this.data2.features[0].properties);
    keys.splice(keys.indexOf('id'), 1);
    // console.log(keys);
    const values = [];
    const vals = {};

    const mean = this.dataSeries.filter(x => x.name === 'mean')[0]['series'];
    const min = this.dataSeries.filter(x => x.name === 'min')[0]['series'];
    const max = this.dataSeries.filter(x => x.name === 'max')[0]['series'];

    keys.forEach(key => {
      // console.log(key);
      vals[key] = [];

      this.data2.features.forEach(feature => {
        vals[key].push(feature.properties[key]);
      });
      max.push({value: Math.max(...vals[key]), name: key});
      min.push({value: Math.min(...vals[key]), name: key});
      mean.push({value: this.mean(vals[key]), name: key});
    });

    console.log(this.dataSeries);
    // console.log(vals);

    this.data2.features.forEach(feature => {
      // keys.forEach(key => {
      //   values.push(feature.properties[key]);
      // });
      // dataSeries = [
      //   {name: 'mean', series: []},
      //   {name: 'min', series: []},
      //   {name: 'max', series: []},
      // ];
      // console.log(feature.properties);
      const props = feature.properties;
      // console.log(props);

      // Object.entries(props).forEach(([key, value]) => {
      //   if (key !== 'id') {
      //     console.log(key);
      //     // mean.push({name: key, value: value});
      //
      //   }
      // });

    });

  }


  // TODO move to shared service
  mean(nums) {
    return nums.reduce((a, b) => (a + b)) / nums.length;
  }

}
