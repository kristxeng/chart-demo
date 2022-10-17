export interface ExchangeInfo {
  timezone: string;
  serverTime: number;
  rateLimits: Array<{
    rateLimitType: string;
    interval: string;
    intervalNum: number;
    limit: number;
  }>;
  exchangeFilters: Array<any>;
  symbols: Array<ExchangeInfoItem>;
}

export interface ExchangeInfoItem {
  symbol: string;
  status: string;
  baseAsset: string;
  baseAssetPrecision: number;
  quoteAsset: string;
  quotePrecision: number;
  quoteAssetPrecision: number;
  orderTypes: string[];
  icebergAllowed: boolean;
  allowTrailingStop: boolean;
  cancelReplaceAllowed: boolean;
  filters: Array<any>;
}
