import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Observer, filter, map, tap } from 'rxjs';
import { StreamMethods } from '../interface/stream-methods.enum'

const wsURL = 'wss://stream.binance.com/ws';

@Injectable({
  providedIn: 'root'
})
export class StreamService {

  private id = 1;
  private stream: WebSocketSubject<any>;

  constructor() { }

  initStream() {
    this.stream = webSocket(wsURL);
  }

  subscribeByStreamNames(streamNames: Array<string>) {
    if (!this.stream) {
      this.initStream();
    }

    this.stream.next({
      method: StreamMethods.Subscribe,
      params: streamNames,
      id: this.id++,
    });

    return this.stream;
  }

  unsubscribeAll() {
    if (!this.stream) return;

    const id = this.id++;

    this.stream.pipe(
      filter(d => d.id === id),
      filter(d => !!d.result.length),
      map(d => d.result)
    ).subscribe(result => {
      this.stream.next({
        method: StreamMethods.Unsubscribe,
        params: result,
        id: this.id++,
      })

    })

    this.stream.next({
      method: StreamMethods.ListSubscriptions,
      id: id
    })
  }
}
