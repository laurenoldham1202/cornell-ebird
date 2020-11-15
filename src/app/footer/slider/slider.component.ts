import { Component, OnInit } from '@angular/core';
import {SliderService} from './slider.service';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss']
})
export class SliderComponent implements OnInit {

  week = 1;
  sliderOptions = {
    floor: 1,
    ceil: 52,
    showSelectionBar: true,
  };

  constructor(
    private sliderService: SliderService,
  ) { }

  ngOnInit(): void {
  }

  onSliderChange(week) {
    this.sliderService.updateWeek(week.value);
  }

}
