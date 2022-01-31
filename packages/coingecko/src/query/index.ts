import { coinHistory } from "./routes/coinHistory";
import { coinMarketChartRange } from "./routes/coinMarketChartRange";
import { coinsList } from "./routes/coinsList";
import { coinsMarkets } from "./routes/coinsMarkets";
import { global } from "./routes/global";
import { ping } from "./routes/ping";
import { simplePrice } from "./routes/simplePrice";
import { simpleTokenPrice } from "./routes/simpleTokenPrice";
import { supportedVSCurrencies } from "./routes/supportedVSCurrencies";
import { tokenInfo } from "./routes/tokenInfo";
import { tokenMarketChart } from "./routes/tokenMarketChart";

export {
  ping,
  coinsList,
  supportedVSCurrencies,
  coinsMarkets,
  global,
  simplePrice,
  simpleTokenPrice,
  tokenInfo,
  tokenMarketChart,
  coinMarketChartRange,
  coinHistory,
};
