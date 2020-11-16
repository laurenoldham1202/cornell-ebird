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

  activePlay = false;

  constructor(
    private sliderService: SliderService,
  ) { }

  ngOnInit(): void {
  }

  updateWeek(value: number) {
    this.week = value;
    this.sliderService.updateWeek(this.week);
  }

  onSliderChange(week) {
    this.updateWeek(week.value);
  }

  // TODO add option to not autoplay
  playAnimation() {
    // toggle button between play and pause
    this.activePlay = !this.activePlay;

    const animation = setInterval(() => {
      if (this.activePlay) {
        // reset to week 1 automatically when final week is reached
        if (this.week > 51) {
          this.week = 0;
        }
        // add to current week count
        this.week++;

        // update app-wide
        this.updateWeek(this.week);
      } else {
        // clear interval when slider is paused
        clearInterval(animation);
      }
    }, 250);
  }
}
