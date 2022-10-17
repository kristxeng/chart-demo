import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CoinPairs } from '../interface/coin-pairs.enum';
import { HttpParams } from "@angular/common/http";
import { Price } from '../interface/price.interface';

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

    return this.http.get<Price[]>('https://api.binance.com/api/v3/ticker/price', options)
  }
}
