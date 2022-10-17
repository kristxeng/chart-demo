import { Component, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {

  @Input() symbol: string;
  @Input() price: string;

  isChanging = false;
  timer: number;

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['price']) {
      !!this.timer && clearTimeout(this.timer);
      this.isChanging = true;
      this.timer = window.setTimeout(() => {
        this.isChanging = false;
        this.timer = 0;
      }, 225)
    }
  }

  onClick() {
    console.log('on card click')
  }
}
