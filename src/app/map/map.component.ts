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

    this.map.on('style.load', () => {
      this.map.addSource('birds', {
        type: 'geojson',
        data: this.data,
      });

      this.map.addLayer({
        'id': 'birds',
        'type': 'fill',
        'source': 'birds',
        'paint': {
          'fill-opacity': 0.5,
          'fill-outline-color': '#EEE',
          'fill-color': [
            'interpolate',
            ['linear'],
            ['get', 'stats_week_1'],  // default at 1 week
            0,
            '#F2F12D',
            0.075,
            '#EED322',
            0.15,
            '#E6B71E',
            0.2,
            '#DA9C20',
            0.33,
            '#CA8323',
            1,
            '#B86B25',
            3,
            '#A25626',
            4.5,
            '#8B4225',
            6,
            '#723122'
          ],
        }
      });

      console.log(this.map.getSource('birds'));

      this.sliderService.week$.subscribe((week: number) => {
        // console.log(this.data.features[10]);
        console.log(this.data.features[10].properties[`stats_week_${week}`]);
        this.map.setPaintProperty('birds', 'fill-color',
          [
            'interpolate',
            ['linear'],
            ['get', `stats_week_${week}`],
            0,
            '#F2F12D',
            0.075,
            '#EED322',
            0.15,
            '#E6B71E',
            0.2,
            '#DA9C20',
            0.33,
            '#CA8323',
            1,
            '#B86B25',
            3,
            '#A25626',
            4.5,
            '#8B4225',
            6,
            '#723122'
          ],)
      });
    });


  }

}
