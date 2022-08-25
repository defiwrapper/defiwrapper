import { BigNumber, Option } from "@polywrap/wasm-as";

import { getNetworkId, getTokenResolverModule } from "../constants";
import {
  Args_getTokenPrice,
  Coingecko_Module,
  Coingecko_SimplePriceData,
  Coingecko_SimpleTokenPrice,
  Env,
  Ethereum_Module,
  PriceResolver_TokenBalance,
  PriceResolver_TokenResolver_Token,
  PriceResolver_TokenValue,
} from "../wrap";

export function getTokenPrice(args: Args_getTokenPrice, env: Env): PriceResolver_TokenBalance {
  const network = Ethereum_Module.getNetwork({ connection: env.connection }).unwrap();
  const tokenResolverQuery = getTokenResolverModule(network.chainId.toUInt32());

  const token = tokenResolverQuery
    .getToken({
      address: args.tokenAddress,
      _type: "ERC20",
    })
    .unwrap();

  const tokenPrices = Coingecko_Module.simpleTokenPrice({
    id: getNetworkId(network.chainId.toUInt32()),
    contract_addresses: [args.tokenAddress],
    vs_currencies: args.vsCurrencies,
    include_market_cap: Option.Some(false),
    include_24hr_vol: Option.Some(false),
    include_24hr_change: Option.Some(false),
    include_last_updated_at: Option.Some(false),
  }).unwrap();

  if (!tokenPrices || tokenPrices.length != 1) {
    throw new Error(`No price info found for token: ${args.tokenAddress}`);
  }

  const tokenPrice = tokenPrices[0] as Coingecko_SimpleTokenPrice;
  if (!tokenPrice.price_data) {
    throw new Error(`No price info found for token: ${args.tokenAddress}`);
  }
  const priceData = tokenPrice.price_data as Coingecko_SimplePriceData[];

  const values: PriceResolver_TokenValue[] = [];
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const balance: BigNumber = args.balance === null ? BigNumber.ONE : args.balance!;
  for (let j = 0; j < priceData.length; j++) {
    values.push({
      currency: priceData[j].vs_currency,
      price: BigNumber.from(priceData[j].price),
      value: BigNumber.from(priceData[j].price).mul(balance),
    });
  }

  return {
    token: changetype<PriceResolver_TokenResolver_Token>(token),
    balance,
    values,
  };
}
