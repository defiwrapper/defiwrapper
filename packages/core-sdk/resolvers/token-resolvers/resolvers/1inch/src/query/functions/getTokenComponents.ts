import { BigInt } from "@web3api/wasm-as";
import { Big } from "as-big";

import {
  env,
  Ethereum_Connection,
  Ethereum_Query,
  Input_getTokenComponents,
  Interface_Token,
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
  const totalSupply: Big = Big.of(token.totalSupply.toString()) / Big.of(tokenDecimals);

  const components: Interface_TokenComponent[] = [];
  let unresolvedComponents: i32 = 0;

  for (let j = 0; j < poolTokenAddresses.length; j++) {
    // get underlying token
    const underlyingTokenAddress: string = poolTokenAddresses[j];
    const tokenRes = Token_Query.getToken({
      address: underlyingTokenAddress,
      m_type: Token_TokenType.ERC20,
    });
    if (tokenRes.isErr) {
      unresolvedComponents++;
      continue;
    }
    const underlyingToken: Interface_Token = changetype<Interface_Token>(tokenRes.unwrap());

    // get underlying token balance
    const balanceRes = Ethereum_Query.callContractView({
      connection: connection,
      address: underlyingToken.address,
      method: "function balanceOf(address account) public view returns (uint256)",
      args: [token.address],
    });
    if (balanceRes.isErr) {
      unresolvedComponents++;
      continue;
    }
    const balance: string = balanceRes.unwrap();
    const underlyIngDecimals = BigInt.fromUInt16(10).pow(underlyingToken.decimals).toString();
    const adjBalance: Big = Big.of(balance) / Big.of(underlyIngDecimals.toString());

    // calculate and push rate
    const rate = (adjBalance / totalSupply).toString();
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
