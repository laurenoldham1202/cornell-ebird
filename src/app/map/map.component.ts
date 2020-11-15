import { Component, OnInit } from '@angular/core';

import * as M from 'mapbox-gl';

// @ts-ignore
import * as data from 'src/assets/michigan-hex.json';
import { SliderService } from '../footer/slider/slider.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  map: M.Map;

  data = (data as any).default;

  constructor(
    private sliderService: SliderService,
  ) { }

  ngOnInit(): void {
    (M as any).accessToken = 'pk.eyJ1IjoibGF1cmVub2xkaGFtMTIwMiIsImEiOiJjaW55dm52N2gxODJrdWtseWZ5czAyZmp5In0.YkEUt6GvIDujjudu187eyA';

    this.map = new M.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
      center: { lon: -86.76249, lat: 45.10906 },
      zoom: 5.60,
    });

    // console.log(this.data);

    this.data.features.forEach(feature => {
      // console.log(feature);
    });

    this.sliderService.week$.subscribe((week: number) => {
      // console.log(this.data.features[10]);
      console.log(this.data.features[10].properties[`stats_week_${week}`]);
    });
  }

}
