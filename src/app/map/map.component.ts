import { Component, OnInit } from '@angular/core';

import * as M from 'mapbox-gl';

// @ts-ignore
import * as data from 'src/assets/michigan-hex-update.json';
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
      zoom: 4.60,
    });

    this.map.on('style.load', () => {
      this.map.addSource('birds', {
        type: 'geojson',
        data: this.data,
      });

      // ['#fec027', '#f1a43a', '#e4874e', '#d76862', '#c7457a', '#a43580', '#7e2884', '#561a88', '#1e078d']
      this.map.addLayer({
        'id': 'birds',
        'type': 'fill',
        'source': 'birds',
        'paint': {
          'fill-opacity': 0.95,
          'fill-outline-color': '#EEE',
          'fill-color': [
            'interpolate',
            ['linear'],
            ['get', 'stats_week_1'],  // default at 1 week
            0,
            'transparent',
            0.15,
            '#f1a43a',
            0.43,
            '#e4874e',
            0.66,
            '#d76862',
            0.89,
            '#c7457a',
            1.18,
            '#a43580',
            1.61,
            '#7e2884',
            2.09,
            '#561a88',
            3.4,
            '#1e078d'
          ],
        }
      });

      this.map.setFilter('birds', ['>', 'stats_week_1', 0]);

      // console.log(this.map.getSource('birds'));

      this.sliderService.week$.subscribe((week: number) => {
        // console.log(this.data.features[10]);
        // console.log(this.data.features[10].properties[`stats_week_${week}`]);
        // 0 - 3.4
        this.map.setPaintProperty('birds', 'fill-color',
          [
            'interpolate',
            ['linear'],
            ['get', `stats_week_${week}`],
            0,
            'transparent',
            0.15,
            '#f1a43a',
            0.43,
            '#e4874e',
            0.66,
            '#d76862',
            0.89,
            '#c7457a',
            1.18,
            '#a43580',
            1.61,
            '#7e2884',
            2.09,
            '#561a88',
            3.4,
            '#1e078d'
          ]);

        this.map.setFilter('birds', ['>', `stats_week_${week}`, 0]);

      });


    });


  }

}
