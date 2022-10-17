import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CoinPairs } from '../interface/coin-pairs.enum';
import { HttpParams } from "@angular/common/http";
import { Price } from '../interface/price.interface';
import { Observable } from 'rxjs';

const BinanceApiUrl = 'https://api.binance.com/api/v3/';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http: HttpClient,
  ) { }

  getAllPrices$(symbols: string[]) {
    const options = {
      params: new HttpParams().set('symbols', JSON.stringify(symbols)),
    };

    return this.http.get<Price[]>(`${BinanceApiUrl}ticker/price`, options);
  }

  getKLines$(symbol:string, interval: string) {
    const options = { 
      params: new HttpParams({ fromObject: { symbol, interval } }) 
    };
    return this.http.get<any[][]>(`${BinanceApiUrl}klines`, options);
  }
}
