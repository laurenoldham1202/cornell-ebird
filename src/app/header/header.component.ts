import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  multi = [
    {
      "name": "Germany",
      "series": [
        {
          "name": "1990",
          "value": 62000000
        },
        {
          "name": "2010",
          "value": 73000000
        },
        {
          "name": "2011",
          "value": 89400000
        }
      ]
    },

    {
      "name": "USA",
      "series": [
        {
          "name": "1990",
          "value": 250000000
        },
        {
          "name": "2010",
          "value": 309000000
        },
        {
          "name": "2011",
          "value": 311000000
        }
      ]
    },

    {
      "name": "France",
      "series": [
        {
          "name": "1990",
          "value": 58000000
        },
        {
          "name": "2010",
          "value": 50000020
        },
        {
          "name": "2011",
          "value": 58000000
        }
      ]
    },
    {
      "name": "UK",
      "series": [
        {
          "name": "1990",
          "value": 57000000
        },
        {
          "name": "2010",
          "value": 62000000
        }
      ]
    }
  ];

  data = [
    {
      "name": "mean",
      "series": [
        {
          "value": 0.3,
          "name": "a"
        },
        {
          "value": 0.5,
          "name": "b"
        },
        {
          "value": 1.5,
          "name": "c"
        },
        {
          "value": 0.75,
          "name": "d"
        },
        {
          "value": 0.3,
          "name": "e"
        }
      ]
    },
    {
      "name": "min",
      "series": [
        {
          "value": 0.03,
          "name": "a"
        },
        {
          "value": 0.15,
          "name": "b"
        },
        {
          "value": 1.05,
          "name": "c"
        },
        {
          "value": 0.795,
          "name": "d"
        },
        {
          "value": 0.23,
          "name": "e"
        }
      ]
    },
    ];
  view: any[] = [350, 200];

  // options
  legend: boolean = false;
  showLabels: boolean = false;
  animations: boolean = true;
  xAxis: boolean = false;
  yAxis: boolean = false;
  showYAxisLabel: boolean = false;
  showXAxisLabel: boolean = false;
  xAxisLabel: string = '';
  yAxisLabel: string = '';
  timeline: boolean = true;

  colorScheme = {
    domain: ['#c7457a', '#fec027', '#1e078d']
  };
  constructor() { }

  ngOnInit(): void {
  }

}
