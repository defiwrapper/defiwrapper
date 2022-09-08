import { Big } from "as-big";

import { getTokenResolverQuery } from "../constants";
import {
  Args_getTokenPrice,
  Ethereum_Module,
  PriceResolver_TokenBalance,
  PriceResolver_TokenResolver_Token,
  PriceResolver_TokenValue,
} from "../wrap";

export function getTokenPrice(args: Args_getTokenPrice): PriceResolver_TokenBalance {
  const network = Ethereum_Module.getNetwork({ connection: null }).unwrap();
  const tokenResolverQuery = getTokenResolverQuery(network.chainId.toUInt32());

  const token = tokenResolverQuery
    .getToken({
      address: args.tokenAddress,
      _type: "ERC20",
    })
    .unwrap();

  const values: PriceResolver_TokenValue[] = [];
  const balance: string = args.balance ? (args.balance as string) : "1";
  for (let j = 0; j < args.vsCurrencies.length; j++) {
    values.push({
      currency: args.vsCurrencies[j],
      price: "1",
      value: Big.of(1).times(Big.of(balance)).toString(),
    });
  }

  return {
    token: changetype<PriceResolver_TokenResolver_Token>(token),
    balance: args.balance ? (args.balance as string) : "1",
    values: values,
  };
}
