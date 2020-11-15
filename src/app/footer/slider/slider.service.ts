import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SliderService {

  _week: BehaviorSubject<number> = new BehaviorSubject<number>(1);
  week$: Observable<number> = this._week.asObservable();

  constructor() { }

  updateWeek(week: number) {
    this._week.next(week);
  }
}
