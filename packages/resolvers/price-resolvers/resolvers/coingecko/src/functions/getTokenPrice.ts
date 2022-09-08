import { Option } from "@polywrap/wasm-as";
import { Big } from "as-big";

import { getNetworkId, getTokenResolverQuery } from "../constants";
import {
  Coingecko_Query,
  Coingecko_SimplePriceData,
  Coingecko_SimpleTokenPrice,
  env,
  Ethereum_Query,
  Input_getTokenPrice,
  PriceResolver_TokenBalance,
  PriceResolver_TokenResolver_Token,
  PriceResolver_TokenValue,
  QueryEnv,
} from "../wrap";

export function getTokenPrice(input: Input_getTokenPrice): PriceResolver_TokenBalance {
  if (env == null) throw new Error("env is not set");
  const connection = (env as QueryEnv).connection;

  const network = Ethereum_Query.getNetwork({ connection: connection }).unwrap();
  const tokenResolverQuery = getTokenResolverQuery(network.chainId.toUInt32());

  const token = tokenResolverQuery
    .getToken({
      address: input.tokenAddress,
      m_type: "ERC20",
    })
    .unwrap();

  const tokenPrices = Coingecko_Query.simpleTokenPrice({
    id: getNetworkId(network.chainId.toUInt32()),
    contract_addresses: [input.tokenAddress],
    vs_currencies: input.vsCurrencies,
    include_market_cap: Option.Some(false),
    include_24hr_vol: Option.Some(false),
    include_24hr_change: Option.Some(false),
    include_last_updated_at: Option.Some(false),
  }).unwrap();

  if (!tokenPrices || tokenPrices.length != 1) {
    throw new Error(`No price info found for token: ${input.tokenAddress}`);
  }

  const tokenPrice = tokenPrices[0] as Coingecko_SimpleTokenPrice;
  if (!tokenPrice.price_data) {
    throw new Error(`No price info found for token: ${input.tokenAddress}`);
  }
  const priceData = tokenPrice.price_data as Coingecko_SimplePriceData[];

  const values: PriceResolver_TokenValue[] = [];
  const balance: string = input.balance ? (input.balance as string) : "1";
  for (let j = 0; j < priceData.length; j++) {
    values.push({
      currency: priceData[j].vs_currency,
      price: priceData[j].price,
      value: Big.of(priceData[j].price).times(Big.of(balance)).toString(),
    });
  }

  return {
    token: changetype<PriceResolver_TokenResolver_Token>(token),
    balance: input.balance ? (input.balance as string) : "1",
    values: values,
  };
}
