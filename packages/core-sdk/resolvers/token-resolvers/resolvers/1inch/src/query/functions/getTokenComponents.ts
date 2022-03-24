import { BigInt } from "@web3api/wasm-as";
import { Big } from "as-big";

import { getUnderlyingTokenData, TokenData } from "../utils/TokenData";
import {
  env,
  Ethereum_Connection,
  Ethereum_Query,
  Input_getTokenComponents,
  Interface_TokenComponent,
  QueryEnv,
  Token_Query,
  Token_TokenType,
} from "../w3";

function getPoolTokenAddresses(poolAddress: string, connection: Ethereum_Connection): string[] {
  const tokenAddressRes = Ethereum_Query.callContractView({
    address: poolAddress,
    method: "function getTokens() external view returns(address[] tokens)",
    args: [],
    connection: connection,
  });
  if (tokenAddressRes.isErr) {
    throw new Error("Invalid protocol token");
  }
  return tokenAddressRes.unwrap().split(",");
}

export function getTokenComponents(input: Input_getTokenComponents): Interface_TokenComponent {
  if (env == null) throw new Error("env is not set");
  const connection = (env as QueryEnv).connection;

  const token = Token_Query.getToken({
    address: input.tokenAddress,
    m_type: Token_TokenType.ERC20,
  }).unwrapOrElse((err: string) => {
    throw new Error(err);
  });

  const poolTokenAddresses: string[] = getPoolTokenAddresses(token.address, connection);

  const tokenDecimals: string = BigInt.fromUInt16(10).pow(token.decimals).toString();
  const totalSupply: Big = Big.of(token.totalSupply.toString()).div(tokenDecimals);

  const components: Interface_TokenComponent[] = [];
  let unresolvedComponents: i32 = 0;

  for (let j = 0; j < poolTokenAddresses.length; j++) {
    const underlyingTokenAddress: string = poolTokenAddresses[j];
    // get underlying token decimals and balance
    const tokenData: TokenData | null = getUnderlyingTokenData(
      token,
      underlyingTokenAddress,
      connection,
    );
    if (!tokenData) {
      unresolvedComponents++;
      continue;
    }
    const decimals: i32 = tokenData.decimals;
    const balance: string = tokenData.balance;

    // calculate decimal-adjusted balance
    const underlyingDecimals = BigInt.fromUInt16(10).pow(decimals).toString();
    const adjBalance: Big = Big.of(balance).div(underlyingDecimals.toString());

    // calculate and push rate
    const rate = adjBalance.div(totalSupply).toString();
    components.push({
      tokenAddress: underlyingTokenAddress,
      unresolvedComponents: 0,
      components: [],
      rate: rate,
    });
  }

  return {
    tokenAddress: token.address,
    unresolvedComponents: unresolvedComponents,
    components: components,
    rate: "1",
  };
}
