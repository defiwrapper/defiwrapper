import { BigInt } from "@web3api/wasm-as";
import { Big } from "as-big";

import {
  env,
  Ethereum_Query,
  Input_getTokenComponents,
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

  // get underlying token
  const underlyingTokenAddressRes = Ethereum_Query.callContractView({
    address: token.address,
    method: "function want() external view returns (address)",
    args: [],
    connection: connection,
  });
  if (underlyingTokenAddressRes.isErr) {
    return {
      tokenAddress: token.address,
      unresolvedComponents: 1,
      components: [],
      rate: "1",
    };
  }

  // calculate rate
  const shareResult = Ethereum_Query.callContractView({
    address: token.address,
    method: "function pricePerShare() external view returns (uint256)",
    args: [],
    connection: connection,
  });
  if (shareResult.isErr) {
    throw new Error("Invalid Yearn protocol token: " + token.address);
  }
  const decimals = BigInt.fromUInt16(10).pow(token.decimals).toString();
  const rate = (Big.of(shareResult) / Big.of(decimals)).toString();

  return {
    tokenAddress: token.address,
    unresolvedComponents: 0,
    components: [
      {
        tokenAddress: underlyingTokenAddressRes.unwrap(),
        unresolvedComponents: 0,
        components: [],
        rate,
      },
    ],
    rate: "1",
  };
}
