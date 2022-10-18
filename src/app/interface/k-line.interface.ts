import { UTCTimestamp } from "lightweight-charts";

export interface KLine {
  time: UTCTimestamp;
  open: string;
  close: string;
  high: string;
  low: string;
}
