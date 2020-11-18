import {Component, HostListener, OnInit} from '@angular/core';

import * as M from 'mapbox-gl';
import * as T from '@turf/turf';
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

  screenWidth = window.outerWidth;
  stateBounds = {type: 'Polygon', coordinates: []};

  hexHighlights;  // TODO type
  stateHighlights;

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

    this.data.features.forEach(feature => {
      feature.id = feature.properties.id;
    });

    this.map.on('style.load', () => {
      this.map.addSource('birds', {
        type: 'geojson',
        data: this.data,
      });

      // instantiate empty geojson for clicked footprints
      this.map.addSource('hex', {type: 'geojson', data: {type: 'FeatureCollection', features: [ ]}});

      // ['#fec027', '#f1a43a', '#e4874e', '#d76862', '#c7457a', '#a43580', '#7e2884', '#561a88', '#1e078d']
      this.map.addLayer({
        'id': 'birds',
        'type': 'fill',
        'source': 'birds',
        'paint': {
          'fill-opacity': 0.8,
          'fill-color': this.setFillColor(),
          'fill-outline-color': ['case', ['boolean', ['feature-state', 'clicked'], false], '#EEE', 'transparent'],
          // 'fill-opacity': ['case', ['boolean', ['feature-state', 'clicked'], false], 1, 0.75],
        }
      });

      this.map.getSource('birds')['_data'].features.forEach(feature => {
        this.stateBounds.coordinates.push(feature.geometry.coordinates[0][0]);
      });

      this.fitBbox(this.stateBounds, this.screenWidth <= 800);

      this.sliderService.week$.subscribe((week: number) => {
        this.week = week;
        this.map.setPaintProperty('birds', 'fill-color', this.setFillColor());
        this.map.setFilter('birds', ['>', this.getSelectedWeek(), 0]);

        const values = [];
        this.data.features.forEach(feature => {
          if (this.hexHighlights?.id === feature.properties.id) {
            this.hexHighlights.value = feature.properties[this.getSelectedWeek()].toFixed(3);
          }
          values.push(feature.properties[this.getSelectedWeek()]);
        });

        this.stateHighlights = {
          min: Math.min(...values).toFixed(3), // TODO Use different value for no hex - % coverage? peak week?
          max: Math.max(...values).toFixed(3),
          count: this.convertWeekToDate(),
          mean: this.mean(values).toFixed(3),
          hexSelected: false,
        };
        this.mapService.updateHighlights(this.stateHighlights);
      });

      let clickId = null;
      this.map.on('mousemove', 'birds', (e) => {
        this.map.getCanvas().style.cursor = 'pointer';

        if (clickId) {
          this.map.setFeatureState({source: 'birds', id: clickId}, {clicked: false});
        }
        clickId = e.features[0].properties.id;
        this.map.setFeatureState({source: 'birds', id: clickId}, {clicked: true});
      });

      this.map.on('mouseleave', 'birds', () => {
        this.map.getCanvas().style.cursor = 'grab';
        this.map.setFeatureState({source: 'birds', id: clickId}, {clicked: false});
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

        const source = this.map.getSource('hex') as M.GeoJSONSource;

        this.data.features.forEach(feature => {
          if (feature.properties.id === props.id) {
            source.setData({type: 'FeatureCollection', features: [feature]});

            // TODO remove style on double click
            if (!this.map.getLayer('hex')) {
              this.map.addLayer({
                id: 'hex',
                type: 'line',
                source: 'hex',
                paint: {
                  'line-width': 3,
                  'line-color': '#EEE',
                  'line-opacity': 0.8,
                }
              });
            }
          }
        });

        // TODO List weeks associated with max, min
        this.hexHighlights = {
          id: props.id,
          min: Math.min(...values).toFixed(3),
          max: Math.max(...values).toFixed(3),
          count: values.filter(x => x > 0).length,
          mean: this.mean(values).toFixed(3),
          value: props[this.getSelectedWeek()].toFixed(3),
        };

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

  calculateDifference(field) {
    const value = (this.hexHighlights[field] - this.stateHighlights[field]).toFixed(3);
    return {
      value: value,
      // @ts-ignore
      diffText: (value >= 0) ? 'higher' : 'lower',
    }
    // return (this.hexHighlights[field] - this.stateHighlights[field]).toFixed(3);
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

  fitBbox(geometry, smallScreen = true) {
    const padding = smallScreen ? {left: 0, top: 0, bottom: 0, right: 0} : {left: 500, top: 100, bottom: 100, right: 0};
    this.map.fitBounds(T.bbox(geometry) as M.LngLatBoundsLike, { padding: padding });
    this.map.resize();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    // TODO adjust 800px minwidth
    this.fitBbox(this.stateBounds, event.target.outerWidth <= 800);
  }

}
