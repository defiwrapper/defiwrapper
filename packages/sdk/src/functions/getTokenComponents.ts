import { BigNumber, wrap_debug_log } from "@polywrap/wasm-as";

import { getTokenResolver } from "../utils";
import {
  Args_getTokenComponents,
  AssetResolver_Module,
  Interface_AssetBalance,
  Interface_PriceResolver_TokenResolver_Token,
  Interface_PriceResolver_TokenValue,
  Interface_TokenComponentBalance,
} from "../wrap";
import { getProtocol } from "./getProtocol";
import { getTokenPrice } from "./getTokenPrice";

function getTokenComponentBalance(
  tokenAddress: string,
  balance: BigNumber,
  vsCurrencies: Array<string>,
): Interface_TokenComponentBalance {
  const protocol = getProtocol({ tokenAddress: tokenAddress });
  wrap_debug_log(protocol ? protocol.id as string : "NO PROTOCOL")
  if (!protocol || !protocol.adapterUri) {
    const tokenBalance = getTokenPrice({
      tokenAddress: tokenAddress,
      balance: balance,
      vsCurrencies: vsCurrencies,
    });
    if (!tokenBalance) throw new Error("Unable to fetch balance for token: " + tokenAddress);
    return {
      token: tokenBalance,
      unresolvedComponents: 0,
      components: [],
    };
  }

  const assetResolver = new AssetResolver_Module(protocol.adapterUri as string);

  const tokenComponents = assetResolver
    .getTokenComponents({
      tokenAddress: tokenAddress,
      protocolId: protocol.id,
    })
    .unwrap();
  const currentBalance = balance.mul(tokenComponents.rate);

  const currencyValueMap: Map<string, BigNumber> = new Map();
  const components: Interface_TokenComponentBalance[] = [];

  for (let i = 0; i < tokenComponents.components.length; i++) {
    const componentBalance = getTokenComponentBalance(
      tokenComponents.components[i].tokenAddress,
      currentBalance,
      vsCurrencies,
    );
    if (componentBalance) {
      for (let j = 0; j < componentBalance.token.values.length; j++) {
        const tokenValue = componentBalance.token.values[j];
        const valueByCurrency = currencyValueMap.get(tokenValue.currency);
        if (!valueByCurrency) {
          currencyValueMap.set(tokenValue.currency, tokenValue.value);
        }
        currencyValueMap.set(tokenValue.currency, tokenValue.value.add(valueByCurrency));
      }
      components.push(componentBalance);
    }
  }
  const currencyValueArr: string[] = currencyValueMap.keys();
  const currentValues: Interface_PriceResolver_TokenValue[] = [];

  for (let i = 0; i < currencyValueArr.length; i++) {
    const value = currencyValueMap.get(currencyValueArr[i]) as BigNumber;
    currentValues.push({
      currency: currencyValueArr[i],
      price: value.div(currentBalance),
      value: value,
    });
  }

  const tokenResolver = getTokenResolver();
  const token = tokenResolver.getToken({ address: tokenAddress, _type: "ERC20" }).unwrap();

  return {
    token: {
      token: changetype<Interface_PriceResolver_TokenResolver_Token>(token),
      balance: currentBalance,
      values: currentValues,
    },
    unresolvedComponents: tokenComponents.unresolvedComponents,
    components: components,
  };
}

export function getTokenComponents(args: Args_getTokenComponents): Interface_AssetBalance | null {
  return {
    tokenComponentBalance: getTokenComponentBalance(
      args.tokenAddress,
      args.multiplier ? (args.multiplier as BigNumber) : BigNumber.from(1),
      args.vsCurrencies ? (args.vsCurrencies as string[]) : ["usd"],
    ),
    apr: "N/A",
    apy: "N/A",
    isDebt: false,
    claimableTokens: [],
  };
}
