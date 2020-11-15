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
    // this.week = week.value;
    // this.sliderService.updateWeek(week.value);
  }

  // var refreshId = setInterval(function() {
  //   var properID = CheckReload();
  //   if (properID > 0) {
  //     clearInterval(refreshId);
  //   }
  // }, 10000);

  playAnimation() {
    this.activePlay = !this.activePlay;

    // if (this.activePlay) {
      // TODO add option to not autoplay
      // begin play count at current slider position
      // let count = this.week;

      const animation = setInterval(() => {


        if (this.activePlay) {
          // reset to week 1 automatically
          if (this.week > 51) {
            this.week = 1;
          }
          // add to current week count
          this.week++;

          // update app-wide
          this.updateWeek(this.week);
        } else {
          clearInterval(animation);
        }
      }, 250);

  }

}
