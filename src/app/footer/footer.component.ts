import { Component, OnInit } from '@angular/core';
import {MapService} from '../map/map.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  highlights; // TODO type

  constructor(
    private mapService: MapService,
  ) { }

  ngOnInit(): void {
    this.mapService.highlights$.subscribe(highlights => {
      if (highlights) {
        this.highlights = highlights;
      }
    });
  }

}
