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

export function getTokenComponents(input: Input_getTokenComponents): Interface_TokenComponent {
  if (env == null) throw new Error("env is not set");
  const connection = (env as QueryEnv).connection;

  const token = Token_Query.getToken({
    address: input.tokenAddress,
    m_type: Token_TokenType.ERC20,
  }).unwrap();

  if (!token) {
    throw new Error(`Token ${input.tokenAddress} is not a valid ERC20 token`);
  }

  const tokenDecimals: string = BigInt.fromUInt16(10).pow(token.decimals).toString();
  const totalSupply: Big = Big.of(token.totalSupply.toString()) / Big.of(tokenDecimals);

  const pairTokenAddresses: string[] = getPairTokenAddresses(token.address, connection);
  const balances: string[] = getPairTokenBalances(token.address, connection);

  const components = new Array<Interface_TokenComponent>(pairTokenAddresses.length);
  let unresolvedComponents: i32 = 0;

  for (let i = 0; i < pairTokenAddresses.length; i++) {
    if (!balances[i]) {
      unresolvedComponents++;
      continue;
    }
    const underlyingTokenAddress: string = pairTokenAddresses[i];
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
    const underlyIngDecimals = BigInt.fromUInt16(10).pow(underlyingToken.decimals).toString();
    const balance: Big = Big.of(balances[i]) / Big.of(underlyIngDecimals.toString());
    const rate = (balance / totalSupply).toString();
    components[i] = {
      tokenAddress: underlyingTokenAddress,
      unresolvedComponents: 0,
      components: [],
      rate: rate,
    };
  }

  if (components[0] == null) {
    throw new Error("unable to resolve components for " + input.tokenAddress);
  }

  return {
    tokenAddress: token.address,
    unresolvedComponents: unresolvedComponents,
    components: components,
    rate: "1",
  };
}

function getPairTokenAddresses(pairAddress: string, connection: Ethereum_Connection): string[] {
  // get token addresses
  const token0AddressResult = Ethereum_Query.callContractView({
    address: pairAddress,
    method: "function token0() external view returns (address)",
    args: [],
    connection: connection,
  });
  // if exception encountered, pair contract presumed not to exist
  if (token0AddressResult.isErr) {
    throw new Error("Invalid protocol token");
  }
  const token0Address = token0AddressResult.unwrap();
  const token1Address = Ethereum_Query.callContractView({
    address: pairAddress,
    method: "function token1() external view returns (address)",
    args: [],
    connection: connection,
  }).unwrap();
  return [token0Address, token1Address];
}

// function getPairTokenBalances2(
//   tokenAddresses: string[],
//   pairAddress: string,
//   connection: Ethereum_Connection,
// ): string[] {
//   const balances: string[] = new Array<string>(tokenAddresses.length);
//   for (let i = 0; i < tokenAddresses.length; i++) {
//     const balanceRes = Ethereum_Query.callContractView({
//       connection: connection,
//       address: tokenAddresses[0],
//       method: "function balanceOf(address account) public view returns (uint256)",
//       args: [pairAddress],
//     });
//     balances[i] = balanceRes.isOk ? balanceRes.unwrap() : "";
//   }
//   return balances;
// }

// todo: should i use this or the other version?
function getPairTokenBalances(pairAddress: string, connection: Ethereum_Connection): string[] {
  const res = Ethereum_Query.callContractView({
    connection: connection,
    address: pairAddress,
    method:
      "function getReserves() public view returns (uint112 _reserve0, uint112 _reserve1, uint32 _blockTimestampLast)",
    args: [],
  });
  if (res.isErr) {
    return ["", ""];
  }
  const arr: string[] = res.unwrap().split(",");
  return [arr[0], arr[1]];
}
