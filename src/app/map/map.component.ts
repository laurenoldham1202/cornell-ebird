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
      center: { lon: -86.35249, lat: 44.90906 },
      zoom: 4.80,
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
          'fill-color': this.setFillColor(),
        }
      });


      this.sliderService.week$.subscribe((week: number) => {
        this.week = week;
        this.map.setPaintProperty('birds', 'fill-color', this.setFillColor());
        this.map.setFilter('birds', ['>', this.getSelectedWeek(), 0]);

        const values = [];
        this.data.features.forEach(feature => {
          values.push(feature.properties[this.getSelectedWeek()]);
        });

        const highlights = {
          min: Math.min(...values).toFixed(3), // TODO Use different value for no hex - % coverage? peak week?
          max: Math.max(...values).toFixed(3),
          // count: week,
          count: this.convertWeekToDate(),
          mean: this.mean(values).toFixed(3),
          hexSelected: false,
        };
        this.mapService.updateHighlights(highlights);

      });

      // TODO change birds layer cursor
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

  getSelectedWeek() {
    return `stats_week_${this.week}`;
  }

  setFillColor() {
    return [
      'interpolate',
      ['linear'],
      ['get', this.getSelectedWeek()],  // default at 1 week
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
    ] as M.Expression;
  }

  convertWeekToDate() {
    const weekMs = 60 * 60 * 1000 * 24 * 7;
    const anchorDate = new Date(2018, 0, 4);
    const date = this.week === 1 ? anchorDate : new Date(anchorDate.getTime() + (weekMs * (this.week - 1)));
    return date.toLocaleDateString();
  }

  mean(nums) {
    return nums.reduce((a, b) => (a + b)) / nums.length;
  }

}
