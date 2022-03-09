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

function getPairTokenAddresses(pairAddress: string, connection: Ethereum_Connection): string[] {
  // get token addresses
  const token0AddressResult = Ethereum_Query.callContractView({
    address: pairAddress,
    method: "function token0() external view returns (address)",
    args: [],
    connection: connection,
  });
  if (token0AddressResult.isErr) {
    throw new Error("Invalid protocol token");
  }
  const token1AddressResult = Ethereum_Query.callContractView({
    address: pairAddress,
    method: "function token1() external view returns (address)",
    args: [],
    connection: connection,
  });
  if (token1AddressResult.isErr) {
    throw new Error("Invalid protocol token");
  }
  return [token0AddressResult.unwrap(), token1AddressResult.unwrap()];
}

export function getTokenComponents(input: Input_getTokenComponents): Interface_TokenComponent {
  if (env == null) throw new Error("env is not set");
  const connection = (env as QueryEnv).connection;

  const token = Token_Query.getToken({
    address: input.tokenAddress,
    m_type: Token_TokenType.ERC20,
  }).unwrap();

  const pairTokenAddresses: string[] = getPairTokenAddresses(token.address, connection);

  const tokenDecimals: string = BigInt.fromUInt16(10).pow(token.decimals).toString();
  const totalSupply: Big = Big.of(token.totalSupply.toString()) / Big.of(tokenDecimals);

  const components: Interface_TokenComponent[] = [];
  let unresolvedComponents: i32 = 0;

  for (let j = 0; j < pairTokenAddresses.length; j++) {
    // get underlying token
    const underlyingTokenAddress: string = pairTokenAddresses[j];
    const underlyingToken: Interface_Token = changetype<Interface_Token>(
      Token_Query.getToken({
        address: underlyingTokenAddress,
        m_type: Token_TokenType.ERC20,
      }).unwrap(),
    );
    if (!underlyingToken) {
      unresolvedComponents++;
      continue;
    }

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
