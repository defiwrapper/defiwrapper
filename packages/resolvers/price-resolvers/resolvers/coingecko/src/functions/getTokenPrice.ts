import { BigNumber, wrap_debug_log } from "@polywrap/wasm-as";

import { getNetworkId, getTokenResolverModule } from "../constants";
import {
  Args_getTokenPrice,
  Coingecko_Module,
  Ethereum_Module,
  PriceResolver_TokenBalance,
  PriceResolver_TokenResolver_Token,
  PriceResolver_TokenValue,
} from "../wrap";

export function getTokenPrice(args: Args_getTokenPrice): PriceResolver_TokenBalance {
  const network = Ethereum_Module.getNetwork({ connection: null }).unwrap();
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
  let prices: Map<string, BigNumber | null> = new Map();

  if (tokenAddress == "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee") {
    // Map<string, Map<string, BigNumber | null>>
    const networkId = getNetworkId(network.chainId.toUInt32());
    const tokenVsMap = Coingecko_Module.simplePrice({
      ids: networkId,
      vs_currencies: vsCurrencies,
      include_market_cap: null,
      include_24hr_vol: null,
      include_24hr_change: null,
      include_last_updated_at: null,
    }).unwrap();

    if (tokenVsMap.has(networkId)) {
      prices = tokenVsMap.get(networkId) as Map<string, BigNumber | null>;
    }
  } else {
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

    if (tokenVsMap.has(tokenAddress)) {
      prices = tokenVsMap.get(tokenAddress) as Map<string, BigNumber | null>;
    }
  }

  const balance: BigNumber = args.balance === null ? BigNumber.ONE : (args.balance as BigNumber);

  const values: PriceResolver_TokenValue[] = [];
  for (let i = 0; i < args.vsCurrencies.length; i++) {
    const currency = args.vsCurrencies[i];
    wrap_debug_log("***************** CUREENCY         " + currency);
    if (!prices.has(currency)) continue;
    const price = prices.get(currency) as BigNumber;
    if (price === null) continue;
    const value = BigNumber.from(price).mul(balance);

    values.push({ currency, price, value });
  }

  wrap_debug_log("***************** VALUES        " + values.length.toString());

  return {
    token: changetype<PriceResolver_TokenResolver_Token>(token),
    balance,
    values,
  };
}
