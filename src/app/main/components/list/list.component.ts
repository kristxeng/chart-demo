import { Component, OnDestroy, OnInit } from '@angular/core';
import { StreamService } from '../../../services/stream.service';
import { map, filter, Observable, tap, switchMap, mergeMap } from 'rxjs';
import { ApiService } from '../../../services/api.service';
import { Price } from '../../../interface/price.interface';
import { MiniTicker } from '../../../interface/mini-ticker.interface';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit, OnDestroy {
  prices$: Observable<Price[]>;
  stream$: Observable<Price[]>;
  pricesMap: { [key: string]: Price };
  symbols: Array<string>;

  constructor(
    private streamService: StreamService,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.prices$ = this.getPrices();
  }

  ngOnDestroy(): void {
    this.streamService.unsubscribeAll();
  }

  getPrices() {
    return this.apiService.get50Symbols().pipe(
      tap(symbols => this.symbols = symbols),
      mergeMap(symbols => this.getInitPrices(symbols)),
      tap(prices => {
        this.pricesMap = prices.reduce((result, current) => {
          return {
            [current.symbol]: current,
            ...result,
          };
        }, {});
      }),
      switchMap(prices => this.getStream(this.symbols, prices)),
    )
  }

  getInitPrices(symbols: string[]): Observable<Price[]> {
    return this.apiService.getAllPrices$(symbols);
  }

  getStream(symbols: string[], prices: Price[]): Observable<Price[]> {
    const streamNames = symbols
      .map(s => s.toLowerCase())
      .map(s => `${s}@miniTicker`);
    return this.streamService.subscribeByStreamNames(streamNames).pipe(
      filter(data => data?.e === '24hrMiniTicker'),
      map((d: MiniTicker) => {
        const item = this.pricesMap[d.s];
        if (item.price !== d.c) {
          item.price = d.c;
        }

        return prices;
      })
    );
  }
}
