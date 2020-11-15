import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  // TODO create class
  _highlights: BehaviorSubject<any> = new BehaviorSubject<any>(undefined);
  highlights$: Observable<any> = this._highlights.asObservable();

  constructor() { }

  // TODO type
  updateHighlights(highlights: any) {
    this._highlights.next(highlights);
  }
}
