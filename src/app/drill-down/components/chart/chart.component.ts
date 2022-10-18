import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  takeUntil,
  Subject,
  map,
  filter,
  switchMap,
  tap,
  ReplaySubject,
  combineLatestWith,
} from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import {
  ColorType,
  createChart,
  IChartApi,
  ISeriesApi,
  UTCTimestamp,
} from 'lightweight-charts';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
})
export class ChartComponent implements OnInit {
  @Input() interval: string;
  private interval$ = new ReplaySubject<string>(1);
  private destroy$ = new Subject<boolean>();
  series: ISeriesApi<'Candlestick'>;
  chart: IChartApi;

  constructor(private route: ActivatedRoute, private apiService: ApiService) {}

  ngOnInit(): void {
    this.createChart();
    this.setChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!!changes['interval']) {
      this.interval$.next(changes['interval'].currentValue);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  kLine(symbol: string, interval: string) {
    return this.apiService.getKLines$(symbol, interval).pipe(
      tap((data) => console.log(data)),
      map((data) =>
        data.map((item) => {
          const [time, open, high, low, close] = item;
          const utcTimeStamp = (time / 1000) as UTCTimestamp;
          return { time: utcTimeStamp, open, high, low, close };
        })
      )
    );
  }

  createChart() {
    const options = {
      layout: {
        textColor: 'black',
        background: { type: ColorType.Solid, color: 'white' },
      },
    };
    this.chart = createChart('container', options);
    this.series = this.chart.addCandlestickSeries({
      upColor: '#ef5350',
      downColor: '#26a69a',
      borderVisible: false,
      wickUpColor: '#ef5350',
      wickDownColor: '#26a69a',
    });
  }

  setChart() {
    this.route.params
      .pipe(
        map((params) => params['symbol']),
        combineLatestWith(this.interval$),
        filter(([symbol, interval]) => !!symbol && !!interval),
        switchMap(([symbol, interval]) => this.kLine(symbol, interval)),
        takeUntil(this.destroy$)
      )
      .subscribe((data) => {
        this.series.setData(data);
        this.series.priceScale().applyOptions({
          autoScale: false,
          scaleMargins: {
            top: 0.1,
            bottom: 0.1,
          },
        });
        this.chart.timeScale().fitContent();
      });
  }
}
