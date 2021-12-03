import { CoinHistory, CoinMarketChartRange, TokenMarketChart } from "../../query/w3";

export type Ping = {
  ping: {
    gecko_says: string;
  };
};

export type TokenMarketChartResult = {
  tokenMarketChart: TokenMarketChart;
};

export type CoinMarketChartRangeResult = {
  coinMarketChartRange: CoinMarketChartRange;
};

export type CoinHistoryResult = {
  coinHistory: CoinHistory;
};
