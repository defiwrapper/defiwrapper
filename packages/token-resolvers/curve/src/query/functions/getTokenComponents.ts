import { BigInt } from "@web3api/wasm-as";
import { Big } from "as-big/Big";

import { CURVE_ADDRESS_PROVIDER_ADDRESS } from "../constants";
import { parseStringArray } from "../utils/parseArray";
import {
  env,
  Ethereum_Query,
  Input_getTokenComponents,
  Interface_AssetBalance,
  Interface_TokenBalance,
  QueryEnv,
} from "../w3";
import { Token_Query } from "../w3/imported/Token_Query";
import { Token_TokenType } from "../w3/imported/Token_TokenType";

// TODO: implement this
export function getTokenComponents(input: Input_getTokenComponents): Interface_AssetBalance | null {
  if (env == null) throw new Error("env is not set");
  const connection = (env as QueryEnv).connection;

  const registeryAddress = Ethereum_Query.callContractView({
    address: CURVE_ADDRESS_PROVIDER_ADDRESS,
    method: "function get_registry() view returns (address)",
    args: null,
    connection: connection,
  });
  const poolAddress = Ethereum_Query.callContractView({
    address: registeryAddress,
    method: "function get_pool_from_lp_token(address) view returns (address)",
    args: [input.token.address],
    connection: connection,
  });
  const totalCoinsResult = Ethereum_Query.callContractView({
    address: registeryAddress,
    method: "function get_n_coins(address) view returns (uint256)",
    args: [poolAddress],
    connection: connection,
  });
  const totalCoins: i32 = I32.parseInt(totalCoinsResult);

  const coinsResult = Ethereum_Query.callContractView({
    address: registeryAddress,
    method: "function get_coins(address) view returns (address[8])",
    args: [poolAddress],
    connection: connection,
  });
  const coins: Array<string> = parseStringArray(coinsResult);

  const balancesResult = Ethereum_Query.callContractView({
    address: registeryAddress,
    method: "function get_balances(address) view returns (uint256[8])",
    args: [poolAddress],
    connection: connection,
  });
  const balances: Array<string> = parseStringArray(balancesResult);

  const components = new Array<Interface_TokenBalance>(totalCoins);

  const tokenDecimals = BigInt.fromString("10").pow(input.token.decimals).toString();
  const totalSupply: Big = Big.of(input.token.totalSupply.toString()).div(Big.of(tokenDecimals));

  for (let i = 0; i < totalCoins; i++) {
    const underlyingTokenAddress: string = coins[i];
    const underlyingToken = Token_Query.getToken({
      address: underlyingTokenAddress,
      m_type: Token_TokenType.ERC20,
    });
    if (underlyingToken.address == "Unknown") return null;
    const underlyIngDecimals = BigInt.fromString("10").pow(underlyingToken.decimals).toString();

    const balance: Big = Big.of(balances[i]).div(Big.of(underlyIngDecimals));

    components[i] = {
      token: underlyingToken,
      balance: balance.div(totalSupply).toString(),
      values: [],
    };
  }

  return null;
}
