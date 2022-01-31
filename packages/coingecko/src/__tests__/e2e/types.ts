// Note: This is a hack until we have dapp codegen.
import { CoinHistory, CoinMarketChartRange, Global, Ping, TokenMarketChart } from "../../query/w3";

export type GlobalResult = {
  data: Global;
};

export type PingResult = {
  ping: Ping;
};

export type SupportedVSCurrenciesResult = {
  supportedVSCurrencies: string[];
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
