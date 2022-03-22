import { Nullable } from "@web3api/wasm-as";
import { Big } from "as-big";

import {
  Coingecko_Query,
  Coingecko_SimplePriceData,
  Coingecko_SimpleTokenPrice,
  env,
  Ethereum_Query,
  Input_getTokenPrice,
  PriceResolver_Token,
  PriceResolver_TokenBalance,
  PriceResolver_TokenValue,
  QueryEnv,
  Token_Query,
  Token_TokenType,
} from "../w3";

export function getNetworkId(chainId: i32): string {
  switch (chainId) {
    case 1:
      return "ethereum";
    default:
      throw Error("Invalid chainid: " + chainId);
  }
}

export function getTokenPrice(input: Input_getTokenPrice): PriceResolver_TokenBalance {
  if (env == null) throw new Error("env is not set");
  const connection = (env as QueryEnv).connection;

  const network = Ethereum_Query.getNetwork({ connection: connection }).unwrap();

  const token = Token_Query.getToken({
    address: input.tokenAddress,
    m_type: Token_TokenType.ERC20,
  }).unwrap();

  const tokenPrices = Coingecko_Query.simpleTokenPrice({
    id: getNetworkId(network.chainId),
    contract_addresses: [input.tokenAddress],
    vs_currencies: input.vsCurrencies,
    include_market_cap: Nullable.fromValue(false),
    include_24hr_vol: Nullable.fromValue(false),
    include_24hr_change: Nullable.fromValue(false),
    include_last_updated_at: Nullable.fromValue(false),
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
    token: changetype<PriceResolver_Token>(token),
    balance: input.balance ? (input.balance as string) : "1",
    values: values,
  };
}
