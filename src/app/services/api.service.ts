import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpParams } from '@angular/common/http';
import { Price } from '../interface/price.interface';
import { map } from 'rxjs';
import { ExchangeInfo } from '../interface/exchange-info.interface';

const BinanceApiUrl = 'https://api.binance.com/api/v3/';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  getAllPrices$(symbols: string[]) {
    const options = {
      params: new HttpParams().set('symbols', JSON.stringify(symbols)),
    };

    return this.http.get<Price[]>(`${BinanceApiUrl}ticker/price`, options);
  }

  getKLines$(symbol: string, interval: string) {
    const options = {
      params: new HttpParams({ fromObject: { symbol, interval } }),
    };
    return this.http.get<any[][]>(`${BinanceApiUrl}klines`, options);
  }

  get50Symbols() {
    return this.http.get<ExchangeInfo>(`${BinanceApiUrl}exchangeInfo`).pipe(
      map(data => data.symbols),
      map(symbols => symbols.map((item) => item.symbol)),
      map(symbols => symbols.slice(0, 50)), 
    );
  }
}
