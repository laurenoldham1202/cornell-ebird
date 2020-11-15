import { Component, OnInit } from '@angular/core';

import * as M from 'mapbox-gl';

// @ts-ignore
import * as data from 'src/assets/michigan-hex-update.json';
import { SliderService } from '../footer/slider/slider.service';
import {MapService} from './map.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  map: M.Map;

  data = (data as any).default;

  week: number;

  constructor(
    private mapService: MapService,
    private sliderService: SliderService,
  ) { }

  ngOnInit(): void {
    (M as any).accessToken = 'pk.eyJ1IjoibGF1cmVub2xkaGFtMTIwMiIsImEiOiJjaW55dm52N2gxODJrdWtseWZ5czAyZmp5In0.YkEUt6GvIDujjudu187eyA';

    this.map = new M.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/dark-v10', // stylesheet location
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
          // 'fill-outline-color': '#EEE',
          'fill-color': [
            'interpolate',
            ['linear'],
            ['get', 'stats_week_1'],  // default at 1 week
            0,
            'transparent',
            0.15,
            '#fec027',
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
        this.week = week;
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
            '#fec027',
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

        // TODO make fn for stats_week
        this.map.setFilter('birds', ['>', `stats_week_${week}`, 0]);

        const values = [];
        // console.log(this.data);
        this.data.features.forEach(feature => {
          // console.log(feature.properties);
          values.push(feature.properties[`stats_week_${week}`]);
        });

        const highlights = {
          min: Math.min(...values).toFixed(3), // TODO Use different value for no hex - % coverage? peak week?
          max: Math.max(...values).toFixed(3),
          count: week,
          mean: this.mean(values).toFixed(3),
          hexSelected: false,
        };
        this.mapService.updateHighlights(highlights);

      });


      this.map.on('click', 'birds', (e) => {
        // console.log(e.features[0].properties);
        const props = e.features[0].properties;
        const values = [];
        Object.entries(props).forEach(([key, value]) => {
          if (key !== 'id') {
            values.push(value);
          }
        });

        // const highlights = {
        //   min: Math.min(...values).toFixed(3),
        //   max: Math.max(...values).toFixed(3),
        //   count: values.filter(x => x > 0).length,
        //   mean: this.mean(values).toFixed(3),
        //   hexSelected: true,
        // };
        // this.mapService.updateHighlights(highlights);


        // console.log('min: ', Math.min(...values));
        // console.log('min: ', Math.max(...values));
        // console.log('mean: ', props[`stats_week_${this.week}`]);
        // console.log('weeks: ', values.filter(x => x > 0).length);

      });
    });


  }

  mean(nums) {
    return nums.reduce((a, b) => (a + b)) / nums.length;
  }

}
