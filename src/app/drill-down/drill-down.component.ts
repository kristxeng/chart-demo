import { Component, OnInit } from '@angular/core';
import { Intervals } from '../configs/intervals';

@Component({
  selector: 'app-drill-down',
  templateUrl: './drill-down.component.html',
  styleUrls: ['./drill-down.component.scss']
})
export class DrillDownComponent implements OnInit {

  intervals = Intervals;
  selected = '1d';

  constructor() { }

  ngOnInit(): void {
  }

}
