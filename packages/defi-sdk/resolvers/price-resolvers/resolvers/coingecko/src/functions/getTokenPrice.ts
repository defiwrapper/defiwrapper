import { BigNumber } from "@polywrap/wasm-as";

import { getNetworkId, getTokenResolverModule } from "../constants";
import {
  Args_getTokenPrice,
  Coingecko_Module,
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

  const tokenAddress = args.tokenAddress.toLowerCase();

  if (args.vsCurrencies.length == 0) {
    throw new Error("vs_currencies array is empty");
  }
  const vsCurrencies = args.vsCurrencies.toString();

  // Map<string, Map<string, BigNumber | null>>
  const tokenVsMap = Coingecko_Module.simpleTokenPrice({
    id: getNetworkId(network.chainId.toUInt32()),
    contract_addresses: tokenAddress,
    vs_currencies: vsCurrencies,
    include_market_cap: null,
    include_24hr_vol: null,
    include_24hr_change: null,
    include_last_updated_at: null,
  }).unwrap();

  if (!tokenVsMap.has(tokenAddress)) {
    throw new Error(`No price info found for token: ${args.tokenAddress}`);
  }
  const prices: Map<string, BigNumber | null> = tokenVsMap.get(tokenAddress);

  const balance: BigNumber = args.balance === null ? BigNumber.ONE : (args.balance as BigNumber);

  const values: PriceResolver_TokenValue[] = [];
  for (let i = 0; i < args.vsCurrencies.length; i++) {
    const currency = args.vsCurrencies[i];
    if (!prices.has(currency)) continue;
    const price = prices.get(currency);
    if (price === null) continue;
    const value = BigNumber.from(price).mul(balance);

    values.push({ currency, price, value });
  }

  if (values.length == 0) {
    throw new Error(`No price info found for token: ${args.tokenAddress}`);
  }

  return {
    token: changetype<PriceResolver_TokenResolver_Token>(token),
    balance,
    values,
  };
}
