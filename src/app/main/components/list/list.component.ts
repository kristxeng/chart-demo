import { Component, OnDestroy, OnInit } from '@angular/core';
import { StreamService } from '../../../services/stream.service';
import { map, filter, Observable, tap, switchMap } from 'rxjs';
import { CoinPairs } from '../../../interface/coin-pairs.enum';
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
    const symbols = Object.keys(CoinPairs);
    return this.getInitPrices(symbols).pipe(
      tap((prices) => {
        this.pricesMap = prices.reduce((result, current) => {
          return {
            [current.symbol]: current,
            ...result,
          };
        }, {});
      }),
      switchMap((initPrices) => this.getStream(symbols, initPrices)),
    );
  }

  getInitPrices(symbols: string[]): Observable<Price[]> {
    return this.apiService.getAllPrices$(symbols);
  }

  getStream(symbols: string[], initPrices: Price[]): Observable<Price[]> {
    const streamNames = symbols
      .map(s => s.toLowerCase())
      .map(s => `${s}@miniTicker`);
    return this.streamService.subscribeByStreamNames(streamNames).pipe(
      filter(data => data?.e === '24hrMiniTicker'),
      map((d: MiniTicker) => {
        const changed = initPrices.find((p: Price) => p.symbol === d.s); // FIXME: wrong comparison
        if (changed) {
          changed.price = d.c;
        }
        return initPrices;
      })
    );
  }
}
