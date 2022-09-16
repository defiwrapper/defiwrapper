import { BigNumber } from "@polywrap/wasm-as";

import {
  Args_getAccountBalance,
  Interface_AccountBalance,
  Interface_AssetBalance,
  Interface_PriceResolver_TokenBalance,
  Interface_PriceResolver_TokenValue,
  Interface_ProtocolBalance,
  Interface_ProtocolResolver_Protocol,
  ProtocolResolver_Protocol,
} from "../wrap";
import { getTokenBalances } from "./getTokenBalances";
import { getTokenComponents } from "./getTokenComponents";

export function getAccountBalance(args: Args_getAccountBalance): Interface_AccountBalance | null {
  const protocolTokenMap: Map<string, Interface_AssetBalance[]> = new Map();
  const protocolIdmap: Map<string, Interface_ProtocolResolver_Protocol> = new Map();
  const protocolValueMap: Map<string, Map<string, BigNumber>> = new Map();
  const simpleTokens: Interface_PriceResolver_TokenBalance[] = [];
  const currencyValueMap: Map<string, BigNumber> = new Map();

  const tokenBalances = getTokenBalances({
    accountAddress: args.accountAddress,
  });
  if (!tokenBalances) return null;

  for (let i = 0; i < tokenBalances.tokenBalances.length; i++) {
    const tokenBalance = tokenBalances.tokenBalances[i];
    const tokenComponent = getTokenComponents({
      tokenAddress: tokenBalance.token.address,
      multiplier: tokenBalance.balance,
      vsCurrencies: args.vsCurrencies,
      noTruncate: args.noTruncate,
      underlyingPrice: args.underlyingPrice,
    });

    if (!tokenComponent) continue;

    if (tokenComponent.tokenComponentBalance.protocol) {
      const protocol = tokenComponent.tokenComponentBalance
        .protocol as Interface_ProtocolResolver_Protocol;
      const tokenValues = tokenComponent.tokenComponentBalance.token.values;
      for (let j = 0; j < tokenValues.length; j++) {
        const tokenValue = tokenValues[j];
        if (protocolValueMap.has(protocol.id)) {
          const protocolValue = protocolValueMap.get(protocol.id) as Map<string, BigNumber>;
          if (protocolValue.has(tokenValue.currency)) {
            const balance = protocolValue.get(tokenValue.currency) as BigNumber;
            protocolValue.set(tokenValue.currency, balance.add(tokenValue.value));
          } else {
            protocolValue.set(tokenValue.currency, tokenValue.value);
          }
        } else {
          const map: Map<string, BigNumber> = new Map();
          map.set(tokenValue.currency, tokenValue.value);
          protocolValueMap.set(protocol.id, map);
        }
      }

      if (!protocolIdmap.has(protocol.id)) {
        protocolIdmap.set(protocol.id, protocol);
      }
      if (protocolTokenMap.has(protocol.id)) {
        const arr = protocolTokenMap.get(protocol.id) as Interface_AssetBalance[];
        arr.push(tokenComponent);
      } else {
        protocolTokenMap.set(protocol.id, [tokenComponent]);
      }
    } else {
      simpleTokens.push(tokenComponent.tokenComponentBalance.token);
    }

    const tokenValues = tokenComponent.tokenComponentBalance.token.values;
    for (let j = 0; j < tokenValues.length; j++) {
      const tokenValue = tokenValues[j];
      if (currencyValueMap.has(tokenValue.currency)) {
        const valueByCurrency = currencyValueMap.get(tokenValue.currency);
        currencyValueMap.set(tokenValue.currency, tokenValue.value.add(valueByCurrency));
      } else {
        currencyValueMap.set(tokenValue.currency, tokenValue.value);
      }
    }
  }

  const currencyValueArr: string[] = currencyValueMap.keys();
  const currentValues: Interface_PriceResolver_TokenValue[] = [];

  for (let i = 0; i < currencyValueArr.length; i++) {
    const value = currencyValueMap.get(currencyValueArr[i]) as BigNumber;
    currentValues.push({
      currency: currencyValueArr[i],
      price: BigNumber.from(0), // TODO: support null here
      value: value,
    });
  }

  const protocolIds: string[] = protocolTokenMap.keys();
  const protocolBals: Interface_ProtocolBalance[] = [];

  for (let i = 0; i < protocolIds.length; i++) {
    const assetBalances = protocolTokenMap.get(protocolIds[i]) as Interface_AssetBalance[];
    const protocol = protocolIdmap.get(protocolIds[i]) as Interface_ProtocolResolver_Protocol;

    const protocolValue = protocolValueMap.get(protocolIds[i]) as Map<string, BigNumber>;
    const currencies: string[] = protocolValue.keys();
    const protocolValues: Interface_PriceResolver_TokenValue[] = [];
    for (let j = 0; j < currencies.length; j++) {
      protocolValues.push({
        currency: currencies[j],
        price: BigNumber.from(0), // TODO: support null here
        value: protocolValue.get(currencies[j]) as BigNumber,
      });
    }

    protocolBals.push({
      assets: assetBalances,
      protocol: protocol,
      values: protocolValues,
    });
  }

  return {
    account: tokenBalances.account,
    chainId: tokenBalances.chainId,
    tokens: simpleTokens,
    values: currentValues,
    protocols: protocolBals,
  };
}
