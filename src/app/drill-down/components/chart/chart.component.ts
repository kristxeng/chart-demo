import { Component, ElementRef, Input, OnInit, ViewChild, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { takeUntil, Subject, map, filter, switchMap, tap, ReplaySubject, combineLatestWith } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { CandlestickData, ColorType, createChart } from 'lightweight-charts';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
})
export class ChartComponent implements OnInit {

  @ViewChild('container') container: ElementRef;
  @Input() interval: string;
  private interval$ = new ReplaySubject<string>(1)
  private destroy$ = new Subject<boolean>();

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
  ) {}

  ngOnInit(): void {
    this.route.params
      .pipe(
        map((params) => params['symbol']),
        combineLatestWith(this.interval$),
        filter(([symbol, interval]) => !!symbol && !!interval),
        switchMap(([symbol, interval]) => this.kLine(symbol, interval)),
        takeUntil(this.destroy$)
      )
      .subscribe((data) => {
        this.createChart(data);
      });
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
          return { time, open, high, low, close };
        })
      )
    );
  }

  createChart(data: CandlestickData[]) {
    const options = {
      layout: {
        textColor: 'black',
        background: { type: ColorType.Solid, color: 'white ' },
      },
    };
    const chart = createChart(this.container.nativeElement, options);
    const series = chart.addCandlestickSeries({
      upColor: '#ef5350',
      downColor: '#26a69a',
      borderVisible: false,
      wickUpColor: '#ef5350',
      wickDownColor: '#26a69a',
    });
    series.setData(data);
    chart.timeScale().fitContent();
  }
}
