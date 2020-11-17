import {Component, HostListener, OnInit} from '@angular/core';
import {MapService} from '../map/map.service';
import * as data from '../../assets/michigan-hex-update.json';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  highlights; // TODO type

  data2 = (data as any).default;
  dataSeries = [
    {name: 'mean', series: []},
    {name: 'min', series: []},
    {name: 'max', series: []},
  ];


  // TODO hide on small screen sizes
  // view: any[] = [90, 90];
  view: any[] = [850, 275];  // 560 310

  // options
  legend: boolean = false;
  showLabels: boolean = false;
  animations: boolean = false;
  xAxis: boolean = false;
  yAxis: boolean = false;
  showYAxisLabel: boolean = false;
  showXAxisLabel: boolean = false;
  xAxisLabel: string = 'Week';
  yAxisLabel: string = 'Abundance';
  timeline: boolean = true;

  colorScheme = {
    domain: ['#c7457a', '#fec027', '#673ab7']
  };

  screenWidth = window.outerWidth;

  constructor(
    private mapService: MapService,
  ) { }

  ngOnInit(): void {
    this.mapService.highlights$.subscribe(highlights => {
      if (highlights) {
        this.highlights = highlights;
      }
    });

    const keys = Object.keys(this.data2.features[0].properties);
    keys.splice(keys.indexOf('id'), 1);
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
  }


  // TODO move to shared service
  mean(nums) {
    return nums.reduce((a, b) => (a + b)) / nums.length;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.screenWidth = event.target.outerWidth;
  }
}
